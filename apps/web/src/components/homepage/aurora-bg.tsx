"use client";

import { useEffect, useRef } from "react";

type Rgb = readonly [number, number, number];

/** Each wave takes its colour from a site token, so it follows the theme. */
const WAVES = [
  {
    y: 0.35,
    amp: 80,
    freq: 0.003,
    speed: 0.0008,
    token: "--site-accent",
    opacity: 0.07,
    width: 200,
  },
  {
    y: 0.45,
    amp: 60,
    freq: 0.004,
    speed: 0.001,
    token: "--site-accent-hover",
    opacity: 0.05,
    width: 160,
  },
  {
    y: 0.55,
    amp: 100,
    freq: 0.002,
    speed: 0.0006,
    token: "--site-text-tertiary",
    opacity: 0.05,
    width: 240,
  },
  {
    y: 0.3,
    amp: 50,
    freq: 0.005,
    speed: 0.0012,
    token: "--site-accent",
    opacity: 0.04,
    width: 120,
  },
] as const;

/**
 * The waves are soft gradients, so the canvas renders at quarter resolution
 * and the browser scales it up: 1/16 of the pixels to fill, no visible change.
 */
const SCALE = 0.25;
/** The motion is slow; 30 fps looks the same as 60 at half the work. */
const FRAME_MS = 1000 / 30;
/** Where the fade to transparent starts, as a fraction of the height. */
const FADE_FROM = 0.6;

/**
 * Resolves a CSS custom property to RGB by letting the canvas normalise it:
 * `fillStyle` reads back as `#rrggbb` or `rgba(r, g, b, a)` whatever the
 * token's original syntax.
 */
function readTokenRgb(ctx: CanvasRenderingContext2D, token: string): Rgb {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  ctx.fillStyle = "#000";
  if (raw) ctx.fillStyle = raw;
  const value = String(ctx.fillStyle);
  if (value.startsWith("#")) {
    const n = Number.parseInt(value.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const [r = 0, g = 0, b = 0] = value.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  return [r, g, b];
}

export default function AuroraBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let colors: Rgb[] = [];
    let elapsed = 0;
    let lastFrame: number | null = null;
    let rafId: number | null = null;

    // Draw one still frame now; start moving once the page has loaded and
    // the browser is idle, so the waves never compete with the first paint.
    let started = false;
    let onScreen = true;
    let pageVisible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const readColors = () => {
      colors = WAVES.map((wave) => readTokenRgb(ctx, wave.token));
    };

    const draw = (t: number) => {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      WAVES.forEach((wave, i) => {
        const [r, g, b] = colors[i] ?? [0, 0, 0];
        const baseY = wave.y * h;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 8) {
          const y =
            baseY +
            Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
            Math.sin(x * wave.freq * 2.3 + t * wave.speed * 1.5) *
              wave.amp *
              0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(
          0,
          baseY - wave.width,
          0,
          baseY + wave.width,
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${wave.opacity})`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${wave.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Fade out towards the bottom, so the hero has no hard lower edge.
      const fade = ctx.createLinearGradient(0, h * FADE_FROM, 0, h);
      fade.addColorStop(0, "#000");
      fade.addColorStop(1, "transparent");
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (lastFrame === null) lastFrame = now;
      const delta = now - lastFrame;
      if (delta < FRAME_MS) return;
      elapsed += delta;
      lastFrame = now;
      draw(elapsed);
    };

    /** Animate only while on screen, in a visible tab, and motion is allowed. */
    const sync = () => {
      const shouldRun =
        started && onScreen && pageVisible && !reducedMotion.matches;
      if (shouldRun && rafId === null) {
        lastFrame = null;
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Reduced motion still gets the aurora — as a single still frame.
      if (!shouldRun) draw(elapsed);
    };

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.ceil(w * SCALE);
      canvas.height = Math.ceil(h * SCALE);
      draw(elapsed);
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver((entries) => {
      // Entries arrive oldest first; the newest one is the current state.
      onScreen = entries.at(-1)?.isIntersecting ?? true;
      sync();
    });
    intersectionObserver.observe(canvas);

    // next-themes toggles the `dark` class on <html>; recolour when it does.
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw(elapsed);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", sync);

    sync();

    // Safari has no requestIdleCallback; a short timeout does the same job.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let startId: number | null = null;
    const begin = () => {
      startId = null;
      started = true;
      sync();
    };
    const start = () => {
      startId = hasIdle
        ? window.requestIdleCallback(begin, { timeout: 2000 })
        : window.setTimeout(begin, 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("load", start);
      if (startId !== null) {
        if (hasIdle) window.cancelIdleCallback(startId);
        else window.clearTimeout(startId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
