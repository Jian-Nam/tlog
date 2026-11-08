"use client";

import type { ReactNode } from "react";

export function Slider({
  label,
  value,
  onChange,
  min = -5,
  max = 5,
  step = 0.1,
  color,
}: {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-10 shrink-0 font-medium" style={color ? { color } : undefined}>
        {label}
      </span>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={color ? ({ "--thumb": color } as React.CSSProperties) : undefined}
      />
      <span className="w-12 shrink-0 text-right font-mono tabular-nums text-muted">{fmt(value)}</span>
    </label>
  );
}

export function Button({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-surface text-fg hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

/** 그래프를 감싸는 카드 */
export function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm font-semibold">
        <span className="inline-block h-2 w-2 rounded-full bg-accent" />
        {title}
      </div>
      <div className="p-4">{children}</div>
      {caption ? (
        <figcaption className="border-t border-border bg-surface-2/60 px-4 py-2.5 text-[13px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const fmt = (v: number, d = 2) => {
  const r = Math.round(v * 10 ** d) / 10 ** d;
  return (Object.is(r, -0) ? 0 : r).toString();
};
