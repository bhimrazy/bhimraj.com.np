"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { readCourse, subscribe } from "./learning-db";

// Drawn over the marker's 1px border.
const R = 19;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Lectures the visitor ticked on the course page, or null before it loads. */
function useWatched(course: string, lectureIds: string[]): number | null {
  const [watched, setWatched] = useState<number | null>(null);
  const key = lectureIds.join(",");
  useEffect(() => {
    if (!key) return;
    const ids = new Set(key.split(","));
    let live = true;
    const load = () =>
      readCourse(course)
        .then((p) => {
          if (!live) return;
          setWatched(
            Object.values(p.lectures).filter((l) => l.done && ids.has(l.video))
              .length,
          );
        })
        // No IndexedDB (private mode, old browser): the plain number stays.
        .catch(() => {});
    load();
    const unsubscribe = subscribe(load);
    return () => {
      live = false;
      unsubscribe();
    };
  }, [course, key]);
  return watched;
}

/**
 * The step number on the timeline. For a course with lectures, a ring fills
 * with the visitor's own progress from the course page; it only changes
 * color, so nothing moves when it loads.
 */
export function StepMarker({
  position,
  course,
  lectureIds,
}: {
  position: number;
  course: string;
  lectureIds: string[];
}) {
  const watched = useWatched(course, lectureIds);
  const total = lectureIds.length;
  const share = watched && total ? Math.min(1, watched / total) : 0;
  const complete = share === 1;

  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border font-medium font-mono text-sm transition-colors",
        complete
          ? "border-site-accent bg-site-accent text-site-on-accent"
          : "border-site-border bg-site-card text-site-text dark:border-white/10",
      )}
    >
      {share > 0 && !complete && (
        <svg
          aria-hidden
          viewBox="0 0 40 40"
          className="absolute -inset-px size-10 -rotate-90"
        >
          <circle
            cx="20"
            cy="20"
            r={R}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${share * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            className="stroke-site-accent"
          />
        </svg>
      )}
      {complete ? (
        <CheckIcon aria-hidden className="size-4" />
      ) : (
        <span aria-hidden>{position}</span>
      )}
      <span className="sr-only">
        {`Step ${position}`}
        {watched ? `, you've watched ${watched} of ${total} lectures` : ""}
      </span>
    </span>
  );
}
