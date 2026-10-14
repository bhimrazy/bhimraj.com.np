import { ArrowLink } from "@/components/section-heading";
import { PATH } from "../facts";
import { Chapter } from "./chapter";

/** Years that get a "read more" pointer beside the sentence. */
const MORE: Partial<Record<(typeof PATH)[number]["year"], string>> = {
  "2024": "/oss",
};

/** The short version, as a hand-drawn-feeling vertical line of years. */
export function Path() {
  return (
    <Chapter id="path" aside="the short version">
      <ol className="relative">
        {PATH.map(({ year, text }, i) => {
          const isLast = i === PATH.length - 1;
          const more = MORE[year];
          return (
            <li
              key={year}
              className="relative grid grid-cols-[3.25rem_1rem_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0"
            >
              <span className="pt-0.5 font-mono text-[13px] text-site-text-tertiary tabular-nums">
                {year}
              </span>
              {/* Dot on the rail; the rail runs down to the next dot. */}
              <span aria-hidden className="relative flex justify-center">
                <span
                  className={
                    isLast
                      ? "mt-[0.45rem] size-2.5 rounded-full bg-site-accent ring-4 ring-site-accent-subtle"
                      : "mt-[0.45rem] size-2.5 rounded-full border-2 border-site-border-hover bg-site-bg"
                  }
                />
                {!isLast && (
                  <span className="absolute top-[1.15rem] -bottom-6 w-px bg-site-border" />
                )}
              </span>
              <p className="text-pretty text-[15px] text-site-text-secondary leading-relaxed">
                {text}
                {more && (
                  <>
                    {" "}
                    <ArrowLink href={more} className="text-[13px]">
                      the open-source log
                    </ArrowLink>
                  </>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </Chapter>
  );
}
