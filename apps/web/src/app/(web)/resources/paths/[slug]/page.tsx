import { ChevronLeftIcon, VideoIcon } from "@radix-ui/react-icons";
import { allLearningPaths } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EndMark } from "@/components/blog/post-end";
import { Chip } from "@/components/chip";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PathCard } from "@/components/resources/path-card";
import {
  getPath,
  getPaths,
  type PathStep,
} from "@/components/resources/resources";
import { StepMarker } from "@/components/resources/step-marker";
import { KIND_LABELS } from "@/components/resources/taxonomy";
import { focusRing, surface } from "@/components/surface";
import { formatHours } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildLearningPathJsonLd,
} from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allLearningPaths.map((p) => ({ slug: p._meta.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = getPath((await params).slug);
  if (!path) return { title: "Not found" };
  return pageMetadata({
    title: `${path.title}: a learning path`,
    description: `${path.promise} ${path.steps.length} free resources in order, each with a line on why it comes where it does.`,
    path: `/resources/paths/${path.slug}`,
    keywords: ["learning path", ...path.steps.map((s) => s.resource.title)],
    ownCard: true,
  });
}

export default async function PathPage({ params }: Props) {
  const path = getPath((await params).slug);
  if (!path) notFound();

  const others = getPaths().filter((p) => p.slug !== path.slug);
  const hasLectures = path.steps.some((s) => s.lectureIds.length > 0);
  const facts = [
    "Learning path",
    `${path.steps.length} steps`,
    path.totalSec > 0 && `${formatHours(path.totalSec)} of lectures`,
  ].filter(Boolean);

  return (
    <main>
      <JsonLd
        data={[
          buildLearningPathJsonLd({
            slug: path.slug,
            title: path.title,
            promise: path.promise,
            steps: path.steps.map((s) => s.resource),
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: path.title, path: `/resources/paths/${path.slug}` },
          ]),
        ]}
      />

      <Container className="px-4 pt-28 pb-10 sm:px-8 sm:pt-32">
        <Link
          href="/resources#paths"
          className={cn(
            "-my-3.5 inline-flex items-center gap-1 rounded-sm py-3.5 font-mono text-site-text-tertiary text-xs transition-colors hover:text-site-text",
            focusRing,
          )}
        >
          <ChevronLeftIcon aria-hidden className="size-3.5" />
          Resources
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="font-mono text-site-accent-text text-xs uppercase tracking-[1.5px]">
            {facts.join(" · ")}
          </p>
          <h1 className="mt-3 text-balance font-bold font-display text-3xl text-site-text leading-[1.1] tracking-tight sm:text-5xl">
            {path.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-site-text-secondary leading-relaxed sm:text-[17px]">
            {path.promise}
          </p>
          <dl className="mt-6 max-w-2xl border-site-accent/40 border-l-2 pl-4 text-sm">
            <dt className="font-mono text-site-text-tertiary text-xs uppercase tracking-wider">
              Good for
            </dt>
            <dd className="mt-1 text-pretty text-site-text-secondary leading-relaxed">
              {path.forWho}
            </dd>
          </dl>
          {path.intro && (
            <div
              className="prose dark:prose-invert mt-6 max-w-none prose-a:text-site-accent-text prose-p:text-site-text-secondary prose-p:leading-relaxed dark:prose-p:text-site-text-secondary"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: compiled from my own markdown at build time
              dangerouslySetInnerHTML={{ __html: path.intro }}
            />
          )}
        </header>
      </Container>

      <Container className="px-4 pb-16 sm:px-8">
        <section aria-labelledby="route-heading" className="max-w-3xl">
          <h2 id="route-heading" className="sr-only">
            The route, in order
          </h2>
          <ol>
            {path.steps.map((step, index) => (
              <Step
                key={step.resource.slug}
                step={step}
                position={index + 1}
                last={index === path.steps.length - 1}
              />
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-pretty text-site-text-tertiary text-xs leading-relaxed sm:ml-14">
            {path.totalSec > 0 &&
              `Hours add up the lectures on YouTube so far${path.untimed > 0 ? `; ${path.untimed === 1 ? "one step has" : `${path.untimed} steps have`} no recordings to count` : ""}. `}
            {hasLectures &&
              "Tick lectures on a course page and its step fills in here. That progress stays in your browser."}
          </p>
        </section>
      </Container>

      <Container className="px-4 pb-20 sm:px-8">
        <EndMark className="mb-12" />
        {others.length > 0 && (
          <section aria-labelledby="more-paths" className="max-w-3xl">
            <h2
              id="more-paths"
              className="font-display font-semibold text-2xl text-site-text tracking-tight"
            >
              {others.length === 1 ? "Another path" : "More paths"}
            </h2>
            <ul className="mt-5 grid gap-4">
              {others.map((p) => (
                <li key={p.slug}>
                  <PathCard path={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </main>
  );
}

function Step({
  step,
  position,
  last,
}: {
  step: PathStep;
  position: number;
  last: boolean;
}) {
  const r = step.resource;
  const linkClass = cn(
    "group/link -my-2 block rounded-sm py-2 transition-colors hover:text-site-accent-text",
    focusRing,
  );
  const arrow = (glyph: string) => (
    <span
      aria-hidden
      className="ml-1.5 inline-block text-site-accent-text text-sm transition-transform group-hover/link:translate-x-0.5"
    >
      {glyph}
    </span>
  );

  return (
    <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0 sm:gap-x-4">
      {/* The rail between markers; the last step ends the line. */}
      {!last && (
        <span
          aria-hidden
          className="absolute top-10 bottom-0 left-5 w-px -translate-x-1/2 bg-site-border dark:bg-white/8"
        />
      )}
      <StepMarker
        position={position}
        course={r.slug}
        lectureIds={step.lectureIds}
      />
      <article className={cn(surface, "p-4 sm:p-6")}>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-2xs text-site-text-tertiary">
          <Chip tone="neutral">{KIND_LABELS[r.kind].one}</Chip>
          <span className="text-site-text-secondary">{r.source}</span>
          {r.term && (
            <>
              <span aria-hidden>·</span>
              <span>{r.term}</span>
            </>
          )}
          {r.lectureCount > 0 && (
            <span className="inline-flex items-center gap-1 sm:ml-auto">
              <VideoIcon aria-hidden className="size-3" />
              {`${r.lectureCount} lectures · ${formatHours(r.totalSec)}`}
            </span>
          )}
        </p>
        <h3 className="mt-3 text-pretty font-display font-semibold text-lg text-site-text leading-snug tracking-tight">
          {r.hasPage ? (
            <Link href={`/resources/${r.slug}`} className={linkClass}>
              {r.title}
              {arrow("→")}
            </Link>
          ) : (
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {r.title}
              {arrow("↗")}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </h3>
        <p className="mt-2 text-pretty text-site-text leading-relaxed">
          {step.why}
        </p>
        <p className="mt-2 text-pretty text-site-text-tertiary text-sm leading-relaxed">
          {r.tldr}
        </p>
      </article>
    </li>
  );
}
