"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { markConverted, updateReactionNote, deleteDiagnosis } from "@/lib/lead-diagnosis/actions";
import type { LeadDiagnosisRow } from "@/lib/types";

export function DiagnosisLog({ rows }: { rows: LeadDiagnosisRow[] }) {
  const [detailRow, setDetailRow] = useState<LeadDiagnosisRow | null>(null);

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-subtle">
        아직 진단 이력이 없습니다
      </p>
    );
  }

  return (
    <div>
      {/* 모바일 카드뷰 */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <MobileLogCard key={row.id} row={row} onDetail={setDetailRow} />
        ))}
      </div>

      {/* 데스크톱 테이블뷰 */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-warm text-xs text-text-muted">
              <th className="px-3 py-2.5 font-medium">날짜</th>
              <th className="px-3 py-2.5 font-medium">이름</th>
              <th className="px-3 py-2.5 font-medium">경력</th>
              <th className="px-3 py-2.5 font-medium">강점</th>
              <th className="px-3 py-2.5 font-medium">분기</th>
              <th className="px-3 py-2.5 font-medium">규제</th>
              <th className="px-3 py-2.5 font-medium">회신</th>
              <th className="px-3 py-2.5 font-medium">전환</th>
              <th className="px-3 py-2.5 font-medium">상세</th>
              <th className="px-3 py-2.5 font-medium">삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <LogRow key={row.id} row={row} onDetail={setDetailRow} />
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {detailRow && (
        <DiagnosisDetailModal row={detailRow} onClose={() => setDetailRow(null)} />
      )}
    </div>
  );
}

