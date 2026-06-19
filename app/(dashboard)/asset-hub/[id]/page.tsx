import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCatalog, loadAssetById } from "@/lib/catalog/loader";
import { ChatInquiryButton } from "./chat-inquiry-button";

const COMMUNITY_URL =
  "https://enterlab-web-844388762563.asia-northeast3.run.app/community";

export async function generateStaticParams() {
  const catalog = await loadCatalog();
  return catalog.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await loadAssetById(id);
  if (!asset) return { title: "자산을 찾을 수 없습니다" };
  return { title: `${asset.name} — AX 자산허브` };
}

const TYPE_STYLES: Record<string, string> = {
  repo: "bg-blue-50 text-blue-700",
  skill: "bg-purple-50 text-purple-700",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  archived: "bg-gray-100 text-gray-500",
  duplicate_candidate: "bg-amber-50 text-amber-700",
  deprecated: "bg-red-50 text-red-600",
};

const DOMAIN_STYLES: Record<string, string> = {
  콘텐츠생산: "bg-pink-50 text-pink-700",
  전략분석: "bg-indigo-50 text-indigo-700",
  아이템발굴: "bg-orange-50 text-orange-700",
  선거여론: "bg-teal-50 text-teal-700",
  인프라: "bg-slate-100 text-slate-600",
};

const WORKFLOW_LABELS: Record<string, string> = {
  intake: "1단계 · 수집",
  structure: "2단계 · 구조화",
  generate: "3단계 · 생성",
  verify: "4단계 · 검증",
  deliver: "5단계 · 배포",
};

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await loadAssetById(id);

  if (!asset) notFound();

  const techTags = asset.tech
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 뒤로 가기 */}
      <Link
        href="/asset-hub"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        자산허브로 돌아가기
      </Link>

      {/* 헤더 */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[asset.type] || "bg-gray-100 text-gray-500"}`}
          >
            {asset.type}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[asset.status] || "bg-gray-100 text-gray-500"}`}
          >
            {asset.status}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DOMAIN_STYLES[asset.domain] || "bg-gray-100 text-gray-500"}`}
          >
            {asset.domain}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text">{asset.name}</h1>
        {asset.last_updated && (
          <p className="mt-1 text-xs text-text-subtle">
            마지막 업데이트: {asset.last_updated}
          </p>
        )}
      </div>

      {/* 목적/설명 */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 text-sm font-semibold text-text-muted">
          목적 및 설명
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
          {asset.purpose}
        </p>
      </div>

      {/* 입력/출력 */}
      {(asset.input || asset.output) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {asset.input && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-1.5 text-xs font-semibold text-text-muted">
                입력 (Input)
              </h3>
              <p className="text-sm text-text">{asset.input}</p>
            </div>
          )}
          {asset.output && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-1.5 text-xs font-semibold text-text-muted">
                출력 (Output)
              </h3>
              <p className="text-sm text-text">{asset.output}</p>
            </div>
          )}
        </div>
      )}

      {/* 기술 스택 */}
      {techTags.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-2 text-xs font-semibold text-text-muted">
            기술 스택
          </h3>
          <div className="flex flex-wrap gap-2">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-warm px-2.5 py-1 text-xs text-text-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 워크플로 단계 */}
      {asset.workflow_step !== "none" && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-1.5 text-xs font-semibold text-text-muted">
            파이프라인 단계
          </h3>
          <p className="text-sm font-medium text-accent">
            {WORKFLOW_LABELS[asset.workflow_step] || asset.workflow_step}
          </p>
        </div>
      )}

      {/* 참고 사항 */}
      {asset.notes && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-1.5 text-xs font-semibold text-text-muted">
            참고 사항
          </h3>
          <p className="whitespace-pre-wrap text-sm text-text">{asset.notes}</p>
        </div>
      )}

      {/* GitHub 링크 — 비활성화 */}
      {asset.repo_url && (
        <span
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-subtle cursor-not-allowed opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub 저장소 (비공개)
        </span>
      )}

      {/* CTA + 챗봇 문의 영역 */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
        <p className="mb-1 text-base font-bold text-text">
          이 자산을 활용한 AX 전환, 무료로 시작하세요
        </p>
        <p className="mb-4 text-sm text-text-muted">
          무료 진단을 통해 우리 회사에 맞는 AI 전환 순서를 설계해 드립니다
        </p>
        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          무료 AX 진단 신청하기
        </a>
        <div className="mt-4 border-t border-accent/10 pt-4">
          <p className="mb-2 text-xs text-text-subtle">
            이 자산에 대해 더 알고 싶으시면
          </p>
          <ChatInquiryButton assetName={asset.name} />
        </div>
      </div>
    </div>
  );
}
