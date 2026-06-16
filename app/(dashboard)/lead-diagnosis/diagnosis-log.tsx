"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markConverted, updateReactionNote } from "@/lib/lead-diagnosis/actions";
import type { LeadDiagnosisRow } from "@/lib/types";

export function DiagnosisLog({ rows }: { rows: LeadDiagnosisRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-subtle">
        아직 진단 이력이 없습니다
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <LogRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogRow({ row }: { row: LeadDiagnosisRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(row.reaction_note || "");

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
      </tr>
      {noteOpen && (
        <tr className="border-b border-border-light bg-surface-warm/30">
          <td colSpan={8} className="px-3 py-2">
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
