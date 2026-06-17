const OPENCHAT_URL = "https://enterlab-web-844388762563.asia-northeast3.run.app/community";

const STEPS = [
  {
    num: 1,
    title: "통증 진단",
    tier: "무료",
    free: true,
    desc: "반복 업무·인건비가 새는 곳을 함께 찾아 딱 1곳으로 좁힙니다.",
    pain: '"뭐부터 해야 하지?" → 전부 말고 1곳만 봅니다',
  },
  {
    num: 2,
    title: "순서 설계",
    tier: "무료",
    free: true,
    desc: "4기둥 중 어떤 것을 먼저 풀지 우선순위 1개를 정합니다.",
    pain: "95% 실패의 진짜 원인 = 잘못된 순서",
  },
  {
    num: 3,
    title: "작게 시작",
    tier: "코칭",
    free: false,
    desc: "가장 아픈 업무 1개에 AI 도구 1개만 붙여 작은 실험을 돌립니다.",
    pain: '"돈만 쓸까 봐" → 최소 비용 실험으로 검증',
  },
  {
    num: 4,
    title: "효과 측정",
    tier: "코칭",
    free: false,
    desc: "절감된 시간과 비용을 숫자로 확인합니다. 감이 아니라 데이터로.",
    pain: '"효과가 있나?" → 줄어든 시간·돈을 직접 봅니다',
  },
  {
    num: 5,
    title: "확장·자동화",
    tier: "코칭",
    free: false,
    desc: "검증된 것만 다음 업무로 넓힙니다. 안 되는 건 버립니다.",
    pain: "검증된 것만 키우니 실패 위험이 최소화됩니다",
  },
] as const;

const PAINS = [
  {
    icon: "?",
    title: "뭐부터 해야 할지 모름",
    desc: "AI가 좋다는데, 우리 가게·공장에 뭘 어떻게 붙여야 할지 막막합니다.",
  },
  {
    icon: "₩",
    title: "비용 부담이 큼",
    desc: "잘못 도입하면 돈만 쓰고 안 쓰게 될까 봐 선뜻 시작을 못 합니다.",
  },
  {
    icon: "!",
    title: "인력은 부족함",
    desc: "사람은 안 구해지고 인건비는 오르는데, 반복 업무는 그대로 쌓입니다.",
  },
] as const;

const WHYS = [
  {
    keyword: "경험 × AI = 증폭",
    title: "현장을 아는 사람",
    desc: "30년 기획 경력과 50건 이상의 정부과제 현장. AI를 파는 게 아니라 사장님의 일을 압니다.",
  },
  {
    keyword: "부울경 당사자",
    title: "같은 지역, 같은 처지",
    desc: "창원 기계·방산, 거제 조선, 김해 금형. 멀리 서울이 아니라 같은 동네에서 같이 고민합니다.",
  },
  {
    keyword: "혼자가 아닙니다",
    title: "1인 전략기획실",
    desc: "직원 한 명 더 뽑은 셈 치고, 옆에서 같이 순서를 짜고 실행까지 동행합니다.",
  },
] as const;

const FUNNEL = [
  {
    step: "STEP 01",
    price: "무료",
    title: "무료 AX 진단",
    desc: "오픈채팅에서 1:1로 통증 지점 1곳을 함께 찾습니다. 부담 없이 시작.",
    action: "→ 지금 신청",
  },
  {
    step: "STEP 02",
    price: "진단 리포트",
    title: "순서 설계서",
    desc: "4기둥 우선순위와 첫 실험 계획을 정리한 리포트를 받습니다.",
    action: "→ 진단 후 안내",
  },
  {
    step: "STEP 03",
    price: "실행 코칭",
    title: "전환 동행",
    desc: "작게 시작 → 효과 측정 → 확장까지, 옆에서 같이 실행합니다.",
    action: "→ 원할 때만",
  },
] as const;

