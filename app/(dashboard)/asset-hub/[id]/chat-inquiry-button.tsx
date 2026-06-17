"use client";

export function ChatInquiryButton({ assetName }: { assetName: string }) {
  function handleClick() {
    window.dispatchEvent(new Event("open-chat-widget"));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z"
          clipRule="evenodd"
        />
      </svg>
      &ldquo;{assetName}&rdquo; 매니저에게 문의하기
    </button>
  );
}
