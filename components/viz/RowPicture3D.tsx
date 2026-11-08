"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Slider, fmt } from "@/components/ui";
import { Label3D, Plane3D, Point3D, Scene3D, planeIntersection, solve3, usePalette, type V3 } from "./scene3d";

const ROWS: [V3, V3, V3] = [
  [2, -1, 0],
  [-1, 2, -1],
  [0, -3, 4],
];
const EQ = ["2x - y", "-x + 2y - z", "-3y + 4z"];
const PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
];

/** A 고정, b 만 조작 → 세 평면이 평행이동하며 교점(해)이 자동으로 따라감 */
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
          <Plane3D key={i} n={r} d={b[i]} color={colors[i]} size={6.5} opacity={0.3} />
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

      <div className="grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-2">
          {EQ.map((e, i) => (
            <div key={i} className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-2 text-sm">
              <span style={{ color: colors[i] }}>
                <Tex>{`${e} = ${fmt(b[i])}`}</Tex>
              </span>
              <Slider label={`b${"₁₂₃"[i]}`} value={b[i]} onChange={setBi(i)} min={-4} max={4} color={colors[i]} />
            </div>
          ))}
        </div>
        <div className="flex items-center rounded-lg bg-surface-2 p-3 font-mono text-sm" style={{ color: pal.cb }}>
          해 (x, y, z) =
          <br />({fmt(sol[0])}, {fmt(sol[1])}, {fmt(sol[2])})
        </div>
      </div>
    </div>
  );
}
