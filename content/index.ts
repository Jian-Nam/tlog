import type { ComponentType } from "react";
import ThreePictures, { toc as tocThreePictures } from "./three-pictures";

export type Toc = { id: string; label: string }[];

export type Post = {
  slug: string;
  title: string;
  description: string;
  Component: ComponentType;
  toc: Toc;
};

/** 글 목록 (읽는 순서대로). 새 글을 쓰면 여기에 추가하세요. */
export const posts: Post[] = [
  {
    slug: "three-pictures",
    title: "연립방정식을 보는 세 가지 그림",
    description: "행 그림, 열 그림, 그리고 Ax = b. 같은 방정식을 세 시점에서 보고, 언제 해가 없는지 확인합니다.",
    Component: ThreePictures,
    toc: tocThreePictures,
  },
];

export function getPost(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return { post: posts[i], num: i + 1, prev: posts[i - 1] ?? null, next: posts[i + 1] ?? null };
}
