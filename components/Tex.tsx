import katex from "katex";
import { FitMath } from "./FitMath";

/** 우리가 직접 작성한 수식만 렌더링하므로 \htmlClass, \htmlData 를 허용 (색상·하이라이트용) */
const TRUSTED = new Set(["\\htmlClass", "\\htmlData"]);

export function renderTex(src: string, block: boolean) {
  return katex.renderToString(src, {
    displayMode: block,
    throwOnError: false,
    strict: "ignore",
    trust: (ctx) => TRUSTED.has(ctx.command),
  });
}

/**
 * KaTeX 수식. 서버/클라이언트 어디서든 사용 가능.
 * 블록 수식은 너비가 모자라면 글자 크기를 줄여 한 줄에 맞춤 (가로 스크롤 없음).
 * 색상: \htmlClass{tx-c1}{…} (1열·파랑), tx-c2 (주황), tx-c3 (초록), tx-b (b·분홍), tx-dim (흐리게)
 */
export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = renderTex(children, block);
  return block ? <FitMath html={html} /> : <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export const M = ({ children }: { children: string }) => <Tex block>{children}</Tex>;
