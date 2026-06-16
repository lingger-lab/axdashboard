# 엔터랩스 자산 카탈로그 요약

> 생성일: 2026-06-16
> 생성자: Claude Code (asset scanner)
> 총 자산: **57개** (레포 35 + 스킬 22)

---

## 1. 도메인별 현황

| 도메인 | 레포 | 스킬 | 합계 |
|--------|------|------|------|
| 콘텐츠생산 | 4 | 10 | **14** |
| 선거여론 | 16 | 5 | **21** |
| 전략분석 | 0 | 2 | **2** |
| 아이템발굴 | 2 | 2 | **4** |
| 인프라 | 13 | 5 | **18** |
| **합계** | **35** | **22** (추가 발견 포함) | **57** |

---

## 2. 상태별 현황

| 상태 | 레포 | 스킬 | 합계 | 비고 |
|------|------|------|------|------|
| active | 22 | 22 | **44** | 현역 자산 |
| duplicate_candidate | 9 | 0 | **9** | 정리 의사결정 필요 |
| deprecated | 3 | 0 | **3** | archive 검토 대상 |
| archived | 1 | 0 | **1** | enterai (GitHub archived) |

---

## 3. 중복 자산 그룹 (9개 레포, 5그룹)

| 그룹 | 정본 (canonical) | 중복 후보 | 권장 액션 |
|------|------------------|-----------|-----------|
| 정책분석 | `campone-plane-policy` | `campone-policy`, `changwon-policy` | 지역 변수만 다름 → 멀티테넌트화 or archive |
| CivicHub | `campone-plane-civichub` | `campone`, `changwon-hub` | 동일 소통 플랫폼 → 멀티테넌트화 or archive |
| 콘텐츠Studio | `campone-plane-studio` | `campone-studio` | 완전 동일 → archive |
| 여론분석 | `campone-plane-insight` | `campone-v2` | 동일 9개 모듈, v2는 사천 특화 → archive |
| 대시보드 | `campone-plane-dashboard` | `camponedashboard` | 구버전 → archive |

> 정리 시 **9개 → 5개 정본만 유지**, 4개 archive 가능

---

## 4. 노후/정리 대상 (3+1개)

| 레포 | 마지막 수정 | 이유 | 권장 |
|------|-------------|------|------|
| `rubby` | 2020-07 | 6년 미수정, Java, 스택 무관 | **즉시 archive** |
| `jeongdami` | 2025-11 | README 없음, 6개월+ 미수정 | archive 검토 |
| `lethe-lab-diagnosis` | 2025-10 | 외부 프로젝트, 6개월+ 미수정 | archive 검토 |
| `v0-fortune-telling-app` | 2026-04 | v0 프로토타입, 단발성 실험 | archive 검토 |

---

## 5. 콘텐츠 파이프 스킬 체인 (03_CONTENT_PIPE 연동)

### 구 3스킬 파이프 (기존)
```
ai-news-curator → ai-newsletter-builder → ai-shortform-builder
  (수집)              (뉴스레터 생성)          (숏폼 변환)
```

### 신 5스킬 AX 파이프 (진화판)
```
ax-signal-curator → ax-newsletter-builder → ax-blog-aeo → ax-essay-writer → ax-shortform-builder
  (4기둥 태깅 수집)     (뉴스레터)           (AEO 블로그)    (1인칭 에세이)     (숏폼 증폭)
```

> **권장**: 신 5스킬 AX 파이프를 03_CONTENT_PIPE의 기본 체인으로 채택. 구 3스킬은 레거시 호환용.

---

## 6. 핵심 자산 TOP 10 (AX 활용 우선순위)

| 순위 | 자산 | 유형 | AX 활용 |
|------|------|------|---------|
| 1 | `campone-plane-dashboard` | repo | 대시보드 UI/컴포넌트 이식 원본 |
| 2 | `yourside` | repo | Supabase+Vercel 인프라 패턴 기준 |
| 3 | `brads-brain` | repo | RAG+로컬LLM 코어 (2층 지식) |
| 4 | `ax-signal-curator` ~ `ax-shortform-builder` | skill x5 | 콘텐츠 파이프 5스킬 체인 |
| 5 | `campone-plane-studio` | repo | 10채널 콘텐츠 생성 엔진 재활용 |
| 6 | `campone-plane-insight` | repo | 여론 데이터 수집/분석 엔진 |
| 7 | `rag-chatbot-platform` | repo | 대시보드 챗봇 인터페이스 후보 |
| 8 | `brad-content-engine` | skill | 콘텐츠 스킬 공통 스타일 가이드 |
| 9 | `enterlabs-quote` | skill | 내부 업무 자동화 (견적서) |
| 10 | `prompt-architect` | skill | 범용 프롬프트 품질 도구 |

