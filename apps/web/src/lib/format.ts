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

/** Lecture lengths: 6268 → "1h 44m", 2940 → "49m", 45 → "1m". */
export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Total watch time, rounded to the hour past 10h: 47520 → "13h". */
export function formatHours(seconds: number): string {
  return seconds >= 36_000
    ? `${Math.round(seconds / 3600)}h`
    : formatDuration(seconds);
}

/** Player position: 83 → "1:23", 3723 → "1:02:03". */
export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60));
  const ss = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${mm.padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
}
