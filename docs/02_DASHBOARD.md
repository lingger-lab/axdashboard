# AX 대시보드 — campone UI 재사용 + 4기둥 (그릇, 3순위)

> **선행**: 00_AX_OVERVIEW.md, 01_ASSET_SCANNER.md, 03_CONTENT_PIPE.md
> **목적**: 자산 카탈로그(산출1)와 콘텐츠 파이프(산출2)를 담는 엔터랩스 내부 AX 업무 대시보드. campone 대시보드 UI를 재사용하되 배포·DB는 곁에와 통일(Vercel+Supabase).
> **왜 3순위(그릇)**: 담을 내용(자산 데이터·콘텐츠 현황)이 먼저 있어야 대시보드가 의미. 빈 그릇부터 만들면 껍데기.

---

## 1. 재사용 전략 — campone-plane-dashboard

| 재사용 ✅ | 교체 ❌ |
|---|---|
| 대시보드 레이아웃·네비게이션 | 배포: Cloud Run → **Vercel** |
| UI 컴포넌트·Tailwind 디자인 | DB: Prisma/Cloud SQL → **Supabase** |
| 화면 구조·차트·테이블 패턴 | 도메인 데이터: 선거 → 엔터랩스 자산·업무 |
| CLAUDE.md 개발 관행 | 인증: → Supabase Auth |

> 핵심: campone의 **UI/UX·컴포넌트·레이아웃만** 가져오고, 배포·DB·인증은 곁에와 동일하게 Vercel+Supabase로 맞춘다. 팀이 한 가지 인프라만 관리(곁에와 통일).

---

## 2. 4기둥 화면

### ① 자산 허브 (asset-catalog.json 소비)
- 34레포+20스킬을 카드·표로. 도메인 필터(콘텐츠·전략분석·아이템발굴·선거여론·인프라).
- 검색: "어떤 일엔 어떤 앱/스킬". workflow_step별 보기.
- 중복·노후 자산 표시(정리 의사결정). 상태 배지(active/archived/duplicate).
- 데이터 출처: 01_ASSET_SCANNER 산출 JSON.

### ② 데이터 레이크 (DX 현황)
- 팀 자료(영업·회의록·문서·고객자료) 적재 현황.
- RAG 연결 상태(김동현 RAG에 무엇이 적재됐나) + 로컬LLM(Qwen3) 상태.
- 미적재 자료 알림(DX 빈틈).

### ③ 프로세스 체계화
- 엔터랩스 반복 업무(정부과제 컨설팅·책 집필·강연·곁에 운영)를 5단계 워크플로우로 시각화.
- 파트너 워크플로우 5단계 뼈대(수집→구조화→생성→검증→납품)를 팀 업무에도 적용.
- 진행 중 업무의 단계 상태.

### ④ 콘텐츠 파이프 (content_pipeline 소비)
- 집출 발행 현황·예약·자동화 트리거(03_CONTENT_PIPE 연동).
- 뉴스 후보 → 선택 → 생성 → 승인 → 발행 상태 보드.
- 채널별(블로그·뉴스레터·유튜브·카카오·페북) 발행 이력.

---

## 3. 기술 스택 (곁에와 통일)

| 레이어 | 기술 |
|---|---|
| 프론트 | Next.js + TypeScript + Tailwind (campone UI 재사용) |
| DB·인증·저장 | Supabase |
| 배포 | Vercel (git push 자동) |
| 데이터 소스 | asset-catalog.json, content_pipeline(Supabase), RAG 상태 API |

---

## 4. 디렉터리 (제안)

```
enterlabs-ax/
├── app/
│   ├── (dashboard)/
│   │   ├── assets/        # ① 자산 허브
│   │   ├── datalake/      # ② 데이터 레이크
│   │   ├── process/       # ③ 프로세스
│   │   └── content/       # ④ 콘텐츠 파이프
│   └── api/
│       ├── assets/        # 카탈로그 조회
│       ├── content/       # 파이프 상태·트리거
│       └── rag-status/    # RAG 연결 상태
├── lib/
│   ├── supabase/
│   └── catalog/           # asset-catalog.json 로더
├── components/            # campone에서 재사용
└── supabase/migrations/
```

---

## 5. Claude Code 실행 절차

### T1 — campone UI 이식 + 스택 전환
- campone-plane-dashboard의 레이아웃·컴포넌트 가져오기 → Prisma/CloudRun 제거, Supabase/Vercel로 교체.
- **DoD**: 빈 대시보드가 Vercel에 배포, Supabase 연결.

### T2 — ① 자산 허브
- asset-catalog.json 로드 → 카드·필터·검색.
- **DoD**: 34레포+20스킬이 도메인별로 표시·검색됨.

### T3 — ④ 콘텐츠 파이프
- content_pipeline(Supabase) 상태 보드 + 발행 현황.
- **DoD**: 03_CONTENT_PIPE 데이터가 대시보드에 표시.

### T4 — ② 데이터 레이크 / ③ 프로세스
- RAG 연결 상태, 업무 워크플로우 시각화.
- **DoD**: DX 현황·프로세스 단계 표시.

---

## 6. 우선순위 내 순서
- T1(골격) → T2(자산허브, 산출1 소비) → T3(콘텐츠, 산출2 소비) → T4(데이터·프로세스).
- ②③은 데이터 적재가 더 쌓인 후 고도화 가능(초기엔 현황 표시 수준).

---

## 7. 곁에와의 관계
- 둘 다 Next.js+TS+Vercel+Supabase → 컴포넌트·배포 노하우 공유.
- 곁에 운영 자동화(곁에 마스터 v3.4 §9.2)는 이 대시보드 ③④에 흡수 가능.
- AX 대시보드 = 내부 도구, 곁에 = 제품. 분리 유지하되 기반 공유.

---

## 8. 전체 AX 실행 요약 (4문서)
1. 00_AX_OVERVIEW — 전체 그림
2. 01_ASSET_SCANNER — 자산 스캔→카탈로그(DX 토대) **[1순위]**
3. 03_CONTENT_PIPE — 콘텐츠 자동화(빠른 ROI) **[2순위]**
4. 02_DASHBOARD — 위를 담는 그릇 **[3순위]**
