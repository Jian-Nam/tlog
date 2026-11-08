import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VideoProvider, YouTubeEmbed } from "@/components/VideoPlayer";
import { notes } from "@/content";
import { getLecture, lectures } from "@/lib/lectures";

export function generateStaticParams() {
  return lectures.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(props: PageProps<"/lectures/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = getLecture(slug);
  if (!found) return {};
  return { title: `${found.lecture.num}강 ${found.lecture.titleKo}`, description: found.lecture.title };
}

export default async function LecturePage(props: PageProps<"/lectures/[slug]">) {
  const { slug } = await props.params;
  const found = getLecture(slug);
  if (!found) notFound();
  const { lecture, prev, next } = found;
  const note = notes[slug];

  return (
    <VideoProvider>
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        {/* 왼쪽: 영상 (데스크톱에서는 고정) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <YouTubeEmbed videoId={lecture.videoId} />
          <div className="mt-4">
            <p className="text-sm text-muted">Lecture {lecture.num}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{lecture.titleKo}</h1>
            <p className="text-sm text-muted">{lecture.title}</p>
          </div>

          {note ? (
            <nav className="mt-6 hidden lg:block">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">목차</p>
              <ol className="space-y-1 border-l border-border text-sm">
                {note.toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-muted hover:border-accent hover:text-fg">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-6 flex justify-between gap-3 text-sm">
            {prev ? (
              <Link href={`/lectures/${prev.slug}`} className="text-muted hover:text-accent">
                ← {prev.num}강
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/lectures/${next.slug}`} className="text-muted hover:text-accent">
                {next.num}강 →
              </Link>
            ) : null}
          </div>
        </aside>

        {/* 오른쪽: 노트 */}
        <article className="prose-note min-w-0 pb-24">
          {note ? (
            <note.Component />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
              <p className="!my-0 text-base">이 강의의 인터랙티브 노트는 아직 준비 중입니다.</p>
              <p className="!mb-0 text-sm">영상은 왼쪽에서 바로 볼 수 있어요.</p>
            </div>
          )}
        </article>
      </div>
    </VideoProvider>
  );
}
