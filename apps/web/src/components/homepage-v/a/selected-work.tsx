import { getFeaturedRepoStats } from "@bhimrazy/github";
import { formatCompact } from "@/lib/format";
import { SELECTED_WORK } from "../facts";
import { Section, SmartLink } from "./primitives";

/** Mixed work across products, releases, papers. Plain rows, no cards. */
export function SelectedWork() {
  const stars = getFeaturedRepoStats()?.stars;

  return (
    <Section label="Selected work" action={{ href: "/projects", text: "All" }}>
      <ul className="-mx-3">
        {SELECTED_WORK.map((w) => {
          const meta =
            w.meta === "stars"
              ? stars != null
                ? `★ ${formatCompact(stars)}`
                : null
              : w.meta;
          return (
            <li key={w.title}>
              <SmartLink
                href={w.href}
                className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-site-bg-secondary focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-site-text">
                    <span className="font-medium transition-colors group-hover:text-site-accent">
                      {w.title}
                    </span>
                    <span className="ml-2 whitespace-nowrap font-mono text-[11px] text-site-text-tertiary">
                      {w.kind}
                    </span>
                  </p>
                  {meta && (
                    <span className="shrink-0 font-mono text-[11.5px] text-site-text-tertiary tabular-nums">
                      {meta}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-site-text-secondary text-sm leading-relaxed">
                  {w.line}
                </p>
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
