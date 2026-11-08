import { fmt } from "@/components/ui";

/** 색 클래스: 1·2·3 번째 (행 또는 열) */
export const TONE = ["tx-c1", "tx-c2", "tx-c3"];
export const VARS = ["x", "y", "z"];

const paint = (cls: string | undefined, s: string) => (cls && s ? `\\htmlClass{${cls}}{${s}}` : s);

/**
 * 고정 폭 자리: 템플릿(예: "-0.00") 너비만큼 자리를 먼저 확보하고 값을 오른쪽 정렬로 넣음.
 * 값이 1 → -3.27 처럼 길이가 바뀌어도 식의 구조(행렬 폭, 정렬)가 그대로 유지됨.
 * (KaTeX 에서 숫자 0-9 의 폭은 모두 같고, +/− 의 폭도 같음)
 */
export const slot = (s: string, tpl: string) => `\\phantom{${tpl}}\\mathllap{${s}}`;
/** 값 자리. 숫자면 고정 폭, 문자(x, y, ?)면 그대로 */
const val = (v: number | string, tpl: string) => (typeof v === "number" ? slot(fmt(v), tpl) : v);
/** 부호를 뗀 크기용 템플릿 ("-0.00" → "0.00") */
const unsigned = (tpl: string) => tpl.replace(/^-/, "");

type Cls = (i: number, j: number) => string | undefined;

/**
 * 연립방정식을 열 정렬해서 렌더링.
 * alignedat: 홀수 칸(오른쪽 정렬) = 항, 짝수 칸(왼쪽 정렬) = 연산자 → 같은 미지수가 세로로 정렬.
 * zero: "blank" 이면 계수 0 인 항은 빈칸(자리만 차지), "dim" 이면 흐리게 0z 표시
 * one:  "hide" 이면 계수 1 생략(일반 표기), "dim" 이면 흐리게 1 표시
 * 우변 b 는 고정 폭 자리(tpl)에 들어감
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
    tpl = "-0.00",
  }: {
    vars?: string[];
    termClass?: Cls;
    bClass?: (i: number) => string | undefined;
    zero?: "blank" | "dim";
    one?: "hide" | "dim";
    tpl?: string;
  } = {},
) {
  const n = A[0].length;
  const op = (s: string, cls?: string) => (s ? `{}${paint(cls, s)}{}` : "");
  const rows = A.map((row, i) => {
    const cells: string[] = [];
    let started = false; // 이 행에서 첫 항이 나왔는지 (첫 항은 부호를 항 안에 씀)
    row.forEach((a, j) => {
      const cls = termClass?.(i, j);
      const v = vars[j];
      if (a === 0) {
        if (zero === "dim") {
          if (j > 0) cells.push(started ? op("+", "tx-dim") : "");
          cells.push(paint("tx-dim", `0${v}`));
          started = true;
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
        cells.push("");
        cells.push(paint(cls, `${a < 0 ? "-" : ""}${mag}${v}`));
      } else {
        cells.push(op(a < 0 ? "-" : "+", cls));
        cells.push(paint(cls, `${mag}${v}`));
      }
      started = true;
    });
    cells.push(op("="), paint(bClass?.(i), val(b[i], tpl)));
    return cells.join(" & ");
  });
  return `\\begin{alignedat}{${n + 1}} ${rows.join(" \\\\[3pt] ")} \\end{alignedat}`;
}

/** 행렬 형태 A x = b. x 에는 문자(x, y, z) 또는 숫자(해) 를 넣을 수 있음. 숫자는 고정 폭 자리 */
export function matrixTex(
  A: number[][],
  x: (number | string)[],
  b: (number | string)[],
  {
    cellClass,
    xClass,
    bClass,
    labels = true,
    tpl = "-0.00",
    xTpl = tpl,
  }: {
    cellClass?: Cls;
    xClass?: (j: number) => string | undefined;
    bClass?: (i: number) => string | undefined;
    labels?: boolean;
    /** b 의 자리 템플릿 */
    tpl?: string;
    /** x 의 자리 템플릿 (해가 b 보다 커질 수 있을 때 따로 지정) */
    xTpl?: string;
  } = {},
) {
  const mA = A.map((row, i) => row.map((a, j) => paint(cellClass?.(i, j), fmt(a))).join(" & ")).join(" \\\\ ");
  const mx = x.map((v, j) => paint(xClass?.(j), val(v, xTpl))).join(" \\\\ ");
  const mb = b.map((v, i) => paint(bClass?.(i), val(v, tpl))).join(" \\\\ ");
  const wrap = (body: string, label: string) =>
    labels ? `\\underbrace{\\begin{bmatrix} ${body} \\end{bmatrix}}_{${label}}` : `\\begin{bmatrix} ${body} \\end{bmatrix}`;
  return `${wrap(mA, "A")}${wrap(mx, "\\mathbf{x}")} = ${wrap(mb, "b")}`;
}

/** 열 그림 형태: x₁·(1열) + x₂·(2열) + … = b. 계수와 b 는 고정 폭 자리 */
export function columnsTex(
  A: number[][],
  coef: (number | string)[],
  b: (number | string)[],
  {
    colClass = (j: number) => TONE[j],
    bClass = () => "tx-b",
    tpl = "-0.00",
  }: {
    colClass?: (j: number) => string | undefined;
    bClass?: (i: number) => string | undefined;
    tpl?: string;
  } = {},
) {
  const n = A[0].length;
  const parts: string[] = [];
  for (let j = 0; j < n; j++) {
    const col = A.map((row) => fmt(row[j])).join(" \\\\ ");
    const c = coef[j];
    let op = j === 0 ? "" : "+";
    let k = typeof c === "number" ? slot(fmt(c), tpl) : c;
    // 둘째 항부터는 부호를 연산자로 (+/− 폭이 같아 구조 유지), 크기는 부호 없는 자리에
    if (typeof c === "number" && j > 0) {
      op = c < 0 ? "-" : "+";
      k = slot(fmt(Math.abs(c)), unsigned(tpl));
    }
    parts.push(`${op} ${paint(colClass(j), `${k}\\begin{bmatrix} ${col} \\end{bmatrix}`)}`);
  }
  const mb = b.map((v, i) => paint(bClass(i), val(v, tpl))).join(" \\\\ ");
  return `${parts.join(" ")} = \\begin{bmatrix} ${mb} \\end{bmatrix}`;
}
