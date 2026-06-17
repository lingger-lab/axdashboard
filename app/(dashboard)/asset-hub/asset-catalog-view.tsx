"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AssetItem } from "@/lib/catalog/types";
import { DOMAINS, TYPES, STATUSES } from "@/lib/catalog/types";

export function AssetCatalogView({ assets }: { assets: AssetItem[] }) {
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (domainFilter !== "전체" && a.domain !== domainFilter) return false;
      if (typeFilter !== "전체" && a.type !== typeFilter) return false;
      if (statusFilter !== "전체" && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.purpose.toLowerCase().includes(q) ||
          a.tech.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assets, search, domainFilter, typeFilter, statusFilter]);

  return (
    <div>
      {/* 필터 바 */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 용도, 기술 검색..."
          className="input-field w-full sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="도메인"
            value={domainFilter}
            options={DOMAINS}
            onChange={setDomainFilter}
          />
          <FilterSelect
            label="타입"
            value={typeFilter}
            options={TYPES}
            onChange={setTypeFilter}
          />
          <FilterSelect
            label="상태"
            value={statusFilter}
            options={STATUSES}
            onChange={setStatusFilter}
          />
        </div>
        <div className="hidden sm:flex gap-1 sm:ml-auto">
          <button
            onClick={() => setViewMode("card")}
            className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              viewMode === "card"
                ? "bg-accent text-white"
                : "bg-surface-warm text-text-muted hover:text-text"
            }`}
          >
            카드
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              viewMode === "table"
                ? "bg-accent text-white"
                : "bg-surface-warm text-text-muted hover:text-text"
            }`}
          >
            테이블
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-text-muted">
        {filtered.length}개 자산 표시
      </p>

      {viewMode === "card" ? (
        <CardView items={filtered} />
      ) : (
        <TableView items={filtered} />
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-text outline-none focus:border-accent"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {label}: {opt}
        </option>
      ))}
    </select>
  );
}

function CardView({ items }: { items: AssetItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-subtle">
        조건에 맞는 자산이 없습니다
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/asset-hub/${item.id}`}
          className="block rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
            <DomainBadge domain={item.domain} />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-text">{item.name}</h3>
          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {item.purpose}
          </p>
          <div className="flex flex-wrap gap-1">
            {item.tech.split(",").map((t) => (
              <span
                key={t.trim()}
                className="rounded bg-surface-warm px-1.5 py-0.5 text-xs text-text-subtle"
              >
                {t.trim()}
              </span>
            ))}
          </div>
          {item.workflow_step !== "none" && (
            <p className="mt-2 text-xs text-text-subtle">
              단계: {item.workflow_step}
            </p>
          )}
          {item.repo_url && (
            <span className="mt-2 inline-block text-xs text-accent">
              GitHub
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function TableView({ items }: { items: AssetItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-subtle">
        조건에 맞는 자산이 없습니다
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-warm text-xs text-text-muted">
            <th className="px-3 py-2.5 font-medium">이름</th>
            <th className="px-3 py-2.5 font-medium">타입</th>
            <th className="px-3 py-2.5 font-medium">도메인</th>
            <th className="px-3 py-2.5 font-medium">용도</th>
            <th className="px-3 py-2.5 font-medium">단계</th>
            <th className="px-3 py-2.5 font-medium">상태</th>
            <th className="px-3 py-2.5 font-medium">기술</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border-light transition-colors hover:bg-surface-warm/50"
            >
              <td className="whitespace-nowrap px-3 py-2.5 text-xs font-medium">
                <Link
                  href={`/asset-hub/${item.id}`}
                  className="text-accent hover:underline"
                >
                  {item.name}
                </Link>
              </td>
              <td className="px-3 py-2.5">
                <TypeBadge type={item.type} />
              </td>
              <td className="px-3 py-2.5">
                <DomainBadge domain={item.domain} />
              </td>
              <td
                className="max-w-[200px] truncate px-3 py-2.5 text-xs text-text-muted"
                title={item.purpose}
              >
                {item.purpose}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-xs text-text-subtle">
                {item.workflow_step !== "none" ? item.workflow_step : "-"}
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="max-w-[120px] truncate px-3 py-2.5 text-xs text-text-subtle">
                {item.tech}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const style =
    type === "repo"
      ? "bg-blue-50 text-blue-700"
      : "bg-purple-50 text-purple-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    archived: "bg-gray-100 text-gray-500",
    duplicate_candidate: "bg-amber-50 text-amber-700",
    deprecated: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  const styles: Record<string, string> = {
    콘텐츠생산: "bg-pink-50 text-pink-700",
    전략분석: "bg-indigo-50 text-indigo-700",
    아이템발굴: "bg-orange-50 text-orange-700",
    선거여론: "bg-teal-50 text-teal-700",
    인프라: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[domain] || "bg-gray-100 text-gray-500"}`}
    >
      {domain}
    </span>
  );
}
