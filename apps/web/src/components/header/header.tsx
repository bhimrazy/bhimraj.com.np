import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import HeaderBackdrop from "./backdrop";
import { ActiveMobileMenu, MobileMenu } from "./mobile-menu";
import { ActiveNavIsland, NavIsland } from "./nav-island";

/**
 * Server shell: everything that does not depend on the URL is prerendered
 * here, and the two URL-aware pieces stream in behind their own boundaries.
 */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 py-2">
      <HeaderBackdrop />

      <nav className="relative mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
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

        <Suspense fallback={<NavIsland />}>
          <ActiveNavIsland />
        </Suspense>

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

          <Suspense fallback={<MobileMenu />}>
            <ActiveMobileMenu />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
