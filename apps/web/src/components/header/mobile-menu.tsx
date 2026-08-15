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
      <DropdownMenuContent align="end" className="w-44">
        {NAV_LINKS.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link
              href={link.href}
              className={cn(
                "cursor-pointer font-medium",
                link.href === activeHref && "text-site-accent",
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
