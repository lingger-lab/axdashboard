import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
// import { cookies } from "next/headers";
// import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { parseDiagnosisResponse } from "@/lib/diagnosis/parse";

const SKILL_PATH = join(
  process.cwd(),
  "skills",
  "career-app-diagnoser",
  "SKILL.md"
);

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 공개
// 복구: 아래 인증 코드 주석 해제
export async function POST(request: Request) {
  // // 쿠키 기반 인증: admin 이메일 검증
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (!user?.email) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  //
  // const adminEmails = (process.env.ADMIN_EMAILS || "")
  //   .split(",")
  //   .map((e) => e.trim());
  // if (!adminEmails.includes(user.email)) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  const { name, q1_career, q2_strength } = await request.json();

  if (!q1_career?.trim() || !q2_strength?.trim()) {
    return NextResponse.json(
      { error: "Q1(경력)과 Q2(강점)는 필수입니다" },
      { status: 400 }
    );
  }

  // 1. SKILL.md 읽기 (단일 원본)
  let skillPrompt: string;
  try {
    skillPrompt = await readFile(SKILL_PATH, "utf-8");
  } catch {
    return NextResponse.json(
      { error: "SKILL.md를 찾을 수 없습니다" },
      { status: 500 }
    );
  }

  // 2. Claude API 호출
  const userMessage = [
    name ? `이름: ${name}` : "",
    `Q1 경력: ${q1_career}`,
    `Q2 강점: ${q2_strength}`,
  ]
    .filter(Boolean)
    .join("\n");

  let rawText: string;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: skillPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Claude API 오류: ${err}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    rawText = data.content?.[0]?.text || "";
  } catch (err) {
    return NextResponse.json(
      { error: `Claude API 호출 실패: ${err}` },
      { status: 502 }
    );
  }

  // 3. 응답 파싱
  const parsed = parseDiagnosisResponse(rawText);

  // 4. DB 저장
  const { data: row, error: dbError } = await adminClient()
    .from("lead_diagnoses")
    .insert({
      name: name?.trim() || null,
      q1_career: q1_career.trim(),
      q2_strength: q2_strength.trim(),
      branch: parsed.branch,
      is_regulated: parsed.isRegulated,
      diagnosis_card: parsed.cardText,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ diagnosis: row });
}
