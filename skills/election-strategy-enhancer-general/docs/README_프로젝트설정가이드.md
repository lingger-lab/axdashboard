# 선거전략 실행문서 엔진 v2.0
## 새 프로젝트 설정 가이드

---

## 새 Claude 프로젝트에 올릴 파일 목록

| 파일명 | 파일 유형 | 용도 |
|--------|----------|------|
| `PROJECT_INSTRUCTIONS.md` | **Project Instructions** | 프로젝트 지침 (시스템 프롬프트) |
| `SKILL_je3eui_parser.md` | 지식 문서 | 제3의눈 파일 파싱 지침 |
| `SKILL_docx_generator.md` | 지식 문서 | docx 생성 코드 패턴 |
| `KNOWLEDGE_document_structure.md` | 지식 문서 | 8-STEP 문서 구조 & 변수 매핑 |
| `KNOWLEDGE_config_template.json` | 지식 문서 | 전체 변수 목록 & 기본값 |
| `KNOWLEDGE_mode_branches.md` | 지식 문서 | 3-Mode 분기 상세 로직 |

---

## Claude 프로젝트 설정 방법

### Step 1. 새 프로젝트 생성
Claude.ai → Projects → New Project

### Step 2. Project Instructions 설정
`PROJECT_INSTRUCTIONS.md` 내용을 프로젝트 지침란에 붙여넣기

### Step 3. 지식 문서 업로드
나머지 5개 파일을 Project Knowledge에 업로드

### Step 4. 사용 시작
```
새 대화에서:
"제3의눈 파일 업로드합니다 → [파일 첨부]"
또는
"사천시 국민의힘 시장 경선, 야당, 유해남, 당내경선으로 전략 문서 만들어줘"
```

---

## 사용 흐름

```
[제3의눈 파일 업로드]
         ↓
[SKILL_je3eui_parser.md 지침으로 자동 파싱]
         ↓
[추출 결과 표 → 사용자 확인 → 수정]
         ↓
[analysis_mode 확정 (primary_multi/bilateral/general)]
         ↓
[KNOWLEDGE_document_structure.md 구조대로 8-STEP 생성]
[KNOWLEDGE_mode_branches.md 분기 로직 적용]
         ↓
[SKILL_docx_generator.md 패턴으로 .docx 생성]
         ↓
[사용자 전달 → 피드백 → 수정]
```

---

## 3종 시나리오 테스트 케이스

새 프로젝트에서 아래 3가지로 품질 검증을 진행합니다.

### 시나리오 A: 여당 광역단체장 1위 방어
```
선거지역: 부산광역시
선거종류: 더불어민주당 부산시장 당내경선
여당/야당: 여당
후보명: 김민준 (가상)
분석방향: 당내경선
현재 순위: 1위 (38%)
```
검증 포인트: `strategy_frame = defense`, 전략공천 차단 섹션 포함, 주차 수 = ceil(30/7) = 5주

### 시나리오 B: 야당 신인 기초단체장 3위 역전
```
선거지역: 경기도 수원시 장안구
선거종류: 국민의힘 수원 장안구청장 당내경선
여당/야당: 야당
후보명: 이지훈 (가상)
분석방향: 당내경선
현재 순위: 3위 (15%)
sub_regions 없음 (권역 미구분)
```
검증 포인트: `strategy_frame = underdog`, sub_regions=[] → STEP 5 정책분야별 fallback, db_target = 10,000

### 시나리오 C: 무소속 전환 본선양자경선
```
선거지역: 경남 창원특례시
선거종류: 창원시장 본선
여당/야당: 무소속 (전 국민의힘)
후보명: 박성훈 (가상)
분석방향: 본선양자경선
```
검증 포인트: `analysis_mode = general_bilateral`, 전략공천 차단 섹션 없음, 준법 주의사항 강화

---

## 버전 이력

| 버전 | 날짜 | 변경 내역 |
|------|------|-----------|
| v1.0 | 2026.03 | 창원시장 경선 특화 (강명상 후보) |
| v2.0 | 2026.03 | 일반화: 5개 고정변수·3Mode 분기·제3의눈 파서·하드코딩 제거 |

---

## 핵심 개선사항 (v1.0 → v2.0)

| 문제 (v1.0) | 해결 (v2.0) |
|-------------|-------------|
| STEP 1~8 실제 구현 없음 | KNOWLEDGE_document_structure.md에 완전 명세 |
| "언더독" 프레임 하드코딩 | strategy_frame 변수화 (defense/offensive/underdog) |
| weekly_kpi 4주 고정 | campaign_days ÷ 7 동적 계산 |
| sub_regions 없으면 오류 | 정책분야별 Fallback 자동 전환 |
| 경쟁자 수 가변 미대응 | competitors 배열 동적 처리 |
| 제3의눈 파싱 미지원 | SKILL_je3eui_parser.md 완전 지침화 |
| 선거 유형별 차이 없음 | 3-Mode 분기 (KNOWLEDGE_mode_branches.md) |
