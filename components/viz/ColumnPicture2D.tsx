"use client";

import { useState } from "react";
import { FormulaPair } from "./FormulaPair";
import { TONE, columnsTex, matrixTex } from "./latex";
import { Arrow, Dot, Label, Plane2D, solve2, useView, type V2 } from "./plane2d";

const A = [
  [2, -1],
  [-1, 2],
];
const a1: V2 = [A[0][0], A[1][0]];
const a2: V2 = [A[0][1], A[1][1]];
// b 는 격자(±LIM) 안 어디든 이동 가능. 이때 x = (2b₁+b₂)/3 이므로 |x| ≤ LIM,
// x·a₁ = (2x, -x) 의 끝점은 최대 2·LIM 까지 나감 → 화면 범위를 2·LIM + 여유로 잡음
const LIM = 4;
const colTone = (j: number) => TONE[j];

/** b 를 드래그하면 x, y 가 자동으로 계산되어 x·a₁ + y·a₂ 가 그려짐 */
export default function ColumnPicture2D() {
  const view = useView(2 * LIM + 0.6, 440);
  const [b, setB] = useState<V2>([0, 3]);

  const [x, y] = solve2(a1[0], a2[0], a1[1], a2[1], b[0], b[1])!;
  const p1: V2 = [x * a1[0], x * a1[1]];

  const clamp = (v: number) => Math.max(-LIM, Math.min(LIM, Math.round(v * 10) / 10));

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-[480px] cursor-crosshair rounded-lg border border-border">
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

      <p className="!my-0 text-center text-sm text-muted">
        격자 안 아무 곳이나 눌러 <strong className="tx-b">b</strong>를 옮겨 보세요.
      </p>
      <FormulaPair
        layout="row"
        items={[
            { label: "열의 일차결합", tex: columnsTex(A, [x, y], b) },
            {
              label: "행렬 형태 Ax = b",
              tex: matrixTex(A, [x, y], b, { cellClass: (_, j) => colTone(j), xClass: colTone, bClass: () => "tx-b" }),
            },
        ]}
      />
    </div>
  );
}
