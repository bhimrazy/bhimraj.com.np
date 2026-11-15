import { JourneyReveal } from "@/components/oss/journey-reveal";
import { ArrowLink } from "@/components/section-heading";
import { PATH } from "./data";

/** Chapters shown before "Show earlier years". */
const VISIBLE = 2;

type Chapter = (typeof PATH)[number];

/** Newest first; entries with only a year have no month to sort by, so they go last. */
function newestFirst(chapter: Chapter): Chapter {
  const dated = chapter.entries.filter((e) => e.date !== chapter.year);
  const undated = chapter.entries.filter((e) => e.date === chapter.year);
  return { ...chapter, entries: [...dated.reverse(), ...undated] };
}

export function PathTimeline() {
  const chapters = [...PATH].reverse().map(newestFirst);
  const recent = chapters.slice(0, VISIBLE);
  const earlier = chapters.slice(VISIBLE);
  const moments = earlier.reduce((n, c) => n + c.entries.length, 0);

  return (
    <div>
      <ol className="flex flex-col [&>li:first-child]:border-t-0 [&>li:first-child]:pt-0">
        {recent.map((chapter) => (
          <ChapterItem key={chapter.year} chapter={chapter} />
        ))}
      </ol>
      {earlier.length > 0 && (
        <JourneyReveal
          label={`Show ${earlier.at(-1)?.year}–${earlier[0].year} · ${moments} more moments`}
        >
          <ol className="flex flex-col">
            {earlier.map((chapter) => (
              <ChapterItem key={chapter.year} chapter={chapter} />
            ))}
          </ol>
        </JourneyReveal>
      )}
    </div>
  );
}

function ChapterItem({ chapter }: { chapter: Chapter }) {
  return (
    <li className="grid grid-cols-1 gap-x-12 border-site-border border-t py-10 lg:grid-cols-[260px_1fr] dark:border-white/5">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p
          aria-hidden
          className="about-outline-numeral font-bold font-display text-6xl leading-none tracking-tighter sm:text-7xl"
        >
          {chapter.year}
        </p>
        <h3 className="mt-3 font-display font-semibold text-lg text-site-text">
          <span className="sr-only">{chapter.year}: </span>
          {chapter.heading}
        </h3>
      </div>

      <ul className="mt-6 flex flex-col gap-6 border-site-border border-l pl-6 lg:mt-1 dark:border-white/8">
        {chapter.entries.map((entry) => (
          <li key={entry.title} className="relative">
            <span
              aria-hidden
              className="absolute top-1.5 -left-7.25 size-2.5 rounded-full border-2 border-site-bg bg-site-accent"
            />
            {/* A bare year would repeat the chapter numeral. */}
            {entry.date !== chapter.year && (
              <p className="font-medium font-mono text-[11px] text-site-accent-text uppercase tracking-[1px]">
                {entry.date}
              </p>
            )}
            <p className="mt-1 font-display font-semibold text-base text-site-text">
              {entry.title}
            </p>
            {entry.body && (
              <p className="mt-1 max-w-xl text-pretty text-site-text-secondary text-sm leading-relaxed">
                {entry.body}
              </p>
            )}
            {entry.link && (
              <ArrowLink
                href={entry.link.href}
                external={!entry.link.href.startsWith("/")}
                className="mt-2"
              >
                {entry.link.label}
              </ArrowLink>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}
