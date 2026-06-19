"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPipelineItem } from "@/lib/content-pipe/actions";

type InputMode = "url" | "text";

export function AddItemForm() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("url");
  const [newsSource, setNewsSource] = useState("");
  const [title, setTitle] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "url") {
      if (!newsSource.trim()) return setLoading(false);
      const res = await addPipelineItem(newsSource.trim(), title.trim() || undefined);
      if (res.error) {
        setError(res.error);
      } else {
        setNewsSource("");
        setTitle("");
        router.refresh();
      }
    } else {
      if (!title.trim() || !rawContent.trim()) return setLoading(false);
      const res = await addPipelineItem(
        source.trim() || title.trim(),
        title.trim(),
        rawContent.trim()
      );
      if (res.error) {
        setError(res.error);
      } else {
        setTitle("");
        setRawContent("");
        setSource("");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-4"
    >
      {/* 입력 방식 토글 */}
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-accent text-white"
              : "bg-surface-warm text-text-muted hover:text-text"
          }`}
        >
          URL / 제목
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === "text"
              ? "bg-accent text-white"
              : "bg-surface-warm text-text-muted hover:text-text"
          }`}
        >
          텍스트 붙여넣기
        </button>
      </div>

      {mode === "url" ? (
        /* URL/제목 모드 */
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-text-muted">
              뉴스 소스 (URL 또는 제목)
            </span>
            <input
              type="text"
              value={newsSource}
              onChange={(e) => setNewsSource(e.target.value)}
              placeholder="https://... 또는 뉴스 제목"
              required
              className="input-field"
            />
          </label>
          <label className="w-full sm:w-48">
            <span className="mb-1 block text-xs font-medium text-text-muted">
              제목 (선택)
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="표시용 제목"
              className="input-field"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !newsSource.trim()}
            className="w-full sm:w-auto rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50"
          >
            {loading ? "추가 중..." : "후보 추가"}
          </button>
        </div>
      ) : (
        /* 텍스트 붙여넣기 모드 */
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="mb-1 block text-xs font-medium text-text-muted">
                제목
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="기사 제목"
                required
                className="input-field"
              />
            </label>
            <label className="w-full sm:w-48">
              <span className="mb-1 block text-xs font-medium text-text-muted">
                출처 (선택)
              </span>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="출처 URL 또는 매체명"
                className="input-field"
              />
            </label>
          </div>
          <label>
            <span className="mb-1 block text-xs font-medium text-text-muted">
              본문
            </span>
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="기사 본문을 붙여넣으세요..."
              required
              rows={5}
              className="input-field resize-y"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !title.trim() || !rawContent.trim()}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50"
            >
              {loading ? "추가 중..." : "후보 추가"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </form>
  );
}
