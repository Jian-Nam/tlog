import Link from "next/link";
import { lectures } from "@/lib/lectures";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <section className="mb-14">
        <p className="mb-3 text-sm font-medium text-accent">MIT 18.06 · Gilbert Strang</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">강의와 함께 보는 선형대수</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          영상을 왼쪽에 띄워두고, 오른쪽 노트의 그래프를 직접 움직여 보세요. 행 그림과 열 그림, 평면의 교차, 벡터의
          일차결합을 2D·3D로 만져볼 수 있습니다. 노트의 시간 표시를 누르면 영상이 그 장면으로 이동합니다.
        </p>
        <Link
          href="/lectures/lec-01"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          1강부터 시작하기 →
        </Link>
      </section>

      <section id="lectures" className="scroll-mt-20">
        <h2 className="mb-4 text-lg font-semibold">강의 목록</h2>
        <ol className="grid gap-2 sm:grid-cols-2">
          {lectures.map((l) => (
            <li key={l.slug} className="min-w-0">
              <Link
                href={`/lectures/${l.slug}`}
                className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-accent"
              >
                <span className="mt-0.5 w-8 shrink-0 font-mono text-sm text-muted tabular-nums">{l.num}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium group-hover:text-accent">{l.titleKo}</span>
                  <span className="block truncate text-xs text-muted">{l.title}</span>
                </span>
                {l.ready ? (
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                    노트
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">영상</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
