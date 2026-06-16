import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/content-pipe/claude";
import { parseCurateResponse } from "@/lib/content-pipe/parse-curate";

export const maxDuration = 60;

// Cron 또는 수동 트리거 시 admin 인증 확인
async function verifyAuth(request: Request): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  // 1. Cron 인증 (Authorization header)
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return { ok: true };
  }

  // 2. 쿠키 기반 admin 인증
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, error: "Unauthorized", status: 401 };
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!adminEmails.includes(user.email)) {
    return { ok: false, error: "Forbidden", status: 403 };
  }

  return { ok: true };
}

async function runCuration() {
  // 중복 방지: 오늘 이미 candidate가 있는지 확인
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: existing } = await adminClient()
    .from("content_pipeline")
    .select("id")
    .eq("status", "candidate")
    .gte("created_at", today.toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({
      message: "오늘 이미 후보가 수집되었습니다",
      skipped: true,
    });
  }

  // Claude API 호출
  const userMessage = `오늘 후보 뽑아줘.

응답 형식 지시: 반드시 아래 JSON 마커 안에 후보 배열을 넣어주세요.
[CANDIDATES_JSON]
[
  {
    "title": "후보 제목",
    "news_source": "출처 URL 또는 이름",
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

  // 파싱
  const candidates = parseCurateResponse(result.rawText);

  // DB 삽입
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
  });
}

// GET: Vercel Cron 호출용
export async function GET(request: Request) {
  const auth = await verifyAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return runCuration();
}

// POST: 수동 "자동 수집" 버튼 호출용
export async function POST(request: Request) {
  const auth = await verifyAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return runCuration();
}
