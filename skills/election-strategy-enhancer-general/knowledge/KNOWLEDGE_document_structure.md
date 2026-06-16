# KNOWLEDGE: 8-STEP 문서 구조 & 변수 매핑
## KNOWLEDGE_document_structure.md

모든 `{{변수명}}`은 `config.json`의 해당 필드로 치환됩니다.  
`[MODE:xxx]` 태그는 해당 모드에서만 생성하는 섹션을 표시합니다.

---

## 표지

```
극비 · CONFIDENTIAL

{{policy_slogan}}
{{candidate_name}}

D-{{campaign_days}} 경선 승리 전략 실행 문서
{{version}}

{{election_type_label}}
전략 프레임: {{strategy_frame_text}}   ← strategy_frame에서 자동 생성
벤치마킹: {{benchmark_case}}
작성일: {{generation_date}}
```

---

## 요약 A4 1장 (표지 다음 페이지, 필수)

| 구성 요소 | 내용 |
|----------|------|
| 상황 개요 | 현재 {{current_ranking}}위({{current_support}}), 목표 {{target_ranking}}위, D-{{campaign_days}} |
| 벤치마킹 | {{benchmark_case}} 역전 공식 → {{campaign_days}}일 압축 적용 |
| 승리 공식 표 | 트랙별 목표/전술/현재→목표 (winning_formula에서 추출) |
| 8-STEP 요약 | 각 STEP 한 줄 요약 |
| 우선순위 액션 TOP3 | top10_actions[0~2] |

---

## STEP 1. 승리조건 역산 모델

### (a) 승리 공식
- 경선 방식: {{primary_method}} (당원{{party_ratio}}% + 여론{{citizen_ratio}}%)
- 수학적 승리 조건 공식

**💡 결론 박스 (highlight색)**
- 현재 추정 포지션: {{current_ranking}}위 / {{current_support}}
- 목표까지 필요한 갭
- 갭 해소 핵심 레버 3가지

**현재 vs 목표 비교표**
| 구분 | 현재 | 목표 | 갭 | 핵심 레버 |
→ region_issues[].negative_rate, scenarios.current, scenarios.s2 활용

### (b) 3개 시나리오
**시나리오 테이블**
| 시나리오 | 상대 | 후보 | 격차 | 핵심 달성 KPI |
→ scenarios.s1, scenarios.s2, scenarios.s3 매핑

### (c) 주차별 역전 경로
→ weekly_kpi 배열 전체 출력 (campaign_days 기반 자동 생성)

### (d) 전략공천 차단 조건 [MODE: primary_multi 전용]
- 차단 조건 3가지
- mode_config.strategic_nomination_risk 반영

### (e) 경쟁자 사퇴/단일화 시뮬레이션 [MODE: primary_multi 전용]
→ competitors 배열 전체 활용
**표 이동 시뮬레이션 테이블**
| 사퇴 시나리오 | {{candidate_name}} 유입 | 경쟁자A 유입 | ... |

### (e-bilateral) 0섬 게임 공식 [MODE: primary_bilateral 전용]
→ competitors[0]을 상대로 설정

### (e-general) 스윙보터 임계점 분석 [MODE: general_bilateral 전용]

**🎯 즉시 실행 액션 TOP3 박스 (action색)**
→ top10_actions[0~2] 매핑

---

## STEP 2. 이슈브레이킹 & 인지도 폭발 전략

### (a) 이슈브레이킹 5대 전술
각 전술 구조: 전술명 / 벤치마킹 / 실행 방법 / {{candidate_name}} 적용안

1. 충격 숫자 선점 — 아무도 말하지 않는 숫자를 먼저 말하라
2. 현장 바이럴 루프 — 거리→숏폼→확산→자원봉사자 유입
3. 토론장 지배 — 준비된 한마디로 뉴스를 만들어라
4. 언더독 스토리텔링 — {{underdog_narrative}} 활용
5. 오피니언리더 동원 — 타인의 입으로 말하게 하라

**충격 숫자 후보 테이블**
→ region_issues[].shock_number 활용

**토론 뉴스 한마디 테이블**
→ 경쟁자별 공격 예상에서 역도출

### (b) 인지도 폭발 시나리오 3종

### (c) 바이럴 콘텐츠 생산 체계
→ content_team_size, daily_call_target_start/end 활용

### (d) KPI & 주차별 측정
→ weekly_kpi[].content_target 활용

---

## STEP 3. 이미지메이킹 설계

### (a) 후보 정체성 1문장 3안
→ three_sec_diff, key_frames 활용

### (b) 상황별 이미지 전환 매트릭스
| 상황 | 복장 | 톤 | 첫마디 | 핵심행동 | 마무리 |
최소 6개 상황: 간담회 / 현장방문 / 합동토론 / SNS숏폼 / 당원접촉 / 미디어 인터뷰

