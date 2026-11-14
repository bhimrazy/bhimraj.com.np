import { ossStartDate } from "@bhimrazy/github";

/** "2024-03-01" → "Mar 2024". UTC, or the 1st reads as the previous month west of UTC. */
export const OSS_START_LABEL = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(ossStartDate));
