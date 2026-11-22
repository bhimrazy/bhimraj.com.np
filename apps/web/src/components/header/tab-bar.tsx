"use client";

import {
  BackpackIcon,
  CubeIcon,
  DotsHorizontalIcon,
  HomeIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MENU_CONTENT, MenuLinks } from "./mobile-menu";
import { activeNavHref, MORE_LINKS, TAB_LINKS } from "./nav-links";
import { nextTabBarScroll } from "./tab-bar-scroll";

const ICONS: Record<string, typeof HomeIcon> = {
  "/": HomeIcon,
  "/blog": ReaderIcon,
  "/projects": CubeIcon,
  "/resources": BackpackIcon,
};

const tab =
  "flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl font-body font-medium text-2xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2";

const tabState = (active: boolean) =>
  active
    ? "bg-site-accent-subtle text-site-accent"
    : "text-site-text-secondary hover:text-site-text";

/**
 * Reads the URL, so it only resolves at request time — render it inside a
 * <Suspense> boundary with <TabBar /> as the prerendered fallback.
 */
export function ActiveTabBar() {
  const pathname = usePathname();
  return <TabBar activeHref={activeNavHref(pathname)} />;
}

/**
 * Bottom tab bar for the installed app on phones. Always rendered, but
 * display: none outside the `installed` variant, so browsers see nothing.
 */
export function TabBar({ activeHref = null }: { activeHref?: string | null }) {
  const [hidden, setHidden] = useState(false);
  const scroll = useRef({ hidden: false, anchorY: 0 });
  const moreActive = MORE_LINKS.some(({ href }) => href === activeHref);

  // Hide on scroll down, show on scroll up. Only wired up in the installed
  // app; the width check is left to CSS since the listener is cheap.
  useEffect(() => {
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      document.documentElement.hasAttribute("data-standalone");
    if (!installed) return;

    scroll.current = { hidden: false, anchorY: window.scrollY };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const root = document.documentElement;
        const next = nextTabBarScroll(
          scroll.current,
          window.scrollY,
          root.scrollHeight - window.innerHeight,
        );
        if (next.hidden !== scroll.current.hidden) setHidden(next.hidden);
        scroll.current = next;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keyboard focus inside a hidden bar brings it back.
  const reveal = () => {
    scroll.current = { ...scroll.current, hidden: false };
    setHidden(false);
  };

  return (
    <nav
      aria-label="App"
      data-hidden={hidden ? "" : undefined}
      onFocus={reveal}
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-(--tab-bar-offset) left-[max(0.75rem,env(safe-area-inset-left))] z-40 installed:block hidden transition-transform duration-300 ease-out data-hidden:translate-y-[calc(100%+var(--tab-bar-offset))] motion-reduce:transition-none"
    >
      <ul className="flex h-15 items-stretch gap-1 rounded-2xl border border-site-border bg-site-card/85 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {TAB_LINKS.map((link) => {
          const Icon = ICONS[link.href] ?? DotsHorizontalIcon;
          const active = link.href === activeHref;
          return (
            <li key={link.href} className="flex min-w-0 flex-1">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(tab, tabState(active))}
              >
                <Icon aria-hidden className="size-5" />
                {link.label}
              </Link>
            </li>
          );
        })}
        <li className="flex min-w-0 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(tab, "cursor-pointer", tabState(moreActive))}
            >
              <DotsHorizontalIcon aria-hidden className="size-5" />
              More
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              sideOffset={12}
              className={MENU_CONTENT}
            >
              <MenuLinks links={MORE_LINKS} activeHref={activeHref} />
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}
