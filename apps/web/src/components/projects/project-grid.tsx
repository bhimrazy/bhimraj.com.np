"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLinkIcon, withUtm } from "./link-utils";

export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubLink: string;
  liveLink?: string;
  featured: boolean;
  category: string;
};

const ALL = "All" as const;

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of projects) seen.add(p.category);
    return [ALL, ...Array.from(seen)];
  }, [projects]);

  const [active, setActive] = useState<string>(ALL);

  const visible =
    active === ALL ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter */}
      <fieldset className="mb-8 flex flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">Filter projects by category</legend>
        {categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full bg-site-accent px-3.5 py-1.5 font-mono text-[12px] text-site-bg transition-colors"
                  : "rounded-full border border-site-border bg-site-card px-3.5 py-1.5 font-mono text-[12px] text-site-text-secondary transition-colors hover:border-site-border-hover hover:text-site-text"
              }
            >
              {category}
            </button>
          );
        })}
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <div
      className={
        project.featured
          ? "group relative flex flex-col overflow-hidden rounded-xl border border-site-accent/40 bg-site-card transition-all duration-200 hover:-translate-y-0.5 hover:border-site-accent/70 hover:shadow-xl/5 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:shadow-site-accent-subtle"
          : "group relative flex flex-col overflow-hidden rounded-xl border border-site-border bg-site-card transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10 dark:hover:shadow-site-accent-subtle"
      }
    >
      {/* Cover image */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-2/1 w-full shrink-0 overflow-hidden border-site-border border-b bg-site-bg-secondary"
      >
        <Image
          src={project.image}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {project.featured && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-site-accent px-2 py-0.5 font-mono text-[10px] text-site-bg uppercase tracking-[0.5px]">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md border-transparent bg-site-accent-subtle font-mono text-[10px] text-site-accent"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <Link href={`/projects/${project.slug}`}>
          <h3 className="mb-2 font-display font-semibold text-base text-site-text leading-snug transition-colors hover:text-site-accent">
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-4 line-clamp-3 grow text-site-text-secondary text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 border-site-border/50 border-t pt-4">
          <a
            href={withUtm(project.githubLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-site-text-tertiary text-xs transition-colors hover:text-site-text"
          >
            <GitHubLogoIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          {project.liveLink && (
            <a
              href={withUtm(project.liveLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-site-accent text-xs transition-colors hover:text-site-accent-hover"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              Open in Lightning Studio
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
