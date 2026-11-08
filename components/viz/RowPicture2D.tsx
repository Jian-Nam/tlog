"use client";

import { useState } from "react";
import { fmt } from "@/components/ui";
import { FormulaPair } from "./FormulaPair";
import { TONE, equationsTex, matrixTex } from "./latex";
import { Dot, DraggableLine, Label, Plane2D, solve2, useView } from "./plane2d";

const A = [
  [2, -1],
  [-1, 2],
];
const rowTone = (i: number) => TONE[i];

/** A 는 본문 예제로 고정. 직선을 잡고 끌면 평행이동(b 변경) → 교점(해)이 자동으로 따라감 */
export default function RowPicture2D() {
  const [b, setB] = useState<[number, number]>([0, 3]);
  const view = useView(5, 420);
  const [x, y] = solve2(A[0][0], A[0][1], A[1][0], A[1][1], b[0], b[1])!;
  const inView = Math.abs(x) < 5 && Math.abs(y) < 5;

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-[480px] touch-none rounded-lg border border-border">
        <Plane2D view={view}>
          <DraggableLine view={view} a={A[0][0]} b={A[0][1]} c={b[0]} color="var(--c1)" onChange={(v) => setB([v, b[1]])} />
          <DraggableLine view={view} a={A[1][0]} b={A[1][1]} c={b[1]} color="var(--c2)" onChange={(v) => setB([b[0], v])} />
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

      <p className="!my-0 text-center text-sm text-muted">직선을 잡고 끌어 평행이동해 보세요.</p>
      <FormulaPair
        layout="row"
        items={[
            {
              label: "방정식 (행마다 직선 하나)",
              tex: equationsTex(A, b, { termClass: rowTone, bClass: rowTone }),
            },
            {
              label: "행렬 형태 Ax = b",
              tex: matrixTex(A, [x, y], b, { cellClass: rowTone, bClass: rowTone, xClass: () => "tx-b" }),
            },
        ]}
      />
    </div>
  );
}
