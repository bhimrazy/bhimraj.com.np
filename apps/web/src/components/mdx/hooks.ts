"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** `true` when the reader asked for reduced motion. Server snapshot: `true` (never autoplay before hydration). */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

/** Tracks whether an element is on screen, so figures stop animating offscreen. */
export function useInView<T extends Element>(ref: RefObject<T | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/**
 * Play/pause state for a figure. Autoplays the first time the figure scrolls
 * into view unless the reader prefers reduced motion; `running` is only true
 * while the figure is visible and the tab is in the foreground.
 */
export function usePlayback<T extends Element>(ref: RefObject<T | null>) {
  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref);
  const [playing, setPlaying] = useState(false);
  const autoplayed = useRef(false);

  useEffect(() => {
    if (inView && !reducedMotion && !autoplayed.current) {
      autoplayed.current = true;
      setPlaying(true);
    }
  }, [inView, reducedMotion]);

  return {
    playing,
    setPlaying,
    toggle: useCallback(() => setPlaying((p) => !p), []),
    running: playing && inView,
    reducedMotion,
  };
}

/** Calls `onTick` every `ms` while `running` (and the tab is visible). */
export function useInterval(onTick: () => void, ms: number, running: boolean) {
  const tick = useRef(onTick);
  tick.current = onTick;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") tick.current();
    }, ms);
    return () => window.clearInterval(id);
  }, [ms, running]);
}

/**
 * A requestAnimationFrame clock from 0 to `duration` (in the figure's own
 * time units, advanced at `rate` units per second). Starts at `duration` so
 * the server-rendered frame is the finished picture.
 */
export function useTimeline(duration: number, rate: number, running: boolean) {
  const [t, setT] = useState(duration);
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const next = Math.min(
        duration,
        tRef.current + ((now - last) / 1000) * rate,
      );
      last = now;
      setT(next);
      if (next < duration) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, rate, running]);

  return [t, setT] as const;
}
