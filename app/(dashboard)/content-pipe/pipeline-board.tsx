"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ContentPipelineRow, PipelineStatus } from "@/lib/content-pipe/types";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/content-pipe/types";
import { updatePipelineStatus, updateBradComment } from "@/lib/content-pipe/actions";

export function PipelineBoard({ rows }: { rows: ContentPipelineRow[] }) {
  const router = useRouter();
  const [isCurating, setIsCurating] = useState(false);
  const [curateMessage, setCurateMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleCurate() {
    setIsCurating(true);
    setCurateMessage(null);
    try {
      const res = await fetch("/api/content-pipe/curate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCurateMessage({ text: data.error || "수집 실패", isError: true });
      } else if (data.skipped) {
        setCurateMessage({ text: data.message, isError: false });
      } else {
        setCurateMessage({ text: data.message || `${data.inserted}건 수집 완료`, isError: false });
      }
      router.refresh();
    } catch (err) {
      setCurateMessage({ text: `오류: ${err}`, isError: true });
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
        {curateMessage && (
          <p className={`text-xs ${curateMessage.isError ? "text-error" : "text-text-muted"}`}>
            {curateMessage.text}
          </p>
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
  const [detailOpen, setDetailOpen] = useState(false);

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
    <>
      <div className="rounded-lg border border-border bg-surface p-2.5 hover:border-accent/40 transition-colors">
        {/* 클릭하면 상세 모달 열기 */}
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="mb-1 w-full text-left text-xs font-medium text-text line-clamp-2 hover:text-accent transition-colors cursor-pointer"
        >
          {item.title || item.news_source}
        </button>
        {item.title && (
          <p className="mb-1 truncate text-xs text-text-subtle">
            {item.news_source}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-text-subtle">
          <span>{dateStr}</span>
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

        {/* 콘텐츠 유무 표시 (간략 뱃지) */}
        <div className="mt-1.5 flex gap-1">
          {item.raw_content && (
            <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600">원문</span>
          )}
          {item.newsletter_body && (
            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600">뉴스레터</span>
          )}
          {item.shortform_script && (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">숏폼</span>
          )}
        </div>

        {generateError && (
          <p className="mt-1 text-xs text-error">{generateError}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {/* 상세보기 버튼 */}
          <button
            onClick={() => setDetailOpen(true)}
            className="rounded bg-surface-warm px-3 py-2 text-xs text-text-muted hover:text-text active:text-text"
          >
            상세
          </button>

          {/* 상태 진행 버튼 (selected 제외 — selected는 뉴스레터 생성으로만 진행) */}
          {nextStatus && item.status !== "selected" && (
            <button
              onClick={handleAdvance}
              disabled={isPending}
              className="rounded bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50"
            >
              → {STATUS_LABELS[nextStatus]}
            </button>
          )}

          {/* selected 상태: 뉴스레터 생성 버튼 (필수 — 스킵 불가) */}
          {item.status === "selected" && (
            <button
              onClick={handleBuildNewsletter}
              disabled={isGenerating || isPending}
              className="rounded bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50"
            >
              {isGenerating
                ? "생성 중..."
                : item.brad_comment && !isAiSuggestion
                  ? "생성"
                  : "AI 분석 생성"}
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

      {/* 상세 모달 */}
      {detailOpen && (
        <DetailModal item={item} onClose={() => setDetailOpen(false)} />
      )}
    </>
  );
}

/* ─────────────── 상세 모달 ─────────────── */
function DetailModal({
  item,
  onClose,
}: {
  item: ContentPipelineRow;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const date = new Date(item.created_at);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[10vh] overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-lg">
        {/* 헤더 */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                  {
                    candidate: "bg-gray-400",
                    selected: "bg-blue-500",
                    generated: "bg-purple-500",
                    approved: "bg-amber-500",
                    published: "bg-emerald-500",
                  }[item.status]
                }`}
              >
                {STATUS_LABELS[item.status]}
              </span>
              <span className="text-[10px] text-text-subtle">{dateStr}</span>
            </div>
            <h2 className="text-sm font-bold text-text">
              {item.title || item.news_source}
            </h2>
            {item.title && (
              <p className="mt-0.5 text-xs text-text-subtle break-all">
                {item.news_source}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1.5 text-text-muted hover:text-text hover:bg-surface-warm transition-colors"
            aria-label="닫기"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 뉴스 소스 링크 */}
          {item.news_source.startsWith("http") && (
            <section>
              <h3 className="mb-1.5 text-xs font-semibold text-text-muted">뉴스 소스</h3>
              <a
                href={item.news_source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline break-all"
              >
                {item.news_source}
              </a>
            </section>
          )}

          {/* 원문 (스크래핑 또는 직접 입력) */}
          {item.raw_content && (
            <section>
              <h3 className="mb-1.5 text-xs font-semibold text-green-600">원문</h3>
              <div className="rounded-lg border border-green-100 bg-green-50/30 p-3 text-xs text-text whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {item.raw_content}
              </div>
            </section>
          )}

          {/* Brad 코멘트 / AI 제안 */}
          {item.brad_comment && (
            <section>
              <h3 className="mb-1.5 text-xs font-semibold text-text-muted">
                {item.brad_comment.startsWith("[AI제안]") ? "AI 제안 반론" : "Brad 코멘트"}
              </h3>
              <div className="rounded-lg bg-surface-warm p-3 text-xs text-text whitespace-pre-wrap leading-relaxed">
                {item.brad_comment.replace(/^\[AI제안\]\s*/, "")}
              </div>
            </section>
          )}

          {/* 뉴스레터 본문 */}
          {item.newsletter_body && (
            <section>
              <h3 className="mb-1.5 text-xs font-semibold text-purple-600">
                뉴스레터 본문
              </h3>
              <div className="rounded-lg border border-purple-100 bg-purple-50/30 p-3 text-xs text-text whitespace-pre-wrap leading-relaxed">
                {item.newsletter_body}
              </div>
            </section>
          )}

          {/* 숏폼 스크립트 */}
          {item.shortform_script && (
            <section>
              <h3 className="mb-1.5 text-xs font-semibold text-amber-600">
                숏폼 스크립트
              </h3>
              <div className="rounded-lg border border-amber-100 bg-amber-50/30 p-3 text-xs text-text whitespace-pre-wrap leading-relaxed">
                {item.shortform_script}
              </div>
            </section>
          )}

          {/* 콘텐츠 없음 안내 */}
          {!item.raw_content && !item.brad_comment && !item.newsletter_body && !item.shortform_script && (
            <p className="py-6 text-center text-xs text-text-subtle">
              아직 생성된 콘텐츠가 없습니다. 파이프라인을 진행해 주세요.
            </p>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t border-border px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-warm px-4 py-2 text-xs font-medium text-text-muted hover:text-text transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
