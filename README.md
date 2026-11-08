# tlog — 강의와 함께 보는 선형대수

MIT 18.06 Linear Algebra (Gilbert Strang, Spring 2005) [유튜브 강의](https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D)를
보면서 함께 읽는 인터랙티브 노트 블로그입니다.

- 왼쪽에 영상, 오른쪽에 노트 (데스크톱에서는 영상이 고정)
- 노트의 `▶ 12:34` 타임스탬프를 누르면 영상이 해당 장면으로 이동
- 2D(SVG) / 3D(Three.js) 그래프를 슬라이더·드래그로 직접 조작

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
  page.tsx                  홈 (강의 목록)
  lectures/[slug]/page.tsx  강의 페이지 (영상 + 노트)
lib/lectures.ts             전체 강의 목록 (제목, 유튜브 videoId)
content/
  index.ts                  노트 등록부 (slug → 컴포넌트, 목차)
  lec01.tsx                 1강 노트
components/
  VideoPlayer.tsx           YouTube IFrame API 플레이어 + 타임스탬프 <T at="mm:ss" />
  Tex.tsx                   KaTeX 수식 (<Tex>, <M>)
  ui.tsx                    Slider, Button, Figure
  viz/                      인터랙티브 그래프
    plane2d.tsx             2D 좌표평면 유틸 (SVG)
    scene3d.tsx             3D 장면 유틸 (화살표, 평면, 점, 3x3 풀이)
    RowPicture2D / ColumnPicture2D / RowPicture3D / ColumnPicture3D / MatVec
```

## 새 강의 노트 추가하기

1. `content/lecNN.tsx` 작성 (`toc` export + 기본 export 컴포넌트)
2. `content/index.ts`에 등록
3. `lib/lectures.ts`의 `READY`에 강의 번호 추가
