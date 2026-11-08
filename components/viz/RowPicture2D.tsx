"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { fmt } from "@/components/ui";
import { Dot, DraggableLine, Label, Plane2D, solve2, useView } from "./plane2d";

/** A 는 강의 예제로 고정. 직선을 잡고 끌면 평행이동(b 변경) → 교점(해)이 자동으로 따라감 */
export default function RowPicture2D() {
  const [b, setB] = useState<[number, number]>([0, 3]);
  const view = useView(5, 420);
  const [x, y] = solve2(2, -1, -1, 2, b[0], b[1])!;
  const inView = Math.abs(x) < 5 && Math.abs(y) < 5;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
      <div className="touch-none rounded-lg border border-border">
        <Plane2D view={view}>
          <DraggableLine view={view} a={2} b={-1} c={b[0]} color="var(--c1)" onChange={(v) => setB([v, b[1]])} />
          <DraggableLine view={view} a={-1} b={2} c={b[1]} color="var(--c2)" onChange={(v) => setB([b[0], v])} />
          {inView ? (
            <g pointerEvents="none">
              <Dot view={view} p={[x, y]} color="var(--cb)" r={6} />
              <Label view={view} p={[x, y]} color="var(--cb)">
                ({fmt(x)}, {fmt(y)})
              </Label>
            </g>
          ) : null}
        </Plane2D>
      </div>

      <div className="eq-tight flex flex-col justify-center gap-3 text-sm">
        <p className="text-muted">직선을 잡고 끌어 평행이동해 보세요.</p>
        <div className="tx-c1">
          <Tex block>{`2x - y = ${fmt(b[0])}`}</Tex>
        </div>
        <div className="tx-c2">
          <Tex block>{`-x + 2y = ${fmt(b[1])}`}</Tex>
        </div>
        <div className="rounded-lg bg-surface-2 p-3 font-mono" style={{ color: "var(--cb)" }}>
          해 (x, y) = ({fmt(x)}, {fmt(y)})
        </div>
      </div>
    </div>
  );
}
