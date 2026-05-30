import type { MonthlyContribution } from "@/lib/github";

export function ContributionGraph({ data }: { data: MonthlyContribution[] }) {
  const max = Math.max(...data.map((d) => d.commits), 1);
  const total = data.reduce((sum, d) => sum + d.commits, 0);
  const peak = data.reduce((a, b) => (b.commits > a.commits ? b : a), data[0]);

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
        {peak.commits > 0 && (
          <span className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[0.5px]">
            Peak · {peak.label} {peak.year} · {peak.commits}
          </span>
        )}
      </div>

      <div className="flex h-44 items-end gap-1.5 sm:gap-2.5">
        {data.map((d) => {
          const heightPct =
            d.commits > 0 ? Math.max((d.commits / max) * 100, 4) : 2;
          return (
            <div
              key={`${d.year}-${d.month}`}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="relative flex w-full flex-1 items-end justify-center">
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-site-border bg-site-bg-tertiary px-2 py-0.5 font-mono text-[10px] text-site-text opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {d.commits} · {d.label} {d.year}
                </span>
                <div
                  className="w-full rounded-t-sm bg-linear-to-t from-site-accent/25 to-site-accent transition-all duration-200 group-hover:from-site-accent/40 group-hover:to-site-accent-hover"
                  style={{ height: `${heightPct}%` }}
                  title={`${d.commits} commits in ${d.label} ${d.year}`}
                />
              </div>
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
