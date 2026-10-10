/** Compact count for stars/forks: 725 → "725", 31361 → "31.4k". */
export function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
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
