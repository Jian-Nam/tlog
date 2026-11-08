"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Slider, fmt } from "@/components/ui";
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

const MODES = {
  lecture: {
    name: "강의 예제",
    cols: [
      [2, -1, 0],
      [-1, 2, -3],
      [0, -1, 4],
    ] as [V3, V3, V3],
  },
  singular: {
    name: "특이 (a₃ = a₁ + a₂)",
    cols: [
      [2, -1, 0],
      [-1, 2, -3],
      [1, 1, -3],
    ] as [V3, V3, V3],
  },
};

export default function ColumnPicture3D() {
  const pal = usePalette();
  const [mode, setMode] = useState<keyof typeof MODES>("lecture");
  const [c, setC] = useState<V3>([0.5, 0.5, 0.5]);
  const [b, setB] = useState<V3>([0, -1, 4]);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const [a1, a2, a3] = MODES[mode].cols;
  const p1 = scale(a1, c[0]);
  const p2 = add(p1, scale(a2, c[1]));
  const p3 = add(p2, scale(a3, c[2]));
  // 행 형태로 바꿔 풀기 (A의 행 = 열들의 i번째 성분)
  const rows: [V3, V3, V3] = [
    [a1[0], a2[0], a3[0]],
    [a1[1], a2[1], a3[1]],
    [a1[2], a2[2], a3[2]],
  ];
  const sol = solve3(rows, b);
  const err = Math.hypot(p3[0] - b[0], p3[1] - b[1], p3[2] - b[2]);
  const spanN = cross(a1, a2);

  const animateTo = (t: V3) => {
    cancelAnimationFrame(raf.current);
    const s = [...c] as V3,
      t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      const e = 1 - (1 - k) ** 3;
      setC([s[0] + (t[0] - s[0]) * e, s[1] + (t[1] - s[1]) * e, s[2] + (t[2] - s[2]) * e]);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const setCi = (i: number) => (v: number) => setC((p) => p.map((x, j) => (j === i ? v : x)) as V3);

  return (
    <div className="space-y-4">
      <Scene3D palette={pal} camera={[7, -7, 4]}>
        {mode === "singular" ? <Plane3D n={spanN} d={0} color={pal.muted} size={10} opacity={0.18} /> : null}
        <Arrow3D to={a1} color={pal.c1} opacity={0.3} radius={0.03} />
        <Arrow3D to={a2} color={pal.c2} opacity={0.3} radius={0.03} />
        <Arrow3D to={a3} color={pal.c3} opacity={0.3} radius={0.03} />
        <Arrow3D to={p1} color={pal.c1} />
        <Arrow3D from={p1} to={p2} color={pal.c2} />
        <Arrow3D from={p2} to={p3} color={pal.c3} />
        <Point3D p={b} color={pal.cb} r={0.14} />
        <Label3D position={[b[0] - 0.5, b[1], b[2] + 0.1]} color={pal.cb}>
          b
        </Label3D>
        <Label3D position={add(a1, [0.25, 0, 0.25])} color={pal.c1}>
          a₁
        </Label3D>
        <Label3D position={add(a2, [0.25, 0, 0.25])} color={pal.c2}>
          a₂
        </Label3D>
        <Label3D position={add(a3, [0.25, 0, 0.25])} color={pal.c3}>
          a₃
        </Label3D>
      </Scene3D>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Slider label="x" value={c[0]} onChange={setCi(0)} min={-2} max={2} step={0.05} color={pal.c1} />
          <Slider label="y" value={c[1]} onChange={setCi(1)} min={-2} max={2} step={0.05} color={pal.c2} />
          <Slider label="z" value={c[2]} onChange={setCi(2)} min={-2} max={2} step={0.05} color={pal.c3} />
          <div className="flex flex-wrap gap-1.5 pt-2">
            <Button onClick={() => sol && animateTo(sol)}>해 찾기</Button>
            <Button
              onClick={() => {
                const r = () => Math.round((Math.random() * 6 - 3) * 2) / 2;
                setB([r(), r(), r()]);
              }}
            >
              b 무작위
            </Button>
            <Button onClick={() => setB([0, -1, 4])}>b = 강의 예제</Button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(MODES).map(([k, m]) => (
              <Button key={k} active={mode === k} onClick={() => setMode(k as keyof typeof MODES)}>
                {m.name}
              </Button>
            ))}
          </div>
          <div className="rounded-lg bg-surface-2 p-3 leading-relaxed">
            <div className="font-mono text-[13px]">
              {fmt(c[0])}·a₁ + {fmt(c[1])}·a₂ + {fmt(c[2])}·a₃ = ({fmt(p3[0])}, {fmt(p3[1])}, {fmt(p3[2])})
            </div>
            <div className="mt-1 text-muted">
              b = ({fmt(b[0])}, {fmt(b[1])}, {fmt(b[2])}) · 거리 {fmt(err)}
            </div>
            <div className="mt-2">
              {sol ? (
                err < 0.08 ? (
                  <strong style={{ color: pal.cb }}>도착! 세 열의 조합으로 b를 만들었습니다.</strong>
                ) : (
                  <>세 열이 공간 전체를 채우므로 어떤 b든 도달할 수 있습니다.</>
                )
              ) : Math.abs(dot(spanN, b)) < 1e-6 ? (
                <>b가 회색 평면 위에 있어 도달은 가능하지만, 방법이 무수히 많습니다.</>
              ) : (
                <>
                  세 열이 <strong>한 평면(회색)</strong> 위에 있습니다. 평면 밖의 b에는 어떤 조합으로도 닿을 수
                  없습니다.
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
