import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/?error=exchange`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/?error=no_user`);
  }

  // admin 이메일이면 대시보드로, 아니면 홈으로
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());

  if (adminEmails.includes(user.email)) {
    return NextResponse.redirect(`${origin}/ax-process`);
  }

  return NextResponse.redirect(`${origin}/`);
}
