"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Slider, fmt } from "@/components/ui";
import { Dot, Label, LineEq, Plane2D, solve2, useView } from "./plane2d";

/** A 는 강의 예제로 고정, b 만 조작 → 두 직선이 평행이동하며 교점(해)이 자동으로 따라감 */
export default function RowPicture2D() {
  const [b, setB] = useState<[number, number]>([0, 3]);
  const view = useView(5, 420);
  const [x, y] = solve2(2, -1, -1, 2, b[0], b[1])!;
  const inView = Math.abs(x) < 5 && Math.abs(y) < 5;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="rounded-lg border border-border">
        <Plane2D view={view}>
          <LineEq view={view} a={2} b={-1} c={b[0]} color="var(--c1)" />
          <LineEq view={view} a={-1} b={2} c={b[1]} color="var(--c2)" />
          {inView ? (
            <>
              <Dot view={view} p={[x, y]} color="var(--cb)" r={6} />
              <Label view={view} p={[x, y]} color="var(--cb)">
                ({fmt(x)}, {fmt(y)})
              </Label>
            </>
          ) : null}
        </Plane2D>
      </div>

      <div className="flex flex-col justify-center gap-4 text-sm">
        <div className="space-y-2">
          <div style={{ color: "var(--c1)" }}>
            <Tex>{`2x - y = ${fmt(b[0])}`}</Tex>
          </div>
          <Slider label="b₁" value={b[0]} onChange={(v) => setB([v, b[1]])} color="var(--c1)" />
        </div>
        <div className="space-y-2">
          <div style={{ color: "var(--c2)" }}>
            <Tex>{`-x + 2y = ${fmt(b[1])}`}</Tex>
          </div>
          <Slider label="b₂" value={b[1]} onChange={(v) => setB([b[0], v])} color="var(--c2)" />
        </div>
        <div className="rounded-lg bg-surface-2 p-3 font-mono" style={{ color: "var(--cb)" }}>
          해 (x, y) = ({fmt(x)}, {fmt(y)})
        </div>
      </div>
    </div>
  );
}
