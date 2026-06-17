import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { MobileNav } from "./mobile-nav";
import { ChatWidget } from "./chat-widget";
import { ClaudeIcon, GeminiIcon, OpenAIIcon } from "@/lib/ai-icons";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());
  if (!adminEmails.includes(user.email)) {
    redirect("/");
  }

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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" title="Claude" className="p-1.5 rounded-md hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"><ClaudeIcon className="w-4 h-4" /></a>
              <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" title="Gemini" className="p-1.5 rounded-md hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"><GeminiIcon className="w-4 h-4" /></a>
              <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" title="ChatGPT" className="p-1.5 rounded-md hover:bg-surface-warm active:bg-surface-warm/70 transition-colors"><OpenAIIcon className="w-4 h-4" /></a>
            </div>
            <span className="hidden sm:inline text-xs text-text-muted">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-text-subtle hover:text-text active:text-text transition-colors min-h-[44px] px-2"
              >
                로그아웃
              </button>
            </form>
          </div>
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
          <div className="flex items-center gap-3">
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-text-subtle hover:text-text active:text-text transition-colors">
              <ClaudeIcon className="w-3.5 h-3.5" /> <span>Claude</span>
            </a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-text-subtle hover:text-text active:text-text transition-colors">
              <GeminiIcon className="w-3.5 h-3.5" /> <span>Gemini</span>
            </a>
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-text-subtle hover:text-text active:text-text transition-colors">
              <OpenAIIcon className="w-3.5 h-3.5" /> <span>ChatGPT</span>
            </a>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
