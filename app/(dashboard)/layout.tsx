import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

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
      <header className="border-b border-border bg-surface px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/lead-diagnosis"
              className="text-base font-bold text-accent"
            >
              엔터랩스 AX
            </Link>
            <nav className="flex gap-1">
              <Link
                href="/lead-diagnosis"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-warm transition-colors"
              >
                리드 진단
              </Link>
              <Link
                href="/asset-hub"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-warm transition-colors"
              >
                자산허브
              </Link>
              <Link
                href="/content-pipe"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-warm transition-colors"
              >
                콘텐츠파이프
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_CAMPONE_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  process.env.NEXT_PUBLIC_CAMPONE_URL
                    ? "text-text hover:bg-surface-warm"
                    : "text-text-subtle cursor-not-allowed"
                }`}
              >
                CampOne Studio ↗
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-text-subtle hover:text-text transition-colors"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
