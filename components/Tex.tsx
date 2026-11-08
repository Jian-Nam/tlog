import katex from "katex";

/** KaTeX 수식. 서버/클라이언트 어디서든 사용 가능 */
export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = katex.renderToString(children, { displayMode: block, throwOnError: false, strict: "ignore" });
  return block ? (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export const M = ({ children }: { children: string }) => <Tex block>{children}</Tex>;
