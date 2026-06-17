import { adminClient } from "@/lib/supabase/admin";
import type { LeadDiagnosisRow } from "@/lib/types";
import { DiagnosisForm } from "./diagnosis-form";
import { DiagnosisLog } from "./diagnosis-log";

export default async function LeadDiagnosisPage() {
  const { data, error } = await adminClient()
    .from("lead_diagnoses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows: LeadDiagnosisRow[] = (data as LeadDiagnosisRow[]) || [];

  const totalCount = rows.length;
  const repliedCount = rows.filter((r) => r.replied).length;
  const convertedCount = rows.filter((r) => r.converted).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* 요약 카드 */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="전체 리드" value={totalCount} />
        <SummaryCard
          label="회신 완료"
          value={repliedCount}
          accent="text-accent"
        />
        <SummaryCard
          label="전환"
          value={convertedCount}
          accent="text-success"
        />
      </div>

      {/* 진단 입력 + 결과 */}
      <section className="mb-8">
        <DiagnosisForm />
      </section>

      {/* 이력 테이블 */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-text">진단 이력</h2>
        {error ? (
          <p className="text-xs text-error">
            데이터를 불러오지 못했습니다: {error.message}
          </p>
        ) : (
          <DiagnosisLog rows={rows} />
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || "text-text"}`}>
        {value}
      </p>
    </div>
  );
}
