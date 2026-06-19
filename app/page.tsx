import { redirect } from "next/navigation";

// ⚠️ 인증 비활성화 — 반응 테스트 기간 동안 로그인 없이 바로 대시보드로 이동
// 복구: 이 파일을 원래의 로그인 폼 버전으로 되돌리기

export default function HomePage() {
  redirect("/ax-process");
}
