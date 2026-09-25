import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { allProjects } from "content-collections";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ExternalLinkIcon, withUtm } from "@/components/projects/link-utils";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Projects sorted newest-first — the same order the list page uses, so
 * prev/next navigation here matches what visitors browsed through. */
function sortedProjects(): Project[] {
  return [...(allProjects as Project[])].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path === slug);

  if (!project) {
    return { title: `Project not found | ${siteConfig.name}` };
  }

  const projectURL = `/projects/${project._meta.path}`;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: projectURL },
    keywords: project.tags,
    openGraph: {
      title: project.title,
      description: project.description,
      url: projectURL,
      siteName: siteConfig.name,
      images: project.image ? [{ url: project.image }] : [],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      creator: siteConfig.author.handle,
      images: project.image ? [project.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  };
}

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project._meta.path }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = sortedProjects();
  const index = projects.findIndex((p) => p._meta.path === slug);

  if (index === -1) {
    notFound();
  }

  const project = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];

  return (
    <main className="pt-24 pb-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <Link
            href="/projects"
            className="mb-10 inline-flex items-center gap-1.5 text-site-text-secondary text-sm transition-colors hover:text-site-text"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            All projects
          </Link>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
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
          )}

          {/* Title */}
          <h1 className="mb-4 font-bold font-display text-3xl text-site-text leading-tight sm:text-4xl">
            {project.title}
          </h1>

          {/* Meta sidebar/header */}
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-site-border bg-site-card p-5 text-sm sm:flex-row sm:items-start sm:justify-between dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
            <div className="flex flex-col gap-3">
              <div>
                <span className="block font-mono text-[10px] text-site-text-tertiary uppercase tracking-[1px]">
                  Published
                </span>
                <time
                  dateTime={project.publishedAt}
                  className="font-mono text-site-text text-xs"
                >
                  {formatDate(project.publishedAt)}
                </time>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-site-text-tertiary uppercase tracking-[1px]">
                  Category
                </span>
                <span className="font-mono text-site-text text-xs">
                  {project.category}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-site-text-tertiary uppercase tracking-[1px]">
                  Stack
                </span>
                <span className="font-mono text-site-text text-xs">
                  {project.tags.join(" · ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
              <a
                href={withUtm(project.githubLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-site-text-secondary text-xs transition-colors hover:text-site-text"
              >
                <GitHubLogoIcon className="h-3.5 w-3.5" />
                GitHub
              </a>
              {project.liveLink && (
                <a
                  href={withUtm(project.liveLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-site-accent text-xs transition-colors hover:opacity-80"
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Open in Lightning Studio
                </a>
              )}
            </div>
          </div>

          {/* OG image */}
          <div className="relative mb-10 aspect-2/1 w-full overflow-hidden rounded-xl border border-site-border">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {/* Content */}
          <div
            className="prose dark:prose-invert wrap-break-word max-w-none prose-headings:scroll-mt-24 overflow-hidden whitespace-normal prose-code:rounded prose-img:rounded-xl prose-pre:rounded-xl prose-img:border prose-pre:border prose-blockquote:border-l-site-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-headings:font-bold prose-headings:font-display prose-a:text-site-accent prose-code:text-[13px] prose-h2:text-2xl prose-h3:text-xl prose-li:text-site-text-secondary prose-p:text-site-text-secondary prose-pre:text-[13px] prose-blockquote:not-italic prose-p:leading-relaxed prose-headings:tracking-tight prose-a:no-underline prose-code:before:content-none prose-code:after:content-none hover:prose-a:underline dark:prose-img:border-site-border dark:prose-pre:border-site-border dark:prose-code:text-site-text dark:prose-headings:text-site-text dark:prose-li:text-site-text-secondary dark:prose-p:text-site-text-secondary dark:prose-strong:text-site-text"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: MDX content is trusted
            dangerouslySetInnerHTML={{ __html: project.html }}
          />

          {/* Prev / next navigation */}
          {(prev || next) && (
            <nav className="mt-14 grid grid-cols-1 gap-3 border-site-border border-t pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/projects/${prev._meta.path}`}
                  className="group flex flex-col rounded-xl border border-site-border bg-site-card px-4 py-3 transition-colors hover:border-site-border-hover"
                >
                  <span className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
                    <ChevronLeftIcon className="h-3 w-3" />
                    Newer
                  </span>
                  <span className="font-display font-semibold text-site-text text-sm transition-colors group-hover:text-site-accent">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/projects/${next._meta.path}`}
                  className="group flex flex-col rounded-xl border border-site-border bg-site-card px-4 py-3 text-right transition-colors hover:border-site-border-hover sm:items-end"
                >
                  <span className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
                    Older
                    <ChevronRightIcon className="h-3 w-3" />
                  </span>
                  <span className="font-display font-semibold text-site-text text-sm transition-colors group-hover:text-site-accent">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </div>
      </Container>
    </main>
  );
}
