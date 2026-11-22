"use client";

import { GitHubLogoIcon, StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { Chip } from "@/components/chip";
import { focusRing, surfaceInteractive } from "@/components/surface";
import { formatCompact, formatShortDate } from "@/lib/format";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { RepoStats } from "./projects";

export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  category: Project["category"];
  featured: boolean;
  /** Already UTM-tagged. */
  githubLink?: string;
  liveLink?: string;
  liveLabel: string;
  stats: RepoStats | null;
  /** Rendered on the server, so the client never computes the geometry. */
  cover: ReactNode;
};

const ALL = "All";

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const categories = useMemo(
    () => [ALL, ...new Set(projects.map((p) => p.category))],
    [projects],
  );
  const [active, setActive] = useState(ALL);

  const visible =
    active === ALL ? projects : projects.filter((p) => p.category === active);
  const count = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;

  return (
    <div>
      <fieldset className="mb-8 min-w-0 border-0 p-0">
        <legend className="sr-only">Filter projects by category</legend>
        {/* One scrolling row on mobile; py-1 keeps the focus ring unclipped. */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((category) => {
            const isActive = category === active;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[12px] transition-colors",
                  focusRing,
                  isActive
                    ? "bg-site-accent text-site-on-accent"
                    : "border border-site-border bg-site-card text-site-text-secondary hover:border-site-border-hover hover:text-site-text",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p aria-live="polite" className="sr-only">
        {active === ALL ? count : `${count} in ${active}`}
      </p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => {
          const lead = i === 0 && project.featured;
          return (
            <li key={project.slug} className={cn(lead && "md:col-span-2")}>
              <ProjectCard project={project} lead={lead} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The title is a stretched link, so the GitHub and live links can sit inside without nesting <a>. */
function ProjectCard({
  project,
  lead,
}: {
  project: ProjectCardData;
  lead: boolean;
}) {
  return (
    <article className={cn(surfaceInteractive, "group flex h-full flex-col")}>
      {project.cover}

      <div className={cn("flex flex-1 flex-col p-6", lead && "sm:p-7")}>
        <p className="flex items-center justify-between gap-3 font-mono text-[11px]">
          <Chip>{project.category}</Chip>
          <span className="text-site-text-tertiary">
            {project.featured
              ? "Featured"
              : formatShortDate(project.publishedAt)}
          </span>
        </p>

        <div className="mt-4 flex items-start justify-between gap-4">
          <h2
            className={cn(
              "text-pretty font-display font-semibold text-site-text leading-snug tracking-tight",
              lead ? "text-2xl sm:text-[28px]" : "text-lg",
            )}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-site-accent focus-visible:after:-outline-offset-2"
            >
              {project.title}
            </Link>
          </h2>
          <span
            aria-hidden
            className="text-site-accent-text text-sm transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        </div>
        <p
          className={cn(
            "mt-2 text-pretty text-site-text-secondary leading-relaxed",
            lead ? "max-w-xl" : "line-clamp-3 text-sm",
          )}
        >
          {project.description}
        </p>

        <ul className="mt-4 mb-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Chip tone="neutral">{tag}</Chip>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 border-site-border/60 border-t pt-4 text-site-text-tertiary text-xs dark:border-white/5">
          {lead && project.stats && (
            <>
              <span className="flex items-center gap-1.5 font-semibold text-site-accent-text">
                <StarFilledIcon className="size-3.5" aria-hidden />
                {formatCompact(project.stats.stars)} stars
              </span>
              <span>{formatCompact(project.stats.forks)} forks</span>
            </>
          )}
          {/* z-10 lifts these above the title's stretched link. */}
          <span className="relative z-10 ml-auto flex items-center gap-2">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg px-2 font-mono text-site-text-secondary transition-colors hover:text-site-text",
                  focusRing,
                )}
              >
                <GitHubLogoIcon className="size-3.5" aria-hidden />
                GitHub
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg font-semibold text-sm transition-colors",
                  focusRing,
                  lead
                    ? "bg-site-accent px-3.5 text-site-on-accent hover:bg-site-accent/85"
                    : "px-2 text-site-accent-text hover:text-site-accent-hover",
                )}
              >
                {project.liveLabel} <span aria-hidden>↗</span>
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
