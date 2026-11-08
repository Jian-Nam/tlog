"use client";

import { Line } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { FormulaPair } from "./FormulaPair";
import { TONE, augTex, equationsTex } from "./latex";
import { Label3D, Plane3D, Point3D, Scene3D, planeIntersection, usePalette, type V3 } from "./scene3d";

type Row = [number, number, number, number]; // [a, b, c | d]

const R1: Row = [1, 2, 1, 2];
const R2: Row = [3, 8, 1, 12];
const R3_OK: Row = [0, 4, 1, 2];
// a₃₃ 이 −4 이면 마지막 피벗 자리가 0 이 되고, 우변은 0 = −10 → 해 없음
const R3_FAIL: Row = [0, 4, -4, 2];
const SOL: V3 = [2, 1, -2];

const L21 = 3;
const L32 = 2;
const sub = (r: Row, k: number, p: Row): Row => r.map((v, i) => v - k * p[i]) as Row;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const rowTone = (i: number) => TONE[i];

/** t ∈ [0, 2]: 0 = A, 1 = 2행에서 3×1행을 뺀 뒤, 2 = 3행에서 2×(새 2행)을 뺀 뒤 (= U) */
function rowsAt(t: number, r3: Row): [Row, Row, Row] {
  const r2 = sub(R2, L21 * clamp01(t), R1);
  const r2done = sub(R2, L21, R1);
  const r3t = sub(r3, L32 * clamp01(t - 1), r2done);
  return [R1, r2, r3t];
}

const STEPS = ["처음: A", "1단계: 2행 − 3 × 1행", "2단계: 3행 − 2 × 2행"];
const AUG_LABEL = ["[A\\,|\\,b]", "E_{21}[A\\,|\\,b]", "E_{32}E_{21}[A\\,|\\,b] = [U\\,|\\,c]"];

/**
 * 소거 단계를 고르면 평면이 회전하며 바뀜 (애니메이션).
 * 식을 빼서 만든 새 평면도 원래 두 평면의 교선을 지나므로, 세 평면이 만나는 점은 그대로.
 * fail: 마지막 피벗이 0 이 되는 경우. 3행이 0 = −10 이 되어 평면이 무한히 멀어짐.
 */
export default function Elimination3D({ fail = false }: { fail?: boolean }) {
  const pal = usePalette();
  const colors = [pal.c1, pal.c2, pal.c3];
  const r3 = fail ? R3_FAIL : R3_OK;
  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);
  const tRef = useRef(0);

  // 선택한 단계까지 t 를 부드럽게 움직임
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const cur = tRef.current;
      const dir = Math.sign(step - cur);
      const next = dir === 0 ? cur : dir > 0 ? Math.min(step, cur + dt * 1.4) : Math.max(step, cur - dt * 1.4);
      tRef.current = next;
      setT(next);
      if (next !== step) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const live = rowsAt(t, r3);
  // 계수가 0 에 가까워지면 평면이 무한히 멀어짐 → 화면 밖이면 그리지 않음
  const visible = live.map((r) => {
    const len = Math.hypot(r[0], r[1], r[2]);
    return len > 1e-6 && Math.abs(r[3]) / len < 7;
  });
  const shown = rowsAt(step, r3); // 수식은 선택한 단계의 값
  const A = shown.map((r) => r.slice(0, 3));
  const b = shown.map((r) => r[3]);
  const lastZero = fail && step === 2;

  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];

  return (
    <div className="space-y-4">
      <Scene3D palette={pal} camera={[10, -10, 5]}>
        {live.map((r, i) =>
          visible[i] ? <Plane3D key={i} n={[r[0], r[1], r[2]]} d={r[3]} color={colors[i]} size={7} opacity={0.26} /> : null,
        )}
        {pairs.map(([i, j]) => {
          if (!visible[i] || !visible[j]) return null;
          const ri = live[i],
            rj = live[j];
          const seg = planeIntersection([ri[0], ri[1], ri[2]], ri[3], [rj[0], rj[1], rj[2]], rj[3], 7);
          return seg ? <Line key={`${i}${j}`} points={seg} color={pal.fg} lineWidth={2} transparent opacity={0.45} /> : null;
        })}
        {!fail ? (
          <>
            <Point3D p={SOL} color={pal.cb} />
            <Label3D position={[SOL[0] + 0.3, SOL[1], SOL[2] - 0.45]} color={pal.cb}>
              (2, 1, −2)
            </Label3D>
          </>
        ) : null}
      </Scene3D>

      <div className="flex flex-wrap justify-center gap-2">
        {STEPS.map((s, i) => (
          <Button key={s} active={step === i} onClick={() => setStep(i)}>
            {s}
          </Button>
        ))}
      </div>

      <FormulaPair
        layout="row"
        items={[
          {
            label: "방정식",
            tex: equationsTex(A, b, { termClass: rowTone, bClass: rowTone, zero: "dim", one: "dim", tpl: "-00" }),
          },
          {
            label: "첨가행렬 (테두리 = 피벗)",
            tex: `\\underbrace{${augTex(A, b, {
              rowClass: rowTone,
              pivot: (i, j) => i === j && i <= step && A[i][j] !== 0,
            })}}_{${AUG_LABEL[step]}}`,
          },
        ]}
      />
      {lastZero ? (
        <p className="!my-0 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
          <strong style={{ color: pal.cb }}>세 번째 피벗 자리가 0.</strong> 마지막 식이{" "}
          <span className="font-mono">0 = −10</span>이 되었습니다. 이 식을 만족하는 점은 없으므로 연립방정식의 해도
          없습니다. 초록 평면은 계수가 0으로 줄어들면서 무한히 멀리 밀려나 사라졌습니다.
        </p>
      ) : null}
    </div>
  );
}
