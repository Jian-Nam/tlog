"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Slider, fmt } from "@/components/ui";

/** Ax 를 '열의 조합' 과 '행과의 내적' 두 방식으로 동시에 보여줌 */
export default function MatVec() {
  const [x, setX] = useState<[number, number]>([1, 2]);
  const r0 = 2 * x[0] + 5 * x[1];
  const r1 = 1 * x[0] + 3 * x[1];
  const [u, v] = [fmt(x[0]), fmt(x[1])];
  const out = `\\begin{bmatrix} ${fmt(r0)} \\\\ ${fmt(r1)} \\end{bmatrix}`;

  return (
    <div className="space-y-3">
      <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-6">
        <Slider label="x₁" value={x[0]} onChange={(n) => setX([n, x[1]])} min={-3} max={3} step={0.5} color="var(--c1)" />
        <Slider label="x₂" value={x[1]} onChange={(n) => setX([x[0], n])} min={-3} max={3} step={0.5} color="var(--c2)" />
      </div>
      <div className="rounded-lg bg-surface-2 px-3 text-sm">
        <p className="!mb-0 !mt-3 font-semibold">열 방식: 열들의 일차결합</p>
        <Tex block>{`\\htmlClass{tx-c1}{${u}}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} + \\htmlClass{tx-c2}{${v}}\\begin{bmatrix} 5 \\\\ 3 \\end{bmatrix} = ${out}`}</Tex>
        <p className="!mb-0 font-semibold">행 방식: 각 행과 x의 내적</p>
        <Tex block>{`\\begin{bmatrix} 2\\cdot\\htmlClass{tx-c1}{${u}} + 5\\cdot\\htmlClass{tx-c2}{${v}} \\\\ 1\\cdot\\htmlClass{tx-c1}{${u}} + 3\\cdot\\htmlClass{tx-c2}{${v}} \\end{bmatrix} = ${out}`}</Tex>
      </div>
    </div>
  );
}
