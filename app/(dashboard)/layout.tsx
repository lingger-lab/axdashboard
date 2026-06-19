// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";
// import { signOut } from "@/lib/auth/actions";
import { MobileNav } from "./mobile-nav";
import { ChatWidget } from "./chat-widget";
import { QuickLinksPopover } from "./quick-links-popover";
import { ClaudeIcon, GeminiIcon, OpenAIIcon, NotebookLMIcon, GoogleAIStudioIcon, GrokIcon, GensparkIcon, CapCutIcon, HeyGenIcon, BandIcon, KmongIcon, FreemoaIcon, WishketIcon, YouTubeIcon, FacebookIcon, NaverBlogIcon, HomeTaxIcon, Gov24Icon } from "@/lib/ai-icons";

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 공개
// 복구: 이 파일의 주석을 해제하고 app/page.tsx의 redirect 주석도 해제

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative border-b border-border bg-surface px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/ax-process"
              className="text-base font-bold text-accent"
            >
              엔터랩스 AX
            </Link>
            <MobileNav camponeUrl={process.env.NEXT_PUBLIC_CAMPONE_URL} />
          </div>
          <QuickLinksPopover />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-surface px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>엔터랩스 운영</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" title="Claude" className="p-1 rounded hover:bg-surface-warm transition-colors"><ClaudeIcon className="w-3.5 h-3.5" /></a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" title="Gemini" className="p-1 rounded hover:bg-surface-warm transition-colors"><GeminiIcon className="w-3.5 h-3.5" /></a>
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" title="ChatGPT" className="p-1 rounded hover:bg-surface-warm transition-colors"><OpenAIIcon className="w-3.5 h-3.5" /></a>
            <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" title="NotebookLM" className="p-1 rounded hover:bg-surface-warm transition-colors"><NotebookLMIcon className="w-3.5 h-3.5" /></a>
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" title="AI Studio" className="p-1 rounded hover:bg-surface-warm transition-colors"><GoogleAIStudioIcon className="w-3.5 h-3.5" /></a>
            <a href="https://grok.com" target="_blank" rel="noopener noreferrer" title="Grok" className="p-1 rounded hover:bg-surface-warm transition-colors"><GrokIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.genspark.ai" target="_blank" rel="noopener noreferrer" title="Genspark" className="p-1 rounded hover:bg-surface-warm transition-colors"><GensparkIcon className="w-3.5 h-3.5" /></a>
            <span className="w-px h-3 bg-border mx-1" />
            <a href="https://www.capcut.com" target="_blank" rel="noopener noreferrer" title="CapCut" className="p-1 rounded hover:bg-surface-warm transition-colors"><CapCutIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.heygen.com" target="_blank" rel="noopener noreferrer" title="HeyGen" className="p-1 rounded hover:bg-surface-warm transition-colors"><HeyGenIcon className="w-3.5 h-3.5" /></a>
            <span className="w-px h-3 bg-border mx-1" />
            <a href="https://www.band.us/band/96322028/post" target="_blank" rel="noopener noreferrer" title="지사네" className="p-1 rounded hover:bg-surface-warm transition-colors"><BandIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="p-1 rounded hover:bg-surface-warm transition-colors"><YouTubeIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="p-1 rounded hover:bg-surface-warm transition-colors"><FacebookIcon className="w-3.5 h-3.5" /></a>
            <a href="https://blog.naver.com/zipchul" target="_blank" rel="noopener noreferrer" title="네이버블로그" className="p-1 rounded hover:bg-surface-warm transition-colors"><NaverBlogIcon className="w-3.5 h-3.5" /></a>
            <span className="w-px h-3 bg-border mx-1" />
            <a href="https://kmong.com/@EnterLabs" target="_blank" rel="noopener noreferrer" title="크몽" className="p-1 rounded hover:bg-surface-warm transition-colors"><KmongIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.freemoa.net/m5/s50" target="_blank" rel="noopener noreferrer" title="프리모아" className="p-1 rounded hover:bg-surface-warm transition-colors"><FreemoaIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.wishket.com/mywishket/partners/" target="_blank" rel="noopener noreferrer" title="위시캣" className="p-1 rounded hover:bg-surface-warm transition-colors"><WishketIcon className="w-3.5 h-3.5" /></a>
            <span className="w-px h-3 bg-border mx-1" />
            <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer" title="홈택스" className="p-1 rounded hover:bg-surface-warm transition-colors"><HomeTaxIcon className="w-3.5 h-3.5" /></a>
            <a href="https://www.gov.kr" target="_blank" rel="noopener noreferrer" title="정부24" className="p-1 rounded hover:bg-surface-warm transition-colors"><Gov24Icon className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
