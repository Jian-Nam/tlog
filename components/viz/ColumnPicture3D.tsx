"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { Slider, fmt } from "@/components/ui";
import {
  Arrow3D,
  Label3D,
  Plane3D,
  Point3D,
  Scene3D,
  add,
  cross,
  dot,
  scale,
  solve3,
  usePalette,
  type V3,
} from "./scene3d";

const A1: V3 = [2, -1, 0];
const A2: V3 = [-1, 2, -3];
const A3_OK: V3 = [0, -1, 4];
const A3_SINGULAR: V3 = add(A1, A2); // [1, 1, -3]

/**
 * b 만 조작 → 계수 x, y, z 가 자동으로 계산되어 x·a₁ + y·a₂ + z·a₃ 화살표가 그려짐.
 * singular: a₃ = a₁ + a₂ 인 경우. 해가 없으면 평면 위에서 b에 가장 가까운 점까지만 그림.
 */
export default function ColumnPicture3D({ singular = false }: { singular?: boolean }) {
  const pal = usePalette();
  const [b, setB] = useState<V3>([0, -1, 4]);
  const a3 = singular ? A3_SINGULAR : A3_OK;

  let coef: V3;
  let reach: V3;
  if (!singular) {
    const rows: [V3, V3, V3] = [
      [A1[0], A2[0], a3[0]],
      [A1[1], A2[1], a3[1]],
      [A1[2], A2[2], a3[2]],
    ];
    coef = solve3(rows, b)!;
    reach = b;
  } else {
    // a₁, a₂ 평면으로 b 를 투영 (정규방정식 2x2)
    const g11 = dot(A1, A1),
      g12 = dot(A1, A2),
      g22 = dot(A2, A2);
    const r1 = dot(A1, b),
      r2 = dot(A2, b);
    const D = g11 * g22 - g12 * g12;
    const s = (r1 * g22 - g12 * r2) / D;
    const t = (g11 * r2 - g12 * r1) / D;
    coef = [s, t, 0];
    reach = add(scale(A1, s), scale(A2, t));
  }
  const p1 = scale(A1, coef[0]);
  const p2 = add(p1, scale(A2, coef[1]));
  const gap = Math.hypot(b[0] - reach[0], b[1] - reach[1], b[2] - reach[2]);
  const reachable = gap < 0.05;

  const setBi = (i: number) => (v: number) => setB((p) => p.map((x, j) => (j === i ? v : x)) as V3);

  return (
    <div className="space-y-4">
      <Scene3D palette={pal} camera={[10, -10, 6]}>
        {singular ? <Plane3D n={cross(A1, A2)} d={0} color={pal.muted} size={10} opacity={0.18} /> : null}
        <Arrow3D to={A1} color={pal.c1} opacity={0.3} radius={0.03} />
        <Arrow3D to={A2} color={pal.c2} opacity={0.3} radius={0.03} />
        <Arrow3D to={a3} color={pal.c3} opacity={0.3} radius={0.03} />
        <Arrow3D to={p1} color={pal.c1} />
        <Arrow3D from={p1} to={p2} color={pal.c2} />
        {!singular ? <Arrow3D from={p2} to={b} color={pal.c3} /> : null}
        {singular && !reachable ? (
          <Line points={[reach, b]} color={pal.cb} lineWidth={2} dashed dashSize={0.15} gapSize={0.1} />
        ) : null}
        <Point3D p={b} color={pal.cb} r={0.14} />
        <Label3D position={[b[0] - 0.5, b[1], b[2] + 0.1]} color={pal.cb}>
          b
        </Label3D>
        <Label3D position={add(A1, [0.25, 0, 0.25])} color={pal.c1}>
          a₁
        </Label3D>
        <Label3D position={add(A2, [0.25, 0, 0.25])} color={pal.c2}>
          a₂
        </Label3D>
        <Label3D position={add(a3, [0.25, 0, 0.25])} color={pal.c3}>
          a₃
        </Label3D>
      </Scene3D>

      <div className="grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-1.5">
          <Slider label="b₁" value={b[0]} onChange={setBi(0)} min={-4} max={4} color={pal.cb} />
          <Slider label="b₂" value={b[1]} onChange={setBi(1)} min={-4} max={4} color={pal.cb} />
          <Slider label="b₃" value={b[2]} onChange={setBi(2)} min={-4} max={4} color={pal.cb} />
        </div>
        <div className="rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
          {!singular ? (
            <div className="font-mono">
              <span style={{ color: pal.c1 }}>x = {fmt(coef[0])}</span>
              <br />
              <span style={{ color: pal.c2 }}>y = {fmt(coef[1])}</span>
              <br />
              <span style={{ color: pal.c3 }}>z = {fmt(coef[2])}</span>
            </div>
          ) : reachable ? (
            <>b가 회색 평면 위에 있습니다. 도달할 수 있지만, 방법이 무수히 많습니다.</>
          ) : (
            <>
              <strong style={{ color: pal.cb }}>도달 불가.</strong> 조합은 회색 평면을 벗어날 수 없어, b와{" "}
              <span className="font-mono">{fmt(gap)}</span>만큼 떨어진 점까지만 갈 수 있습니다.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