### (c) 자기소개 스크립트
→ scripts.10s, scripts.30s, scripts.120s 활용 (있으면 보완, 없으면 생성)

4가지 버전:
- **10초** → self_intro.s10
- **30초** → self_intro.s30
- **120초** → self_intro.s120
- **3분** → self_intro.s180 (180초 구조: 인지→공감→비전→신뢰→결의)

### (d) "3초 기억" 설계
| 감각 채널 | 설계 | 작동 원리 |
| 시각적 기억 | ... | ... |
| 청각적 기억 | ... | ... |
| 감정적 기억 | ... | ... |

---

## STEP 4. 카피라이팅 체계 — 6-Layer 아키텍처

### (a) 6-Layer 카피 아키텍처
| Layer | 역할 | 카피 | 적용 장소 |
| L1 마스터 | 불변 기둥 | "{{policy_slogan}} {{candidate_name}}" | 전 매체 |
| L2 서브 | 상황별 | {{sub_slogan}} | 간담회/SNS |
| L3 타겟 | 세그먼트별 | 당원용/시민용/청년용 | 맞춤 채널 |
| L4 공격/방어 | 경쟁 대응 | 토론 원라이너 | 토론장/인터뷰 |
| L5 긴급감 | 시간 압박 | "D-N 남았습니다" | 막판 결집 |
| L6 채널별 | 매체 최적화 | 140자/15초/현수막 | 채널별 |

### (b) 슬로건 변형 패턴 사전 10가지

### (c) 경쟁자 대비 카피 차별화
→ competitors 배열 활용
| 경쟁자 | 예상 슬로건/톤 | 차별화 포인트 | 토론 원라이너 |

### (d) 숏폼 스크립트 10개
구조: "{{election_district}}의 [문제 숫자]. [해법 숫자]. {{policy_slogan}} {{candidate_name}}."
→ region_issues 기반으로 지역별 생성

### (e) FAQ 답변 TOP5
→ faq_questions 배열 활용 (없으면 bias_check 기반으로 생성)
구조: 팩트 → 원칙 → 조치 → 슬로건 연결

### (f) 카피 품질 체크리스트

---

## STEP 5. 이슈선점 전략

### 권역 있는 경우 (sub_regions 존재)
→ region_issues 배열 순회하여 권역별 섹션 생성

**각 권역 구조:**
```
이슈 N: {{region}} ({{area_name}}) — {{solution_keyword}}

| 구분 | 내용 |
| 문제 | region_issues[N].issues[0] |
| 해법 | region_issues[N].solution |
| 충격 숫자 | region_issues[N].shock_number |
| 100일 실행안 | region_issues[N].first_100_days |
| 카피 연결 | region_issues[N].copy_connection |
```

**N-매트릭스 요약** (권역 × 이슈 교차표)

### 권역 없는 경우 Fallback (sub_regions = [])
→ 정책분야별 구조로 대체

```
이슈 A: 경제/일자리 — {{key_policies[0]}}
이슈 B: 복지/생활 — {{key_policies[1]}}
이슈 C: 교통/인프라 — {{key_policies[2]}}
이슈 D: 청년/미래 — {{key_policies[3]}}
이슈 E: 지역 특화 — {{key_policies[4]}}
```

---

## STEP 6. 경쟁우위 프레이밍

### (a) 본선경쟁력 프레이밍
→ scenarios.s2 데이터 활용 ("양자대결 시 역전 가능" 논거)

세그먼트별 메시지 테이블:
→ party_ratio/citizen_ratio 기반 당원/시민 세그먼트 분리

### (b) 경쟁자 1:1 차별화
→ competitors 배열 순회

**각 경쟁자 구조:**
- 프레임 제목: "{{candidate_name}} vs {{comp.name}}"
- 1문장 차별화: key_frames 활용
- 토론 30초 스크립트

[MODE: primary_bilateral] → 단일 상대에 집중, 더 공격적 스크립트

### (c) 예상 공격 TOP5 방어
→ bias_check 데이터 + 경쟁자 공격 패턴 종합
구조: 팩트 확인 → 원칙 천명 → 구체적 조치 → 슬로건 전환

### (d) 전략공천 차단 패키지 [MODE: primary_multi 전용]
→ mode_config.strategic_nomination_risk 기반 상세 전개

---

## STEP 7. D-{{campaign_days}} 실행 캘린더

→ weekly_kpi 배열 기반으로 주차 수 자동 생성

