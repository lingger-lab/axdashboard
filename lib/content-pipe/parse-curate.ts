import type { CuratedCandidate } from "./types";

export function parseCurateResponse(raw: string): CuratedCandidate[] {
  // Try JSON marker extraction first
  const jsonMatch = raw.match(
    /\[CANDIDATES_JSON\]([\s\S]*?)\[\/CANDIDATES_JSON\]/
  );

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 3).map(normCandidate);
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: try parsing entire response as JSON array
  try {
    const parsed = JSON.parse(raw.trim());
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3).map(normCandidate);
    }
  } catch {
    // Fall through to text fallback
  }

  // Final fallback: return raw text as single candidate
  if (raw.trim()) {
    return [
      {
        title: "자동 수집 결과",
        news_source: "",
        summary: raw.trim().slice(0, 500),
        category: "AI트렌드",
        counterarguments: [],
      },
    ];
  }

  return [];
}

function normCandidate(item: Record<string, unknown>): CuratedCandidate {
  return {
    title: String(item.title || ""),
    news_source: String(item.news_source || item.source || item.url || ""),
    summary: String(item.summary || ""),
    category: String(item.category || "AI트렌드"),
    counterarguments: Array.isArray(item.counterarguments)
      ? item.counterarguments.map(String)
      : [],
    flag: item.flag ? String(item.flag) : undefined,
  };
}
