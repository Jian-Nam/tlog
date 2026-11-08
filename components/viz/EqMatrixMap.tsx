"use client";

import { useEffect, useRef, useState } from "react";
import { Tex } from "@/components/Tex";
import { fmt } from "@/components/ui";

const COL = ["tx-c1", "tx-c2", "tx-c3"];
const ORD = ["1", "2", "3"];

/**
 * 연립방정식 ↔ 행렬 형태 Ax = b 대응도.
 * - 색: j번째 미지수의 계수 = A의 j열 = x의 j번째 성분 (같은 색), 우변 = b (분홍)
 * - 생략된 계수 1, 빠진 항(계수 0)도 흐리게 드러내서 행렬 칸과 1:1 로 대응
 * - 마우스를 올리면(모바일: 탭) 짝이 되는 요소가 양쪽에서 함께 강조됨
 */
export default function EqMatrixMap({
  A,
  b,
  vars = ["x", "y", "z"],
}: {
  A: number[][];
  b: number[];
  vars?: string[];
}) {
  const n = A[0].length;
  const v = vars.slice(0, n);
  const [key, setKey] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.classList.toggle("has-on", key !== null);
    el.querySelectorAll<HTMLElement>("[data-k]").forEach((s) => s.classList.toggle("is-on", s.dataset.k === key));
  }, [key]);

  // ---------- 방정식 ----------
  const term = (i: number, j: number) => {
    const a = A[i][j];
    const first = j === 0;
    const sign = a < 0 ? "-" : first ? "" : "+";
    const abs = Math.abs(a);
    const mag = abs === 1 ? "\\htmlClass{tx-dim}{1}" : fmt(abs);
    const coef = `\\htmlData{k=a-${i}-${j}}{${sign}${first ? "" : "\\,"}${mag}}`;
    const body = `\\htmlClass{${COL[j]}}{${coef}\\htmlData{k=x-${j}}{${v[j]}}}`;
    return a === 0 ? `\\htmlClass{tx-dim}{${body}}` : body;
  };
  const eqRows = A.map(
    (_, i) =>
      `${A[i].map((__, j) => term(i, j)).join(" & ")} & = & \\htmlClass{tx-b}{\\htmlData{k=b-${i}}{${fmt(b[i])}}}`,
  );
  const eqTex = `\\begin{array}{${"r".repeat(n)}cl} ${eqRows.join(" \\\\[2pt] ")} \\end{array}`;

  // ---------- 행렬 형태 ----------
  const mA = A.map((row, i) =>
    row.map((a, j) => `\\htmlClass{${COL[j]}}{\\htmlData{k=a-${i}-${j}}{${fmt(a)}}}`).join(" & "),
  ).join(" \\\\ ");
  const mx = v.map((name, j) => `\\htmlClass{${COL[j]}}{\\htmlData{k=x-${j}}{${name}}}`).join(" \\\\ ");
  const mb = b.map((val, i) => `\\htmlClass{tx-b}{\\htmlData{k=b-${i}}{${fmt(val)}}}`).join(" \\\\ ");
  const matTex = `\\underbrace{\\begin{bmatrix} ${mA} \\end{bmatrix}}_{A}\\underbrace{\\begin{bmatrix} ${mx} \\end{bmatrix}}_{\\mathbf{x}} = \\underbrace{\\begin{bmatrix} ${mb} \\end{bmatrix}}_{b}`;

  // ---------- 설명 ----------
  let info: React.ReactNode = (
    <span className="text-muted">
      숫자나 문자에 마우스를 올리면 (모바일은 탭) 짝이 되는 위치가 양쪽에서 함께 강조됩니다.
    </span>
  );
  if (key) {
    const [kind, p, q] = key.split("-");
    const i = Number(p),
      j = Number(q);
    if (kind === "a") {
      const a = A[i][j];
      info = (
        <>
          <strong className={COL[j]}>{fmt(a)}</strong> — {ORD[i]}번째 방정식의 <em>{v[j]}</em> 계수 → A의{" "}
          <strong>
            {ORD[i]}행 {ORD[j]}열
          </strong>
          {Math.abs(a) === 1 ? <span className="text-muted"> (식에서는 1을 생략해서 씁니다)</span> : null}
          {a === 0 ? <span className="text-muted"> (식에 보이지 않던 항이 행렬에서는 0으로 들어갑니다)</span> : null}
        </>
      );
    } else if (kind === "x") {
      info = (
        <>
          <strong className={COL[i]}>{v[i]}</strong> — 미지수. 모든 방정식에서 같은 자리에 있고, <strong>x</strong>의{" "}
          {ORD[i]}번째 성분이 됩니다. A의 <strong className={COL[i]}>{ORD[i]}열 전체</strong>에 곱해집니다.
        </>
      );
    } else {
      info = (
        <>
          <strong className="tx-b">{fmt(b[i])}</strong> — {ORD[i]}번째 방정식의 우변 → <strong>b</strong>의 {ORD[i]}
          번째 성분
        </>
      );
    }
  }

  return (
    <div
      ref={root}
      className="eqmap my-6 rounded-xl border border-border bg-surface px-3 py-2"
      onPointerOver={(e) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>("[data-k]");
        setKey(t?.dataset.k ?? null);
      }}
      onPointerLeave={() => setKey(null)}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6">
        <div className="min-w-0 max-w-full">
          <Tex block>{eqTex}</Tex>
        </div>
        <div className="text-xl text-muted">⟺</div>
        <div className="min-w-0 max-w-full">
          <Tex block>{matTex}</Tex>
        </div>
      </div>
      <div className="min-h-[3.2em] border-t border-border px-1 pt-2 text-sm leading-relaxed">{info}</div>
    </div>
  );
}
