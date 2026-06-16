export interface AssetItem {
  id: string;
  name: string;
  type: "repo" | "skill";
  domain: string;
  purpose: string;
  input: string;
  output: string;
  tech: string;
  workflow_step: string;
  status: string;
  repo_url: string;
  last_updated: string;
  notes: string;
}

export const DOMAINS = [
  "전체",
  "콘텐츠생산",
  "전략분석",
  "아이템발굴",
  "선거여론",
  "인프라",
] as const;

export const TYPES = ["전체", "repo", "skill"] as const;

export const STATUSES = [
  "전체",
  "active",
  "archived",
  "duplicate_candidate",
  "deprecated",
] as const;
