"use client";

import { CheckIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { focusRing } from "@/components/surface";
import { capture } from "@/lib/analytics";
import { formatDuration, formatHours, formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  BackupError,
  type CourseProgress,
  exportBackup,
  importBackup,
  readCourse,
  requestPersistence,
  resetCourse,
  saveLecture,
  subscribe,
} from "./learning-db";
import type { MaterialLink } from "./materials";
import { type PlaybackEvent, YouTubePlayer } from "./youtube-player";

export type ClassroomLecture = {
  id: string;
  title: string;
  speakers: string | null;
  durationSec: number;
  /** False when the channel only allows playback on YouTube. */
  embeddable: boolean;
  /** Slides, readings and labs the course publishes for this lecture. */
  materials: MaterialLink[];
};

/** Counted as watched past this share of the video (end credits, Q&A tails). */
const DONE_AT = 0.9;

type Loaded = CourseProgress & { status: "loading" | "ready" | "unavailable" };

function useCourseProgress(course: string): Loaded {
  const [progress, setProgress] = useState<Loaded>({
    status: "loading",
    lectures: {},
    state: null,
  });
  useEffect(() => {
    let live = true;
    const load = () =>
      readCourse(course)
        .then((p) => live && setProgress({ ...p, status: "ready" }))
        .catch(
          () => live && setProgress((p) => ({ ...p, status: "unavailable" })),
        );
    load();
    const unsubscribe = subscribe(load);
    return () => {
      live = false;
      unsubscribe();
    };
  }, [course]);
  return progress;
}

/** Where to start a lecture: its saved spot, unless barely begun or nearly over. */
function resumeAt(
  saved: CourseProgress["lectures"][string] | undefined,
  durationSec: number,
) {
  if (!saved || saved.done) return 0;
  return saved.positionSec > 15 && saved.positionSec < durationSec - 30
    ? saved.positionSec
    : 0;
}

export function CourseClassroom({
  course,
  lectures,
}: {
  course: string;
  lectures: ClassroomLecture[];
}) {
  const progress = useCourseProgress(course);
  const [current, setCurrent] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const asked = useRef(false);
  /**
   * Lectures auto-completed this visit. Each completes once, so the event
   * fires once even when storage is off, and an untick isn't undone by the
   * next save.
   */
  const autoDone = useRef(new Set<string>());

  const indexOf = useCallback(
    (id: string) => lectures.findIndex((l) => l.id === id),
    [lectures],
  );

  // Open on the lecture in the URL, else where the visitor left off, else
  // the first one not yet watched.
  useEffect(() => {
    if (current || progress.status === "loading") return;
    const fromUrl = new URLSearchParams(window.location.search).get("v");
    const last = progress.state?.lastVideo;
    const pick =
      (fromUrl && indexOf(fromUrl) >= 0 && fromUrl) ||
      (last && indexOf(last) >= 0 && last) ||
      lectures.find((l) => !progress.lectures[l.id]?.done)?.id ||
      lectures[0]?.id;
    if (pick) setCurrent(pick);
  }, [current, progress, lectures, indexOf]);

  const select = (id: string, scroll: boolean) => {
    setCurrent(id);
    const url = new URL(window.location.href);
    url.searchParams.set("v", id);
    window.history.replaceState(null, "", url);
    if (scroll && window.matchMedia("(max-width: 1023px)").matches) {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const save = async (input: Parameters<typeof saveLecture>[0]) => {
    try {
      const first = await saveLecture(input);
      if (first) capture("course_started", { course });
      if (!asked.current) {
        asked.current = true;
        requestPersistence();
      }
    } catch {
      // Storage refused (private mode, quota): playback still works.
    }
  };

  const onPlayback = (event: PlaybackEvent) => {
    const lecture = lectures[indexOf(event.video)];
    if (!lecture) return;
    const durationSec = event.durationSec || lecture.durationSec;
    const reached =
      event.kind === "end" || event.positionSec >= durationSec * DONE_AT;
    const completes =
      reached &&
      !autoDone.current.has(event.video) &&
      !progress.lectures[event.video]?.done;
    if (reached) autoDone.current.add(event.video);
    if (completes) capture("lecture_completed", { course, video: event.video });
    void save({
      course,
      video: event.video,
      positionSec: event.kind === "end" ? 0 : event.positionSec,
      durationSec,
      done: completes ? true : undefined,
    });
  };

  const toggleDone = (lecture: ClassroomLecture) => {
    const saved = progress.lectures[lecture.id];
    // An untick should stick for this visit, not be re-ticked at 90%.
    autoDone.current.add(lecture.id);
    void save({
      course,
      video: lecture.id,
      positionSec: 0, // ignored for ticks: the stored position is kept
      durationSec: lecture.durationSec,
      done: !saved?.done,
      played: false,
    });
  };

  const watched = lectures.filter((l) => progress.lectures[l.id]?.done);
  const leftSec = lectures
    .filter((l) => !progress.lectures[l.id]?.done)
    .reduce((sum, l) => sum + l.durationSec, 0);
  const lecture = current ? lectures[indexOf(current)] : undefined;
  const lectureIndex = lecture ? indexOf(lecture.id) : -1;
  const last = progress.state?.lastVideo;
  const lastLecture = last ? lectures[indexOf(last)] : undefined;
  const storageOff = progress.status === "unavailable";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
      <div
        ref={playerRef}
        className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start"
      >
        {lecture ? (
          <>
            {lecture.embeddable ? (
              <YouTubePlayer
                video={lecture.id}
                title={lecture.title}
                startSec={resumeAt(
                  progress.lectures[lecture.id],
                  lecture.durationSec,
                )}
                onPlayback={onPlayback}
                onStart={(video) =>
                  capture("lecture_played", {
                    course,
                    video,
                    index: indexOf(video) + 1,
                    embedded: true,
                  })
                }
                endCard={(replay) => {
                  const next = lectures[lectureIndex + 1];
                  return (
                    <div className="max-w-sm text-center">
                      <p className="font-mono text-site-accent-text text-xs">
                        Lecture finished
                      </p>
                      {next ? (
                        <button
                          type="button"
                          onClick={() => select(next.id, false)}
                          className={cn(
                            "mt-3 rounded-lg bg-site-accent px-4 py-2 font-semibold text-site-on-accent text-sm transition-colors hover:bg-site-accent/85",
                            focusRing,
                          )}
                        >
                          Next: {String(lectureIndex + 2).padStart(2, "0")}.{" "}
                          {next.title}
                        </button>
                      ) : (
                        <p className="mt-2 text-site-text text-sm">
                          That was the last lecture.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={replay}
                        className={cn(
                          "mt-3 block w-full rounded-sm text-site-text-secondary text-xs underline-offset-4 hover:text-site-text hover:underline",
                          focusRing,
                        )}
                      >
                        Watch again
                      </button>
                    </div>
                  );
                }}
              />
            ) : (
              <ExternalLecture
                lecture={lecture}
                startSec={resumeAt(
                  progress.lectures[lecture.id],
                  lecture.durationSec,
                )}
                onOpen={() => {
                  capture("lecture_played", {
                    course,
                    video: lecture.id,
                    index: lectureIndex + 1,
                    embedded: false,
                  });
                  // Counts as played for "Continue"; the position stays put.
                  void save({
                    course,
                    video: lecture.id,
                    positionSec:
                      progress.lectures[lecture.id]?.positionSec ?? 0,
                    durationSec: lecture.durationSec,
                  });
                }}
              />
            )}
            <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <p className="font-mono text-site-text-tertiary text-xs">
                  {String(lectureIndex + 1).padStart(2, "0")} of{" "}
                  {lectures.length} · {formatDuration(lecture.durationSec)}
                </p>
                <h2 className="mt-1 text-pretty font-display font-semibold text-site-text text-xl leading-snug tracking-tight">
                  {lecture.title}
                </h2>
                {lecture.speakers && (
                  <p className="mt-1 text-site-text-secondary text-sm">
                    {lecture.speakers}
                  </p>
                )}
                {lecture.materials.length > 0 && (
                  <ul
                    aria-label="Lecture materials"
                    className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm"
                  >
                    {lecture.materials.map((m) => (
                      <li key={m.url}>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center gap-1 rounded-sm font-medium text-site-accent-text transition-colors hover:text-site-text dark:hover:text-site-accent-hover",
                            focusRing,
                          )}
                        >
                          {m.label}
                          <ExternalLinkIcon aria-hidden className="size-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={storageOff}
                  aria-pressed={Boolean(progress.lectures[lecture.id]?.done)}
                  onClick={() => toggleDone(lecture)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg border border-site-border px-3 font-medium text-sm transition-colors disabled:opacity-50 dark:border-white/8",
                    focusRing,
                    progress.lectures[lecture.id]?.done
                      ? "bg-site-accent-subtle text-site-accent-text"
                      : "text-site-text-secondary hover:text-site-text",
                  )}
                >
                  <CheckIcon aria-hidden className="size-4" />
                  {progress.lectures[lecture.id]?.done
                    ? "Watched"
                    : "Mark as watched"}
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${lecture.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-site-text-secondary text-sm transition-colors hover:text-site-text",
                    focusRing,
                  )}
                >
                  YouTube
                  <ExternalLinkIcon aria-hidden className="size-3.5" />
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-video animate-pulse rounded-2xl border border-site-border bg-site-card dark:border-white/8" />
        )}
      </div>

      <div>
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-3 font-mono text-xs">
            <span className="text-site-text-secondary">
              {watched.length} of {lectures.length} watched
            </span>
            <span className="text-site-text-tertiary">
              {leftSec > 0 ? `${formatHours(leftSec)} left` : "All watched"}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Lectures watched"
            aria-valuemin={0}
            aria-valuemax={lectures.length}
            aria-valuenow={watched.length}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-site-bg-tertiary"
          >
            <div
              className="h-full rounded-full bg-site-accent transition-[width] duration-500"
              style={{ width: `${(watched.length / lectures.length) * 100}%` }}
            />
          </div>
          {lastLecture && lastLecture.id !== current && (
            <button
              type="button"
              onClick={() => select(lastLecture.id, true)}
              className={cn(
                "mt-3 w-full rounded-lg border border-site-accent/30 bg-site-accent-subtle px-3 py-2 text-left text-site-accent-text text-sm transition-colors hover:border-site-accent/60",
                focusRing,
              )}
            >
              Continue: {String(indexOf(lastLecture.id) + 1).padStart(2, "0")}.{" "}
              {lastLecture.title}
              {resumeAt(
                progress.lectures[lastLecture.id],
                lastLecture.durationSec,
              ) > 0 &&
                ` at ${formatTimestamp(progress.lectures[lastLecture.id]?.positionSec ?? 0)}`}
            </button>
          )}
        </div>

        <ol className="flex flex-col gap-1">
          {lectures.map((l, i) => {
            const saved = progress.lectures[l.id];
            const isCurrent = l.id === current;
            const partial =
              saved && !saved.done && saved.positionSec > 0
                ? Math.min(1, saved.positionSec / l.durationSec)
                : 0;
            return (
              <li
                key={l.id}
                className={cn(
                  "flex items-start gap-2 rounded-xl p-2 transition-colors",
                  isCurrent
                    ? "bg-site-accent-subtle"
                    : "hover:bg-site-bg-secondary",
                )}
              >
                <button
                  type="button"
                  disabled={storageOff}
                  aria-pressed={Boolean(saved?.done)}
                  aria-label={`Mark "${l.title}" as watched`}
                  onClick={() => toggleDone(l)}
                  className={cn(
                    "relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors after:absolute after:-inset-2 disabled:opacity-50",
                    focusRing,
                    saved?.done
                      ? "border-site-accent bg-site-accent text-site-on-accent"
                      : "border-site-border-hover text-transparent hover:border-site-accent",
                  )}
                >
                  <CheckIcon aria-hidden className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={() => select(l.id, true)}
                  className={cn(
                    "min-w-0 flex-1 rounded-md text-left",
                    focusRing,
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-site-text-tertiary text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-pretty text-sm leading-snug",
                        isCurrent
                          ? "font-medium text-site-text"
                          : saved?.done
                            ? "text-site-text-tertiary"
                            : "text-site-text-secondary",
                      )}
                    >
                      {l.title}
                    </span>
                  </span>
                  {l.speakers && (
                    <span className="mt-0.5 block pl-7 text-site-text-tertiary text-xs">
                      {l.speakers}
                    </span>
                  )}
                  {partial > 0 && (
                    <span
                      aria-hidden
                      className="mt-1.5 ml-7 block h-0.5 overflow-hidden rounded-full bg-site-bg-tertiary"
                    >
                      <span
                        className="block h-full bg-site-accent/70"
                        style={{ width: `${partial * 100}%` }}
                      />
                    </span>
                  )}
                </button>
                <span className="mt-0.5 flex shrink-0 items-center gap-1 font-mono text-site-text-tertiary text-xs">
                  {!l.embeddable && (
                    <>
                      <ExternalLinkIcon aria-hidden className="size-3" />
                      <span className="sr-only">Plays on YouTube,</span>
                    </>
                  )}
                  {formatDuration(l.durationSec)}
                </span>
              </li>
            );
          })}
        </ol>

        <BackupControls
          course={course}
          disabled={storageOff}
          onMessage={setMessage}
        />
        <p aria-live="polite" className="mt-2 text-site-text-secondary text-xs">
          {storageOff
            ? "This browser isn't letting the page save progress (private browsing can do this), so checkmarks are off."
            : message}
        </p>
      </div>
    </div>
  );
}

function BackupControls({
  course,
  disabled,
  onMessage,
}: {
  course: string;
  disabled: boolean;
  onMessage: (message: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const link = cn(
    "rounded-sm underline-offset-4 transition-colors hover:text-site-text hover:underline disabled:opacity-50",
    focusRing,
  );

  const backup = async () => {
    try {
      const data = await exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `learning-progress-${data.exportedAt.slice(0, 10)}.json`;
      a.click();
      // Revoked later: revoking at once can cancel the download.
      setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
      capture("progress_exported", { lectures: data.lectures.length });
      onMessage("Backup downloaded. It covers every course on this site.");
    } catch {
      onMessage("Couldn't create the backup.");
    }
  };

  const restore = async (file: File) => {
    try {
      const count = await importBackup(JSON.parse(await file.text()));
      capture("progress_imported", { lectures: count });
      onMessage(
        count === 0
          ? "Nothing to restore: this browser already has everything in that file."
          : `Restored ${count} ${count === 1 ? "lecture" : "lectures"}.`,
      );
    } catch (error) {
      onMessage(
        error instanceof BackupError
          ? error.message
          : "Couldn't read that file.",
      );
    }
  };

  const reset = async () => {
    if (!window.confirm("Clear your progress for this course?")) return;
    try {
      await resetCourse(course);
      capture("progress_reset", { course });
      onMessage("Progress for this course cleared.");
    } catch {
      onMessage("Couldn't clear progress.");
    }
  };

  return (
    <div className="mt-6 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
      <p>
        Your progress is saved in this browser only. Back it up to keep it or
        move it to another device.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono">
        <button
          type="button"
          disabled={disabled}
          onClick={backup}
          className={link}
        >
          Back up
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className={link}
        >
          Restore
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={reset}
          className={link}
        >
          Reset this course
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void restore(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

/**
 * For lectures the channel won't let other sites embed: the thumbnail and a
 * link out, with a note on ticking it off here.
 */
function ExternalLecture({
  lecture,
  startSec,
  onOpen,
}: {
  lecture: ClassroomLecture;
  startSec: number;
  onOpen: () => void;
}) {
  const href = `https://www.youtube.com/watch?v=${lecture.id}${
    startSec > 0 ? `&t=${Math.floor(startSec)}s` : ""
  }`;
  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          onOpen();
          // On desktop, a window beside the page keeps the checklist in
          // view; elsewhere (or if it's blocked) the link opens a tab.
          if (
            !window.matchMedia("(min-width: 1024px) and (pointer: fine)")
              .matches
          )
            return;
          const width = Math.round(window.screen.availWidth * 0.6);
          const height = Math.round(window.screen.availHeight * 0.8);
          const win = window.open(
            href,
            "lecture",
            `popup,width=${width},height=${height},left=0,top=0`,
          );
          if (win) {
            win.opener = null;
            e.preventDefault();
          }
        }}
        className={cn(
          "group relative block aspect-video overflow-hidden rounded-2xl border border-site-border bg-black dark:border-white/8",
          focusRing,
        )}
      >
        {/* biome-ignore lint/performance/noImgElement: YouTube's own thumbnail CDN; next/image adds nothing with images unoptimized */}
        <img
          src={`https://i.ytimg.com/vi/${lecture.id}/hqdefault.jpg`}
          alt=""
          className="size-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2 rounded-full bg-site-accent px-5 py-2.5 font-semibold text-site-on-accent text-sm shadow-lg">
            Watch on YouTube
            <ExternalLinkIcon aria-hidden className="size-4" />
            <span className="sr-only">
              : {lecture.title} (opens in a new window)
            </span>
          </span>
        </span>
      </a>
      <p className="mt-2 text-site-text-tertiary text-xs">
        The channel only allows this lecture to play on YouTube, so it opens
        there. Tick it off here when you&apos;ve watched it.
      </p>
    </div>
  );
}
