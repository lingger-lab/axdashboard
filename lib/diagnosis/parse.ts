import type { DiagnosisBranch } from "@/lib/types";

interface ParsedDiagnosis {
  branch: DiagnosisBranch | null;
  isRegulated: boolean;
  cardText: string;
}

export function parseDiagnosisResponse(raw: string): ParsedDiagnosis {
  const branchMatch = raw.match(/\[BRANCH:([ABC])\]/);
  const branch = branchMatch ? (branchMatch[1] as DiagnosisBranch) : null;

  const isRegulated = raw.includes("[REGULATED]");

  const cardText = raw
    .replace(/\[BRANCH:[ABC]\]/g, "")
    .replace(/\[REGULATED\]/g, "")
    .trim();

  return { branch, isRegulated, cardText };
}
