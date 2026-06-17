import { NextResponse } from "next/server";
import { matchFAQ } from "@/lib/chat/faq-data";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { answer: "질문을 입력해 주세요." },
        { status: 400 }
      );
    }

    const faq = matchFAQ(question);

    if (faq) {
      return NextResponse.json({ answer: faq.answer, escalated: false });
    }

    // 매칭 안 되면 에스컬레이션
    return NextResponse.json({
      answer:
        "해당 질문은 더 자세한 안내가 필요합니다. 커뮤니티에서 상담을 신청해 주세요.",
      escalated: true,
    });
  } catch {
    return NextResponse.json(
      { answer: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
