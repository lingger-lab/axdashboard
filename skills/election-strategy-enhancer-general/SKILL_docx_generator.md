# SKILL: 선거전략 DOCX 생성기
## SKILL_docx_generator.md

이 스킬은 Node.js + docx 라이브러리를 사용하여  
선거전략 실행문서 .docx 파일을 생성하는 코드 패턴을 정의합니다.

---

## 환경 설정

```bash
# 작업 디렉토리 생성
mkdir -p /home/claude/strategy-output

# 의존성 설치
cd /home/claude/strategy-output
npm install docx
```

---

## 파일 생성 워크플로우

```
config.json (변수 집합)
      ↓
generate_strategy.js (이 스킬의 패턴 적용)
      ↓
strategy.docx → validate.py → 사용자 전달
```

---

## 페이지 설정 (A4 고정)

```javascript
const PAGE_WIDTH = 11906;   // A4 가로 DXA
const PAGE_HEIGHT = 16838;  // A4 세로 DXA
const MARGIN = 1440;        // 1인치
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2); // 9026

sections: [{
  properties: {
    page: {
      size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
      margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
    }
  }
}]
```

---

## 색상 팔레트 (변경 금지)

```javascript
const COLORS = {
  primary:   "1F4E79",  // 남색 — 헤더, STEP 제목
  secondary: "2E75B6",  // 중간 파랑 — 서브 제목
  accent:    "D5E8F0",  // 연한 파랑 — 테이블 헤더 배경
  highlight: "FFF2CC",  // 연한 노랑 — 💡 결론 박스
  benchmark: "E8F5E9",  // 연한 초록 — 🗽 벤치마킹 박스
  action:    "FCE4EC",  // 연한 분홍 — 🎯 액션 박스
  warning:   "FFE0B2",  // 연한 주황 — ⚠️ 리스크
  border:    "CCCCCC",
  darkText:  "1A1A1A",
  lightText: "666666"
};
```

---

## 핵심 헬퍼 함수 패턴

### createStepHeading (STEP 제목)
```javascript
function createStepHeading(stepNum, title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    children: [new TextRun({
      text: `STEP ${stepNum}. ${title}`,
      font: "Arial", size: 32, bold: true, color: COLORS.primary
    })]
  });
}
```

### createInfoBox (💡🗽🎯 박스)
```javascript
function createInfoBox(emoji, title, lines, bgColor) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { top: border, bottom: border, left: border, right: border },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [
            new TextRun({ text: `${emoji} ${title}`, bold: true, font: "Arial", size: 22, color: COLORS.primary })
          ]}),
          ...lines.map(line => new Paragraph({ spacing: { after: 40 }, children: [
            new TextRun({ text: line, font: "Arial", size: 20, color: COLORS.darkText })
          ]}))
        ]
      })
    ]})]
  });
}
```

### createDataTable (데이터 테이블)
```javascript
function createDataTable(headers, rows, colWidths) {
  // colWidths 미지정 시 균등 분할
  if (!colWidths) {
    const eq = Math.floor(CONTENT_WIDTH / headers.length);
    colWidths = headers.map((_, i) =>
      i === headers.length - 1 ? CONTENT_WIDTH - eq * (headers.length - 1) : eq
    );
  }
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headers.map((h, i) =>
        new TableCell({
          borders, width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: COLORS.accent, type: ShadingType.CLEAR },
          margins: cellMargins, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: COLORS.primary })
          ]})]
        })
      )}),
      ...rows.map(row => new TableRow({ children: row.map((cell, i) =>
        new TableCell({
          borders, width: { size: colWidths[i], type: WidthType.DXA },
          margins: cellMargins, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [
            new TextRun({ text: String(cell), font: "Arial", size: 20, color: COLORS.darkText })
          ]})]
        })
      )}))
    ]
  });
}
```

---

## 문서 구조 순서 (필수 준수)

