"use client";

import { useEffect, useRef } from "react";

export default function AuroraBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--site-accent")
        .trim() || "#f59e0b";

    const waves = [
      {
        y: 0.35,
        amp: 80,
        freq: 0.003,
        speed: 0.0008,
        color: accent,
        opacity: 0.07,
        width: 200,
      },
      {
        y: 0.45,
        amp: 60,
        freq: 0.004,
        speed: 0.001,
        color: "#8b5cf6",
        opacity: 0.05,
        width: 160,
      },
      {
        y: 0.55,
        amp: 100,
        freq: 0.002,
        speed: 0.0006,
        color: "#06b6d4",
        opacity: 0.04,
        width: 240,
      },
      {
        y: 0.3,
        amp: 50,
        freq: 0.005,
        speed: 0.0012,
        color: accent,
        opacity: 0.04,
        width: 120,
      },
    ];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const wave of waves) {
        ctx.beginPath();
        const baseY = wave.y * h;
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
        const hex = Math.round(wave.opacity * 255)
          .toString(16)
          .padStart(2, "0");
        const hex2 = Math.round(wave.opacity * 0.5 * 255)
          .toString(16)
          .padStart(2, "0");
        grad.addColorStop(0, `${wave.color}00`);
        grad.addColorStop(0.3, `${wave.color}${hex}`);
        grad.addColorStop(0.7, `${wave.color}${hex2}`);
        grad.addColorStop(1, `${wave.color}00`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
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
