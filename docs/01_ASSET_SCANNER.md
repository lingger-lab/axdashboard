# 자산 스캐너 — 34레포 + 20스킬 카탈로그화 (DX 1순위)

> **선행**: 00_AX_OVERVIEW.md
> **목적**: 흩어진 자산을 Claude Code가 스캔해 표준 카탈로그(asset-catalog.json)를 자동 생성한다. 이것이 DX의 토대이자 자산 허브의 시드 데이터.
> **왜 Claude Code인가**: 사람이 34개를 손으로 정리하면 느리고 누락된다. Claude Code는 Brad GitHub 인증으로 비공개 레포까지 읽고 rate limit을 우회하며, README·코드를 분석해 자동 분류한다.

---

## 1. 스캔 대상

### 1.1 GitHub 레포 (lingger-lab, 약 34개)
- 조직/계정: `lingger-lab`
- 확인된 공개 레포 예: campone-plane-dashboard, jeongdami, Vibe-Code-Auditor, youtube-insigt, enterai
- 나머지는 비공개 추정 → **Claude Code가 인증으로 전체 목록 조회**(`gh repo list lingger-lab --limit 100` 또는 GitHub API).

### 1.2 Claude 스킬 (약 20개)
- 위치: Brad의 Claude 환경(skills 디렉터리 또는 export).
- 목록(이미지 기준): Zipchul-ax-content-system, AI숏폼 빌더, AI뉴스 큐레이터, AI뉴스레터 빌더, 프롬프트 생성 스킬12, AMP 아이템 스카우트, 아이템 발굴 내외시장·페인포인트, 씨앗·뉴스기반 브랜딩+5개核, CampOne 여론조사 사업 진단, AI도구 워크샵 실습가이드, 제3의눈 경선전략 실행 보고서, 제3의눈 여론조사 정책동향 분석, 비즈니스전략 일론머스크, 제3의눈 본선 양자분석, ENTERLABS Quote, 일론머스크 제1원칙 전략 분석, 공천 AI 모델 고득점 플래너, 경선전략 실행문서 생성기, 제3의눈 여론조사 정책동향 분석 리포트, 강연대본·프레젠테이션 생성.
- Claude Code가 각 SKILL.md를 읽어 메타데이터 추출.

---

## 2. 표준 카탈로그 스키마 (asset-catalog.json)

각 자산을 아래 항목으로 기록. Claude Code가 README·SKILL.md·코드를 분석해 채운다.

```json
{
  "id": "asset_001",
  "name": "AI뉴스레터 빌더",
  "type": "skill | repo",
  "domain": "콘텐츠생산 | 전략분석 | 아이템발굴 | 선거여론 | 인프라",
  "purpose": "선택된 AI 뉴스로 집출 뉴스레터 발행물 생성",
  "input": "뉴스 링크/제목 + Brad 코멘트",
  "output": "발행 가능한 뉴스레터 글 + 메타데이터",
  "tech": "Claude skill | Next.js | Python ...",
  "workflow_step": "intake|structure|generate|verify|deliver|none",
  "status": "active | archived | duplicate_candidate | deprecated",
  "repo_url": "https://github.com/lingger-lab/...",
  "last_updated": "2026-06-01",
  "notes": "유사 자산: AI숏폼 빌더와 파이프 연결 가능"
}
```

### 도메인 분류 기준 (00_OVERVIEW §4)
- 콘텐츠생산 / 전략분석 / 아이템발굴 / 선거여론(CampOne) / 인프라(대시보드·RAG·로컬LLM 등)

### workflow_step (파트너 워크플로우 5단계 뼈대와 정합)
- intake(수집)·structure(구조화)·generate(생성)·verify(검증)·deliver(납품)·none(독립도구)

---

## 3. Claude Code 실행 절차

### T1 — GitHub 레포 전수 스캔
1. `gh repo list lingger-lab --limit 100 --json name,description,url,updatedAt,isArchived,primaryLanguage` 로 전체 목록.
2. 각 레포의 README(없으면 주요 파일·디렉터리 구조) 읽기.
3. 스키마에 맞춰 분류·요약. domain·workflow_step·status 추론.
- **DoD**: 34개 전부 카탈로그 항목화. 누락 0.

### T2 — Claude 스킬 스캔
1. 각 SKILL.md 읽기(이름·description·트리거·입출력).
2. 스키마에 맞춰 항목화.
- **DoD**: 20개 전부 항목화.

### T3 — 중복·노후 자산 탐지
- 유사 목적 자산 그룹핑 → `duplicate_candidate` 표시.
- 6개월+ 미수정 → `deprecated` 후보 표시.
- **DoD**: 중복·노후 리스트 별도 산출(정리 의사결정용).

### T4 — 카탈로그 산출
- `asset-catalog.json` 생성(전체) + `asset-catalog-summary.md`(사람용 요약: 도메인별 개수·중복·노후).
- **DoD**: JSON + 요약 MD 2파일. 대시보드 ①자산허브가 이 JSON을 소비.

---

## 4. 산출물

| 파일 | 용도 |
|---|---|
| `asset-catalog.json` | 자산 허브 시드 데이터(대시보드가 소비) |
| `asset-catalog-summary.md` | 사람용 요약(도메인별·중복·노후 의사결정) |

---

## 5. 사람의 검수 포인트 (휴먼 인 더 루프)
- Claude Code 자동 분류 후, Brad가 도메인·status·중복 판정을 검수.
- "다 넣지 말고 핵심만" — 노후·중복은 정리(archive) 결정.
- 검수된 카탈로그가 자산 허브의 확정 데이터.

> 다음: 03_CONTENT_PIPE.md (이 카탈로그에서 콘텐츠 자산을 파이프로 연결)
