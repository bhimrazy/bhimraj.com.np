import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { BrandMark, Wordmark } from "@/components/brand-mark";
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
          aria-label="Bhimraj Yadav, home"
          className="group flex items-center gap-2.5 rounded-md font-display font-semibold text-base text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
        >
          <BrandMark
            size={28}
            sunClassName="transition-transform duration-300 [transform-box:fill-box] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          />
          <Wordmark />
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
