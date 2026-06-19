"use server";

// import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
// import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import type { PipelineStatus } from "./types";
import { scrapeUrl } from "./scrape";

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 공개
// 복구: 이 함수의 주석을 해제하고 아래 noop을 삭제
async function verifyAdmin(): Promise<{ email: string }> {
  return { email: "anonymous" };
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (!user?.email) throw new Error("Unauthorized");
  //
  // const adminEmails = (process.env.ADMIN_EMAILS || "")
  //   .split(",")
  //   .map((e) => e.trim());
  // if (!adminEmails.includes(user.email)) throw new Error("Forbidden");
  //
  // return { email: user.email };
}

export async function addPipelineItem(
  newsSource: string,
  title?: string,
  rawContent?: string,
  sourceType: "manual" | "auto" = "manual"
): Promise<{ error?: string }> {
  await verifyAdmin();

  // URL 형태 입력 시 스크래핑 시도 (rawContent가 없을 때만)
  let content = rawContent || null;
  if (!content && newsSource.startsWith("http")) {
    content = await scrapeUrl(newsSource);
  }

  const { error } = await adminClient()
    .from("content_pipeline")
    .insert({
      news_source: newsSource,
      title: title || null,
      raw_content: content,
      source_type: sourceType,
    });
  if (error) return { error: error.message };
  revalidatePath("/content-pipe");
  return {};
}

export async function updatePipelineStatus(
  id: string,
  status: PipelineStatus
): Promise<{ error?: string }> {
  await verifyAdmin();
  const updates: Record<string, unknown> = { status };
  if (status === "published") updates.published_at = new Date().toISOString();

  const { error } = await adminClient()
    .from("content_pipeline")
    .update(updates)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/content-pipe");
  return {};
}

export async function updateBradComment(
  id: string,
  comment: string
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("content_pipeline")
    .update({ brad_comment: comment })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/content-pipe");
  return {};
}

