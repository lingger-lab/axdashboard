import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/content-pipe/claude";
import { parseShortformResponse } from "@/lib/content-pipe/parse-shortform";

export const maxDuration = 60;

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 공개
// 복구: 아래 인증 코드 주석 해제
export async function POST(request: Request) {
  // // 쿠키 기반 admin 인증
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);
  // const { data: { user } } = await supabase.auth.getUser();
  //
  // if (!user?.email) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  //
  // const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  // if (!adminEmails.includes(user.email)) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

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

  // newsletter_body 존재 검증
  if (!row.newsletter_body) {
    return NextResponse.json(
      { error: "뉴스레터 본문이 필요합니다. 먼저 뉴스레터를 생성해주세요." },
      { status: 400 }
    );
  }

  // Claude API 호출
  const userMessage = `아래 완성된 AI시대예감 글로 숏폼을 만들어줘.

${row.newsletter_body}

응답 형식 지시: 반드시 아래 JSON 마커 안에 씬 배열을 넣어주세요.
[SCENES_JSON]
[
  {
    "scene_number": 1,
    "time_range": "0~3초",
    "narration": "내레이션 텍스트",
    "subtitle": "화면 자막",
    "image_prompt": "Nano Banana 9:16 이미지 프롬프트"
  }
]
[/SCENES_JSON]`;

  const result = await callClaude({
    skillName: "ai-shortform-builder",
    userMessage,
    maxTokens: 4096,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // 파싱
  const parsed = parseShortformResponse(result.rawText);

  // DB 업데이트
  const { error: updateError } = await adminClient()
    .from("content_pipeline")
    .update({
      shortform_script: JSON.stringify(parsed.scenes),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    shortform: parsed,
  });
}
