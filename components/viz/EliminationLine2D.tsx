"use client";

import { useRef, useState } from "react";
import { fmt } from "@/components/ui";
import { FormulaPair } from "./FormulaPair";
import { slot } from "./latex";
import { Dot, Label, LineEq, Plane2D, clientToMath, useView, type V2, type View } from "./plane2d";

// x + 2y = 4,  3x + 8y = 14  → 해 (2, 1)
const R1 = [1, 2, 4];
const R2 = [3, 8, 14];
const SOL: V2 = [2, 1];
const L_MAX = 9.9;
// ℓ ∈ [−9.9, 9.9] 이면 새 2행의 계수는 |3−ℓ| ≤ 12.9, |8−2ℓ| ≤ 27.8, |14−4ℓ| ≤ 53.6 → 두 자리 정수 + 소수 한 자리
const TPL = "-00.0";
const f1 = (v: number) => fmt(v, 1);
const c2 = (s: string) => `\\htmlClass{tx-c2}{${s}}`;
const c1 = (s: string) => `\\htmlClass{tx-c1}{${s}}`;

/** 새 2행 = 2행 − ℓ·1행 */
const newRow = (l: number) => R2.map((v, k) => v - l * R1[k]);

/**
 * 해를 지나는 직선만 가능하므로, 직선 2를 잡고 끌면 해를 중심으로 회전.
 * 포인터 방향 d 에 대해 (R2 − ℓR1)·d = 0 이 되는 ℓ 을 구함.
 */
function RotatingLine({ view, l, onChange }: { view: View; l: number; onChange: (l: number) => void }) {
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const active = hover || dragging;
  const live = useRef(false);
  const [a, b] = newRow(l);
  const n = Math.hypot(a, b);
  const d: V2 = [-b / n, a / n];
  const L = view.R * 3;
  const ends = {
    x1: view.sx(SOL[0] - d[0] * L),
    y1: view.sy(SOL[1] - d[1] * L),
    x2: view.sx(SOL[0] + d[0] * L),
    y2: view.sy(SOL[1] + d[1] * L),
  };

  const move = (e: React.PointerEvent<SVGLineElement>) => {
    const q = clientToMath(e.currentTarget.ownerSVGElement!, view, e.clientX, e.clientY);
    const dx = q[0] - SOL[0],
      dy = q[1] - SOL[1];
    if (Math.hypot(dx, dy) < 0.3) return; // 중심 근처에서는 방향이 불안정
    const den = R1[0] * dx + R1[1] * dy;
    const num = R2[0] * dx + R2[1] * dy;
    let next = Math.abs(den) < 1e-9 ? Math.sign(num) * L_MAX : num / den;
    next = Math.max(-L_MAX, Math.min(L_MAX, Math.round(next * 10) / 10));
    if (Math.abs(next - 3) < 0.25) next = 3; // x 가 사라지는 지점에 달라붙음
    onChange(next);
  };

  return (
    <g>
      <line {...ends} stroke="var(--c2)" strokeWidth={active ? 4.5 : 2.5} strokeLinecap="round" />
      <line
        {...ends}
        stroke="transparent"
        strokeWidth={22}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          live.current = true;
          setDragging(true);
        }}
        onPointerMove={(e) => live.current && move(e)}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          live.current = false;
          setDragging(false);
        }}
      />
    </g>
  );
}

/** 2행에서 1행의 ℓ배를 빼면 직선 2가 해를 중심으로 돈다. ℓ = 3 이면 x 가 사라짐 */
export default function EliminationLine2D() {
  const [l, setL] = useState(0);
  const view = useView(5, 420);
  const [a, b, c] = newRow(l);

  const eqTex = [
    `\\begin{alignedat}{3}`,
    `${c1(`${slot("\\htmlClass{tx-dim}{1}", TPL)}x`)} & {}${c1("+")}{} & ${c1(`${slot("2", TPL.slice(1))}y`)} & {}={} & ${c1(slot("4", TPL))} \\\\[3pt]`,
    `${c2(`${slot(f1(a), TPL)}x`)} & {}${c2(b < 0 ? "-" : "+")}{} & ${c2(`${slot(f1(Math.abs(b)), TPL.slice(1))}y`)} & {}={} & ${c2(slot(f1(c), TPL))}`,
    `\\end{alignedat}`,
  ].join(" ");
  // E 의 j열 숫자는 A 의 j행에 곱해짐 → 열마다 행 색
  const E = `\\begin{bmatrix} ${c1(slot("1", TPL))} & ${c2("0")} \\\\ ${c1(slot(f1(-l), TPL))} & ${c2("1")} \\end{bmatrix}`;
  const aug = (r1: number[], r2: number[], tpl: string) =>
    `\\left[\\begin{array}{rr|r} ${r1.map((v) => c1(slot(f1(v), tpl))).join(" & ")} \\\\ ${r2.map((v) => c2(slot(f1(v), tpl))).join(" & ")} \\end{array}\\right]`;
  const matTex = `\\underbrace{${E}}_{E}\\,${aug(R1, R2, "00")} = ${aug(R1, [a, b, c], TPL)}`;

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-[480px] touch-none rounded-lg border border-border">
        <Plane2D view={view}>
          <g opacity={0.35} pointerEvents="none" strokeDasharray="6 6">
            <LineEq view={view} a={R2[0]} b={R2[1]} c={R2[2]} color="var(--c2)" width={2} />
          </g>
          <g pointerEvents="none">
            <LineEq view={view} a={R1[0]} b={R1[1]} c={R1[2]} color="var(--c1)" />
          </g>
          <RotatingLine view={view} l={l} onChange={setL} />
          <g pointerEvents="none">
            <Dot view={view} p={SOL} color="var(--cb)" r={6} />
            <Label view={view} p={SOL} color="var(--cb)" dx={10} dy={18}>
              (2, 1)
            </Label>
          </g>
        </Plane2D>
      </div>

      <p className="!my-0 text-center text-sm text-muted">
        {l === 3 ? (
          <>
            <span className="font-semibold text-c2">ℓ = 3</span>: x가 사라졌습니다. 두 번째 식만으로 y = 1.
          </>
        ) : (
          <>
            주황 직선을 잡고 돌려 보세요. 지금 <span className="font-mono">ℓ = {f1(l)}</span>
          </>
        )}
      </p>
      <FormulaPair
        layout="stack"
        items={[
          { label: "방정식: 2행 ← 2행 − ℓ × 1행", tex: eqTex },
          { label: "행렬 형태: 소거 행렬 E를 왼쪽에 곱함", tex: matTex },
        ]}
      />
    </div>
  );
}
