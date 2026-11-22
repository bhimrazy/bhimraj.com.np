/**
 * Published CVE records per year.
 * Source: https://cve.icu/ (yearly_summary.json, CVE Program data), fetched
 * 2026-11-22; within ~1% of https://cve.0xosprey.com/.
 */
export const CVE_BY_YEAR = [
  { year: 2015, count: 6494 },
  { year: 2016, count: 6449 },
  { year: 2017, count: 14642 },
  { year: 2018, count: 16510 },
  { year: 2019, count: 17305 },
  { year: 2020, count: 18322 },
  { year: 2021, count: 20149 },
  { year: 2022, count: 25073 },
  { year: 2023, count: 28816 },
  { year: 2024, count: 39953 },
  { year: 2025, count: 48150 },
  { year: 2026, count: 102419 },
] as const;

/** The last year is year to date. */
export const CVE_PARTIAL = { year: 2026, through: "22 Nov" } as const;

export interface Incident {
  name: string;
  /** Time from malicious release to removal, in hours. */
  hours: number;
  /** How the source states it. */
  window: string;
}

/**
 * How long known malicious releases stayed live.
 * Source: William Woodruff, "We should all be using dependency cooldowns",
 * https://blog.yossarian.net/2025/11/21/We-should-all-be-using-dependency-cooldowns
 * LiteLLM 1.107.0 (PyPI, Oct 2026): Help Net Security.
 */
export const INCIDENTS: readonly Incident[] = [
  { name: "rspack", hours: 1, window: "1h" },
  { name: "Ultralytics (2)", hours: 1, window: "1h" },
  { name: "LiteLLM", hours: 1.75, window: "1h45m" },
  { name: "Nx", hours: 4, window: "4h" },
  { name: "web3.js", hours: 5, window: "5h" },
  // Source says "<12h"; plotted at the bound.
  { name: "chalk", hours: 12, window: "<12h" },
  { name: "Ultralytics (1)", hours: 12, window: "12h" },
  { name: "tj-actions", hours: 3 * 24, window: "3d" },
  { name: "Kong Ingress", hours: 10 * 24, window: "~10d" },
  { name: "xz-utils", hours: 5 * 7 * 24, window: "~5w" },
];

export const COOLDOWNS = [
  { value: "0", label: "None", days: 0 },
  { value: "3", label: "3 days", days: 3 },
  { value: "7", label: "7 days", days: 7 },
  { value: "14", label: "14 days", days: 14 },
] as const;

export type CooldownValue = (typeof COOLDOWNS)[number]["value"];

/**
 * A release is skipped only if it was pulled before it became old enough to
 * install, so a window equal to the cooldown still gets through.
 */
export const isBlocked = (incident: Incident, days: number) =>
  incident.hours < days * 24;

/** Illustrative commits for the tag-vs-SHA figure. */
export const ACTION = {
  repo: "org/action",
  tag: "v4",
  older: "7f3e9a1",
  good: "a1b2c3d",
  goodFull: "a1b2c3d4e5f6",
  bad: "e666f0c",
} as const;

export type Leg = "private" | "untrusted" | "egress";

/**
 * Simon Willison's lethal trifecta for AI agents:
 * https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
 */
export const TRIFECTA: readonly {
  id: Leg;
  label: string;
  examples: string;
  /** Narration when this leg is switched off. */
  off: string;
}[] = [
  {
    id: "private",
    label: "Private data",
    examples: "your repo, .env, ~/.ssh",
    off: "The agent can still be tricked and can still send, but there is nothing secret within reach. Run it without your .env, keys or broad tokens mounted.",
  },
  {
    id: "untrusted",
    label: "Untrusted content",
    examples: "issues, web pages, READMEs",
    off: "Nobody can slip the agent instructions. Hard to guarantee in practice: issues, web pages and dependency READMEs are where agents spend their day.",
  },
  {
    id: "egress",
    label: "Can send data out",
    examples: "network, git push, PR comments",
    off: "The agent can still be tricked, but it has nowhere to send what it reads. Sandboxed network access does this.",
  },
];
