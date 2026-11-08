import type { ComponentType } from "react";
import Lecture01, { toc as toc01 } from "./lec01";

export type Toc = { id: string; label: string }[];

/** 노트가 작성된 강의. 새 강의 노트를 추가하면 여기에 등록하세요. */
export const notes: Record<string, { Component: ComponentType; toc: Toc }> = {
  "lec-01": { Component: Lecture01, toc: toc01 },
};
