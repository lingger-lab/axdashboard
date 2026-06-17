import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "엔터랩스 AX 대시보드",
  description:
    "AI 도입, 80%가 실패합니다. 이유는 기술이 아니라 순서입니다. 집출의 AX 전환 5단계로 무료 진단부터 시작하세요.",
  openGraph: {
    title: "엔터랩스 AX — AI 전환 운영 대시보드",
    description:
      "AI 도입, 80%가 실패합니다. 이유는 기술이 아니라 순서입니다. 집출의 AX 전환 5단계로 무료 진단부터 시작하세요.",
    images: [
      {
        url: "/axdashboar-og-image.png",
        width: 1200,
        height: 630,
        alt: "엔터랩스 AX 운영 대시보드",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "엔터랩스 AX — AI 전환 운영 대시보드",
    description:
      "AI 도입, 80%가 실패합니다. 이유는 기술이 아니라 순서입니다.",
    images: ["/axdashboar-og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
