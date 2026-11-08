import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, posts } from "@/content";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = getPost(slug);
  if (!found) return {};
  return { title: found.post.title, description: found.post.description };
}

export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const found = getPost(slug);
  if (!found) notFound();
  const { post, num, prev, next } = found;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
      {/* 왼쪽: 목차 (데스크톱에서만, 고정) */}
      <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">목차</p>
        <ol className="space-y-1 border-l border-border text-sm">
          {post.toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-muted hover:border-accent hover:text-fg">
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <article className="prose-note min-w-0 max-w-3xl pb-24">
        <header className="mb-8">
          <p className="!my-0 text-sm text-muted">노트 {num}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="!mt-3 text-muted">{post.description}</p>
        </header>

        <post.Component />

        <nav className="mt-16 flex justify-between gap-3 border-t border-border pt-6 text-sm">
          {prev ? (
            <Link href={`/posts/${prev.slug}`} className="text-muted hover:text-accent">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/posts/${next.slug}`} className="text-muted hover:text-accent">
              {next.title} →
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
