"use client";

import { useState, useRef, useEffect } from "react";
import {
  ClaudeIcon, GeminiIcon, OpenAIIcon, NotebookLMIcon,
  GoogleAIStudioIcon, GrokIcon, GensparkIcon,
  CapCutIcon, HeyGenIcon,
  BandIcon, YouTubeIcon, FacebookIcon, NaverBlogIcon,
  KmongIcon, FreemoaIcon, WishketIcon,
  HomeTaxIcon, Gov24Icon,
} from "@/lib/ai-icons";

/* 헤더에 직접 노출할 주요 AI 링크 */
const PRIMARY_LINKS = [
  { name: "Claude", href: "https://claude.ai", Icon: ClaudeIcon },
  { name: "Gemini", href: "https://gemini.google.com", Icon: GeminiIcon },
  { name: "ChatGPT", href: "https://chatgpt.com", Icon: OpenAIIcon },
];

/* 더보기 패널에 분류별로 표시할 링크 */
const MORE_GROUPS = [
  {
    label: "AI 도구",
    links: [
      { name: "NotebookLM", href: "https://notebooklm.google.com", Icon: NotebookLMIcon },
      { name: "AI Studio", href: "https://aistudio.google.com", Icon: GoogleAIStudioIcon },
      { name: "Grok", href: "https://grok.com", Icon: GrokIcon },
      { name: "Genspark", href: "https://www.genspark.ai", Icon: GensparkIcon },
    ],
  },
  {
    label: "크리에이티브",
    links: [
      { name: "CapCut", href: "https://www.capcut.com", Icon: CapCutIcon },
      { name: "HeyGen", href: "https://www.heygen.com", Icon: HeyGenIcon },
    ],
  },
  {
    label: "커뮤니티·SNS",
    links: [
      { name: "지사네", href: "https://www.band.us/band/96322028/post", Icon: BandIcon },
      { name: "YouTube", href: "https://www.youtube.com", Icon: YouTubeIcon },
      { name: "Facebook", href: "https://www.facebook.com", Icon: FacebookIcon },
      { name: "네이버블로그", href: "https://blog.naver.com/zipchul", Icon: NaverBlogIcon },
    ],
  },
  {
    label: "프리랜서 플랫폼",
    links: [
      { name: "크몽", href: "https://kmong.com/@EnterLabs", Icon: KmongIcon },
      { name: "프리모아", href: "https://www.freemoa.net/m5/s50", Icon: FreemoaIcon },
      { name: "위시캣", href: "https://www.wishket.com/mywishket/partners/", Icon: WishketIcon },
    ],
  },
  {
    label: "정부·공공",
    links: [
      { name: "홈택스", href: "https://www.hometax.go.kr", Icon: HomeTaxIcon },
      { name: "정부24", href: "https://www.gov.kr", Icon: Gov24Icon },
    ],
  },
];

const MORE_COUNT = MORE_GROUPS.reduce((n, g) => n + g.links.length, 0);

export function QuickLinksPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative flex items-center gap-1" ref={ref}>
      {/* 주요 3개 아이콘 직접 노출 */}
      {PRIMARY_LINKS.map((link) => {
        const Icon = link.Icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
            className="p-1.5 rounded-md hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}

      {/* +N 더보기 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-colors ${
          open
            ? "bg-accent text-white"
            : "text-text-subtle hover:bg-surface-warm hover:text-text"
        }`}
      >
        +{MORE_COUNT}
      </button>

      {/* 더보기 팝오버 패널 */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-xl border border-border bg-surface shadow-lg z-50 animate-scale-in">
          <div className="p-4 space-y-3">
            {MORE_GROUPS.map((group) => (
              <div key={group.label}>
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  {group.label}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {group.links.map((link) => {
                    const Icon = link.Icon;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.name}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-text-subtle hover:bg-surface-warm hover:text-text active:bg-surface-warm/70 transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
