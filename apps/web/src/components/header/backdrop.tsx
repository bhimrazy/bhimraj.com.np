"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Fades a blurred bar in behind the nav once the page is scrolled. */
export default function HeaderBackdrop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 transition-all duration-300",
        scrolled
          ? "border-site-border/50 border-b backdrop-blur-xl dark:border-white/4"
          : "border-transparent border-b",
      )}
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--site-bg) 80%, transparent)"
          : "transparent",
      }}
    />
  );
}