export default function AXProcessPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 히어로 */}
      <section className="mb-10">
        <span className="mb-4 inline-block rounded border border-accent px-3 py-1 text-xs font-bold tracking-widest text-accent">
          AX 전환 절차 안내
        </span>
        <h1 className="mb-4 text-2xl font-bold leading-tight text-text sm:text-3xl lg:text-4xl">
          AI 도입, <span className="bg-accent/10 px-1">80%가 실패</span>
          합니다.
          <br />
          이유는 기술이 아니라{" "}
          <span className="bg-accent/10 px-1">순서</span>입니다.
        </h1>
        <p className="mb-2 text-base text-text-muted sm:text-lg">
          직원 안 뽑고 버티는 법, 한 명이 세 명 몫을 하는 법 — 그 순서를 작은
          회사에 맞게 설계해 드립니다.
        </p>
        <p className="mb-6 text-xs text-text-subtle">
          전 세계 기업의 <strong className="text-accent">95%</strong>가 AI
          도입에서 막힙니다. 도구가 없어서가 아니라, 어디서부터 어떤 순서로 할지
          모르기 때문입니다.
        </p>
        <a
          href={OPENCHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90 active:bg-accent/80"
        >
          무료 AX 진단 신청하기 <span>→</span>
        </a>
        <span className="mt-2 block text-xs text-text-subtle">
          엔터랩스 커뮤니티에서 1:1로 진행 · 비용 없음
        </span>
      </section>

      {/* 자산허브 안내 카드 */}
      <a
        href="/asset-hub"
        className="mb-10 block rounded-xl border border-accent/20 bg-accent/5 p-5 transition-colors hover:border-accent/40 hover:bg-accent/10"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm font-bold text-text">엔터랩스 AX 전환 자산허브</h3>
              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">둘러보기</span>
            </div>
            <p className="text-xs leading-relaxed text-text-muted">
              AX 전환에 활용되는 도구, 레포지토리, 자동화 자산을 한눈에 확인할 수 있습니다.
              어떤 기술 자산이 준비되어 있는지 먼저 살펴보세요.
            </p>
          </div>
          <svg className="mt-1 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </a>

      {/* 구분선 */}
      <hr className="mb-10 border-border" />

      {/* CHECK · 공감 블록 */}
      <section className="mb-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent">
          CHECK · 지금 이런 상태이신가요
        </p>
        <h2 className="mb-2 text-xl font-bold text-text sm:text-2xl">
          사장님이 이미 겪고 계신 세 가지
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          아래 중 하나라도 해당되면, AX 전환을 시작할 준비가 된 겁니다. 문제는
          &quot;할까 말까&quot;가 아니라 &quot;어디서부터&quot;입니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAINS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-surface-warm p-5"
            >
              <div className="mb-3 text-3xl font-bold text-accent/40">
                {p.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-text">{p.title}</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="mb-10 border-border" />

      {/* PROCESS · 5단계 절차 */}
      <section className="mb-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent">
          PROCESS · 전환 절차
        </p>
        <h2 className="mb-2 text-xl font-bold text-text sm:text-2xl">
          실패하지 않는 AX 전환 5단계
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          한 번에 다 바꾸지 않습니다. 가장 아픈 곳 1곳을 찾아, 작게 시작하고,
          숫자로 확인한 뒤에만 넓힙니다.
        </p>
        <div className="mb-6 flex flex-wrap gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            무료 진입 — 진단·설계
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />
            유료 코칭 — 실행·확장
          </span>
        </div>
        <div className="flex flex-col gap-0">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`grid grid-cols-[48px_1fr] gap-4 py-5 sm:grid-cols-[64px_1fr] ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg font-bold sm:h-14 sm:w-14 sm:text-xl ${
                  s.free
                    ? "border-emerald-500 text-emerald-600"
                    : "border-accent text-accent bg-surface-warm"
                }`}
              >
                {s.num}
              </div>
              <div>
                <h3 className="mb-1 flex flex-wrap items-center gap-2 text-base font-bold text-text">
                  {s.title}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.free
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {s.tier}
                  </span>
                </h3>
                <p className="mb-1.5 text-sm text-text-muted">{s.desc}</p>
                <p className="inline-block rounded-r border-l-[3px] border-accent bg-surface-warm px-3 py-1.5 text-xs text-text">
                  <strong className="text-accent">해소:</strong> {s.pain}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4기둥 노트 */}
        <div className="mt-6 rounded-xl bg-text p-5 text-surface">
          <h3 className="mb-1 text-sm font-bold text-white">
            5단계는 결국 이 4가지 중 하나를 풉니다
          </h3>
          <p className="mb-3 text-xs text-text-subtle">
            1~2단계가 &quot;어떤 기둥부터&quot;를 정하고, 3~5단계가 그 기둥을
            실제로 실행합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {["업무 자동화", "생산성 향상", "인건비 절감", "수익모델 개선"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-text-subtle px-3 py-1 text-xs text-surface"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <hr className="mb-10 border-border" />

      {/* WHY · 집출이 다른 이유 */}
      <section className="mb-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent">
          WHY ZIPCHUL · 집출이 다른 이유
        </p>
        <h2 className="mb-6 text-xl font-bold text-text sm:text-2xl">
          왜 집출과 시작해야 하나
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {WHYS.map((w) => (
            <div
              key={w.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="mb-2 text-xs font-bold text-accent">{w.keyword}</p>
              <h3 className="mb-1 text-sm font-bold text-text">{w.title}</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="mb-10 border-border" />

      {/* 정부지원 연계 */}
      <section className="mb-10">
        <div className="rounded-xl border border-border bg-surface-warm p-5 sm:p-7">
          <span className="mb-3 inline-block rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
            정부지원 연계
          </span>
          <h3 className="mb-2 text-lg font-bold text-text">
            그 비용, 정부가 댑니다
          </h3>
          <p className="mb-4 text-sm text-text-muted">
            2026년 중소기업·소상공인 AI 전환을 위한 지원 예산이 풀려 있습니다.
            집출은 절차 안내에 그치지 않고, 사장님 상황에 맞는 지원사업 신청까지
            함께합니다.
          </p>
          <ul className="mb-4 flex flex-col gap-2.5">
            {[
              <>
                AI·클라우드·데이터를{" "}
                <strong className="text-accent">바우처로 통합 지원</strong>하는
                중소기업 AX 지원사업
              </>,
              <>
                도구 보급이 아니라{" "}
                <strong className="text-accent">
                  AI를 제품·서비스에 접목
                </strong>
                하도록 돕는 소상공인 AI 활용 지원
              </>,
              <>
                50건 이상의 정부과제 작성 경험으로,{" "}
                <strong className="text-accent">신청서부터 동행</strong>
              </>,
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-text">
                <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-sm bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-subtle">
            ※ 지원사업은 매년 공고·예산·마감이 달라집니다. 현재 신청 가능한
            사업은 오픈채팅에서 사장님 상황에 맞춰 안내드립니다.
          </p>
        </div>
      </section>

      <hr className="mb-10 border-border" />

      {/* START · 시작하는 법 */}
      <section className="mb-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent">
          START · 시작하는 법
        </p>
        <h2 className="mb-2 text-xl font-bold text-text sm:text-2xl">
          세 걸음이면 시작됩니다
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          첫 걸음은 비용이 없습니다. 진단해 보고, 해볼 만하다 싶을 때만 다음으로
          가면 됩니다.
        </p>
        <div className="grid gap-0 sm:grid-cols-3">
          {FUNNEL.map((f, i) => (
            <div
              key={f.step}
              className={`border border-border bg-surface p-5 ${
                i === 0
                  ? "rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                  : i === 2
                    ? "rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none"
                    : "border-t-0 border-b-0 sm:border-t sm:border-b sm:border-l-0 sm:border-r-0"
              }`}
            >
              <p className="mb-2 text-xs tracking-wider text-text-subtle">
                {f.step}
              </p>
              <p
                className={`mb-1 text-lg font-bold ${i === 0 ? "text-emerald-600" : "text-text"}`}
              >
                {f.price}
              </p>
              <h3 className="mb-1 text-sm font-bold text-text">{f.title}</h3>
              <p className="mb-2 text-xs leading-relaxed text-text-muted">
                {f.desc}
              </p>
              <p className="text-xs font-bold text-accent">{f.action}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="mb-10 border-border" />

      {/* 최종 CTA */}
      <section className="rounded-xl bg-text p-8 text-center sm:p-12">
        <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
          혼자여도, 혼자가 아닙니다
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-text-subtle">
          AX 전환의 첫 진단은 비용이 없습니다. 사장님 가게·공장의 &quot;그 반복
          업무&quot; 하나만 떠올려 오세요.
        </p>
        <a
          href={OPENCHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90 active:bg-accent/80"
        >
          무료 AX 진단 신청하기 <span>→</span>
        </a>
        <span className="mt-3 block text-xs text-text-subtle">
          엔터랩스 커뮤니티로 연결됩니다
        </span>
      </section>
    </div>
  );
}
