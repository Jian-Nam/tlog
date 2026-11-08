"use client";

import { useLayoutEffect, useRef } from "react";

const MIN_SCALE = 0.5;

/**
 * 블록 수식이 부모 너비보다 넓으면 font-size 를 줄여 한 줄에 맞춤.
 * KaTeX 는 모든 크기를 em 으로 계산하므로 font-size 만 바꾸면 비율 그대로 축소됨.
 */
export function FitMath({ html }: { html: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // 내용이 바뀔 때마다 (슬라이더로 숫자가 바뀌는 경우 포함) 다시 맞춤
  useLayoutEffect(() => {
    const o = outer.current,
      i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      i.style.fontSize = "1em";
      const natural = i.scrollWidth;
      const avail = o.clientWidth;
      const s = natural > avail && natural > 0 ? Math.max(MIN_SCALE, avail / natural) : 1;
      i.style.fontSize = `${s}em`;
    };
    fit();
    // 높이 변화(축소로 인한)에는 반응하지 않도록 너비가 바뀔 때만 다시 맞춤
    let lastW = o.clientWidth;
    const ro = new ResizeObserver(() => {
      if (o.clientWidth === lastW) return;
      lastW = o.clientWidth;
      fit();
    });
    ro.observe(o);
    return () => ro.disconnect();
  });

  return (
    <div ref={outer} className="fit-math">
      <div ref={inner} className="fit-math-inner" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