---

## 7. docs 스킬 목록 대조표 (20개 vs 발견 22개)

| docs 언급 스킬명 | 매칭된 스킬 ID | 상태 |
|------------------|----------------|------|
| Zipchul-ax-content-system | `content-system` | 발견 |
| AI숏폼 빌더 | `ai-shortform-builder` | 발견 |
| AI뉴스 큐레이터 | `ai-news-curator` | 발견 |
| AI뉴스레터 빌더 | `ai-newsletter-builder` | 발견 |
| 프롬프트 생성 스킬 | `prompt-architect` | 발견 |
| AMP 아이템 스카우트 | `amp-item-scout` | 발견 |
| 아이템 발굴 내외시장·페인포인트 | `market-research` (추정) | 확인 필요 |
| 씨앗·뉴스기반 브랜딩+5개核 | — | **미발견** |
| CampOne 여론조사 사업 진단 | — | **미발견** |
| AI도구 워크샵 실습가이드 | `workshop-guide-docx` | 발견 (E드라이브) |
| 제3의눈 경선전략 실행 보고서 | `election-primary-strategy` | 발견 |
| 제3의눈 여론조사 정책동향 분석 | `election-strategy-enhancer` | 발견 |
| 비즈니스전략 일론머스크 | `first-principles-strategy-biz` (추정) | 확인 필요 |
| 제3의눈 본선 양자분석 | `general-election-bilateral-analyzer` | 발견 (E드라이브) |
| ENTERLABS Quote | `enterlabs-quote` | 발견 (E드라이브) |
| 일론머스크 제1원칙 전략 분석 | `first-principles-strategy` | 발견 |
| 공천 AI 모델 고득점 플래너 | `ppp-nomination-planner` | 발견 |
| 경선전략 실행문서 생성기 | `election-primary-strategy` | 발견 |
| 제3의눈 여론조사 정책동향 분석 리포트 | `election-strategy-enhancer-general` | 발견 |
| 강연대본·프레젠테이션 생성 | — | **미발견** |

**발견율: 20개 중 17개 발견 (85%)** + 추가 5개(AX 5스킬) = 총 22개

### 미발견 3개 (보류)
1. 씨앗·뉴스기반 브랜딩+5개核
2. CampOne 여론조사 사업 진단
3. 강연대본·프레젠테이션 생성

---

## 8. workflow_step 분포

| 단계 | 자산 수 | 대표 자산 |
|------|---------|-----------|
| intake (수집) | 6 | campone-plane-insight, ax-signal-curator, amp-item-scout |
| structure (구조화) | 5 | campone-plane-policy, brad-content-engine, first-principles |
| generate (생성) | 18 | campone-plane-studio, 콘텐츠 스킬들, 선거 스킬들 |
| verify (검증) | 1 | Vibe-Code-Auditor |
| deliver (납품) | 4 | enterlab-web, enterlabs-quote, lethe-lab |
| none (독립도구) | 23 | 대시보드류, 인프라류, 프로토타입류 |

> **generate가 압도적** — 엔터랩스는 "생성" 중심 조직. 수집·검증 자동화가 상대적 공백.

---

## 9. 다음 액션

1. **Brad 검수**: 도메인·status·중복 판정 검토 → 확정
2. **중복 정리**: 5그룹 중복 → 정본 지정, 나머지 archive
3. **미발견 3개**: 스킬 파일 위치 확인 또는 기존 스킬로 흡수 결정
4. **프로젝트 초기화**: axdashboard Next.js 셋업 → asset-catalog.json 로더 구현
5. **콘텐츠 파이프**: 신 5스킬 AX 파이프 오케스트레이션 구현
