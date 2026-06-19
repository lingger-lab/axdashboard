"use client";

import { useState, useRef } from "react";
import { markReplied } from "@/lib/lead-diagnosis/actions";
import type { LeadDiagnosisRow } from "@/lib/types";

interface DiagnosisResult {
  diagnosis: LeadDiagnosisRow;
}

export function DiagnosisForm() {
  const [name, setName] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          q1_career: q1.trim(),
          q2_strength: q2.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "진단 요청에 실패했습니다");
        return;
      }

      setResult(data);
      // 결과 영역으로 스크롤
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result?.diagnosis.diagnosis_card) return;
    await navigator.clipboard.writeText(result.diagnosis.diagnosis_card);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleMarkReplied() {
    if (!result?.diagnosis.id) return;
    setIsPending(true);
    const res = await markReplied(result.diagnosis.id);
    setIsPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setResult((prev) =>
      prev
        ? {
            diagnosis: { ...prev.diagnosis, replied: true },
          }
        : null
    );
  }

  const diagnosis = result?.diagnosis;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 입력 영역 */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text">리드 진단 생성</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="이름" optional>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="리드 이름 (선택)"
              className="input-field"
            />
          </Field>

          <Field label="Q1. 경력">
            <textarea
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="현재 직업, 경력 연차, 주요 도메인 등"
              rows={3}
              required
              className="input-field resize-none"
            />
          </Field>

          <Field label="Q2. 강점">
            <textarea
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              placeholder="잘하는 것, 사람들이 인정하는 능력, 반복 성과 등"
              rows={3}
              required
              className="input-field resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={loading || !q1.trim() || !q2.trim()}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "진단 생성 중..." : "진단 생성"}
          </button>
        </form>

        {/* V2 비활성 영역 */}
        <div className="mt-4 flex gap-2">
          <button
            disabled
            className="flex-1 rounded-lg border border-dashed border-border-light px-3 py-2 text-xs text-text-subtle opacity-40 cursor-not-allowed"
          >
            메타 웹훅 연동 (V2)
          </button>
          <button
            disabled
            className="flex-1 rounded-lg border border-dashed border-border-light px-3 py-2 text-xs text-text-subtle opacity-40 cursor-not-allowed"
          >
            자동 발송 (V2)
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      <div ref={resultRef} className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text">진단 결과</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-error-light px-3 py-2 text-xs text-error">
            {error}
          </div>
        )}

        {!diagnosis && !error && (
          <p className="py-12 text-center text-sm text-text-subtle">
            리드 정보를 입력하고 진단을 생성하세요
          </p>
        )}

        {diagnosis && (
          <div className="animate-fade-in space-y-4">
            {/* 배지 영역 */}
            <div className="flex items-center gap-2">
              {diagnosis.is_regulated && (
                <span className="rounded-full bg-error-light px-2.5 py-0.5 text-xs font-medium text-error">
                  규제 업종
                </span>
              )}
              {diagnosis.branch && <BranchBadge branch={diagnosis.branch} />}
              {diagnosis.replied && (
                <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                  회신 완료
                </span>
              )}
            </div>

            {/* 카드 텍스트 */}
            <div className="max-h-60 sm:max-h-80 overflow-y-auto rounded-lg bg-surface-warm p-4 text-sm leading-relaxed text-text whitespace-pre-wrap">
              {diagnosis.diagnosis_card}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-warm active:bg-surface-warm min-h-[44px]"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
              {!diagnosis.replied && (
                <button
                  onClick={handleMarkReplied}
                  disabled={isPending}
                  className="rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50 min-h-[44px]"
                >
                  {isPending ? "처리 중..." : "회신 완료"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-muted">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-text-subtle">선택</span>
        )}
      </span>
      {children}
    </label>
  );
}

function BranchBadge({ branch }: { branch: "A" | "B" | "C" }) {
  const styles = {
    A: "bg-emerald-50 text-emerald-700",
    B: "bg-blue-50 text-blue-700",
    C: "bg-amber-50 text-amber-700",
  };
  const labels = {
    A: "A: 충분",
    B: "B: 보통",
    C: "C: 부족",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[branch]}`}
    >
      {labels[branch]}
    </span>
  );
}
