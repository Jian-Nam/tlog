"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { fmt } from "@/components/ui";
import { FormulaPair } from "./FormulaPair";
import { TONE, equationsTex, matrixTex } from "./latex";
import { DraggablePlane, Label3D, Point3D, Scene3D, planeIntersection, solve3, usePalette, type V3 } from "./scene3d";

const ROWS: [V3, V3, V3] = [
  [2, -1, 0],
  [-1, 2, -1],
  [0, -3, 4],
];
const rowTone = (i: number) => TONE[i];
const PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
];

/** A 고정. 평면을 잡고 끌면 법선 방향으로 평행이동(b 변경) → 교점(해)이 자동으로 따라감 */
export default function RowPicture3D() {
  const pal = usePalette();
  const [b, setB] = useState<V3>([0, -1, 4]);
  const colors = [pal.c1, pal.c2, pal.c3];
  const sol = solve3(ROWS, b)!;

  const setBi = (i: number) => (v: number) => setB((p) => p.map((x, j) => (j === i ? v : x)) as V3);

  return (
    <div className="space-y-4">
      <Scene3D palette={pal} camera={[9, -11, 7]}>
        {ROWS.map((r, i) => (
          <DraggablePlane key={i} n={r} d={b[i]} color={colors[i]} onChange={setBi(i)} />
        ))}
        {PAIRS.map(([i, j]) => {
          const seg = planeIntersection(ROWS[i], b[i], ROWS[j], b[j], 7);
          return seg ? <Line key={`${i}${j}`} points={seg} color={pal.fg} lineWidth={2} transparent opacity={0.5} /> : null;
        })}
        <Point3D p={sol} color={pal.cb} />
        <Label3D position={[sol[0] + 0.3, sol[1], sol[2] + 0.45]} color={pal.cb}>
          ({fmt(sol[0])}, {fmt(sol[1])}, {fmt(sol[2])})
        </Label3D>
      </Scene3D>

      <p className="!my-0 text-sm text-muted">평면을 잡고 끌면 평행이동합니다. 빈 곳을 끌면 회전합니다.</p>
      <FormulaPair
        layout="row"
        items={[
          { label: "방정식 (행마다 평면 하나)", tex: equationsTex(ROWS, b, { termClass: rowTone, bClass: rowTone }) },
          {
            label: "행렬 형태 Ax = b",
            tex: matrixTex(ROWS, sol, b, { cellClass: rowTone, bClass: rowTone, xClass: () => "tx-b" }),
          },
        ]}
      />
    </div>
  );
}
