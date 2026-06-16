export type DiagnosisBranch = "A" | "B" | "C";

export interface LeadDiagnosisRow {
  id: string;
  created_at: string;
  name: string | null;
  q1_career: string;
  q2_strength: string;
  branch: DiagnosisBranch | null;
  is_regulated: boolean;
  diagnosis_card: string | null;
  replied: boolean;
  converted: boolean;
  reaction_note: string | null;
  updated_at: string;
}
