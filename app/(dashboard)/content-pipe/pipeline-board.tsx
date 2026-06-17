"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContentPipelineRow, PipelineStatus } from "@/lib/content-pipe/types";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/content-pipe/types";
import { updatePipelineStatus, updateBradComment } from "@/lib/content-pipe/actions";

export function PipelineBoard({ rows }: { rows: ContentPipelineRow[] }) {
  const router = useRouter();
  const [isCurating, setIsCurating] = useState(false);
  const [curateError, setCurateError] = useState<string | null>(null);

  async function handleCurate() {
    setIsCurating(true);
    setCurateError(null);
    try {
      const res = await fetch("/api/content-pipe/curate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCurateError(data.error || "수집 실패");
      } else if (data.skipped) {
        setCurateError(data.message);
      }
      router.refresh();
    } catch (err) {
      setCurateError(`오류: ${err}`);
    } finally {
      setIsCurating(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleCurate}
          disabled={isCurating}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isCurating ? "수집 중..." : "자동 수집"}
        </button>
        {curateError && (
          <p className="text-xs text-text-muted">{curateError}</p>
        )}
      </div>
      <div className="snap-scroll-x flex gap-3 pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {STATUS_ORDER.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            items={rows.filter((r) => r.status === status)}
          />
        ))}
      </div>
    </div>
  );
}

function StatusColumn({
  status,
  items,
}: {
  status: PipelineStatus;
  items: ContentPipelineRow[];
}) {
  const colors: Record<PipelineStatus, string> = {
    candidate: "border-t-gray-400",
    selected: "border-t-blue-500",
    generated: "border-t-purple-500",
    approved: "border-t-amber-500",
    published: "border-t-emerald-500",
  };

  return (
    <div
      className={`min-w-[80vw] sm:min-w-[60vw] md:min-w-0 snap-center rounded-xl border border-border border-t-2 ${colors[status]} bg-surface-warm/30 p-3`}
    >
      <h3 className="mb-3 text-xs font-semibold text-text-muted">
        {STATUS_LABELS[status]}{" "}
        <span className="font-normal text-text-subtle">({items.length})</span>
      </h3>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-text-subtle">
            항목 없음
          </p>
        ) : (
          items.map((item) => (
            <PipelineCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function PipelineCard({ item }: { item: ContentPipelineRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState(item.brad_comment || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const currentIdx = STATUS_ORDER.indexOf(item.status);
  const nextStatus =
    currentIdx < STATUS_ORDER.length - 1
      ? STATUS_ORDER[currentIdx + 1]
      : null;

  async function handleAdvance() {
    if (!nextStatus) return;
    await updatePipelineStatus(item.id, nextStatus);
    startTransition(() => router.refresh());
  }

  async function handleSaveComment() {
    await updateBradComment(item.id, comment);
    setCommentOpen(false);
    startTransition(() => router.refresh());
  }

  async function handleBuildNewsletter() {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/content-pipe/build-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error);
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setGenerateError(`오류: ${err}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleBuildShortform() {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/content-pipe/build-shortform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error);
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setGenerateError(`오류: ${err}`);
    } finally {
      setIsGenerating(false);
    }
  }

  const date = new Date(item.created_at);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  // AI제안 표시 여부 판단
  const isAiSuggestion = item.brad_comment?.startsWith("[AI제안]");

  return (
    <div className="rounded-lg border border-border bg-surface p-2.5">
      <p className="mb-1 text-xs font-medium text-text line-clamp-2">
        {item.title || item.news_source}
      </p>
      {item.title && (
        <p className="mb-1 truncate text-xs text-text-subtle">
          {item.news_source}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-text-subtle">
        <span>{dateStr}</span>
        {item.channel && (
          <span className="rounded bg-surface-warm px-1.5 py-0.5">
            {item.channel}
          </span>
        )}
      </div>

      {item.brad_comment && !commentOpen && (
        <p
          className={`mt-1.5 cursor-pointer truncate rounded px-2 py-1 text-xs ${
            isAiSuggestion
              ? "bg-purple-50 text-purple-600"
              : "bg-accent-light text-accent"
          }`}
          onClick={() => setCommentOpen(true)}
          title={item.brad_comment}
        >
          {isAiSuggestion ? "AI 제안 반론" : item.brad_comment}
        </p>
      )}

      {/* 뉴스레터 미리보기 */}
      {item.newsletter_body && (
        <details className="mt-1.5">
          <summary className="cursor-pointer text-xs font-medium text-purple-600">
            뉴스레터 미리보기
          </summary>
          <div className="mt-1 max-h-32 overflow-y-auto rounded bg-surface-warm p-2 text-xs text-text whitespace-pre-wrap">
            {item.newsletter_body.slice(0, 500)}
            {item.newsletter_body.length > 500 && "..."}
          </div>
        </details>
      )}

      {/* 숏폼 스크립트 미리보기 */}
      {item.shortform_script && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs font-medium text-amber-600">
            숏폼 스크립트 미리보기
          </summary>
          <div className="mt-1 max-h-32 overflow-y-auto rounded bg-surface-warm p-2 text-xs text-text whitespace-pre-wrap">
            {item.shortform_script.slice(0, 500)}
            {item.shortform_script.length > 500 && "..."}
          </div>
        </details>
      )}

      {generateError && (
        <p className="mt-1 text-xs text-error">{generateError}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {/* 상태 진행 버튼 */}
        {nextStatus && item.status !== "selected" && (
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="rounded bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50"
          >
            → {STATUS_LABELS[nextStatus]}
          </button>
        )}

        {/* selected 상태: 뉴스레터 생성 버튼 */}
        {item.status === "selected" && item.brad_comment && !isAiSuggestion && (
          <button
            onClick={handleBuildNewsletter}
            disabled={isGenerating || isPending}
            className="rounded bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50"
          >
            {isGenerating ? "생성 중..." : "생성"}
          </button>
        )}

        {/* selected 상태: 일반 진행 버튼 (코멘트 없이 넘어가기) */}
        {item.status === "selected" && nextStatus && (
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="rounded bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50"
          >
            → {STATUS_LABELS[nextStatus]}
          </button>
        )}

        {/* generated 상태: 숏폼 생성 버튼 */}
        {item.status === "generated" && item.newsletter_body && (
          <button
            onClick={handleBuildShortform}
            disabled={isGenerating || isPending}
            className="rounded bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50"
          >
            {isGenerating ? "숏폼 생성 중..." : "숏폼 생성"}
          </button>
        )}

        {/* 메모 버튼 */}
        <button
          onClick={() => setCommentOpen(!commentOpen)}
          className="rounded bg-surface-warm px-3 py-2 text-xs text-text-muted hover:text-text active:text-text"
        >
          메모
        </button>
      </div>

      {commentOpen && (
        <div className="mt-2 flex gap-1.5">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Brad 코멘트..."
            className="flex-1 rounded border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <button
            onClick={handleSaveComment}
            className="rounded bg-accent px-3 py-2 text-xs text-white active:bg-accent/80"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}
