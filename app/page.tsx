import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle } from "@/lib/auth/actions";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이미 로그인된 admin이면 대시보드로
  if (user?.email) {
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim());
    if (adminEmails.includes(user.email)) {
      redirect("/lead-diagnosis");
    }
  }

  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-text">엔터랩스 AX</h1>
        <p className="mb-6 text-sm text-text-muted">운영 대시보드</p>

        {error && (
          <p className="mb-4 rounded-lg bg-error-light px-3 py-2 text-xs text-error">
            로그인에 실패했습니다. 다시 시도해주세요.
          </p>
        )}

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Google로 로그인
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-text-subtle">
          관리자 계정만 접근 가능합니다
        </p>
      </div>
    </div>
  );
}
