import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { allResources } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/blog/comments";
import { EndMark } from "@/components/blog/post-end";
import { Chip } from "@/components/chip";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { CourseClassroom } from "@/components/resources/course-classroom";
import { groupMaterials } from "@/components/resources/materials";
import {
  getLectures,
  getPathsWith,
  getResource,
  totalSeconds,
} from "@/components/resources/resources";
import {
  KIND_LABELS,
  STATUS_LABELS,
  TOPIC_LABELS,
} from "@/components/resources/taxonomy";
import { focusRing, surface } from "@/components/surface";
import { formatHours } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allResources
    .filter((r) => r.hasPage)
    .map((r) => ({ slug: r._meta.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getResource((await params).slug);
  if (!resource?.hasPage) return { title: "Not found" };
  const lectures = getLectures(resource);
  const facts =
    lectures.length > 0
      ? ` ${lectures.length} lectures, ${formatHours(totalSeconds(lectures))} in all, with a checklist that keeps your progress in your browser.`
      : "";
  return pageMetadata({
    title: `${resource.title}${resource.term ? ` (${resource.term})` : ""}`,
    description: `${resource.tldr}${facts}`,
    path: `/resources/${resource._meta.path}`,
    keywords: [resource.source, ...resource.topics.map((t) => TOPIC_LABELS[t])],
    ownCard: true,
  });
}

export default async function ResourcePage({ params }: Props) {
  const resource = getResource((await params).slug);
  if (!resource?.hasPage) notFound();

  const slug = resource._meta.path;
  const lectures = getLectures(resource);
  const totalSec = totalSeconds(lectures);
  const { byLecture, general } = groupMaterials(resource.materials);
  const inPaths = getPathsWith(slug);
  const playlistUrl = resource.playlist
    ? `https://www.youtube.com/playlist?list=${resource.playlist}`
    : null;

  const facts = [
    KIND_LABELS[resource.kind].one,
    resource.source,
    resource.term,
    lectures.length > 0 &&
      `${lectures.length} lectures · ${formatHours(totalSec)}`,
  ].filter(Boolean);

  return (
    <main>
      <JsonLd
        data={[
          buildCourseJsonLd({
            title: resource.title,
            tldr: resource.tldr,
            slug,
            url: resource.url,
            source: resource.source,
            people: resource.people,
            term: resource.term,
            totalSec,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: resource.title, path: `/resources/${slug}` },
          ]),
        ]}
      />

      <Container className="px-4 pt-28 pb-10 sm:px-8 sm:pt-32">
        <Link
          href="/resources"
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
            {resource.title}
          </h1>
          {resource.people.length > 0 && (
            <p className="mt-3 text-site-text-secondary">
              {resource.people.join(", ")}
            </p>
          )}
          <p className="mt-5 max-w-2xl text-pretty text-base text-site-text-secondary leading-relaxed sm:text-[17px]">
            {resource.tldr}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {resource.status && <Chip>{STATUS_LABELS[resource.status]}</Chip>}
            {resource.watched !== undefined && lectures.length > 0 && (
              <Chip>
                {resource.watched >= lectures.length
                  ? "I've watched it all"
                  : `I've watched ${resource.watched} of ${lectures.length}`}
              </Chip>
            )}
            {resource.topics.map((t) => (
              <Chip key={t} tone="neutral">
                {TOPIC_LABELS[t]}
              </Chip>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <OutLink href={resource.url}>Course site</OutLink>
            </li>
            {playlistUrl && (
              <li>
                <OutLink href={playlistUrl}>Playlist on YouTube</OutLink>
              </li>
            )}
            {resource.otherTerms.map((t) => (
              <li key={t.url}>
                <OutLink href={t.url}>{t.term}</OutLink>
              </li>
            ))}
          </ul>

          {inPaths.length > 0 && (
            <ul className="mt-4 space-y-1 text-site-text-secondary text-sm">
              {inPaths.map(({ path, position }) => (
                <li key={path.slug}>
                  Step {position} of {path.steps.length} in{" "}
                  <Link
                    href={`/resources/paths/${path.slug}`}
                    className={cn(
                      "rounded-sm font-medium text-site-text underline decoration-site-accent/40 underline-offset-4 transition-colors hover:text-site-accent-text hover:decoration-site-accent",
                      focusRing,
                    )}
                  >
                    {path.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        {(resource.forWho ||
          resource.skipIf ||
          resource.prereqs.length > 0) && (
          <dl
            className={cn(
              surface,
              "mt-8 grid max-w-3xl gap-4 p-5 text-sm sm:grid-cols-3 sm:p-6",
            )}
          >
            {resource.forWho && <Fact label="Good for">{resource.forWho}</Fact>}
            {resource.skipIf && <Fact label="Skip if">{resource.skipIf}</Fact>}
            {resource.prereqs.length > 0 && (
              <Fact label="Before you start">
                {resource.prereqs.join(", ")}
              </Fact>
            )}
          </dl>
        )}
      </Container>

      {lectures.length > 0 ? (
        <section aria-label="Lectures" className="pb-16">
          <Container className="px-4 sm:px-8">
            <CourseClassroom
              course={slug}
              lectures={lectures.map(
                ({ id, title, speakers, durationSec, embeddable }, index) => ({
                  id,
                  title,
                  speakers,
                  durationSec,
                  embeddable,
                  materials: byLecture.get(index + 1) ?? [],
                }),
              )}
            />
          </Container>
        </section>
      ) : (
        playlistUrl && (
          <Container className="px-4 pb-16 sm:px-8">
            <p className="max-w-3xl text-site-text-secondary text-sm">
              The lecture list appears after the next sync. Until then, the{" "}
              <OutLink href={playlistUrl}>playlist is on YouTube</OutLink>.
            </p>
          </Container>
        )
      )}

      {general.length > 0 && (
        <Container className="px-4 pb-16 sm:px-8">
          <section aria-labelledby="materials-heading" className="max-w-3xl">
            <h2
              id="materials-heading"
              className="font-display font-semibold text-2xl text-site-text tracking-tight"
            >
              Course materials
            </h2>
            <p className="mt-2 text-site-text-secondary text-sm">
              Published by the course. These open on its own site.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {general.map((m) => (
                <li key={m.url}>
                  <OutLink href={m.url}>{m.label}</OutLink>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}

      {(resource.note || resource.notes) && (
        <Container className="px-4 pb-16 sm:px-8">
          <section aria-labelledby="notes-heading" className="max-w-3xl">
            <h2
              id="notes-heading"
              className="font-display font-semibold text-2xl text-site-text tracking-tight"
            >
              My notes
            </h2>
            {resource.note && (
              <p className="mt-4 text-pretty border-site-accent/40 border-l-2 pl-4 text-site-text italic leading-relaxed">
                {resource.note}
              </p>
            )}
            {resource.notes && (
              <div
                className="prose dark:prose-invert mt-4 max-w-none prose-headings:font-display prose-a:text-site-accent-text prose-headings:text-site-text prose-li:text-site-text-secondary prose-p:text-site-text-secondary prose-p:leading-relaxed prose-headings:tracking-tight dark:prose-headings:text-site-text dark:prose-li:text-site-text-secondary dark:prose-p:text-site-text-secondary dark:prose-strong:text-site-text"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: compiled from my own markdown at build time
                dangerouslySetInnerHTML={{ __html: resource.notes }}
              />
            )}
          </section>
        </Container>
      )}

      <Container className="px-4 pb-20 sm:px-8">
        <EndMark className="mb-12" />
        <Comments className="max-w-3xl" />
      </Container>
    </main>
  );
}

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="font-mono text-site-text-tertiary text-xs uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-pretty text-site-text-secondary leading-relaxed">
        {children}
      </dd>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm font-medium text-site-accent-text transition-colors hover:text-site-text dark:hover:text-site-accent-hover",
        focusRing,
      )}
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}
