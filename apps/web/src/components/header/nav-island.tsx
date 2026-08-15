"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { activeNavHref, NAV_LINKS } from "./nav-links";

/**
 * Reads the URL, so it only resolves at request time — render it inside a
 * <Suspense> boundary with <NavIsland /> as the prerendered fallback.
 */
export function ActiveNavIsland() {
  const pathname = usePathname();
  return <NavIsland activeHref={activeNavHref(pathname)} />;
}

/** The floating glass nav island. Prerenderable: the active tab is a prop. */
export function NavIsland({
  activeHref = null,
}: {
  activeHref?: string | null;
}) {
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
    animate: false,
  });

  const moveIndicator = useCallback((href: string | null, animate = true) => {
    const el = href ? itemRefs.current[href] : null;
    if (el) {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
        visible: true,
        animate,
      });
    } else {
      setIndicator((prev) => ({ ...prev, visible: false, animate }));
    }
  }, []);

  // Settle the indicator on the active tab on mount, route change, and resize.
  useEffect(() => {
    moveIndicator(activeHref, false);
    const onResize = () => moveIndicator(activeHref, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeHref, moveIndicator]);

  return (
    <ul
      onMouseLeave={() => moveIndicator(activeHref)}
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-(--site-border) p-1 backdrop-blur-md md:flex"
      style={{
        background: "color-mix(in srgb, var(--site-card-bg) 70%, transparent)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      }}
    >
      {/* Sliding indicator (the "bubble") */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-(--site-accent-subtle) ease-out",
          indicator.animate && "transition-all duration-300",
        )}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
          opacity: indicator.visible ? 1 : 0,
          boxShadow: "inset 0 0 0 1px var(--site-accent-subtle)",
        }}
      />

      {NAV_LINKS.map((link) => (
        <li
          key={link.href}
          ref={(el) => {
            itemRefs.current[link.href] = el;
          }}
          onMouseEnter={() => moveIndicator(link.href)}
        >
          <Link
            href={link.href}
            className={cn(
              "relative block rounded-full px-4 py-1.5 font-body font-medium text-sm transition-colors duration-200",
              link.href === activeHref
                ? "text-(--site-text)"
                : "text-(--site-text-secondary) hover:text-(--site-text)",
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
