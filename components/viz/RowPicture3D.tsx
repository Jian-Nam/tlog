"use client";

import { Line } from "@react-three/drei";
import { useState } from "react";
import { Tex } from "@/components/Tex";
import { Button, Slider, fmt } from "@/components/ui";
import { Label3D, Plane3D, Point3D, Scene3D, planeIntersection, solve3, usePalette, type V3 } from "./scene3d";

const SYSTEMS = {
  lecture: {
    name: "강의 예제",
    rows: [
      [2, -1, 0],
      [-1, 2, -1],
      [0, -3, 4],
    ] as [V3, V3, V3],
    b: [0, -1, 4] as V3,
  },
  singular: {
    name: "특이 (3행 = 1행 + 2행)",
    rows: [
      [2, -1, 0],
      [-1, 2, -1],
      [1, 1, -1],
    ] as [V3, V3, V3],
    b: [0, -1, 1] as V3,
  },
};

const term = (c: number, v: string, first: boolean) => {
  if (c === 0) return "";
  const s = Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`;
  if (first) return c < 0 ? `-${s}` : s;
  return c < 0 ? ` - ${s}` : ` + ${s}`;
};
const eqTex = (r: V3, b: number) => {
  let out = "";
  (["x", "y", "z"] as const).forEach((v, i) => {
    out += term(r[i], v, out === "");
  });
  return `${out} = ${fmt(b)}`;
};

export default function RowPicture3D() {
  const pal = usePalette();
  const [sys, setSys] = useState<keyof typeof SYSTEMS>("lecture");
  const [b, setB] = useState<V3>([...SYSTEMS.lecture.b]);
  const [show, setShow] = useState([true, true, true]);
  const [lines, setLines] = useState(true);

  const rows = SYSTEMS[sys].rows;
  const colors = [pal.c1, pal.c2, pal.c3];
  const sol = solve3(rows, b);

  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];

  const setBi = (i: number) => (v: number) => setB((p) => p.map((x, j) => (j === i ? v : x)) as V3);

  return (
    <div className="space-y-4">
      <Scene3D palette={pal} camera={[9, -11, 7]}>
        {rows.map((r, i) =>
          show[i] ? <Plane3D key={`${sys}-${i}`} n={r} d={b[i]} color={colors[i]} size={6.5} opacity={0.3} /> : null,
        )}
        {lines &&
          pairs.map(([i, j]) => {
            if (!show[i] || !show[j]) return null;
            const seg = planeIntersection(rows[i], b[i], rows[j], b[j], 7);
            return seg ? <Line key={`${i}${j}`} points={seg} color={pal.fg} lineWidth={2} transparent opacity={0.55} /> : null;
          })}
        {sol ? (
          <>
            <Point3D p={sol} color={pal.cb} />
            <Label3D position={[sol[0] + 0.3, sol[1], sol[2] + 0.45]} color={pal.cb}>
              ({fmt(sol[0])}, {fmt(sol[1])}, {fmt(sol[2])})
            </Label3D>
          </>
        ) : null}
      </Scene3D>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShow((s) => s.map((v, j) => (j === i ? !v : v)))}
                className="h-4 w-4 shrink-0 rounded border-2"
                style={{ borderColor: colors[i], background: show[i] ? colors[i] : "transparent" }}
                aria-label={`${i + 1}번 평면 보이기`}
              />
              <span style={{ color: colors[i] }}>
                <Tex>{eqTex(r, b[i])}</Tex>
              </span>
            </div>
          ))}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(SYSTEMS).map(([k, s]) => (
              <Button
                key={k}
                active={sys === k}
                onClick={() => {
                  setSys(k as keyof typeof SYSTEMS);
                  setB([...s.b]);
                }}
              >
                {s.name}
              </Button>
            ))}
            <Button active={lines} onClick={() => setLines((v) => !v)}>
              교선 보기
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Slider label="b₁" value={b[0]} onChange={setBi(0)} min={-4} max={4} color={pal.c1} />
          <Slider label="b₂" value={b[1]} onChange={setBi(1)} min={-4} max={4} color={pal.c2} />
          <Slider label="b₃" value={b[2]} onChange={setBi(2)} min={-4} max={4} color={pal.c3} />
          <p className="pt-1 text-[13px] leading-relaxed text-muted">
            {sol
              ? "세 평면이 정확히 한 점에서 만납니다. b를 바꾸면 평면이 평행이동하고 교점도 따라 움직입니다."
              : "세 교선이 서로 평행합니다. b₃ = b₁ + b₂ 일 때만 세 평면이 한 직선을 공유(해 무수히)하고, 그 외에는 공통점이 없습니다."}
          </p>
        </div>
      </div>
    </div>
  );
}
