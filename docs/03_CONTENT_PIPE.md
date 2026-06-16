# 콘텐츠 자동화 파이프 — 집출 발행 자동화 (빠른 ROI, 2순위)

> **선행**: 00_AX_OVERVIEW.md, 01_ASSET_SCANNER.md
> **목적**: 이미 있는 콘텐츠 스킬들을 자동 파이프로 연결해 집출 뉴스레터·이미지·영상 발행을 자동화한다. 새로 만들지 않고 기존 스킬을 잇는다.
> **왜 2순위**: 콘텐츠 생산이 엔터랩스 최다 업무이고 매주 반복되며 효과가 즉시 보임 → AX 효과를 팀이 가장 빨리 체감.

---

## 1. 파이프 전체 흐름

```
[1 수집]        [2 생성]              [3 가공]           [4 발행]
AI뉴스 큐레이터 → AI뉴스레터 빌더 →  (이미지) Nano Banana → 블로그/뉴스레터
              → AI숏폼 빌더      →  (영상)   CapCut       → YouTube Shorts
                                  + Brad 코멘트(검증)
```

> 5단계 워크플로우 뼈대 대응: 수집(큐레이터)→구조화·생성(빌더)→가공(이미지·영상)→검증(Brad 코멘트)→납품(발행).

---

## 2. 활용 기존 스킬 (자산 카탈로그에서)

| 단계 | 스킬 | 역할 |
|---|---|---|
| 수집 | AI뉴스 큐레이터 | AI 수익모델 뉴스 후보 수집 |
| 생성(뉴스레터) | AI뉴스레터 빌더 | 선택 뉴스 1건 + Brad 코멘트 → 「AI시대예감」 발행물 |
| 생성(숏폼) | AI숏폼 빌더 | 뉴스레터 → 숏폼 스크립트 |
| 가공(이미지) | Nano Banana | 9:16, 한글 렌더링 |
| 가공(영상) | CapCut(김동현) | 이미지→영상 편집 |
| 통합 | Zipchul-ax-content-system | 멀티채널 배포(블로그·카카오·페북 등) |

> 새 스킬 제작 ❌. 기존 스킬을 호출·연결하는 오케스트레이션만 구현.

---

## 3. 핵심 원칙 — 휴먼 인 더 루프

- 뉴스 후보는 AI가 수집, **선택은 Brad**(어떤 뉴스로 발행할지).
- 뉴스레터 초안은 AI 생성, **Brad 코멘트가 차별점**(59세 기획자 관점 = 콘텐츠의 유일한 차별점).
- 발행 전 **사람 최종 승인**. 자동 발행은 승인 후.
- 즉 자동화는 "수집·초안·가공·예약"까지, 판단·코멘트·승인은 사람.

---

## 4. 자동화 구현 (Vercel + Supabase)

### 4.1 스케줄
- Vercel Cron(또는 Supabase scheduled function)으로 매주 정해진 요일에 뉴스 후보 수집 → Brad에게 알림.
- Brad 선택·코멘트 → 생성 파이프 실행 → 발행 대기 큐.

### 4.2 데이터 (Supabase)
```
content_pipeline 테이블(예시)
- id, news_source, selected(bool), brad_comment
- newsletter_body, shortform_script
- image_url, video_url
- status: candidate|selected|generated|approved|published
- channel: blog|newsletter|youtube|kakao|facebook
- scheduled_at, published_at
```

### 4.3 발행 채널
- 블로그·뉴스레터(집출 zipchul.cloud), YouTube Shorts, 카카오·페이스북.
- 채널별 포맷은 Zipchul-ax-content-system 스킬 활용.

---

## 5. Claude Code 실행 절차

### T1 — 파이프 오케스트레이터
- 기존 스킬 호출 체인 구현(큐레이터→빌더→숏폼). 스킬 입출력 연결.
- **DoD**: 뉴스 1건 입력 → 뉴스레터+숏폼 초안 생성.

### T2 — 스케줄·큐
- Vercel Cron 수집 트리거 + Supabase 발행 큐.
- **DoD**: 매주 자동 수집 → Brad 알림 → 선택 시 생성.

### T3 — 발행 연동
- 채널별 발행(우선 블로그·뉴스레터부터, 영상은 CapCut 수동 편집 연계).
- **DoD**: 승인 → 블로그·뉴스레터 발행.

### T4 — 대시보드 연동 지점
- content_pipeline 상태를 AX 대시보드 ④콘텐츠 파이프 화면이 소비(02_DASHBOARD.md).
- **DoD**: 발행 현황·예약이 대시보드에 표시.

---

## 6. 마일스톤
- 1차: 집출 「AI시대예감」 뉴스레터 매주 반자동 발행(수집·초안 자동, 코멘트·승인 사람).
- 2차: 숏폼 스크립트·이미지 자동 생성 연계.
- 3차: 멀티채널 동시 발행.

> 다음: 02_DASHBOARD.md (자산 카탈로그 + 콘텐츠 파이프를 담는 그릇)
