export interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQ[] = [
  {
    keywords: ["ax", "전환", "뭐", "무엇"],
    question: "AX 전환이 뭔가요?",
    answer:
      "AX(AI Transformation)는 기존 업무에 AI를 접목해 자동화·생산성 향상·인건비 절감·수익모델 개선을 이루는 과정입니다. 집출은 작은 회사에 맞는 순서로 AX 전환을 설계합니다.",
  },
  {
    keywords: ["5단계", "절차", "단계", "프로세스", "과정"],
    question: "5단계 절차가 궁금해요",
    answer:
      "집출의 AX 전환 5단계:\n① 통증 진단 (무료) — 반복 업무 1곳 특정\n② 순서 설계 (무료) — 4기둥 우선순위 결정\n③ 작게 시작 (코칭) — AI 도구 1개 실험\n④ 효과 측정 (코칭) — 시간·비용 데이터 확인\n⑤ 확장·자동화 (코칭) — 검증된 것만 넓히기\n\n1~2단계는 무료로 진행됩니다.",
  },
  {
    keywords: ["무료", "진단", "비용", "없", "공짜"],
    question: "무료 진단은 어떻게 받나요?",
    answer:
      "엔터랩스 커뮤니티에서 무료 AX 진단을 신청할 수 있습니다. 통증 진단과 순서 설계(1~2단계)까지 비용이 없습니다. 부담 없이 시작하세요.",
  },
  {
    keywords: ["정부", "지원", "바우처", "보조금", "사업"],
    question: "정부지원 연계가 가능한가요?",
    answer:
      "네, 가능합니다. 2026년 중소기업·소상공인 AI 전환 지원 예산이 편성되어 있습니다. 집출은 사장님 상황에 맞는 지원사업을 찾아 신청서 작성까지 함께합니다. 50건 이상의 정부과제 경험이 있습니다.",
  },
  {
    keywords: ["비용", "가격", "얼마", "코칭", "유료"],
    question: "비용은 얼마나 드나요?",
    answer:
      "1~2단계(통증 진단 + 순서 설계)는 완전 무료입니다. 3~5단계 실행 코칭 비용은 사장님의 업종과 규모에 따라 달라집니다. 무료 진단 후 상세 안내드립니다. 정부지원 연계 시 비용 부담을 크게 줄일 수 있습니다.",
  },
  {
    keywords: ["집출", "zipchul", "누구", "회사"],
    question: "집출은 어떤 곳인가요?",
    answer:
      "집출(zipchul · 집으로 출근하기)은 부울경 지역의 제조·소상공인을 위한 AX 전환 동행 서비스입니다. 30년 기획 경력과 50건 이상의 정부과제 현장 경험을 바탕으로, AI를 파는 게 아니라 사장님의 일을 이해하고 함께 전환을 설계합니다.",
  },
  {
    keywords: ["4기둥", "기둥", "자동화", "생산성", "인건비", "수익"],
    question: "4기둥이 뭔가요?",
    answer:
      "AX 전환의 4기둥은:\n1. 업무 자동화 — 반복 업무를 AI로 대체\n2. 생산성 향상 — 한 명이 더 많은 일을\n3. 인건비 절감 — 인력 부담 경감\n4. 수익모델 개선 — 새로운 수익 창출\n\n1~2단계에서 어떤 기둥부터 풀지 우선순위를 정합니다.",
  },
  {
    keywords: ["부울경", "지역", "창원", "부산", "울산", "경남", "거제", "김해"],
    question: "부울경 지역만 가능한가요?",
    answer:
      "집출은 부산·울산·경남(부울경) 지역에 특화되어 있습니다. 창원 기계·방산, 거제 조선, 김해 금형 등 지역 산업을 잘 이해하고 있습니다. 온라인 상담은 전국 가능합니다.",
  },
];

export function matchFAQ(question: string): FAQ | null {
  const q = question.toLowerCase();
  let bestMatch: FAQ | null = null;
  let bestScore = 0;

  for (const faq of FAQ_DATA) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (q.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
