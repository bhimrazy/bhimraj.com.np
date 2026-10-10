import type { MonthlyContribution } from "@bhimrazy/github";
import { cn } from "@/lib/utils";

export function ContributionGraph({ data }: { data: MonthlyContribution[] }) {
  const max = Math.max(...data.map((d) => d.commits), 1);
  const total = data.reduce((sum, d) => sum + d.commits, 0);
  const peak = data.reduce<MonthlyContribution | null>(
    (a, b) => (a && a.commits >= b.commits ? a : b),
    null,
  );

  return (
    <div className="rounded-xl border border-site-border bg-site-card p-6 sm:p-8 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-site-text">
            Contribution activity
          </h3>
          <p className="mt-1 text-site-text-secondary text-sm">
            {total.toLocaleString()} commits over the last 12 months
          </p>
        </div>
        {peak && peak.commits > 0 && (
          <span className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
            Peak · {peak.label} {peak.year} · {peak.commits}
          </span>
        )}
      </div>

      <div className="flex h-44 items-end gap-1.5 sm:gap-2.5">
        {data.map((d) => {
          const heightPct =
            d.commits > 0 ? Math.max((d.commits / max) * 100, 4) : 2;
          const count = `${d.commits} commit${d.commits === 1 ? "" : "s"}`;
          return (
            <div
              key={`${d.year}-${d.month}`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              {/* A button, so the breakdown opens from the keyboard too. */}
              <button
                type="button"
                aria-label={`${d.label} ${d.year}: ${count}`}
                className="group relative flex h-full w-full flex-1 cursor-default items-end justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
              >
                {/* Hover / focus breakdown card */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 block w-44 -translate-x-1/2 rounded-lg border border-site-border bg-site-card p-3 text-left opacity-0 shadow-black/10 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/8 dark:bg-site-bg-tertiary">
                  <span className="flex items-baseline justify-between gap-2 border-site-border/60 border-b pb-1.5">
                    <span className="font-display font-semibold text-site-text text-xs">
                      {d.label} {d.year}
                    </span>
                    <span className="font-mono text-[11px] text-site-accent">
                      {count}
                    </span>
                  </span>
                  {d.byRepo.length > 0 ? (
                    <span className="mt-2 block space-y-1">
                      {d.byRepo.map((r) => (
                        <span
                          key={r.repo}
                          className="flex items-center justify-between gap-2 font-mono text-[11px]"
                        >
                          <span className="truncate text-site-text-secondary">
                            {r.name}
                          </span>
                          <span className="shrink-0 text-site-text-tertiary">
                            {r.commits}
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="mt-2 block font-mono text-[11px] text-site-text-tertiary">
                      No contributions
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    "block w-full rounded-t-sm bg-linear-to-t transition-all duration-200 group-hover:from-site-accent/40 group-hover:to-site-accent-hover",
                    d === peak
                      ? "from-site-accent to-site-accent-hover"
                      : "from-site-accent/25 to-site-accent",
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              </button>
              <span className="font-mono text-[10px] text-site-text-tertiary">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
