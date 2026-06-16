import { adminClient } from "@/lib/supabase/admin";
import type { ContentPipelineRow } from "@/lib/content-pipe/types";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/content-pipe/types";
import { PipelineBoard } from "./pipeline-board";
import { AddItemForm } from "./add-item-form";

export default async function ContentPipePage() {
  const { data, error } = await adminClient()
    .from("content_pipeline")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows: ContentPipelineRow[] =
    (data as ContentPipelineRow[]) || [];

  const statusCounts = STATUS_ORDER.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    count: rows.filter((r) => r.status === s).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* 상태 요약 */}
      <div className="mb-6 grid grid-cols-5 gap-3">
        {statusCounts.map((sc) => (
          <div
            key={sc.status}
            className="rounded-xl border border-border bg-surface px-4 py-3"
          >
            <p className="text-xs text-text-muted">{sc.label}</p>
            <p className="mt-1 text-2xl font-bold text-text">{sc.count}</p>
          </div>
        ))}
      </div>

      {/* 새 항목 추가 */}
      <section className="mb-6">
        <AddItemForm />
      </section>

      {/* 상태 보드 */}
      <section>
        {error ? (
          <p className="text-xs text-error">
            데이터를 불러오지 못했습니다: {error.message}
          </p>
        ) : (
          <PipelineBoard rows={rows} />
        )}
      </section>
    </div>
  );
}
