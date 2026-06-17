import { loadCatalog } from "@/lib/catalog/loader";
import { AssetCatalogView } from "./asset-catalog-view";

export default async function AssetHubPage() {
  const assets = await loadCatalog();

  const repoCount = assets.filter((a) => a.type === "repo").length;
  const skillCount = assets.filter((a) => a.type === "skill").length;
  const activeCount = assets.filter((a) => a.status === "active").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* 요약 카드 */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard label="전체 자산" value={assets.length} />
        <SummaryCard label="레포" value={repoCount} />
        <SummaryCard label="스킬" value={skillCount} />
        <SummaryCard label="활성" value={activeCount} accent="text-success" />
      </div>

      {/* 카탈로그 뷰 */}
      <AssetCatalogView assets={assets} />
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
