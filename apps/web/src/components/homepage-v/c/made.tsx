import { getFeaturedRepoStats } from "@bhimrazy/github";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { chip, surfaceInteractive } from "@/components/homepage/surface";
import { ArrowLink } from "@/components/section-heading";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SELECTED_WORK } from "../facts";
import { Chapter } from "./chapter";

type Work = (typeof SELECTED_WORK)[number];

function Meta({ work }: { work: Work }) {
  if (work.meta !== "stars") return <>{work.meta}</>;
  const repo = getFeaturedRepoStats();
  if (!repo) return <>GitHub</>;
  return (
    <span className="inline-flex items-center gap-1">
      <StarFilledIcon aria-hidden className="size-3 text-site-accent" />
      {formatCompact(repo.stars)} stars
    </span>
  );
}

function ShelfLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return href.startsWith("http") ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** A mixed shelf: my own project, releases, a paper. Not one org's portfolio. */
export function Made() {
  return (
    <Chapter id="made" aside="a mixed shelf">
      <ul className="grid gap-3 sm:grid-cols-2">
        {SELECTED_WORK.map((work) => {
          const external = work.href.startsWith("http");
          return (
            <li key={work.title} className="flex">
              <ShelfLink
                href={work.href}
                className={cn(
                  surfaceInteractive,
                  "group flex w-full flex-col rounded-xl p-4 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:p-5",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className={chip}>{work.kind}</span>
                  <span className="font-mono text-[11px] text-site-text-tertiary">
                    <Meta work={work} />
                  </span>
                </span>
                <span className="mt-3.5 flex items-baseline justify-between gap-3 sm:mt-4">
                  <span className="text-pretty font-display font-semibold text-[17px] text-site-text leading-snug transition-colors group-hover:text-site-accent">
                    {work.title}
                  </span>
                  <span
                    aria-hidden
                    className="text-site-text-tertiary text-sm transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-site-accent motion-reduce:transition-none"
                  >
                    {external ? "↗" : "→"}
                  </span>
                </span>
                <span className="mt-1.5 text-pretty text-site-text-secondary text-sm leading-relaxed">
                  {work.line}
                </span>
              </ShelfLink>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        <ArrowLink href="/projects">All projects</ArrowLink>
        <ArrowLink href="/oss">Open-source log</ArrowLink>
        <ArrowLink href="/research">Research</ArrowLink>
      </div>
    </Chapter>
  );
}
