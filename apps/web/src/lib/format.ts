/**
 * Compact count: exact with a thousands separator under 10k ("1,093"), one
 * floored decimal above ("31.3k"). Flooring keeps a trailing "+" honest.
 */
export function formatCompact(n: number): string {
  if (n >= 10_000) return `${Math.floor(n / 100) / 10}k`;
  return n.toLocaleString("en-US");
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
