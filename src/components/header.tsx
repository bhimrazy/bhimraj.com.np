"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled ? "border-b backdrop-blur-xl" : "border-transparent border-b",
      )}
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--site-bg) 85%, transparent)"
          : "transparent",
        borderColor: scrolled ? "var(--site-border)" : "transparent",
      }}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold font-display text-lg text-site-text"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-site-accent font-bold text-sm text-white">
            B
          </span>
          bhimraj
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative font-body font-medium text-sm transition-colors",
                    isActive
                      ? "text-(--site-text)"
                      : "text-(--site-text-secondary) hover:text-(--site-text)",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-site-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
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
        </div>
      </nav>
    </header>
  );
}
