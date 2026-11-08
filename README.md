# tlog — 만져 보며 읽는 선형대수

그래프를 직접 움직이며 읽는 선형대수 인터랙티브 노트 블로그입니다.

- 글만으로 완결되는 노트 (외부 영상·강의 없이 읽을 수 있음)
- 2D(SVG) / 3D(Three.js) 그래프를 드래그로 직접 조작

## 스택

Next.js 16 (App Router) · React 19 · Three.js + @react-three/fiber + drei · KaTeX · Tailwind CSS 4

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## 구조

```
app/
  page.tsx                  홈 (노트 목록)
  posts/[slug]/page.tsx     노트 페이지 (목차 + 본문)
content/
  index.ts                  노트 목록 (slug, 제목, 설명, 컴포넌트, 목차)
  three-pictures.tsx        1. 연립방정식을 보는 세 가지 그림
  elimination.tsx           2. 소거법: 행렬로 푸는 연립방정식
components/
  Tex.tsx                   KaTeX 수식 (<Tex>, <M>)
  FitMath.tsx               블록 수식을 폭에 맞게 축소
  ui.tsx                    Slider, Button, Figure
  viz/                      인터랙티브 그래프
    plane2d.tsx             2D 좌표평면 유틸 (SVG)
    scene3d.tsx             3D 장면 유틸 (화살표, 평면, 점, 3x3 풀이)
    latex.ts                방정식 / Ax = b / 열 일차결합 수식 생성
    RowPicture2D / ColumnPicture2D / RowPicture3D / ColumnPicture3D / MatVec / EqMatrixMap
    EliminationLine2D / Elimination3D
```

## 새 노트 추가하기

1. `content/<slug>.tsx` 작성 (`toc` export + 기본 export 컴포넌트)
2. `content/index.ts`의 `posts`에 추가 (읽는 순서대로)
