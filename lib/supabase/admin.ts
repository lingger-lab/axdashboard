import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// RLS를 우회하는 관리자 전용 클라이언트.
// 서버 코드에서만 사용. 클라이언트에서 import 금지.
// lazy-init으로 빌드 시 env 미설정 에러 방지.
let _admin: SupabaseClient | null = null;

export function adminClient(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
  }
  return _admin;
}
