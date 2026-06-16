import { readFile } from "fs/promises";
import { join } from "path";

interface CallClaudeOptions {
  skillName: string;
  userMessage: string;
  maxTokens?: number;
}

type CallClaudeResult =
  | { ok: true; rawText: string }
  | { ok: false; error: string; status: number };

export async function callClaude({
  skillName,
  userMessage,
  maxTokens = 2048,
}: CallClaudeOptions): Promise<CallClaudeResult> {
  const skillPath = join(process.cwd(), "skills", skillName, "SKILL.md");

  let skillPrompt: string;
  try {
    skillPrompt = await readFile(skillPath, "utf-8");
  } catch {
    return { ok: false, error: `SKILL.md를 찾을 수 없습니다: ${skillName}`, status: 500 };
  }

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
        max_tokens: maxTokens,
        system: skillPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { ok: false, error: `Claude API 오류: ${err}`, status: 502 };
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "";
    return { ok: true, rawText };
  } catch (err) {
    return { ok: false, error: `Claude API 호출 실패: ${err}`, status: 502 };
  }
}
