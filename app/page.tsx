import Link from "next/link";
import { posts } from "@/content";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <section className="mb-14">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">만져 보며 읽는 선형대수</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          글을 읽다가 그림을 직접 움직여 보세요. 직선과 평면이 어떻게 만나는지, 벡터를 어떻게 섞으면 원하는 점에
          닿는지를 2D와 3D로 바로 확인할 수 있습니다.
        </p>
      </section>

      <section id="posts" className="scroll-mt-20">
        <h2 className="mb-4 text-lg font-semibold">노트</h2>
        <ol className="grid gap-2">
          {posts.map((p, i) => (
            <li key={p.slug} className="min-w-0">
              <Link
                href={`/posts/${p.slug}`}
                className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="mt-0.5 w-6 shrink-0 font-mono text-sm text-muted tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium group-hover:text-accent">{p.title}</span>
                  <span className="mt-1 block text-sm text-muted">{p.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
