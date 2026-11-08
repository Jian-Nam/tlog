import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "tlog · 선형대수 노트", template: "%s · tlog" },
  description: "그래프를 직접 움직이며 읽는 선형대수 인터랙티브 노트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2 font-semibold tracking-tight">
              <span className="text-lg">tlog</span>
              <span className="text-sm font-normal text-muted">선형대수 인터랙티브 노트</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/#posts" className="hover:text-fg">노트</Link>
              <a href="https://github.com/Jian-Nam/tlog" target="_blank" rel="noreferrer" className="hover:text-fg">
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 text-center text-xs text-muted">
          tlog · 선형대수 인터랙티브 노트
        </footer>
      </body>
    </html>
  );
}
