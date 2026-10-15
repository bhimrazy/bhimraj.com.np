import { getGitHubStars } from "@bhimrazy/github";
import {
  GitHubLogoIcon,
  LightningBoltIcon,
  ReaderIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import BlogPreview from "../../homepage/blog-preview";
import { ColumnTitle } from "../../homepage/column-title";
import { surface } from "../../homepage/surface";
import { PERSON, THREADS } from "../facts";

type Place = {
  icon: ReactNode;
  title: string;
  note: string;
  href: string;
  external?: boolean;
};

const research = THREADS.find((t) => t.key === "research");

/*
 * The paper already has a card in Selected work, so this column is a slim
 * index of everywhere else the writing and teaching live, instead of a second
 * copy of the same publication.
 */
function places(): Place[] {
  return [
    {
      icon: <ReaderIcon aria-hidden />,
      title: "Research",
      note: research?.role ?? "",
      href: "/research",
    },
    {
      icon: <VideoIcon aria-hidden />,
      title: "YouTube",
      note: "youtube.com/@bhimrajyadav",
      href: PERSON.youtube,
      external: true,
    },
    {
      icon: <LightningBoltIcon aria-hidden />,
      title: "Lightning Studios",
      note: "Templates and model APIs, published as one-click Studios",
      href: PERSON.studios,
      external: true,
    },
    {
      icon: <GitHubLogoIcon aria-hidden />,
      title: PERSON.handle,
      note: `${getGitHubStars().toLocaleString("en-US")} stars across my own repositories`,
      href: siteConfig.links.github,
      external: true,
    },
  ];
}

function PlaceRow({ place }: { place: Place }) {
  const className =
    "group flex items-center gap-4 px-6 py-4.5 transition-colors hover:bg-site-bg-secondary/70 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 sm:px-7 dark:hover:bg-white/3";
  const body = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-site-border bg-site-bg-secondary text-site-text-secondary transition-colors group-hover:text-site-accent dark:border-white/6 dark:bg-white/3 [&_svg]:size-4">
        {place.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-semibold text-site-text transition-colors group-hover:text-site-accent">
          {place.title}
        </span>
        <span className="mt-0.5 block text-pretty text-site-text-tertiary text-xs leading-snug">
          {place.note}
        </span>
      </span>
      <span
        aria-hidden
        className="text-site-accent text-sm transition-transform group-hover:translate-x-0.5"
      >
        {place.external ? "↗" : "→"}
      </span>
    </>
  );
  return place.external ? (
    <a
      href={place.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
    </a>
  ) : (
    <Link href={place.href} className={className}>
      {body}
    </Link>
  );
}

export default function Writing() {
  return (
    <section id="writing" className="scroll-mt-20 py-20 sm:py-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Blog"
          title="Writing"
          description="Long-form posts on what I build and learn, and where else to find me."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-5">
          <BlogPreview />
          <div className="flex flex-col">
            {/* Zero-width action keeps this title on the same baseline as "All posts". */}
            <ColumnTitle
              title="Elsewhere"
              action={
                <span aria-hidden className="text-sm">
                  &#8203;
                </span>
              }
            />
            <ul
              className={cn(
                surface,
                "flex flex-1 flex-col justify-between divide-y divide-site-border/60 dark:divide-white/5",
              )}
            >
              {places().map((place) => (
                <li key={place.title} className="flex-1 content-center">
                  <PlaceRow place={place} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
