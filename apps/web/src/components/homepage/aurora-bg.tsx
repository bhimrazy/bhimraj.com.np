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

    let onScreen = true;
    let pageVisible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const readColors = () => {
      colors = WAVES.map((wave) => readTokenRgb(ctx, wave.token));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      WAVES.forEach((wave, i) => {
        const [r, g, b] = colors[i] ?? [0, 0, 0];
        const baseY = wave.y * h;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 4) {
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
    };

    const frame = (now: number) => {
      if (lastFrame !== null) elapsed += now - lastFrame;
      lastFrame = now;
      draw(elapsed);
      rafId = requestAnimationFrame(frame);
    };

    /** Animate only while on screen, in a visible tab, and motion is allowed. */
    const sync = () => {
      const shouldRun = onScreen && pageVisible && !reducedMotion.matches;
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
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      draw(elapsed);
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
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

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
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
