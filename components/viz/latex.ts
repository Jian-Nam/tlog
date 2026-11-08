import { fmt } from "@/components/ui";

/** 색 클래스: 1·2·3 번째 (행 또는 열) */
export const TONE = ["tx-c1", "tx-c2", "tx-c3"];
export const VARS = ["x", "y", "z"];

const paint = (cls: string | undefined, s: string) => (cls && s ? `\\htmlClass{${cls}}{${s}}` : s);
const num = (v: number | string) => (typeof v === "number" ? fmt(v) : v);

type Cls = (i: number, j: number) => string | undefined;

/**
 * 연립방정식을 열 정렬해서 렌더링.
 * 각 항은 [부호 칸][계수·변수 칸(오른쪽 정렬)] 으로 나뉘어 x, y, z 가 세로로 맞음.
 * zero: "blank" 이면 계수 0 인 항은 빈칸(자리만 차지), "dim" 이면 흐리게 0z 표시
 * one:  "hide" 이면 계수 1 생략(일반 표기), "dim" 이면 흐리게 1 표시
 */
export function equationsTex(
  A: number[][],
  b: (number | string)[],
  {
    vars = VARS,
    termClass,
    bClass,
    zero = "blank",
    one = "hide",
  }: {
    vars?: string[];
    termClass?: Cls;
    bClass?: (i: number) => string | undefined;
    zero?: "blank" | "dim";
    one?: "hide" | "dim";
  } = {},
) {
  const n = A[0].length;
  // alignedat: 홀수 칸(오른쪽 정렬) = 항, 짝수 칸(왼쪽 정렬) = 연산자 {}+{}
  // → 같은 미지수의 항이 세로로 정렬되고, 빈 항도 칸을 차지함
  const op = (s: string, cls?: string) => (s ? `{}${paint(cls, s)}{}` : "");
  const rows = A.map((row, i) => {
    const cells: string[] = [];
    let started = false; // 이 행에서 0 이 아닌 첫 항이 나왔는지 (첫 항은 부호를 항 안에 씀)
    row.forEach((a, j) => {
      const cls = termClass?.(i, j);
      const v = vars[j];
      if (a === 0) {
        if (zero === "dim") {
          if (j > 0) cells.push(started ? op("+", "tx-dim") : "");
          cells.push(paint("tx-dim", `0${v}`));
          started = true; // 흐린 0 항도 '첫 항'으로 취급 → 다음 항의 부호는 연산자 칸에
        } else {
          if (j > 0) cells.push("");
          cells.push(""); // 빈칸이지만 열 자리는 유지
        }
        return;
      }
      const abs = Math.abs(a);
      const mag = abs === 1 ? (one === "dim" ? "\\htmlClass{tx-dim}{1}" : "") : fmt(abs);
      if (j === 0) {
        cells.push(paint(cls, `${a < 0 ? "-" : ""}${mag}${v}`));
      } else if (!started) {
        // 앞 항들이 모두 비어 있으면 + 는 생략, - 는 항 앞에 붙임
        cells.push("");
        cells.push(paint(cls, `${a < 0 ? "-" : ""}${mag}${v}`));
      } else {
        cells.push(op(a < 0 ? "-" : "+", cls));
        cells.push(paint(cls, `${mag}${v}`));
      }
      started = true;
    });
    cells.push(op("="), paint(bClass?.(i), num(b[i])));
    return cells.join(" & ");
  });
  return `\\begin{alignedat}{${n + 1}} ${rows.join(" \\\\[3pt] ")} \\end{alignedat}`;
}

/** 행렬 형태 A x = b. x 에는 문자(x, y, z) 또는 숫자(해) 를 넣을 수 있음 */
export function matrixTex(
  A: number[][],
  x: (number | string)[],
  b: (number | string)[],
  {
    cellClass,
    xClass,
    bClass,
    labels = true,
    rel = "=",
  }: {
    cellClass?: Cls;
    xClass?: (j: number) => string | undefined;
    bClass?: (i: number) => string | undefined;
    labels?: boolean;
    rel?: string;
  } = {},
) {
  const mA = A.map((row, i) => row.map((a, j) => paint(cellClass?.(i, j), fmt(a))).join(" & ")).join(" \\\\ ");
  const mx = x.map((v, j) => paint(xClass?.(j), num(v))).join(" \\\\ ");
  const mb = b.map((v, i) => paint(bClass?.(i), num(v))).join(" \\\\ ");
  const wrap = (body: string, label: string) =>
    labels ? `\\underbrace{\\begin{bmatrix} ${body} \\end{bmatrix}}_{${label}}` : `\\begin{bmatrix} ${body} \\end{bmatrix}`;
  return `${wrap(mA, "A")}${wrap(mx, "\\mathbf{x}")} ${rel} ${wrap(mb, "b")}`;
}

/** 열 그림 형태: x₁·(1열) + x₂·(2열) + … = b */
export function columnsTex(
  A: number[][],
  coef: (number | string)[],
  b: (number | string)[],
  {
    colClass = (j: number) => TONE[j],
    bClass = () => "tx-b",
    rel = "=",
  }: { colClass?: (j: number) => string | undefined; bClass?: (i: number) => string | undefined; rel?: string } = {},
) {
  const n = A[0].length;
  const parts: string[] = [];
  for (let j = 0; j < n; j++) {
    const col = A.map((row) => fmt(row[j])).join(" \\\\ ");
    const c = coef[j];
    let op = j === 0 ? "" : "+";
    let k = num(c);
    if (typeof c === "number" && c < 0 && j > 0) {
      op = "-";
      k = fmt(-c);
    }
    parts.push(`${op} ${paint(colClass(j), `${k}\\begin{bmatrix} ${col} \\end{bmatrix}`)}`);
  }
  const mb = b.map((v, i) => paint(bClass(i), num(v))).join(" \\\\ ");
  return `${parts.join(" ")} ${rel} \\begin{bmatrix} ${mb} \\end{bmatrix}`;
}
