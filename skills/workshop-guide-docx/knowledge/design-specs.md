# 워크숍 실습 가이드 — DOCX 디자인 사양

> 이 파일은 DOCX 생성 시 적용할 디자인 사양을 정의합니다.
> Phase 2 Step 5 (DOCX 빌드) 시 참조하세요.
> `/mnt/skills/public/docx/SKILL.md`와 함께 사용합니다.

---

## 1. 페이지 설정

| 항목 | 값 | DXA | 비고 |
|------|-----|-----|------|
| 용지 | A4 세로 | 11906 x 16838 | docx-js 기본값 |
| 여백 (상하) | 2.5cm | 1418 | |
| 여백 (좌우) | 2.5cm | 1418 | |
| 콘텐츠 영역 폭 | 16.0cm | 9070 | 11906 - 1418*2 |
| 페이지 번호 | 하단 중앙 | — | 표지(1p) 제외 |

```javascript
// 페이지 설정 코드
sections: [{
  properties: {
    page: {
      size: { width: 11906, height: 16838 },  // A4
      margin: { top: 1418, right: 1418, bottom: 1418, left: 1418 }
    },
    titlePage: true  // 표지 페이지 번호 제외
  },
  headers: { default: new Header({ children: [] }) },
  footers: {
    default: new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT] })]
        })
      ]
    })
  },
  children: [/* ... */]
}]
```

---

## 2. 타이포그래피

| 용도 | 폰트 | 크기(pt) | 크기(half-pt) | 굵기 | 색상 |
|------|------|---------|-------------|------|------|
| 본문 | Arial | 11 | 22 | Normal | #1E1E1E |
| H1 (섹션 제목) | Arial | 20 | 40 | Bold | {BRAND_COLOR} |
| H2 (소제목) | Arial | 15 | 30 | Bold | {BRAND_COLOR} |
| H3 (항목 제목) | Arial | 12 | 24 | Bold | #333333 |
| 캡션/힌트 | Arial | 9 | 18 | Italic | #888888 |
| 코드/프롬프트 | Consolas | 10 | 20 | Normal | #333333 |
| 격려 문구 | Arial | 11 | 22 | Italic | {BRAND_COLOR} |

```javascript
// 스타일 정의
styles: {
  default: {
    document: {
      run: { font: "Arial", size: 22, color: "1E1E1E" },
      paragraph: { spacing: { line: 360 } }  // 1.5 줄간격
    }
  },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 40, bold: true, font: "Arial", color: BRAND_COLOR },
      paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 }
    },
    {
      id: "Heading2", name: "Heading 2",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 30, bold: true, font: "Arial", color: BRAND_COLOR },
      paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 }
    },
    {
      id: "Heading3", name: "Heading 3",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: "333333" },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
    }
  ]
}
```

---

## 3. 색상 체계

### 색상 파생 로직

`BRAND_COLOR` 하나에서 모든 색상을 파생합니다.

