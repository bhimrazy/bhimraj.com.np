import { ChevronLeftIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { allProjects } from "content-collections";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const UTM =
  "utm_source=bhimraj.com.np&utm_medium=portfolio&utm_campaign=projects";
function withUtm(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${UTM}`;
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path === slug);

  const projectURL = `/projects/${project?._meta.path}`;

  return {
    title: project?.title,
    description: project?.description,
    alternates: { canonical: projectURL },
    keywords: project?.tags,
    openGraph: {
      title: project?.title,
      description: project?.description,
      url: projectURL,
      siteName: siteConfig.name,
      images: project?.image ? [{ url: project.image }] : [],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: project?.title,
      description: project?.description,
      creator: siteConfig.author.handle,
      images: project?.image ? [project.image] : [],
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
  // biome-ignore lint/style/noNonNullAssertion: guaranteed by generateStaticParams
  const project = allProjects.find((p) => p._meta.path === slug)! as Project;

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

          {/* Meta row */}
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-site-border border-b pb-8 text-sm">
            <time
              dateTime={project.publishedAt}
              className="font-mono text-site-text-tertiary text-xs"
            >
              {formatDate(project.publishedAt)}
            </time>
            <span className="text-site-border">·</span>
            <div className="flex items-center gap-3">
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
                  Lightning AI
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
        </div>
      </Container>
    </main>
  );
}
