import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { allProjects } from "content-collections";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const UTM =
  "utm_source=bhimraj.com.np&utm_medium=portfolio&utm_campaign=projects";

function withUtm(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${UTM}`;
}

export default function ProjectSection() {
  const projects = [...(allProjects as Project[])].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project._meta.path}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-site-border bg-site-card px-5 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10 dark:hover:shadow-site-accent-subtle"
        >
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
          <Link href={`/projects/${project._meta.path}`}>
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
                Lightning AI
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
