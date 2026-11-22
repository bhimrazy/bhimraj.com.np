"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { BRAND_COLORS } from "@/lib/brand";

/**
 * Registers the service worker (production only) and keeps the browser
 * chrome colour on the site's theme rather than the OS one.
 */
export function Pwa() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .catch((error: unknown) =>
          console.warn("SW registration failed", error),
        );
    };
    // After load, so the worker's install never competes with the page.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  useEffect(() => {
    if (!resolvedTheme) return;
    // Our own tag, first in <head>: browsers use the first theme-color, and
    // React never re-renders it on navigation.
    let meta = document.head.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][data-site-theme]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.dataset.siteTheme = "";
      document.head.prepend(meta);
    }
    meta.content =
      resolvedTheme === "light" ? BRAND_COLORS.paper : BRAND_COLORS.night;
  }, [resolvedTheme]);

  return null;
}
