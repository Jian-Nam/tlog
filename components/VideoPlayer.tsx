"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type YTPlayer = {
  seekTo: (s: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Ctx = { seek: (seconds: number) => void; time: number };
const VideoCtx = createContext<Ctx>({ seek: () => {}, time: 0 });
export const useVideo = () => useContext(VideoCtx);

let apiPromise: Promise<void> | null = null;
function loadApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

export function VideoProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [time, setTime] = useState(0);

  const seek = useCallback((seconds: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(seconds, true);
    p.playVideo();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.();
      if (typeof t === "number") setTime(t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <VideoCtx.Provider value={{ seek, time }}>
      <PlayerRefCtx.Provider value={playerRef}>{children}</PlayerRefCtx.Provider>
    </VideoCtx.Provider>
  );
}

const PlayerRefCtx = createContext<React.RefObject<YTPlayer | null> | null>(null);

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const playerRef = useContext(PlayerRefCtx);

  useEffect(() => {
    let cancelled = false;
    let player: YTPlayer | null = null;
    const hostEl = host.current;
    loadApi().then(() => {
      if (cancelled || !hostEl || !window.YT) return;
      const el = document.createElement("div");
      hostEl.appendChild(el);
      player = new window.YT.Player(el, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
      });
      if (playerRef) playerRef.current = player;
    });
    return () => {
      cancelled = true;
      player?.destroy();
      if (playerRef) playerRef.current = null;
      if (hostEl) hostEl.innerHTML = "";
    };
  }, [videoId, playerRef]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <div ref={host} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />
    </div>
  );
}

function parseTime(t: string) {
  return t.split(":").reduce((acc, p) => acc * 60 + Number(p), 0);
}

/** 노트 안의 시간 표시 — 누르면 영상이 해당 위치로 이동 */
export function T({ at, children }: { at: string; children?: ReactNode }) {
  const { seek } = useVideo();
  return (
    <button
      type="button"
      onClick={() => seek(parseTime(at))}
      className="mx-0.5 inline-flex items-center gap-1 rounded-md bg-accent/10 px-1.5 py-0.5 align-baseline font-mono text-[0.8em] text-accent hover:bg-accent/20"
      title="영상에서 이 장면으로 이동"
    >
      ▶ {at}
      {children ? <span className="font-sans">{children}</span> : null}
    </button>
  );
}
