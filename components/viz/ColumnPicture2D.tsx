"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { fmt } from "@/components/ui";
import { Arrow, Dot, Label, Plane2D, solve2, useView, type V2 } from "./plane2d";

const a1: V2 = [2, -1];
const a2: V2 = [-1, 2];
// b 는 격자(±LIM) 안 어디든 이동 가능. 이때 x = (2b₁+b₂)/3 이므로 |x| ≤ LIM,
// x·a₁ = (2x, -x) 의 끝점은 최대 2·LIM 까지 나감 → 화면 범위를 2·LIM + 여유로 잡음
const LIM = 4;

/** b 를 드래그하면 x, y 가 자동으로 계산되어 x·a₁ + y·a₂ 가 그려짐 */
export default function ColumnPicture2D() {
  const view = useView(2 * LIM + 0.6, 440);
  const [b, setB] = useState<V2>([0, 3]);

  const [x, y] = solve2(a1[0], a2[0], a1[1], a2[1], b[0], b[1])!;
  const p1: V2 = [x * a1[0], x * a1[1]];

  const clamp = (v: number) => Math.max(-LIM, Math.min(LIM, Math.round(v * 10) / 10));

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="cursor-crosshair rounded-lg border border-border">
        <Plane2D view={view} gridR={LIM} onPointer={(p, phase) => phase !== "up" && setB([clamp(p[0]), clamp(p[1])])}>
          <Arrow view={view} to={a1} color="var(--c1)" width={1.5} opacity={0.35} dashed />
          <Arrow view={view} to={a2} color="var(--c2)" width={1.5} opacity={0.35} dashed />
          <Label view={view} p={a1} color="var(--c1)" dx={6} dy={14}>
            a₁
          </Label>
          <Label view={view} p={a2} color="var(--c2)" dx={-20} dy={-6}>
            a₂
          </Label>
          <Arrow view={view} to={p1} color="var(--c1)" />
          <Arrow view={view} from={p1} to={b} color="var(--c2)" />
          <circle cx={view.sx(b[0])} cy={view.sy(b[1])} r={13} fill="var(--cb)" opacity={0.15} />
          <Dot view={view} p={b} color="var(--cb)" r={7} />
          <Label view={view} p={b} color="var(--cb)" dx={12} dy={-10}>
            b
          </Label>
        </Plane2D>
      </div>

      <div className="flex flex-col justify-center gap-4 text-sm">
        <p className="text-muted">
          격자 안 아무 곳이나 눌러 <strong style={{ color: "var(--cb)" }}>b</strong>를 옮겨 보세요. 격자 바깥은
          화살표가 지나가는 여백입니다.
        </p>
        <Tex block>{`\\textcolor{#2f6fdf}{${fmt(x)}}\\begin{bmatrix}2\\\\-1\\end{bmatrix} + \\textcolor{#e8590c}{${fmt(
          y,
        )}}\\begin{bmatrix}-1\\\\2\\end{bmatrix} = \\begin{bmatrix}${fmt(b[0])}\\\\${fmt(b[1])}\\end{bmatrix}`}</Tex>
        <div className="rounded-lg bg-surface-2 p-3 font-mono">
          <span style={{ color: "var(--c1)" }}>x = {fmt(x)}</span>
          <br />
          <span style={{ color: "var(--c2)" }}>y = {fmt(y)}</span>
        </div>
      </div>
    </div>
  );
}
