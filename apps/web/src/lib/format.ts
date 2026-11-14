/** Compact count for stars/forks: 725 → "725", 1000 → "1k", 31361 → "31.4k". */
export function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "2023-04-11" → "Apr 11, 2023" (UTC, so server and client agree). */
export function formatShortDate(value: string | Date): string {
  return shortDate.format(typeof value === "string" ? new Date(value) : value);
}

/**
 * Snapshot counts only grow, so show a floor that stays true between syncs:
 * 54 → "50+", 314 → "310+", 1092 → "1,090+".
 */
export function atLeast(n: number, step = n >= 100 ? 10 : 5): string {
  if (n < step) return String(n); // a floor of 0 would read as "0+"
  return `${(Math.floor(n / step) * step).toLocaleString("en-US")}+`;
}

/** Whole or half years, floored: 32 months → "2.5+ years". */
export function yearsAtLeast(months: number): string {
  if (months < 12) return `${months} months`;
  return `${Math.floor(months / 6) / 2}+ years`;
}