| 역할 | 변수명 | 계산 방법 | 예시 (#6B21A8) |
|------|--------|----------|---------------|
| 주색상 (제목, 강조) | PRIMARY | BRAND_COLOR 그대로 | #6B21A8 |
| 표 헤더 배경 | HEADER_BG | 밝기 +15%, 채도 -10% | #8B4FC6 |
| 표 헤더 텍스트 | HEADER_TEXT | 항상 흰색 | #FFFFFF |
| TIP 박스 배경 | TIP_BG | 밝기 +75% | #F3E8FF |
| TIP 박스 왼쪽 바 | TIP_BAR | PRIMARY | #6B21A8 |
| 본문 텍스트 | TEXT | 항상 고정 | #1E1E1E |
| 보조 텍스트 | TEXT_LIGHT | 항상 고정 | #888888 |
| 코드 박스 배경 | CODE_BG | 항상 고정 | #F5F5F5 |
| 코드 박스 테두리 | CODE_BORDER | 항상 고정 | #DDDDDD |
| 워크시트 빈칸 배경 | BLANK_BG | 항상 고정 | #F9F9F9 |
| 교대 행 (짝수) | ZEBRA | 항상 고정 | #F9F9F9 |
| 표 테두리 | TABLE_BORDER | 항상 고정 | #CCCCCC |

### JavaScript 색상 파생 함수

```javascript
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1,3), 16) / 255;
  let g = parseInt(hex.slice(3,5), 16) / 255;
  let b = parseInt(hex.slice(5,7), 16) / 255;
  let max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function HSLToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function deriveColors(brandColor) {
  const hsl = hexToHSL(brandColor);
  return {
    PRIMARY: brandColor.replace('#', ''),
    HEADER_BG: HSLToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(100, hsl.l + 15)),
    TIP_BG: HSLToHex(hsl.h, Math.max(0, hsl.s - 30), Math.min(100, hsl.l + 45)),
    // 고정 색상
    HEADER_TEXT: "FFFFFF",
    TEXT: "1E1E1E",
    TEXT_LIGHT: "888888",
    CODE_BG: "F5F5F5",
    CODE_BORDER: "DDDDDD",
    BLANK_BG: "F9F9F9",
    ZEBRA: "F9F9F9",
    TABLE_BORDER: "CCCCCC"
  };
}
```

---

## 4. 표 스타일

### 기본 표

```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: colors.TABLE_BORDER };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// 표 폭 = 콘텐츠 영역 폭 = 9070 DXA
new Table({
  width: { size: 9070, type: WidthType.DXA },
  columnWidths: [/* 합계 = 9070 */],
  rows: [
    // 헤더행
    new TableRow({
      tableHeader: true,
      children: columns.map(col =>
        new TableCell({
          borders,
          width: { size: col.width, type: WidthType.DXA },
          shading: { fill: colors.HEADER_BG, type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [new Paragraph({
            children: [new TextRun({ text: col.header, bold: true, color: colors.HEADER_TEXT, font: "Arial", size: 22 })]
          })]
        })
      )
    }),
    // 본문행 (제브라 스트라이핑)
    ...data.map((row, i) =>
      new TableRow({
        children: columns.map(col =>
          new TableCell({
            borders,
            width: { size: col.width, type: WidthType.DXA },
            shading: { fill: i % 2 === 1 ? colors.ZEBRA : "FFFFFF", type: ShadingType.CLEAR },
            margins: cellMargins,
            children: [new Paragraph({
              children: [new TextRun({ text: row[col.key], font: "Arial", size: 22 })]
            })]
          })
        )
      })
    )
  ]
});
```

### 비교표 (좋은/나쁜 예)

2열 구조, 헤더에 🚫/✅ 포함:

```javascript
columnWidths: [4535, 4535]  // 균등 분할
// 헤더: "🚫 이렇게 쓰면" | "✅ 이렇게 쓰세요"
```

---

## 5. 특수 요소

### TIP 박스

왼쪽 4pt 색상 바 + 연한 배경으로 구현합니다.

```javascript
function createTipBox(text, colors) {
  return new Paragraph({
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: colors.PRIMARY, space: 8 }
    },
    shading: { fill: colors.TIP_BG, type: ShadingType.CLEAR },
    spacing: { before: 200, after: 200 },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({ text: "💡 TIP: ", bold: true, font: "Arial", size: 22, color: colors.PRIMARY }),
      new TextRun({ text: text, font: "Arial", size: 22, color: colors.TEXT })
    ]
  });
}
```

### 복사용 프롬프트/코드 박스

회색 배경 + 모노스페이스 폰트:

```javascript
function createCodeBox(text, colors) {
  return new Paragraph({
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: colors.CODE_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: colors.CODE_BORDER },
      left: { style: BorderStyle.SINGLE, size: 1, color: colors.CODE_BORDER },
      right: { style: BorderStyle.SINGLE, size: 1, color: colors.CODE_BORDER }
    },
    shading: { fill: colors.CODE_BG, type: ShadingType.CLEAR },
    spacing: { before: 200, after: 200 },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({ text: text, font: "Consolas", size: 20, color: "333333" })
    ]
  });
}
```

### 워크시트 빈칸

인쇄 후 필기 가능한 빈칸:

```javascript
function createBlankLine(colors) {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.DOTTED, size: 1, color: colors.TABLE_BORDER }
    },
    shading: { fill: colors.BLANK_BG, type: ShadingType.CLEAR },
    spacing: { before: 100, after: 100 },
    children: [
      new TextRun({ text: " ", font: "Arial", size: 28 })  // 높이 확보
    ]
  });
}
```

### 격려 문구

이탤릭, 중앙 정렬, 브랜드 색상:

```javascript
function createEncouragement(text, colors) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 300 },
    children: [
      new TextRun({
        text: text,
        italics: true,
        font: "Arial",
        size: 22,
        color: colors.PRIMARY
      })
    ]
  });
}
```

### 페이지 나누기

각 섹션 시작 시:

```javascript
// 섹션 시작 전에 PageBreak 삽입
new Paragraph({ children: [new PageBreak()] })
```

---

## 6. 워크시트 전용 표 스타일

실습 워크시트의 빈칸 채우기형 표:

```javascript
// 빈칸 셀 — 넓은 높이 + 연한 배경 + 점선 하단
new TableCell({
  borders: {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.DOTTED, size: 1, color: colors.TABLE_BORDER },
    left: { style: BorderStyle.SINGLE, size: 1, color: colors.TABLE_BORDER },
    right: { style: BorderStyle.SINGLE, size: 1, color: colors.TABLE_BORDER }
  },
  shading: { fill: colors.BLANK_BG, type: ShadingType.CLEAR },
  margins: { top: 120, bottom: 120, left: 120, right: 120 },
  children: [
    new Paragraph({
      children: [new TextRun({ text: " ", size: 28 })]  // 높이 확보
    })
  ]
})

// 힌트 텍스트 — 작은 이탤릭
new Paragraph({
  children: [
    new TextRun({
      text: "(힌트: pop, rock, jazz, R&B, EDM...)",
      italics: true, font: "Arial", size: 18, color: colors.TEXT_LIGHT
    })
  ]
})
```

---

## 7. 조합 공간 박스 (최종 프롬프트 작성용)

```javascript
function createCompositionBox(label, lineCount, colors) {
  const lines = [];
  lines.push(new Paragraph({
    children: [new TextRun({ text: `▼ ${label}`, bold: true, font: "Arial", size: 22 })]
  }));
  for (let i = 0; i < lineCount; i++) {
    lines.push(new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: colors.TABLE_BORDER }
      },
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: " ", size: 28 })]
    }));
  }
  return lines;
}
// 사용: createCompositionBox("위 내용을 조합한 나의 최종 프롬프트:", 4, colors)
```

---

## 8. 체크리스트 (DOCX 빌드 완료 전)

DOCX 생성 후 다음을 확인하세요:

- [ ] A4 세로, 여백 2.5cm 설정
- [ ] 표지에 페이지 번호 없음
- [ ] H1/H2에 BRAND_COLOR 적용
- [ ] 모든 표에 듀얼 폭 설정 (columnWidths + cell width)
- [ ] 표 음영: ShadingType.CLEAR 사용 (SOLID 아님)
- [ ] 불릿: LevelFormat.BULLET 사용 (유니코드 아님)
- [ ] 코드/프롬프트 박스: 회색 배경 + Consolas 폰트
- [ ] TIP 박스: 왼쪽 색상 바 + 연한 배경
- [ ] 워크시트 빈칸: 충분한 높이 + 힌트 포함
- [ ] 각 섹션 시작: PageBreak
- [ ] validate.py 통과
