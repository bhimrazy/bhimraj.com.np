import {
  groupByYear,
  splitJourney,
  TIMELINE,
  type TimelineItem,
} from "./journey-data";
import { JourneyReveal } from "./journey-reveal";

/** How many of the newest entries stay visible before "Show full journey". */
const VISIBLE = 5;

export function Timeline() {
  const { recent, earlier } = splitJourney(TIMELINE, VISIBLE);
  const recentGroups = groupByYear(recent);
  const earlierGroups = groupByYear(earlier);
  // When a year straddles the cut, the collapsed part continues it without a
  // second heading.
  const continuesYear = earlierGroups[0]?.[0] === recentGroups.at(-1)?.[0];
  const oldest = earlier.at(-1)?.date ?? recent.at(-1)?.date ?? "";

  return (
    <div className="flex flex-col gap-10">
      {recentGroups.map(([year, items]) => (
        <YearGroup key={year} year={year} items={items} />
      ))}

      {earlier.length > 0 && (
        <JourneyReveal
          label={`Show full journey · ${earlier.length} earlier ${earlier.length === 1 ? "moment" : "moments"}, back to ${oldest}`}
        >
          <div className="flex flex-col gap-10">
            {earlierGroups.map(([year, items], i) => (
              <YearGroup
                key={year}
                year={year}
                items={items}
                headless={i === 0 && continuesYear}
              />
            ))}
          </div>
        </JourneyReveal>
      )}
    </div>
  );
}

function YearGroup({
  year,
  items,
  headless = false,
}: {
  year: string;
  items: TimelineItem[];
  headless?: boolean;
}) {
  return (
    <div className={headless ? "-mt-10" : undefined}>
      {!headless && (
        <div className="mb-4 flex items-center gap-3">
          <span className="font-bold font-display text-site-text text-xl">
            {year}
          </span>
          <span className="h-px flex-1 bg-site-border" />
        </div>
      )}

      <ol className="relative ml-2 border-site-border border-l">
        {items.map((item) => (
          <li
            key={item.title}
            className={
              headless
                ? "relative pt-10 pb-10 pl-8 last:pb-0"
                : "relative pb-10 pl-8 last:pb-0"
            }
          >
            {/* Rail node: milestones get a bigger, ringed dot. */}
            {item.milestone ? (
              <span className="absolute top-1 -left-[7px] size-3.5 rounded-full border-2 border-site-bg bg-site-accent ring-4 ring-site-accent/20" />
            ) : (
              <span className="absolute top-1.5 -left-1.25 size-2.5 rounded-full border-2 border-site-border-hover bg-site-bg" />
            )}
            <span className="font-medium font-mono text-[11px] text-site-accent uppercase tracking-[1px]">
              {item.date}
            </span>
            <h3
              className={
                item.milestone
                  ? "mt-1 font-display font-semibold text-lg text-site-text"
                  : "mt-1 font-display font-semibold text-base text-site-text"
              }
            >
              {item.title}
            </h3>
            <p className="mt-1.5 max-w-2xl text-site-text-secondary text-sm leading-relaxed">
              {item.body}
            </p>

            {item.quotes && item.quotes.length > 0 && (
              <div className="mt-3 flex flex-col gap-2.5">
                {item.quotes.map((q) => (
                  <blockquote
                    key={q.author}
                    className="relative overflow-hidden rounded-lg border border-site-accent/20 border-l-2 border-l-site-accent bg-site-accent-subtle px-4 py-3"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-0 right-2 font-display text-5xl text-site-accent/15 leading-none"
                    >
                      “
                    </span>
                    <p className="relative text-site-text text-sm italic leading-relaxed">
                      “{q.text}”
                    </p>
                    <footer className="relative mt-1.5 font-mono text-[11px] text-site-text-secondary">
                      {q.author} · {q.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}

            {item.link && (
              <a
                href={item.link.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-1 font-mono text-[12px] text-site-accent transition-colors hover:text-site-accent-hover"
              >
                {item.link.label}
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