```javascript
const children = [
  // 1. 표지
  ...generateCoverPage(config),

  // 2. 요약 A4 1장
  ...generateSummaryPage(config),

  // 3. STEP 1~8 (모드별 분기 적용)
  ...generateStep1(config),  // 승리조건 역산
  ...generateStep2(config),  // 이슈브레이킹
  ...generateStep3(config),  // 이미지메이킹
  ...generateStep4(config),  // 카피라이팅
  ...generateStep5(config),  // 이슈선점
  ...generateStep6(config),  // 경쟁우위
  ...generateStep7(config),  // 실행캘린더
  ...generateStep8(config),  // 리스크관리

  // 4. 교차검증
  ...generateCrossValidation(config),

  // 5. 부록
  ...generateAppendix1(config),  // 암기카드
  ...generateAppendix2(config),  // 주간점검표
];
```

---

## 모드별 분기 패턴

```javascript
function generateStep1(config) {
  const elements = [];

  // 공통 섹션
  elements.push(createStepHeading(1, '승리조건 역산 모델'));
  elements.push(/* 승리 공식 */);

  // 모드 분기
  if (config.analysis_mode === 'primary_multi') {
    elements.push(/* 전략공천 차단 조건 */);
    elements.push(/* 경쟁자 사퇴/단일화 시뮬레이션 */);
  } else if (config.analysis_mode === 'primary_bilateral') {
    elements.push(/* 0섬 게임 공식 */);
    elements.push(/* 양자 지지율 시뮬레이션 */);
  } else if (config.analysis_mode === 'general_bilateral') {
    elements.push(/* 정당 지지율 기반 분석 */);
    elements.push(/* 중도층/스윙보터 공략 */);
  }

  elements.push(spacer());
  return elements;
}
```

---

## 동적 생성 규칙

### 주간 KPI 주차 수 계산
```javascript
const totalWeeks = Math.ceil(config.campaign_days / 7);
// campaign_days=19 → 3주, campaign_days=30 → 5주, campaign_days=45 → 7주
```

### 권역 없을 때 Fallback
```javascript
const hasRegions = config.sub_regions && config.sub_regions.length > 0;
if (hasRegions) {
  // 권역별 이슈 구조 생성
} else {
  // 정책분야별 이슈 구조 생성 (경제/복지/교통/환경/청년)
}
```

### strategy_frame 자동 결정
```javascript
const frame = config.strategy_frame || (
  config.current_ranking <= 1 ? 'defense' :
  config.current_ranking <= 2 ? 'offensive' : 'underdog'
);
const frameText = {
  underdog: '언더독(Underdog) 역전승',
  defense:  '선두 수성 전략',
  offensive: '추격 역전 전략'
}[frame];
```

### DB 목표 비례 계산
```javascript
const regionCount = config.sub_regions?.length || 0;
const dbTarget = regionCount >= 5 ? 50000 :
                 regionCount >= 3 ? 20000 :
                 regionCount >= 1 ? 10000 : 5000;
```

---

## 표지 생성 패턴

```javascript
function generateCoverPage(config) {
  const frame = config.strategy_frame || 'underdog';
  const frameText = { underdog: '언더독(Underdog) 역전승', defense: '선두 수성 전략', offensive: '추격 역전 전략' }[frame];

  return [
    new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "극비 · CONFIDENTIAL", font: "Arial", size: 20, color: COLORS.lightText })] }),
    spacer(), spacer(),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: config.policy_slogan || '', font: "Arial", size: 52, bold: true, color: COLORS.primary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: config.candidate_name || '', font: "Arial", size: 36, bold: true, color: COLORS.secondary })] }),
    spacer(),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `D-${config.campaign_days || 30} 경선 승리 전략 실행 문서`, font: "Arial", size: 28, color: COLORS.darkText })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: config.version || 'v1.0', font: "Arial", size: 22, color: COLORS.lightText })] }),
    spacer(), spacer(),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: config.election_type_label || '', font: "Arial", size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `전략 프레임: ${frameText}`, font: "Arial", size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `벤치마킹: ${config.benchmark_case || ''}`, font: "Arial", size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `작성일: ${config.generation_date || new Date().toISOString().split('T')[0]}`, font: "Arial", size: 22 })] }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}
```

---

## 검증 (생성 후 필수)

```bash
python /mnt/skills/public/docx/scripts/office/validate.py /home/claude/strategy-output/strategy.docx
```

실패 시: 오류 메시지를 읽고 해당 섹션의 XML 또는 docx-js 코드를 수정합니다.

---

## 출력 경로

```bash
cp /home/claude/strategy-output/strategy.docx /mnt/user-data/outputs/
```

`present_files` 도구로 사용자에게 전달합니다.
