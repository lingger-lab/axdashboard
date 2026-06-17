"use client";

import { useEffect, useSyncExternalStore } from "react";

// 카카오톡 등 인앱 브라우저는 구글 OAuth가 disallowed_useragent로 차단되므로
// 외부(기본) 브라우저로 빠져나가도록 유도한다.
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

// 인앱 브라우저 여부는 클라이언트 전용 정보라 useSyncExternalStore로 읽는다.
// (서버 스냅샷은 false → 하이드레이션 불일치 방지)
const subscribe = () => () => {};

export function InAppBrowserEscape() {
  const inApp = useSyncExternalStore(
    subscribe,
    () => IN_APP_PATTERN.test(navigator.userAgent),
    () => false
  );

  useEffect(() => {
    if (inApp) escapeToExternalBrowser();
  }, [inApp]);

  if (!inApp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <p className="mb-6 text-sm text-text">
          보안을 위해 외부 브라우저로 이동합니다.
        </p>
        <button
          type="button"
          onClick={escapeToExternalBrowser}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          외부 브라우저로 열기
        </button>
      </div>
    </div>
  );
}
