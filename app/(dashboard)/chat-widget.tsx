"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
  escalated?: boolean;
}

const QUICK_QUESTIONS = [
  "AX 전환이 뭔가요?",
  "5단계 절차가 궁금해요",
  "무료 진단은 어떻게 받나요?",
  "정부지원 연계가 가능한가요?",
  "비용은 얼마나 드나요?",
];

const COMMUNITY_URL =
  "https://enterlab-web-844388762563.asia-northeast3.run.app/community";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("open-chat-widget", handleOpen);
    return () => window.removeEventListener("open-chat-widget", handleOpen);
  }, []);

  async function sendMessage(question: string) {
    if (!question.trim()) return;

    const userMsg: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const botMsg: Message = {
        role: "bot",
        text: data.answer || "죄송합니다. 일시적인 오류가 발생했습니다.",
        escalated: data.escalated || false,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    }

    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* 플로팅 버블 */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:bottom-6 sm:h-14 sm:w-14 overflow-hidden"
          aria-label="운영매니저 채팅 열기"
        >
          <img
            src="/chat-icon-a.png"
            alt="운영매니저"
            className="h-full w-full object-cover"
          />
        </button>
      )}

      {/* 챗 패널 */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="운영매니저 채팅"
          className="fixed bottom-0 right-0 z-50 flex h-[30rem] w-full flex-col rounded-t-2xl border border-border bg-background shadow-lg sm:bottom-6 sm:right-4 sm:w-96 sm:rounded-2xl animate-scale-in"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3 sm:rounded-t-2xl">
            <div className="flex items-center gap-3">
              {/* 매니저 아바타 */}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden ring-2 ring-white/20">
                <img
                  src="/chat-icon-a.png"
                  alt="운영매니저"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-accent" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">운영매니저</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  응답 가능 · AX 전환 상담
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="닫기"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div>
                {/* 환영 메시지 */}
                <div className="mb-4 rounded-2xl bg-accent-light px-4 py-3 text-sm text-text">
                  <p className="font-medium mb-1">안녕하세요! 운영매니저입니다.</p>
                  <p className="text-text-muted text-xs">AX 전환, 자산 활용, 비용, 정부지원 등 무엇이든 물어보세요.</p>
                </div>
                <p className="mb-3 text-xs font-medium text-text-muted">자주 묻는 질문</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-text hover:bg-surface-warm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden">
                    <img src="/chat-icon-a.png" alt="" className="h-full w-full object-cover" />
                  </span>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-accent text-white"
                      : "bg-surface text-text shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.escalated && (
                    <a
                      href={COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500/90 transition-colors"
                    >
                      커뮤니티에서 상담하기
                    </a>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-3 flex justify-start">
                <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden">
                  <img src="/chat-icon-a.png" alt="" className="h-full w-full object-cover" />
                </span>
                <div className="rounded-2xl bg-surface px-4 py-2 text-sm text-text-muted shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border px-4 py-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="무엇이든 물어보세요..."
                aria-label="질문 입력"
                className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                전송
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
