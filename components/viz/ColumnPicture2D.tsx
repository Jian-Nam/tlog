"use client";

import { useEffect, useRef, useState } from "react";
import { Tex } from "@/components/Tex";
import { Button, Slider, fmt } from "@/components/ui";
import { Arrow, Dot, Label, Plane2D, solve2, useView, type V2 } from "./plane2d";

const COLS: Record<"lecture" | "dependent", [V2, V2]> = {
  lecture: [
    [2, -1],
    [-1, 2],
  ],
  dependent: [
    [2, -1],
    [-4, 2],
  ],
};

export default function ColumnPicture2D() {
  const view = useView(5, 420);
  const [mode, setMode] = useState<keyof typeof COLS>("lecture");
  const [x, setX] = useState(1);
  const [y, setY] = useState(0.5);
  const [b, setB] = useState<V2>([0, 3]);
  const [lattice, setLattice] = useState(false);
  const raf = useRef(0);

  const [a1, a2] = COLS[mode];
  const p1: V2 = [x * a1[0], x * a1[1]];
  const sum: V2 = [p1[0] + y * a2[0], p1[1] + y * a2[1]];
  const sol = solve2(a1[0], a2[0], a1[1], a2[1], b[0], b[1]);
  const err = Math.hypot(sum[0] - b[0], sum[1] - b[1]);
  const hit = err < 0.08;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const animateTo = (tx: number, ty: number) => {
    cancelAnimationFrame(raf.current);
    const x0 = x,
      y0 = y,
      t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      const e = 1 - (1 - k) ** 3;
      setX(x0 + (tx - x0) * e);
      setY(y0 + (ty - y0) * e);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const snap = (v: number) => Math.round(v * 2) / 2;

  const latticeLines = [];
  if (lattice) {
    for (let k = -8; k <= 8; k++) {
      latticeLines.push(
        <line
          key={`u${k}`}
          x1={view.sx(k * a1[0] - 20 * a2[0])}
          y1={view.sy(k * a1[1] - 20 * a2[1])}
          x2={view.sx(k * a1[0] + 20 * a2[0])}
          y2={view.sy(k * a1[1] + 20 * a2[1])}
          stroke="var(--c2)"
          strokeOpacity={0.25}
        />,
        <line
          key={`v${k}`}
          x1={view.sx(k * a2[0] - 20 * a1[0])}
          y1={view.sy(k * a2[1] - 20 * a1[1])}
          x2={view.sx(k * a2[0] + 20 * a1[0])}
          y2={view.sy(k * a2[1] + 20 * a1[1])}
          stroke="var(--c1)"
          strokeOpacity={0.25}
        />,
      );
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-lg border border-border">
        <Plane2D
          view={view}
          onPointer={(p, phase) => {
            if (phase === "up") return;
            setB([Math.max(-5, Math.min(5, snap(p[0]))), Math.max(-5, Math.min(5, snap(p[1])))]);
          }}
        >
          {latticeLines}
          <Arrow view={view} to={b} color="var(--cb)" width={3} opacity={0.35} />
          <Arrow view={view} to={a1} color="var(--c1)" width={1.5} opacity={0.35} dashed />
          <Arrow view={view} to={a2} color="var(--c2)" width={1.5} opacity={0.35} dashed />
          <Arrow view={view} to={p1} color="var(--c1)" />
          <Arrow view={view} from={p1} to={sum} color="var(--c2)" />
          <Arrow view={view} to={sum} color="var(--fg)" width={1.5} dashed opacity={0.6} />
          <Dot view={view} p={b} color="var(--cb)" r={7} />
          <Label view={view} p={b} color="var(--cb)">
            b = ({fmt(b[0])}, {fmt(b[1])})
          </Label>
          <Label view={view} p={p1} color="var(--c1)" dx={-30} dy={18}>
            {fmt(x)}·a₁
          </Label>
          <Label view={view} p={sum} color="var(--c2)" dx={8} dy={16}>
            +{fmt(y)}·a₂
          </Label>
        </Plane2D>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <Button active={mode === "lecture"} onClick={() => setMode("lecture")}>
            강의 예제 열
          </Button>
          <Button active={mode === "dependent"} onClick={() => setMode("dependent")}>
            평행한 열
          </Button>
          <Button active={lattice} onClick={() => setLattice((v) => !v)}>
            조합 격자
          </Button>
        </div>

        <Tex block>{`${fmt(x)}\\textcolor{${"#2f6fdf"}}{\\begin{bmatrix}${a1[0]}\\\\${a1[1]}\\end{bmatrix}} + ${fmt(
          y,
        )}\\textcolor{${"#e8590c"}}{\\begin{bmatrix}${a2[0]}\\\\${a2[1]}\\end{bmatrix}} = \\begin{bmatrix}${fmt(
          sum[0],
        )}\\\\${fmt(sum[1])}\\end{bmatrix}`}</Tex>

        <Slider label="x" value={x} onChange={setX} min={-3} max={3} step={0.05} color="var(--c1)" />
        <Slider label="y" value={y} onChange={setY} min={-3} max={3} step={0.05} color="var(--c2)" />

        <div className="flex gap-1.5">
          <Button onClick={() => sol && animateTo(sol[0], sol[1])}>해 찾기</Button>
          <Button onClick={() => animateTo(0, 0)}>초기화</Button>
        </div>

        <div className="rounded-lg bg-surface-2 p-3 leading-relaxed">
          {hit ? (
            <span style={{ color: "var(--cb)" }}>
              <strong>도착!</strong> b = {fmt(x)}·a₁ + {fmt(y)}·a₂
            </span>
          ) : sol ? (
            <>
              b까지 거리 {fmt(err)}. 분홍 점(b)을 드래그해서 다른 목표를 정해 보세요.
            </>
          ) : (
            <>
              두 열이 <strong>같은 직선</strong> 위에 있습니다. 조합은 그 직선만 채우므로, b가 직선 밖에 있으면 절대
              도달할 수 없습니다.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
