"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { Tex } from "@/components/Tex";
import { fmt } from "@/components/ui";
import { DraggablePlane, Label3D, Point3D, Scene3D, planeIntersection, solve3, usePalette, type V3 } from "./scene3d";

const ROWS: [V3, V3, V3] = [
  [2, -1, 0],
  [-1, 2, -1],
  [0, -3, 4],
];
const EQ = ["2x - y", "-x + 2y - z", "-3y + 4z"];
const COLS = ["tx-c1", "tx-c2", "tx-c3"];
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

      <div className="grid items-center gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="eq-tight space-y-1 text-sm">
          <p className="!mb-2 !mt-0 text-muted">평면을 잡고 끌면 평행이동합니다. 빈 곳을 끌면 회전합니다.</p>
          {EQ.map((e, i) => (
            <div key={i} className={COLS[i]}>
              <Tex block>{`${e} = ${fmt(b[i])}`}</Tex>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-surface-2 p-3 font-mono text-sm" style={{ color: pal.cb }}>
          해 (x, y, z) =
          <br />({fmt(sol[0])}, {fmt(sol[1])}, {fmt(sol[2])})
        </div>
      </div>
    </div>
  );
}
