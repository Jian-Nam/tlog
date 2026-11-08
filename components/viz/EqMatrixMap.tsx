import { Tex } from "@/components/Tex";
import { TONE, VARS, equationsTex, matrixTex } from "./latex";

/**
 * 연립방정식 ↔ 행렬 형태 Ax = b 대응도 (색으로만 표시).
 * - j번째 미지수의 계수 = A의 j열 = x의 j번째 성분 (같은 색), 우변 = b (분홍)
 * - 생략된 계수 1, 빠진 항(계수 0)도 흐리게 드러내서 행렬 칸과 1:1 로 대응
 */
export default function EqMatrixMap({ A, b }: { A: number[][]; b: number[] }) {
  const col = (_: number, j: number) => TONE[j];
  const eqTex = equationsTex(A, b, { termClass: col, bClass: () => "tx-b", zero: "dim", one: "dim" });
  const matTex = matrixTex(A, VARS.slice(0, A[0].length), b, {
    cellClass: col,
    xClass: (j) => TONE[j],
    bClass: () => "tx-b",
  });

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