**각 주차 구조:**
```
N주차 (D-X~D-Y): {{weekly_kpi[N].theme}}

벤치마킹 공식 적용: ...
KPI: 당원 {{party_support_target}} / 시민 {{citizen_support_target}}

| 트랙 | 핵심 액션 | 담당 |
| 당원 공략 | ... | 조직팀 |
| 시민 공략 | ... | 전략팀 |
| 카피/콘텐츠 | {{weekly_kpi[N].content_target}} | 미디어팀 |
| 이미지메이킹 | ... | 후보 직접 |
| 리스크 관리 | ... | 전략팀장 |
```

---

## STEP 8. 리스크 관리 & 준법

### (a) 리스크 시나리오 TOP5
→ risks 배열 활용 (없으면 모드 기반 기본 리스크 생성)

**리스크 매트릭스 테이블**
| 리스크 | 발생확률 | 영향도 | 대응 핵심 |

### (b) 2시간 대응 프로토콜
| 시간 | 액션 | 담당 | 산출물 |
| 0~30분 | 팩트 확인 | 전략팀장 | 사실관계 보고서 |
| 30~60분 | 메시지 작성 | 카피팀 | 공식 입장문 |
| 60~90분 | 채널 배포 | 디지털팀 | SNS+언론 |
| 90~120분 | 현장 반영 | 현장팀 | 간담회 멘트 수정 |

### (c) 검증 패키지 3종
→ candidate_background, key_policies 기반 생성

### (d) 준법 체크 ★ 필수 포함
**하면 위험한 행동 vs 대신 할 수 있는 것** 테이블

> ⚠️ "위 내용은 일반적 가이드이며, 구체적 법적 판단은 반드시 선거법 전문 변호사의 자문을 받으십시오."

[MODE: general_bilateral] → 추가 주의: 사전선거운동 금지, 여론조사 공표 제한

---

## 교차 검증 — 6개 관점

| 관점 | 질문 | 판정 | 보완 |
| 1. 이미지 | D-{{campaign_days}} 후 각인 목표 달성 가능? | | |
| 2. 카피 일관성 | L1~L6 전 접점 통일? | | |
| 3. 숫자 | 정량적 3초 기억? | | |
| 4. 실행 | {{campaign_days}}일 내 실행 가능? | | |
| 5. 리스크 | 치명적 리스크 대비? | | |
| 6. 본선 확장성 | 본선까지 이어지는 메시지? | | |

### 최종 집중 사항 TOP3
### 3초 기억 최종 검증
### 가장 빨리 돌파할 세그먼트

---

## 부록 1: 캠프 전원 암기 카드

→ 마스터 슬로건 + 서브카피 + 핵심 숫자 + 30초 자기소개 + 공격 방어 5종

---

## 부록 2: 주간 점검 체크리스트

→ weekly_kpi 기반 자동 생성, 최소 12개 항목

| No | 점검 항목 | 1주차 | 2주차 | ... |
| 1 | DB 확보 현황 | ☐ | ☐ | ... |
| 2 | 간담회 실시 횟수 | ☐ | ☐ | ... |
| 3 | 콘텐츠 게시 수 | ☐ | ☐ | ... |
...

---

## 변수 ↔ 섹션 전체 매핑 인덱스

| config 변수 | 사용 STEP |
|------------|-----------|
| candidate_name | 표지, 전 섹션 |
| election_district | STEP 4-d 숏폼, STEP 5 |
| analysis_mode | STEP 1·6·7 분기 전체 |
| campaign_days | 표지, STEP 1-c, STEP 7 주차 수 |
| party_ratio / citizen_ratio | STEP 1-a |
| current_ranking | 표지, 요약, STEP 1 |
| current_support | STEP 1 비교표 |
| competitors | STEP 1-e, STEP 2, STEP 4-c, STEP 6-b |
| policy_slogan | 표지, L1, 전 섹션 |
| sub_slogan | L2 |
| three_sec_diff | STEP 3-a, STEP 3-d |
| key_frames | STEP 3-a, STEP 6-b |
| sub_regions | STEP 5 분기 |
| region_issues | STEP 5, STEP 2 충격숫자 |
| scenarios | STEP 1-b, 요약 |
| winning_formula | 요약, STEP 1-a |
| scripts / self_intro | STEP 3-c |
| top10_actions | 요약, STEP 1 액션박스 |
| bias_check | STEP 4-e, STEP 6-c |
| weekly_kpi | STEP 7, 부록2 |
| risks | STEP 8-a |
| faq_questions | STEP 4-e |
| strategy_frame | 표지, STEP 1-c |
| benchmark_case | 표지, 각 STEP 벤치마킹 박스 |
| db_target | STEP 2-c, STEP 7 |
| volunteer_target | STEP 2-c |
| candidate_background | STEP 3-c |
| mode_config | STEP 1-d, STEP 6-d |
