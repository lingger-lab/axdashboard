import type { ParsedShortformOutput, ShortformScene } from "./types";

export function parseShortformResponse(raw: string): ParsedShortformOutput {
  // Try JSON marker extraction
  const jsonMatch = raw.match(
    /\[SCENES_JSON\]([\s\S]*?)\[\/SCENES_JSON\]/
  );

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      if (Array.isArray(parsed)) {
        return { scenes: parsed.map(normScene) };
      }
    } catch {
      // Fall through
    }
  }

  // Fallback: try parsing entire response as JSON
  try {
    const parsed = JSON.parse(raw.trim());
    if (Array.isArray(parsed)) {
      return { scenes: parsed.map(normScene) };
    }
    if (parsed.scenes && Array.isArray(parsed.scenes)) {
      return { scenes: parsed.scenes.map(normScene) };
    }
  } catch {
    // Fall through
  }

  // Final fallback: return raw text as single scene
  return {
    scenes: [
      {
        scene_number: 1,
        time_range: "0~60초",
        narration: raw.trim(),
        subtitle: "",
        image_prompt: "",
      },
    ],
  };
}

function normScene(item: Record<string, unknown>): ShortformScene {
  return {
    scene_number: Number(item.scene_number || item.number || 1),
    time_range: String(item.time_range || item.time || ""),
    narration: String(item.narration || ""),
    subtitle: String(item.subtitle || ""),
    image_prompt: String(item.image_prompt || ""),
  };
}
