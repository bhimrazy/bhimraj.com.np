"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { activeNavHref, NAV_LINKS } from "./nav-links";

/**
 * Reads the URL, so it only resolves at request time — render it inside a
 * <Suspense> boundary with <MobileMenu /> as the prerendered fallback.
 */
export function ActiveMobileMenu() {
  const pathname = usePathname();
  return <MobileMenu activeHref={activeNavHref(pathname)} />;
}

/** Small-screen nav dropdown. Prerenderable: the active link is a prop. */
export function MobileMenu({
  activeHref = null,
}: {
  activeHref?: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 rounded-xl border-site-border bg-site-card p-1.5 text-site-text shadow-2xl shadow-black/10 dark:border-white/8 dark:bg-site-card dark:text-site-text dark:shadow-black/40"
      >
        {NAV_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.href}
            asChild
            className="rounded-lg px-3 py-2 text-sm focus:bg-site-bg-secondary focus:text-site-text dark:focus:bg-site-bg-secondary dark:focus:text-site-text"
          >
            <Link
              href={link.href}
              aria-current={link.href === activeHref ? "page" : undefined}
              className={cn(
                "cursor-pointer font-medium text-site-text-secondary hover:bg-site-bg-secondary hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2",
                link.href === activeHref &&
                  "text-site-accent-text hover:text-site-accent-text focus:text-site-accent-text dark:focus:text-site-accent-text",
              )}
            >
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
