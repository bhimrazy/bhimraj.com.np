import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { allProjects } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip } from "@/components/chip";
import { Container } from "@/components/container";
import ContactSection from "@/components/homepage/contact-section";
import { withUtm } from "@/components/projects/link-utils";
import { ProjectCover } from "@/components/projects/project-cover";
import {
  getRepoStats,
  getSortedProjects,
  liveLabel,
} from "@/components/projects/projects";
import { ArrowLink, PageHeader } from "@/components/section-heading";
import { surfaceInteractive } from "@/components/surface";
import { siteConfig } from "@/config/site";
import { formatCompact, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

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
  const projects = getSortedProjects();
  const index = projects.findIndex((p) => p._meta.path === slug);

  if (index === -1) {
    notFound();
  }

  const project = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const stats = getRepoStats(project.githubLink);

  return (
    <main>
      <Container className="px-4 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/projects"
            className={cn(
              "mb-10 inline-flex items-center gap-1.5 rounded-sm text-site-text-secondary text-sm transition-colors hover:text-site-text",
              focusRing,
            )}
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
            All projects
          </Link>

          <PageHeader
            eyebrow={project.category}
            title={project.title}
            description={project.description}
          >
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-site-text-tertiary text-xs">
              <time dateTime={project.publishedAt}>
                {formatShortDate(project.publishedAt)}
              </time>
              {stats && (
                <>
                  <span className="flex items-center gap-1.5 font-semibold text-site-accent-text">
                    <StarFilledIcon className="size-3.5" aria-hidden />
                    {formatCompact(stats.stars)} stars
                  </span>
                  <span>{formatCompact(stats.forks)} forks</span>
                </>
              )}
            </p>

            {(project.liveLink || project.githubLink) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                {project.liveLink && (
                  <a
                    href={withUtm(project.liveLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex h-10 items-center gap-1.5 rounded-lg bg-site-accent px-4 font-semibold text-site-on-accent text-sm transition-colors hover:bg-site-accent/85",
                      focusRing,
                    )}
                  >
                    {liveLabel(project)} <span aria-hidden>↗</span>
                  </a>
                )}
                {project.githubLink && (
                  <ArrowLink href={withUtm(project.githubLink)} external>
                    View on GitHub
                  </ArrowLink>
                )}
              </div>
            )}

            {project.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Chip tone="neutral">{tag}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </PageHeader>

          <ProjectCover
            slug={project._meta.path}
            className="mt-10 mb-10 rounded-xl border border-site-border dark:border-white/5"
          />

          <div
            className="prose dark:prose-invert wrap-break-word max-w-none prose-headings:scroll-mt-24 overflow-hidden whitespace-normal prose-code:rounded prose-img:rounded-xl prose-pre:rounded-xl prose-img:border prose-pre:border prose-blockquote:border-l-site-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-headings:font-bold prose-headings:font-display prose-a:text-site-accent prose-code:text-[13px] prose-h2:text-2xl prose-h3:text-xl prose-li:text-site-text-secondary prose-p:text-site-text-secondary prose-pre:text-[13px] prose-blockquote:not-italic prose-p:leading-relaxed prose-headings:tracking-tight prose-a:no-underline prose-code:before:content-none prose-code:after:content-none hover:prose-a:underline dark:prose-img:border-site-border dark:prose-pre:border-site-border dark:prose-code:text-site-text dark:prose-headings:text-site-text dark:prose-li:text-site-text-secondary dark:prose-p:text-site-text-secondary dark:prose-strong:text-site-text"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: MDX content is trusted
            dangerouslySetInnerHTML={{ __html: project.html }}
          />

          {(prev || next) && (
            <nav
              aria-label="More projects"
              className="mt-14 grid grid-cols-1 gap-3 border-site-border border-t pt-8 sm:grid-cols-2"
            >
              {prev && (
                <Link
                  href={`/projects/${prev._meta.path}`}
                  className={cn(
                    surfaceInteractive,
                    "group flex flex-col rounded-xl px-5 py-4",
                    focusRing,
                  )}
                >
                  <span className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
                    <ChevronLeftIcon className="size-3" aria-hidden />
                    Previous
                  </span>
                  <span className="font-display font-semibold text-site-text text-sm transition-colors group-hover:text-site-accent">
                    {prev.title}
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/projects/${next._meta.path}`}
                  className={cn(
                    surfaceInteractive,
                    "group flex flex-col rounded-xl px-5 py-4 text-right sm:col-start-2 sm:items-end",
                    focusRing,
                  )}
                >
                  <span className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
                    Next
                    <ChevronRightIcon className="size-3" aria-hidden />
                  </span>
                  <span className="font-display font-semibold text-site-text text-sm transition-colors group-hover:text-site-accent">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </Container>
      <ContactSection index="01" />
    </main>
  );
}
