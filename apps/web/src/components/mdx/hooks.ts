"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/** Live `matchMedia` result; `serverValue` is used for SSR and hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  // Stable callbacks, or useSyncExternalStore re-subscribes every render.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}

/** Reduced motion; `true` on the server so nothing autoplays before hydration. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

/** Whether the element is on screen. */
function useInView<T extends Element>(ref: RefObject<T | null>) {
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

/** Play/pause: autoplays on first view (not with reduced motion); runs only while visible. */
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

/** rAF clock from 0 to `duration` at `rate` units/s; starts at the end so SSR shows the finished frame. */
export function useTimeline(
  duration: number,
  rate: number,
  running: boolean,
  onEnd: () => void,
) {
  const [t, setT] = useState(duration);
  const tRef = useRef(t);
  tRef.current = t;
  const end = useRef(onEnd);
  end.current = onEnd;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    // Playing from the end replays from the start.
    let current = tRef.current >= duration ? 0 : tRef.current;
    const frame = (now: number) => {
      // Cap the step so returning from a hidden tab doesn't jump to the end.
      const delta = Math.min(now - last, 100);
      current = Math.min(duration, current + (delta / 1000) * rate);
      last = now;
      setT(current);
      if (current < duration) raf = requestAnimationFrame(frame);
      else end.current();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, rate, running]);

  return [t, setT] as const;
}
