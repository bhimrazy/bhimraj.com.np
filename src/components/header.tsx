"use client";

import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Open Source", href: "/oss" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
    animate: false,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const activeHref =
    NAV_LINKS.find((link) => isActive(link.href))?.href ?? null;

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
    <header className="fixed inset-x-0 top-0 z-50 py-2">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-all duration-300",
          scrolled
            ? "border-(--site-border) border-b backdrop-blur-xl"
            : "border-transparent border-b",
        )}
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--site-bg) 80%, transparent)"
            : "transparent",
        }}
      />

      <nav className="relative mx-auto flex h-12 w-full max-w-280 items-center justify-between px-4 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display font-semibold text-base text-site-text"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl font-bold font-mono text-[15px] text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6"
            style={{
              background:
                "linear-gradient(135deg, var(--site-accent), var(--site-accent-hover))",
              boxShadow: "0 4px 14px var(--site-accent-subtle)",
            }}
          >
            b
          </span>
          <span className="tracking-tight">
            bhimraj<span className="text-site-accent">.</span>
          </span>
        </Link>

        {/* Floating glass nav island */}
        <ul
          ref={navRef}
          onMouseLeave={() => moveIndicator(activeHref)}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-(--site-border) p-1 backdrop-blur-md md:flex"
          style={{
            background:
              "color-mix(in srgb, var(--site-card-bg) 70%, transparent)",
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

          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
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
                    active
                      ? "text-(--site-text)"
                      : "text-(--site-text-secondary) hover:text-(--site-text)",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-5 w-5" />
            </a>
          </Button>
          <ModeToggle />

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <HamburgerMenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "cursor-pointer font-medium",
                      isActive(link.href) && "text-site-accent",
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
