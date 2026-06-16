import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/content-pipe/claude";
import { parseNewsletterResponse } from "@/lib/content-pipe/parse-newsletter";

export const maxDuration = 60;

export async function POST(request: Request) {
  // 쿠키 기반 admin 인증
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!adminEmails.includes(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 요청 본문에서 id 추출
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "id가 필요합니다" }, { status: 400 });
  }

  // 해당 row fetch
  const { data: row, error: fetchError } = await adminClient()
    .from("content_pipeline")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !row) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다" }, { status: 404 });
  }

  // 상태 검증: selected 상태여야 함
  if (row.status !== "selected") {
    return NextResponse.json(
      { error: `현재 상태가 '${row.status}'입니다. 'selected' 상태에서만 생성 가능합니다.` },
      { status: 400 }
    );
  }

  // brad_comment 필수 검증
  const comment = row.brad_comment?.replace(/^\[AI제안\]\s*/g, "").trim();
  if (!comment) {
    return NextResponse.json(
      { error: "Brad 코멘트가 필요합니다. 코멘트를 먼저 입력해주세요." },
      { status: 400 }
    );
  }

  // Claude API 호출
  const userMessage = `뉴스: ${row.news_source}
제목: ${row.title || "없음"}
Brad 코멘트: ${comment}

응답 형식 지시: 아래 마커를 사용해 구분해주세요.
[BLOG_BODY]
블로그 본문 전체
[/BLOG_BODY]

[CARD_SUMMARY]
카드형 요약 (SNS 미리보기용)
[/CARD_SUMMARY]`;

  const result = await callClaude({
    skillName: "ai-newsletter-builder",
    userMessage,
    maxTokens: 4096,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // 파싱
  const parsed = parseNewsletterResponse(result.rawText);

  // DB 업데이트
  const { error: updateError } = await adminClient()
    .from("content_pipeline")
    .update({
      newsletter_body: parsed.blog_body,
      status: "generated",
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    newsletter: parsed,
  });
}
