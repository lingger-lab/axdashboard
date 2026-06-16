import type { ParsedNewsletterOutput } from "./types";

export function parseNewsletterResponse(raw: string): ParsedNewsletterOutput {
  // Extract blog body from markers
  const bodyMatch = raw.match(
    /\[BLOG_BODY\]([\s\S]*?)\[\/BLOG_BODY\]/
  );
  const blog_body = bodyMatch ? bodyMatch[1].trim() : "";

  // Extract card summary from markers
  const cardMatch = raw.match(
    /\[CARD_SUMMARY\]([\s\S]*?)\[\/CARD_SUMMARY\]/
  );
  const card_summary = cardMatch ? cardMatch[1].trim() : "";

  // If no markers found, use entire text as blog body
  if (!blog_body && !card_summary) {
    return {
      blog_body: raw.trim(),
      card_summary: raw.trim().slice(0, 200),
    };
  }

  return { blog_body: blog_body || raw.trim(), card_summary };
}