function LogRow({
  row,
  onDetail,
}: {
  row: LeadDiagnosisRow;
  onDetail: (row: LeadDiagnosisRow) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(row.reaction_note || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleConvert() {
    const res = await markConverted(row.id);
    if (!res.error) {
      startTransition(() => router.refresh());
    }
  }

  async function handleSaveNote() {
    const res = await updateReactionNote(row.id, noteText);
    if (!res.error) {
      setNoteOpen(false);
      startTransition(() => router.refresh());
    }
  }

  async function handleDelete() {
    const res = await deleteDiagnosis(row.id);
    if (!res.error) {
      startTransition(() => router.refresh());
    }
  }

  const date = new Date(row.created_at);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <>
      <tr className="border-b border-border-light transition-colors hover:bg-surface-warm/50">
        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-text-muted">
          {dateStr}
        </td>
        <td className="px-3 py-2.5 text-xs">
          {row.name || <span className="text-text-subtle">-</span>}
        </td>
        <td className="max-w-[140px] truncate px-3 py-2.5 text-xs" title={row.q1_career}>
          {row.q1_career}
        </td>
        <td className="max-w-[140px] truncate px-3 py-2.5 text-xs" title={row.q2_strength}>
          {row.q2_strength}
        </td>
        <td className="px-3 py-2.5">
          {row.branch ? (
            <BranchDot branch={row.branch} />
          ) : (
            <span className="text-xs text-text-subtle">-</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {row.is_regulated ? (
            <span className="text-xs text-error">Y</span>
          ) : (
            <span className="text-xs text-text-subtle">-</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {row.replied ? (
            <span className="text-xs text-accent">O</span>
          ) : (
            <span className="text-xs text-text-subtle">-</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {row.converted ? (
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className="text-xs text-success hover:underline"
            >
              O
            </button>
          ) : (
            <button
              onClick={handleConvert}
              disabled={isPending}
              className="text-xs text-text-subtle transition-colors hover:text-success disabled:opacity-50"
              title="전환으로 표시"
            >
              [ ]
            </button>
          )}
        </td>
        <td className="px-3 py-2.5">
          {row.diagnosis_card ? (
            <button
              onClick={() => onDetail(row)}
              className="text-xs text-accent hover:underline"
            >
              보기
            </button>
          ) : (
            <span className="text-xs text-text-subtle">-</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {confirmDelete ? (
            <span className="inline-flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs font-medium text-error hover:underline disabled:opacity-50"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-text-subtle hover:text-text"
              >
                취소
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-text-subtle transition-colors hover:text-error"
              title="삭제"
            >
              삭제
            </button>
          )}
        </td>
      </tr>
      {noteOpen && (
        <tr className="border-b border-border-light bg-surface-warm/30">
          <td colSpan={10} className="px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="반응 메모 입력..."
                className="flex-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-text outline-none focus:border-accent"
              />
              <button
                onClick={handleSaveNote}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90"
              >
                저장
              </button>
              <button
                onClick={() => setNoteOpen(false)}
                className="rounded-md px-2 py-1.5 text-xs text-text-subtle hover:text-text"
              >
                취소
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MobileLogCard({
  row,
  onDetail,
}: {
  row: LeadDiagnosisRow;
  onDetail: (row: LeadDiagnosisRow) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(row.reaction_note || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleConvert() {
    const res = await markConverted(row.id);
    if (!res.error) startTransition(() => router.refresh());
  }

  async function handleSaveNote() {
    const res = await updateReactionNote(row.id, noteText);
    if (!res.error) {
      setNoteOpen(false);
      startTransition(() => router.refresh());
    }
  }

  async function handleDelete() {
    const res = await deleteDiagnosis(row.id);
    if (!res.error) {
      startTransition(() => router.refresh());
    }
  }

  const date = new Date(row.created_at);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-text-muted">{dateStr}</span>
        <div className="flex items-center gap-2">
          {row.branch && <BranchDot branch={row.branch} />}
          {row.is_regulated && (
            <span className="text-xs font-medium text-error">규제</span>
          )}
        </div>
      </div>
      <p className="mb-1 text-sm font-medium text-text">
        {row.name || <span className="text-text-subtle">이름 없음</span>}
      </p>
      <p className="mb-1 text-xs text-text-muted line-clamp-2">{row.q1_career}</p>
      <p className="mb-3 text-xs text-text-muted line-clamp-2">{row.q2_strength}</p>
      <div className="flex items-center gap-3">
        {row.diagnosis_card && (
          <button
            onClick={() => onDetail(row)}
            className="text-xs text-accent active:opacity-70 min-h-[44px] flex items-center"
          >
            상세보기
          </button>
        )}
        {row.replied ? (
          <span className="text-xs text-accent">회신 완료</span>
        ) : (
          <span className="text-xs text-text-subtle">미회신</span>
        )}
        {row.converted ? (
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="text-xs text-success active:opacity-70 min-h-[44px] flex items-center"
          >
            전환 완료
          </button>
        ) : (
          <button
            onClick={handleConvert}
            disabled={isPending}
            className="text-xs text-text-subtle active:text-success min-h-[44px] flex items-center disabled:opacity-50"
          >
            전환 표시
          </button>
        )}
        <span className="ml-auto">
          {confirmDelete ? (
            <span className="inline-flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs font-medium text-error active:opacity-70 min-h-[44px] flex items-center disabled:opacity-50"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-text-subtle active:opacity-70 min-h-[44px] flex items-center"
              >
                취소
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-text-subtle active:text-error min-h-[44px] flex items-center"
            >
              삭제
            </button>
          )}
        </span>
      </div>
      {noteOpen && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="반응 메모..."
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <button
            onClick={handleSaveNote}
            className="rounded-md bg-accent px-3 py-2 text-xs text-white active:bg-accent/80"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────── 진단 상세 모달 ─────────────── */
function DiagnosisDetailModal({
  row,
  onClose,
}: {
  row: LeadDiagnosisRow;
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

  const date = new Date(row.created_at);
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
              {row.branch && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                    { A: "bg-emerald-500", B: "bg-blue-500", C: "bg-amber-500" }[row.branch]
                  }`}
                >
                  {row.branch}분기
                </span>
              )}
              {row.is_regulated && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                  규제 업종
                </span>
              )}
              {row.replied && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  회신 완료
                </span>
              )}
              <span className="text-[10px] text-text-subtle">{dateStr}</span>
            </div>
            <h2 className="text-sm font-bold text-text">
              {row.name || "이름 없음"} 진단 결과
            </h2>
            <p className="mt-0.5 text-xs text-text-subtle">
              경력: {row.q1_career}
            </p>
            <p className="text-xs text-text-subtle">
              강점: {row.q2_strength}
            </p>
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

        {/* 진단 카드 본문 */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {row.diagnosis_card ? (
            <div className="rounded-lg bg-surface-warm p-4 text-sm leading-relaxed text-text whitespace-pre-wrap">
              {row.diagnosis_card}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-text-subtle">
              진단 카드 내용이 없습니다.
            </p>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t border-border px-5 py-3 flex items-center gap-2">
          <DeleteButtonInModal id={row.id} onDeleted={onClose} />
          <div className="flex-1" />
          <CopyButton text={row.diagnosis_card || ""} />
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-warm transition-colors"
    >
      {copied ? "복사됨!" : "복사"}
    </button>
  );
}

function DeleteButtonInModal({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    const res = await deleteDiagnosis(id);
    if (!res.error) {
      onDeleted();
      startTransition(() => router.refresh());
    }
  }

  if (confirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isPending ? "삭제 중..." : "삭제 확인"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="rounded-lg px-3 py-2 text-xs text-text-subtle hover:text-text transition-colors"
        >
          취소
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
    >
      삭제
    </button>
  );
}

function BranchDot({ branch }: { branch: "A" | "B" | "C" }) {
  const colors = {
    A: "bg-emerald-500",
    B: "bg-blue-500",
    C: "bg-amber-500",
  };
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className={`inline-block h-2 w-2 rounded-full ${colors[branch]}`} />
      {branch}
    </span>
  );
}
