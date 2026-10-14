import { EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { ArrowLink, SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { CompanyLogo, LOGOS } from "../../homepage/company-logo";
import { surface } from "../../homepage/surface";
import { PERSON, THREADS } from "../facts";

type Thread = (typeof THREADS)[number];
type ThreadLink = { href: string; label: string; external?: boolean };

/** Link labels per thread; the hrefs come from facts. */
const LINKS: Partial<Record<Thread["key"], ThreadLink[]>> = {
  oss: [{ href: "/oss", label: "Open-source work" }],
  infra: [
    {
      href: "https://stablecluster.com",
      label: "stablecluster.com",
      external: true,
    },
  ],
  research: [{ href: "/research", label: "Research" }],
  community: [
    { href: "/blog", label: "Blog" },
    { href: PERSON.youtube, label: "YouTube", external: true },
  ],
};

const ICONS: Partial<Record<Thread["key"], ReactNode>> = {
  research: <EyeOpenIcon className="size-4" aria-hidden />,
  community: <Pencil2Icon className="size-4" aria-hidden />,
};

/** Optical sizing: the Lightning mark carries a tagline, so it needs more height. */
const LOGO_SIZE = {
  fetchly: "h-6",
  lightning: "h-8",
  stablecluster: "h-5.5",
} as const;

function Mark({ thread }: { thread: Thread }) {
  if (thread.logo) {
    return (
      <CompanyLogo
        logo={LOGOS[thread.logo]}
        company={thread.org}
        className={LOGO_SIZE[thread.logo]}
      />
    );
  }
  return (
    <span className="flex size-8 items-center justify-center rounded-lg border border-site-border bg-site-bg-secondary text-site-accent dark:border-white/6 dark:bg-white/3">
      {ICONS[thread.key]}
    </span>
  );
}

/*
 * Layout: 3 + 2. The top row is the three roles held at organisations (each
 * has a logo); the bottom row is the two practices that run across all of
 * them, given wider cards because their descriptions are longer. Every card
 * is the same height within its row, so nothing reads as the headline.
 */
const SPAN: Record<Thread["key"], string> = {
  product: "lg:col-span-2",
  oss: "lg:col-span-2",
  infra: "md:col-span-2 lg:col-span-2",
  research: "lg:col-span-3",
  community: "md:col-span-2 lg:col-span-3",
};

/** The two wide cards split into label | description at lg. */
const WIDE = new Set<Thread["key"]>(["research", "community"]);

export default function Threads() {
  return (
    <section id="what-i-do" className="scroll-mt-20 py-20 sm:py-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="Work"
          title="What I work on"
          description="Products, open source, infrastructure, and some research and writing on the side."
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {THREADS.map((thread) => {
            const links = LINKS[thread.key] ?? [];
            return (
              <li
                key={thread.key}
                className={cn(
                  surface,
                  "flex flex-col p-5 sm:p-7",
                  WIDE.has(thread.key) &&
                    "lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8",
                  SPAN[thread.key],
                )}
              >
                <div
                  className={cn(
                    "flex h-8 items-center",
                    WIDE.has(thread.key) && "lg:col-span-2",
                  )}
                >
                  <Mark thread={thread} />
                </div>
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-site-text text-xl leading-snug tracking-tight">
                    {thread.verb}
                  </h3>
                  <p className="mt-1 text-site-text-secondary text-sm">
                    {thread.org}
                  </p>
                  <p className="mt-0.5 text-pretty font-mono text-[11px] text-site-text-tertiary leading-relaxed">
                    {thread.role}
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-4 flex flex-1 flex-col",
                    WIDE.has(thread.key) && "lg:mt-6 lg:pt-0.5",
                  )}
                >
                  <p className="flex-1 text-pretty text-site-text-secondary text-sm leading-relaxed">
                    {thread.line}
                  </p>
                  {links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {links.map((link) => (
                        <ArrowLink
                          key={link.href}
                          href={link.href}
                          external={link.external}
                        >
                          {link.label}
                        </ArrowLink>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
