import Link from "next/link";
import { surface } from "@/components/homepage/surface";
import { cn } from "@/lib/utils";
import { PERSONAL, THREADS } from "../facts";
import { NowItems } from "../now-items";
import { Chapter } from "./chapter";

const NOW = [
  { label: "Building", value: PERSONAL.currently.building },
  { label: "Learning", value: PERSONAL.currently.learning },
  { label: "Reading", value: PERSONAL.currently.reading },
  { label: "Off-screen", value: PERSONAL.currently.elsewhere },
] as const;

type ThreadKey = (typeof THREADS)[number]["key"];

/**
 * How each thread reads as a sentence. Every thread gets the same treatment
 * (a lead line, a detail line, a quiet role line): none is "the" identity.
 */
const THREAD_VOICE: Record<
  ThreadKey,
  { when: string; lead: string; name?: string }
> = {
  product: { when: "By day", lead: "I build products at" },
  infra: { when: "On the side", lead: "I consult on infrastructure with" },
  oss: { when: "In open source", lead: "I help maintain tools at" },
  research: {
    when: "In research",
    lead: "I study",
    name: "computer vision and healthcare AI",
  },
  community: {
    when: "In the community",
    lead: "I teach and share through",
    name: "writing, videos and community",
  },
};

const ORDER: readonly ThreadKey[] = [
  "product",
  "infra",
  "oss",
  "research",
  "community",
];

const threads = ORDER.map((key) => {
  const thread = THREADS.find((t) => t.key === key);
  if (!thread) throw new Error(`Missing thread: ${key}`);
  return { ...thread, ...THREAD_VOICE[key] };
});

function OrgName({ label, href }: { label: string; href?: string }) {
  if (!href) return <span className="text-site-text">{label}</span>;
  const className =
    "rounded-sm text-site-text underline decoration-site-accent/40 decoration-1 underline-offset-4 transition-colors hover:text-site-accent hover:decoration-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";
  return href.startsWith("http") ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Currently() {
  return (
    <Chapter id="currently" aside="a /now page, more or less">
      {/* The now card: what's on the desk this season. */}
      <div className={cn(surface, "p-5 sm:p-6")}>
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.5px]">
          <span aria-hidden className="size-1.5 rounded-full bg-site-success" />
          On my desk right now
        </p>
        <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-[15px] sm:grid-cols-[7rem_minmax(0,1fr)]">
          {NOW.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="pt-px font-mono text-[12px] text-site-text-tertiary leading-6">
                {label}
              </dt>
              <dd className="text-pretty text-site-text leading-6">
                <NowItems items={value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The threads: one line each, equal weight. */}
      <ul className="mt-8 divide-y divide-site-border/70 dark:divide-white/5">
        {threads.map((t) => (
          <li
            key={t.key}
            className="grid gap-1.5 py-5 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4"
          >
            <p className="pt-0.5 font-mono text-[12px] text-site-accent">
              {t.when}
            </p>
            <div>
              <p className="text-pretty font-medium text-[15px] text-site-text-secondary leading-relaxed sm:text-base">
                {t.lead} <OrgName label={t.name ?? t.org} href={t.orgHref} />.
              </p>
              <p className="mt-1 text-pretty text-[15px] text-site-text-secondary leading-relaxed">
                {t.line}
              </p>
              <p className="mt-2 font-mono text-[11px] text-site-text-tertiary">
                {t.role}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
