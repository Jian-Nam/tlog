import { Tex } from "@/components/Tex";
import { fmt } from "@/components/ui";

const COL = ["tx-c1", "tx-c2", "tx-c3"];

/**
 * 연립방정식 ↔ 행렬 형태 Ax = b 대응도 (색으로만 표시).
 * - j번째 미지수의 계수 = A의 j열 = x의 j번째 성분 (같은 색), 우변 = b (분홍)
 * - 생략된 계수 1, 빠진 항(계수 0)도 흐리게 드러내서 행렬 칸과 1:1 로 대응
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

  const term = (i: number, j: number) => {
    const a = A[i][j];
    const first = j === 0;
    const sign = a < 0 ? "-" : first ? "" : "+";
    const abs = Math.abs(a);
    const mag = abs === 1 ? "\\htmlClass{tx-dim}{1}" : fmt(abs);
    const body = `\\htmlClass{${COL[j]}}{${sign}${first ? "" : "\\,"}${mag}${v[j]}}`;
    return a === 0 ? `\\htmlClass{tx-dim}{${body}}` : body;
  };
  const eqRows = A.map(
    (_, i) => `${A[i].map((__, j) => term(i, j)).join(" & ")} & = & \\htmlClass{tx-b}{${fmt(b[i])}}`,
  );
  const eqTex = `\\begin{array}{${"r".repeat(n)}cl} ${eqRows.join(" \\\\[2pt] ")} \\end{array}`;

  const mA = A.map((row) => row.map((a, j) => `\\htmlClass{${COL[j]}}{${fmt(a)}}`).join(" & ")).join(" \\\\ ");
  const mx = v.map((name, j) => `\\htmlClass{${COL[j]}}{${name}}`).join(" \\\\ ");
  const mb = b.map((val) => `\\htmlClass{tx-b}{${fmt(val)}}`).join(" \\\\ ");
  const matTex = `\\underbrace{\\begin{bmatrix} ${mA} \\end{bmatrix}}_{A}\\underbrace{\\begin{bmatrix} ${mx} \\end{bmatrix}}_{\\mathbf{x}} = \\underbrace{\\begin{bmatrix} ${mb} \\end{bmatrix}}_{b}`;

  return (
    <div className="my-6 flex flex-wrap items-center justify-center gap-x-6 rounded-xl border border-border bg-surface px-3 py-1">
      <div className="min-w-0 max-w-full">
        <Tex block>{eqTex}</Tex>
      </div>
      <div className="text-xl text-muted">⟺</div>
      <div className="min-w-0 max-w-full">
        <Tex block>{matTex}</Tex>
      </div>
    </div>
  );
}
