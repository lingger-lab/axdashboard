export type PipelineStatus =
  | "candidate"
  | "selected"
  | "generated"
  | "approved"
  | "published";

export interface ContentPipelineRow {
  id: string;
  created_at: string;
  news_source: string;
  title: string | null;
  brad_comment: string | null;
  newsletter_body: string | null;
  shortform_script: string | null;
  raw_content: string | null;
  source_type: string | null;
  status: PipelineStatus;
  published_at: string | null;
  updated_at: string;
}

export const STATUS_LABELS: Record<PipelineStatus, string> = {
  candidate: "후보",
  selected: "선택됨",
  generated: "생성됨",
  approved: "승인됨",
  published: "발행됨",
};

export const STATUS_ORDER: PipelineStatus[] = [
  "candidate",
  "selected",
  "generated",
  "approved",
  "published",
];

// --- V2 자동화 파서 출력 타입 ---

export interface CuratedCandidate {
  title: string;
  news_source: string;
  summary: string;
  category: string;
  counterarguments: string[];
  flag?: string;
}

export interface ParsedNewsletterOutput {
  blog_body: string;
  card_summary: string;
}

export interface ShortformScene {
  scene_number: number;
  time_range: string;
  narration: string;
  subtitle: string;
  image_prompt: string;
}

export interface ParsedShortformOutput {
  scenes: ShortformScene[];
}
