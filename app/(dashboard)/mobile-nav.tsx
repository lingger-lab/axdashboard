"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function MobileNav({ camponeUrl }: { camponeUrl: string | undefined }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  const linkClass = (href: string) =>
    `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors active:bg-surface-warm/70 ${
      pathname.startsWith(href)
        ? "bg-surface-warm text-accent"
        : "text-text hover:bg-surface-warm"
    }`;

  return (
    <>
      {/* 햄버거 버튼 — 모바일만 표시 */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-md text-text hover:bg-surface-warm active:bg-surface-warm/70 md:hidden"
        aria-label="메뉴"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 데스크톱 내비 — md 이상 표시 */}
      <nav className="hidden md:flex gap-1">
        <Link href="/ax-process" className={linkClass("/ax-process")}>
          AX전환절차
        </Link>
        <Link href="/asset-hub" className={linkClass("/asset-hub")}>
          자산허브
        </Link>
        <Link href="/content-pipe" className={linkClass("/content-pipe")}>
          콘텐츠파이프
        </Link>
        <Link href="/lead-diagnosis" className={linkClass("/lead-diagnosis")}>
          리드 진단
        </Link>
        {camponeUrl ? (
          <a
            href={camponeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"
          >
            CampOne Studio ↗
          </a>
        ) : (
          <span className="rounded-md px-3 py-2.5 text-sm font-medium text-text-subtle cursor-not-allowed">
            CampOne Studio ↗
          </span>
        )}
      </nav>

      {/* 모바일 드롭다운 */}
      {open && (
        <nav className="absolute left-0 top-full w-full border-b border-border bg-surface px-4 py-3 md:hidden z-50 animate-fade-in">
          <div className="flex flex-col gap-1">
            <Link href="/ax-process" className={linkClass("/ax-process")} onClick={close}>
              AX전환절차
            </Link>
            <Link href="/asset-hub" className={linkClass("/asset-hub")} onClick={close}>
              자산허브
            </Link>
            <Link href="/content-pipe" className={linkClass("/content-pipe")} onClick={close}>
              콘텐츠파이프
            </Link>
            <Link href="/lead-diagnosis" className={linkClass("/lead-diagnosis")} onClick={close}>
              리드 진단
            </Link>
            {camponeUrl ? (
              <a
                href={camponeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"
                onClick={close}
              >
                CampOne Studio ↗
              </a>
            ) : (
              <span className="block rounded-md px-3 py-2.5 text-sm font-medium text-text-subtle cursor-not-allowed">
                CampOne Studio ↗
              </span>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
