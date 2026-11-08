"use client";

import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Button, Slider, fmt } from "@/components/ui";
import { Dot, Label, LineEq, Plane2D, solve2, useView } from "./plane2d";

const PRESETS = {
  lecture: { A: [2, -1, -1, 2], b: [0, 3], name: "강의 예제" },
  parallel: { A: [1, -1, 2, -2], b: [1, -2], name: "평행 (해 없음)" },
  same: { A: [1, 1, 2, 2], b: [2, 4], name: "같은 직선 (해 무수히)" },
} as const;

/** 계수 + 변수 항. 계수 1은 생략, 0이면 0x 그대로 표시 */
const sgn = (v: number, first = false) => {
  const a = Math.abs(v);
  const s = Math.abs(a - 1) < 1e-9 ? "" : fmt(a);
  if (first) return v < 0 ? `-${s}` : s;
  return v < 0 ? `- ${s}` : `+ ${s}`;
};

export default function RowPicture2D() {
  const [A, setA] = useState<number[]>([...PRESETS.lecture.A]);
  const [b, setB] = useState<number[]>([...PRESETS.lecture.b]);
  const view = useView(5, 420);

  const sol = solve2(A[0], A[1], A[2], A[3], b[0], b[1]);
  const det = A[0] * A[3] - A[1] * A[2];

  const setAi = (i: number) => (v: number) => setA((p) => p.map((x, j) => (j === i ? v : x)));
  const setBi = (i: number) => (v: number) => setB((p) => p.map((x, j) => (j === i ? v : x)));

  const eq = (r: number) => `${sgn(A[r * 2], true)}x ${sgn(A[r * 2 + 1])}y = ${fmt(b[r])}`;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-lg border border-border">
        <Plane2D view={view}>
          <LineEq view={view} a={A[0]} b={A[1]} c={b[0]} color="var(--c1)" />
          <LineEq view={view} a={A[2]} b={A[3]} c={b[1]} color="var(--c2)" />
          {sol && Math.abs(sol[0]) < 5 && Math.abs(sol[1]) < 5 ? (
            <>
              <Dot view={view} p={sol} color="var(--cb)" r={6} />
              <Label view={view} p={sol} color="var(--cb)">
                ({fmt(sol[0])}, {fmt(sol[1])})
              </Label>
            </>
          ) : null}
        </Plane2D>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRESETS).map(([k, p]) => (
            <Button
              key={k}
              onClick={() => {
                setA([...p.A]);
                setB([...p.b]);
              }}
            >
              {p.name}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5">
          <div className="text-sm" style={{ color: "var(--c1)" }}>
            <Tex>{eq(0)}</Tex>
          </div>
          <Slider label="a₁₁" value={A[0]} onChange={setAi(0)} color="var(--c1)" />
          <Slider label="a₁₂" value={A[1]} onChange={setAi(1)} color="var(--c1)" />
          <Slider label="b₁" value={b[0]} onChange={setBi(0)} color="var(--c1)" />
        </div>
        <div className="space-y-1.5">
          <div className="text-sm" style={{ color: "var(--c2)" }}>
            <Tex>{eq(1)}</Tex>
          </div>
          <Slider label="a₂₁" value={A[2]} onChange={setAi(2)} color="var(--c2)" />
          <Slider label="a₂₂" value={A[3]} onChange={setAi(3)} color="var(--c2)" />
          <Slider label="b₂" value={b[1]} onChange={setBi(1)} color="var(--c2)" />
        </div>

        <div className="rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
          {sol ? (
            <>
              두 직선이 한 점에서 만납니다.
              <br />
              해: <Tex>{`(x, y) = (${fmt(sol[0])},\\ ${fmt(sol[1])})`}</Tex>
            </>
          ) : (
            <>
              <Tex>{`\\det A = ${fmt(det)}`}</Tex> — 두 직선이 <strong>평행</strong>합니다.
              <br />
              b에 따라 해가 <strong>없거나</strong> (서로 다른 직선) <strong>무수히 많습니다</strong> (같은 직선).
            </>
          )}
        </div>
      </div>
    </div>
  );
}
