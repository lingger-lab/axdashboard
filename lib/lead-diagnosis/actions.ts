"use server";

// import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
// import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

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

export async function markReplied(id: string): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("lead_diagnoses")
    .update({ replied: true })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/lead-diagnosis");
  return {};
}

export async function markConverted(
  id: string,
  reactionNote?: string
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("lead_diagnoses")
    .update({
      converted: true,
      reaction_note: reactionNote || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/lead-diagnosis");
  return {};
}

export async function updateReactionNote(
  id: string,
  note: string
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("lead_diagnoses")
    .update({ reaction_note: note })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/lead-diagnosis");
  return {};
}

export async function deleteDiagnosis(
  id: string
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("lead_diagnoses")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/lead-diagnosis");
  return {};
}
