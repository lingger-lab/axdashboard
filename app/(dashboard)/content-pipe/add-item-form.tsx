"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPipelineItem } from "@/lib/content-pipe/actions";

export function AddItemForm() {
  const router = useRouter();
  const [newsSource, setNewsSource] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsSource.trim()) return;
    setLoading(true);
    setError(null);

    const res = await addPipelineItem(newsSource.trim(), title.trim());
    if (res.error) {
      setError(res.error);
    } else {
      setNewsSource("");
      setTitle("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-xl border border-border bg-surface p-4"
    >
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
      <label className="w-48">
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
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {loading ? "추가 중..." : "후보 추가"}
      </button>
      {error && <p className="text-xs text-error">{error}</p>}
    </form>
  );
}
