"use client";

import dynamic from "next/dynamic";

const Loading = ({ h = 420 }: { h?: number }) => (
  <div className="flex w-full animate-pulse items-center justify-center rounded-lg bg-surface-2 text-sm text-muted" style={{ height: h }}>
    그래프 불러오는 중…
  </div>
);

// 3D(WebGL)는 브라우저에서만 렌더링
export const RowPicture3D = dynamic(() => import("./RowPicture3D"), { ssr: false, loading: () => <Loading /> });
export const ColumnPicture3D = dynamic(() => import("./ColumnPicture3D"), { ssr: false, loading: () => <Loading /> });

export { default as RowPicture2D } from "./RowPicture2D";
export { default as ColumnPicture2D } from "./ColumnPicture2D";
export { default as MatVec } from "./MatVec";
export { default as EqMatrixMap } from "./EqMatrixMap";
