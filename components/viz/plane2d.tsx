"use client";

import { useCallback, useRef, type ReactNode } from "react";

export type V2 = [number, number];

/** 수학 좌표 [-R, R]² 를 SVG 로 매핑하는 2D 좌표평면 */
export function useView(R: number, size = 400) {
  const s = size / (2 * R);
  const sx = (x: number) => size / 2 + x * s;
  const sy = (y: number) => size / 2 - y * s;
  return { R, size, s, sx, sy };
}
export type View = ReturnType<typeof useView>;

export function Plane2D({
  view,
  children,
  onPointer,
  gridR,
}: {
  view: View;
  children: ReactNode;
  /** 격자를 [-gridR, gridR]² 안에만 그림 (기본: 화면 전체) */
  gridR?: number;
  /** 드래그 중인 포인터의 수학 좌표 */
  onPointer?: (p: V2, phase: "down" | "move" | "up") => void;
}) {
  const { R, size, sx, sy } = view;
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const toMath = useCallback(
    (e: React.PointerEvent): V2 => {
      const r = ref.current!.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * size;
      const py = ((e.clientY - r.top) / r.height) * size;
      return [(px - size / 2) / view.s, -(py - size / 2) / view.s];
    },
    [size, view.s],
  );

  const G = gridR ?? R;
  const ticks: number[] = [];
  for (let i = -Math.floor(G); i <= Math.floor(G); i++) ticks.push(i);
  // 격자 선의 시작/끝 (화면 좌표)
  const g0 = gridR ? sx(-G) : 0;
  const g1 = gridR ? sx(G) : size;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className="block w-full touch-none select-none"
      onPointerDown={(e) => {
        if (!onPointer) return;
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        onPointer(toMath(e), "down");
      }}
      onPointerMove={(e) => dragging.current && onPointer?.(toMath(e), "move")}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        dragging.current = false;
        onPointer?.(toMath(e), "up");
      }}
    >
      {gridR ? (
        <rect x={g0} y={g0} width={g1 - g0} height={g1 - g0} fill="var(--surface-2)" opacity={0.6} />
      ) : null}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={g0} y2={g1} stroke="var(--grid)" strokeWidth={1} />
          <line y1={sy(t)} y2={sy(t)} x1={g0} x2={g1} stroke="var(--grid)" strokeWidth={1} />
        </g>
      ))}
      {gridR ? (
        <rect x={g0} y={g0} width={g1 - g0} height={g1 - g0} fill="none" stroke="var(--axis)" strokeWidth={1} opacity={0.6} />
      ) : null}
      <line x1={0} x2={size} y1={sy(0)} y2={sy(0)} stroke="var(--axis)" strokeWidth={1.5} />
      <line y1={0} y2={size} x1={sx(0)} x2={sx(0)} stroke="var(--axis)" strokeWidth={1.5} />
      {ticks
        .filter((t) => t !== 0 && t % 2 === 0)
        .map((t) => (
          <g key={`l${t}`} fontSize={11} fill="var(--muted)">
            <text x={sx(t)} y={sy(0) + 14} textAnchor="middle">
              {t}
            </text>
            <text x={sx(0) - 6} y={sy(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
      <text x={size - 8} y={sy(0) - 8} fontSize={12} fill="var(--muted)" textAnchor="end" fontStyle="italic">
        x
      </text>
      <text x={sx(0) + 8} y={14} fontSize={12} fill="var(--muted)" fontStyle="italic">
        y
      </text>
      {children}
    </svg>
  );
}

export function Arrow({
  view,
  from = [0, 0],
  to,
  color,
  width = 2.5,
  dashed,
  opacity = 1,
}: {
  view: View;
  from?: V2;
  to: V2;
  color: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const { sx, sy } = view;
  const x1 = sx(from[0]),
    y1 = sy(from[1]),
    x2 = sx(to[0]),
    y2 = sy(to[1]);
  const dx = x2 - x1,
    dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len,
    uy = dy / len;
  const h = Math.min(11, len * 0.5);
  const bx = x2 - ux * h,
    by = y2 - uy * h;
  const w = h * 0.5;
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <polygon points={`${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`} fill={color} />
    </g>
  );
}

/** ax + by = c 직선을 화면 경계까지 그림 */
export function LineEq({
  view,
  a,
  b,
  c,
  color,
  width = 2.5,
}: {
  view: View;
  a: number;
  b: number;
  c: number;
  color: string;
  width?: number;
}) {
  const { R, sx, sy } = view;
  const n = Math.hypot(a, b);
  if (n < 1e-9) return null;
  // 직선 위의 한 점 + 방향
  const p: V2 = [(a * c) / (n * n), (b * c) / (n * n)];
  const d: V2 = [-b / n, a / n];
  const L = R * 3;
  return (
    <line
      x1={sx(p[0] - d[0] * L)}
      y1={sy(p[1] - d[1] * L)}
      x2={sx(p[0] + d[0] * L)}
      y2={sy(p[1] + d[1] * L)}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

export function Dot({ view, p, color, r = 5 }: { view: View; p: V2; color: string; r?: number }) {
  return <circle cx={view.sx(p[0])} cy={view.sy(p[1])} r={r} fill={color} stroke="var(--surface)" strokeWidth={2} />;
}

export function Label({
  view,
  p,
  children,
  color,
  dx = 8,
  dy = -8,
}: {
  view: View;
  p: V2;
  children: ReactNode;
  color: string;
  dx?: number;
  dy?: number;
}) {
  return (
    <text
      x={view.sx(p[0]) + dx}
      y={view.sy(p[1]) + dy}
      fill={color}
      fontSize={13}
      fontWeight={600}
      paintOrder="stroke"
      stroke="var(--surface)"
      strokeWidth={4}
    >
      {children}
    </text>
  );
}

export function solve2(a: number, b: number, c: number, d: number, e: number, f: number): V2 | null {
  // [a b; c d] [x; y] = [e; f]
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-9) return null;
  return [(e * d - b * f) / det, (a * f - e * c) / det];
}
