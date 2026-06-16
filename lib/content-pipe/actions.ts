"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import type { PipelineStatus, PublishChannel } from "./types";

async function verifyAdmin(): Promise<{ email: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) throw new Error("Unauthorized");

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());
  if (!adminEmails.includes(user.email)) throw new Error("Forbidden");

  return { email: user.email };
}

export async function addPipelineItem(
  newsSource: string,
  title?: string
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("content_pipeline")
    .insert({
      news_source: newsSource,
      title: title || null,
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
  if (status === "selected") updates.selected = true;
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

export async function updatePipelineChannel(
  id: string,
  channel: PublishChannel
): Promise<{ error?: string }> {
  await verifyAdmin();
  const { error } = await adminClient()
    .from("content_pipeline")
    .update({ channel })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/content-pipe");
  return {};
}
