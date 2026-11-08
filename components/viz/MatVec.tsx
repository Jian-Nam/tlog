"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Button, Slider, fmt } from "@/components/ui";

/** Ax 를 '열의 조합' 과 '행과의 내적' 두 방식으로 계산 */
export default function MatVec() {
  const A = [
    [2, 5],
    [1, 3],
  ];
  const [x, setX] = useState<[number, number]>([1, 2]);
  const [way, setWay] = useState<"col" | "row">("col");

  const r0 = A[0][0] * x[0] + A[0][1] * x[1];
  const r1 = A[1][0] * x[0] + A[1][1] * x[1];

  const lhs = `\\begin{bmatrix} 2 & 5 \\\\ 1 & 3 \\end{bmatrix}\\begin{bmatrix} ${fmt(x[0])} \\\\ ${fmt(x[1])} \\end{bmatrix}`;
  const col = `= ${fmt(x[0])}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} + ${fmt(x[1])}\\begin{bmatrix} 5 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} ${fmt(r0)} \\\\ ${fmt(r1)} \\end{bmatrix}`;
  const row = `= \\begin{bmatrix} (2,5)\\cdot(${fmt(x[0])},${fmt(x[1])}) \\\\ (1,3)\\cdot(${fmt(x[0])},${fmt(x[1])}) \\end{bmatrix} = \\begin{bmatrix} ${fmt(r0)} \\\\ ${fmt(r1)} \\end{bmatrix}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        <Button active={way === "col"} onClick={() => setWay("col")}>
          열 방식 (조합)
        </Button>
        <Button active={way === "row"} onClick={() => setWay("row")}>
          행 방식 (내적)
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg bg-surface-2 px-3">
        <Tex block>{`${lhs} ${way === "col" ? col : row}`}</Tex>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-6">
        <Slider label="x₁" value={x[0]} onChange={(v) => setX([v, x[1]])} min={-3} max={3} step={0.5} color="var(--c1)" />
        <Slider label="x₂" value={x[1]} onChange={(v) => setX([x[0], v])} min={-3} max={3} step={0.5} color="var(--c2)" />
      </div>
    </div>
  );
}
