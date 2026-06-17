"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/actions";

// 카카오톡 등 인앱 브라우저는 구글 OAuth가 disallowed_useragent로 차단된다.
const IN_APP_PATTERN = /kakaotalk|naver|instagram|fban|fbav|line|daum/i;

function escapeToExternalBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  const url = window.location.href;

  if (ua.includes("kakaotalk")) {
    // 카카오톡 전용 스킴 (iOS/Android 모두 기본 브라우저로 탈출)
    window.location.href =
      "kakaotalk://web/openExternal?url=" + encodeURIComponent(url);
  } else if (ua.includes("android")) {
    // 그 외 Android 인앱: intent로 Chrome 강제 오픈
    window.location.href =
      "intent://" +
      url.replace(/^https?:\/\//, "") +
      "#Intent;scheme=https;package=com.android.chrome;end";
  }
}

export function GoogleLoginForm() {
  const [showChoice, setShowChoice] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // 인앱 브라우저면 구글 로그인이 에러나므로, 제출을 막고 선택지를 띄운다.
    if (IN_APP_PATTERN.test(navigator.userAgent)) {
      e.preventDefault();
      setShowChoice(true);
    }
    // 일반 브라우저면 그대로 서버 액션(signInWithGoogle) 진행
  }

  return (
    <>
      <form action={signInWithGoogle} onSubmit={handleSubmit}>
        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          Google로 로그인
        </button>
      </form>

      {showChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg">
            <p className="mb-5 text-sm text-text">
              인앱 브라우저에서는 구글 로그인이 제한됩니다. 외부 브라우저로
              여시겠어요?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChoice(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-background"
              >
                취소
              </button>
              <button
                type="button"
                onClick={escapeToExternalBrowser}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                외부 브라우저로 열기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
