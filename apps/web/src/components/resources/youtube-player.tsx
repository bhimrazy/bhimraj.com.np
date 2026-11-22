"use client";

import { PlayIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { focusRing } from "@/components/surface";
import { cn } from "@/lib/utils";

/** The slice of the IFrame Player API this file uses. */
type YTPlayer = {
  loadVideoById: (opts: { videoId: string; startSeconds?: number }) => void;
  cueVideoById: (opts: { videoId: string; startSeconds?: number }) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onStateChange: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads YouTube's player script once, on the first play. */
function loadApi(): Promise<YTNamespace> {
  apiPromise ??= new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube player failed to load"));
    };
    document.head.append(script);
  });
  return apiPromise;
}

export type PlaybackEvent = {
  video: string;
  positionSec: number;
  durationSec: number;
  kind: "progress" | "pause" | "end";
};

/** How often to save the position while a video plays. */
const SAVE_EVERY_MS = 10_000;

/**
 * Shows the thumbnail until someone presses play, so pages with a player
 * load no YouTube code or cookies up front. After that it swaps videos in
 * place, starting each at `startSec`.
 */
export function YouTubePlayer({
  video,
  title,
  startSec,
  onPlayback,
  onStart,
}: {
  video: string;
  title: string;
  startSec: number;
  onPlayback: (event: PlaybackEvent) => void;
  /** Fires once per video, on its first play. */
  onStart: (video: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  // Callbacks and the current video, readable from YouTube's handlers.
  const latest = useRef({ video, startSec, onPlayback, onStart });
  latest.current = { video, startSec, onPlayback, onStart };
  const started = useRef(new Set<string>());
  /** The video in the player, which can trail the prop for a render. */
  const loaded = useRef(video);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const report = (kind: PlaybackEvent["kind"]) => {
      const player = playerRef.current;
      if (!player) return;
      latest.current.onPlayback({
        video: loaded.current,
        positionSec: player.getCurrentTime(),
        durationSec: player.getDuration(),
        kind,
      });
    };
    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    loadApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        // YouTube replaces the element it's given with its iframe, so give
        // it one React doesn't own.
        const mount = document.createElement("div");
        mount.className = "size-full";
        hostRef.current.replaceChildren(mount);
        playerRef.current = new YT.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId: latest.current.video,
          playerVars: {
            autoplay: 1,
            start: Math.floor(latest.current.startSec),
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onStateChange: ({ data }) => {
              if (data === YT.PlayerState.PLAYING) {
                const current = loaded.current;
                if (!started.current.has(current)) {
                  started.current.add(current);
                  latest.current.onStart(current);
                }
                stopTimer();
                timer = setInterval(() => report("progress"), SAVE_EVERY_MS);
              } else if (data === YT.PlayerState.PAUSED) {
                stopTimer();
                report("pause");
              } else if (data === YT.PlayerState.ENDED) {
                stopTimer();
                report("end");
              }
            },
          },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      stopTimer();
      // Save where the viewer was before the player goes away.
      if (playerRef.current) {
        report("pause");
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // Created once per activation; later videos load through the effect below.
  }, [active]);

  // A different lecture picked while the player is up: save where the old
  // one stopped, then swap the new one in place.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || loaded.current === video) return;
    latest.current.onPlayback({
      video: loaded.current,
      positionSec: player.getCurrentTime(),
      durationSec: player.getDuration(),
      kind: "pause",
    });
    loaded.current = video;
    player.loadVideoById({
      videoId: video,
      startSeconds: Math.floor(startSec),
    });
  }, [video, startSec]);

  if (failed) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-site-border bg-site-card p-6 text-center text-site-text-secondary text-sm">
        <p>
          The YouTube player didn&apos;t load.{" "}
          <a
            href={`https://www.youtube.com/watch?v=${video}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-site-accent-text underline underline-offset-4"
          >
            Watch on YouTube
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-site-border bg-black dark:border-white/8">
      {active ? (
        <div ref={hostRef} className="absolute inset-0 size-full" />
      ) : (
        <button
          type="button"
          onClick={() => {
            loaded.current = video;
            setActive(true);
          }}
          className={cn("group absolute inset-0 size-full", focusRing)}
        >
          {/* biome-ignore lint/performance/noImgElement: YouTube's own thumbnail CDN; next/image adds nothing with images unoptimized */}
          <img
            src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`}
            alt=""
            className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-site-accent px-5 py-2.5 font-semibold text-site-on-accent text-sm shadow-lg">
              <PlayIcon aria-hidden className="size-4" />
              {startSec > 0 ? "Resume" : "Play"}
              <span className="sr-only">: {title}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
