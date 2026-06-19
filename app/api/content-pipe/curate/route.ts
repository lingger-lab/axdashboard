import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/content-pipe/claude";
import { parseCurateResponse } from "@/lib/content-pipe/parse-curate";
import { fetchNewsFromRSS } from "@/lib/content-pipe/rss";

export const maxDuration = 60;

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 공개
async function verifyAuth(_request: Request): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  return { ok: true };
}

async function runCuration(force = false) {
  // 중복 방지: 오늘 자동수집(source_type=auto) candidate가 있는지 확인
  if (!force) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existing } = await adminClient()
      .from("content_pipeline")
      .select("id")
      .eq("status", "candidate")
      .eq("source_type", "auto")
      .gte("created_at", today.toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: "오늘 이미 자동수집 후보가 있습니다",
        skipped: true,
      });
    }
  }

  // 1. Google News RSS에서 뉴스 수집
  const rssItems = await fetchNewsFromRSS();

  if (rssItems.length === 0) {
    return NextResponse.json({
      error: "RSS 피드에서 새 뉴스를 찾지 못했습니다.",
    }, { status: 404 });
  }

  // 2. 이미 DB에 있는 URL 제외
  const { data: existingUrls } = await adminClient()
    .from("content_pipeline")
    .select("news_source");

  const knownUrls = new Set(
    (existingUrls || []).map((r: { news_source: string }) => r.news_source)
  );
  const newItems = rssItems.filter((item) => !knownUrls.has(item.link));

  if (newItems.length === 0) {
    return NextResponse.json({
      message: "새로운 뉴스가 없습니다. 모두 이미 수집된 항목입니다.",
      skipped: true,
    });
  }

  // 3. 뉴스 목록을 Claude에게 전달하여 선별 요청
  const newsList = newItems
    .map((item, i) => `${i + 1}. [${item.source || "출처 미상"}] ${item.title}\n   URL: ${item.link}\n   날짜: ${item.pubDate}`)
    .join("\n\n");

  const userMessage = `아래 뉴스 목록에서 후보 3건(국내 2 + 해외 1)을 선별해주세요.

${newsList}

응답 형식 지시: 반드시 아래 JSON 마커 안에 후보 배열을 넣어주세요.
[CANDIDATES_JSON]
[
  {
    "title": "후보 제목",
    "news_source": "원본 URL",
    "summary": "2-3문장 요약",
    "category": "6개 카테고리 중 하나",
    "counterarguments": ["반론A", "반론B", "반론C"],
    "flag": "수치 미검증 (해당 시)"
  }
]
[/CANDIDATES_JSON]`;

  const result = await callClaude({
    skillName: "ai-news-curator",
    userMessage,
    maxTokens: 2048,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // 4. 파싱
  const candidates = parseCurateResponse(result.rawText);

  // 5. DB 삽입
  const insertedRows = [];
  for (const c of candidates) {
    const suggestedAngles = c.counterarguments.length > 0
      ? `[AI제안] ${c.counterarguments.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
      : null;

    const { data: row, error } = await adminClient()
      .from("content_pipeline")
      .insert({
        news_source: c.news_source || c.title,
        title: c.title,
        brad_comment: suggestedAngles,
        status: "candidate",
        source_type: "auto",
      })
      .select()
      .single();

    if (!error && row) {
      insertedRows.push(row);
    }
  }

  return NextResponse.json({
    candidates: candidates.length,
    inserted: insertedRows.length,
    message: `${insertedRows.length}건의 뉴스를 수집했습니다.`,
  });
}

// GET: Vercel Cron 호출용
export async function GET(request: Request) {
  const auth = await verifyAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  return runCuration(force);
}

// POST: 수동 "자동 수집" 버튼 호출용
export async function POST(request: Request) {
  const auth = await verifyAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  return runCuration(force);
}
