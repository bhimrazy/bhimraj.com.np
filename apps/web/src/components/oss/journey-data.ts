export type TimelineQuote = {
  text: string;
  author: string;
  role: string;
};

export type TimelineLink = {
  label: string;
  href: string;
};

export type TimelineItem = {
  /** "Mon YYYY" */
  date: string;
  title: string;
  body: string;
  link?: TimelineLink;
  quotes?: TimelineQuote[];
  /** A turning point: drawn larger on the rail. Everything else is a regular beat. */
  milestone?: boolean;
};

/**
 * Oldest first. Dates for the "Nth merged PR" entries come from the GitHub
 * search API; the "Nth commit" entries use GitHub's contributor count, the
 * same metric as the totals above the timeline.
 */
export const TIMELINE: TimelineItem[] = [
  {
    date: "Mar 2024",
    title: "Joined the Lightning AI Studios Publisher Program",
    body: "Invited into the Publisher Program to collaborate with the team and build Studios — my first foothold in the Lightning AI ecosystem.",
    quotes: [
      {
        text: "We're excited for you to collaborate with us and build some great Studios.",
        author: "Corey Strausman",
        role: "Lightning AI",
      },
    ],
  },
  {
    date: "Mar 2024",
    title: "Published my first Lightning Studio",
    body: "My first public artifact in the Lightning AI ecosystem — and the spark that pulled me toward contributing upstream.",
    link: {
      label: "View the announcement",
      href: "https://x.com/bhimrazy/status/1773618727910588875",
    },
  },
  {
    date: "May 2024",
    title: "First PR to the Lightning ecosystem — LitServe",
    body: "My first contribution to a Lightning AI repo. It merged a couple of days later, with a few words from the founders that I still keep around.",
    milestone: true,
    link: {
      label: "LitServe #113",
      href: "https://github.com/Lightning-AI/LitServe/pull/113",
    },
    quotes: [
      {
        text: "Let's goo! Merged 🚀",
        author: "Luca Antiga",
        role: "CTO, Lightning AI",
      },
      {
        text: "congrats @bhimrazy! solid contribution",
        author: "William Falcon",
        role: "CEO, Lightning AI",
      },
    ],
  },
  {
    date: "Jun 2024",
    title: "First PR to LitData",
    body: "Started with just a one-line change — the beginning of what became my most active corner of the ecosystem.",
    link: {
      label: "LitData #169",
      href: "https://github.com/Lightning-AI/litData/pull/169",
    },
  },
  {
    date: "Aug 2024",
    title: "Joined the LitData core team",
    body: "Invited onto the core team after a few months of contributions — a small group of maintainers shaping where the library goes next.",
    milestone: true,
    quotes: [
      {
        text: "I want to welcome Bhimraj Yadav to the LitData core-team. He made some splendid contributions to LitData in the past months and we are quite eager to see what comes next 😉",
        author: "Thomas Chaton",
        role: "LitData maintainer, Lightning AI",
      },
    ],
  },
  {
    date: "Aug 2024",
    title: "Shipped my first LitData release",
    body: "Cut and announced LitData v0.2.24 — my first time owning a release end to end.",
    link: {
      label: "LitData v0.2.24 release notes",
      href: "https://github.com/Lightning-AI/litdata/releases/tag/v0.2.24",
    },
  },
  {
    date: "Feb 2025",
    title: "Became a Tier 2 OSS Contributor at Lightning AI",
    body: "Recognized as a Tier 2 OSS Contributor — the result of a year of steady work across LitData, LitServe, and the wider ecosystem.",
    milestone: true,
  },
  {
    date: "Apr 2025",
    title: "First PR to LitGPT",
    body: "OpenAI-spec support for `litgpt serve` — my first change on the LLM side of the ecosystem.",
    link: {
      label: "LitGPT #1943",
      href: "https://github.com/Lightning-AI/litgpt/pull/1943",
    },
  },
  {
    date: "May 2025",
    title: "50th merged PR to LitData",
    body: "Fifty merged pull requests to LitData — and I shipped v0.2.46 the same day.",
    link: {
      label: "LitData #579",
      href: "https://github.com/Lightning-AI/litData/pull/579",
    },
  },
  {
    date: "Jun 2025",
    title: "First PR to PyTorch Lightning itself",
    body: "A docs fix to the compatibility matrix. Small, but it was the framework that started it all for me.",
    link: {
      label: "PyTorch Lightning #20948",
      href: "https://github.com/Lightning-AI/pytorch-lightning/pull/20948",
    },
  },
  {
    date: "Oct 2025",
    title: "100th commit to LitData",
    body: "Crossed 100 commits to LitData — by now my home base in the ecosystem, from streaming datasets to releases.",
    milestone: true,
  },
  {
    date: "Nov 2025",
    title: "Started contributing to datasketch",
    body: "Branched out beyond Lightning with CI hygiene for ekzhu/datasketch, a widely used library of probabilistic data structures.",
    link: {
      label: "datasketch #253",
      href: "https://github.com/ekzhu/datasketch/pull/253",
    },
  },
  {
    date: "Dec 2025",
    title: "50th commit to PyTorch Lightning",
    body: "Hit 50 commits to PyTorch Lightning itself — the framework that started it all for me.",
  },
  {
    date: "Dec 2025",
    title: "Cut my first LitServe release",
    body: "LitServe v0.2.17 — the second Lightning library I've shipped end to end.",
    link: {
      label: "LitServe v0.2.17 release notes",
      href: "https://github.com/Lightning-AI/LitServe/releases/tag/v0.2.17",
    },
  },
  {
    date: "Jan 2026",
    title: "Cut my first PyTorch Lightning release",
    body: "Owned a release of the core framework end to end — Lightning v2.6.1.",
    milestone: true,
    link: {
      label: "PyTorch Lightning v2.6.1 release notes",
      href: "https://github.com/Lightning-AI/pytorch-lightning/releases/tag/2.6.1",
    },
  },
  {
    date: "Aug 2026",
    title: "250th merged PR across Lightning AI",
    body: "A quarter of a thousand merged pull requests across the org, two years and three months after the first one.",
    milestone: true,
    link: {
      label: "LitServe #727",
      href: "https://github.com/Lightning-AI/LitServe/pull/727",
    },
  },
  {
    date: "Aug 2026",
    title: "receipt-ocr passed 500 stars",
    body: "The side project I started in December 2023 crossed 500 GitHub stars — and kept climbing.",
    link: {
      label: "bhimrazy/receipt-ocr",
      href: "https://github.com/bhimrazy/receipt-ocr",
    },
  },
  {
    date: "Aug 2026",
    title: "100th commit to PyTorch Lightning",
    body: "By GitHub's contributor count, my hundredth commit to the core framework landed — a long way from that first docs fix.",
    milestone: true,
  },
  {
    date: "Oct 2026",
    title: "100th merged PR to LitData",
    body: "One hundred merged pull requests to LitData, nearly a year and a half after a one-line first PR.",
    link: {
      label: "LitData #941",
      href: "https://github.com/Lightning-AI/litData/pull/941",
    },
  },
  {
    date: "Oct 2026",
    title: "500th contribution across the ecosystem",
    body: "Five hundred commits across the repos I contribute to, by GitHub's count — most of them in the Lightning ecosystem.",
    milestone: true,
  },
];

/** Pulls the year out of a "Mon YYYY" date label, e.g. "Mar 2024" -> "2024". */
export function yearOf(date: string): string {
  return date.split(" ").at(-1) ?? date;
}

/** Groups already-ordered timeline items into [year, items][] runs, preserving order. */
export function groupByYear(items: TimelineItem[]): [string, TimelineItem[]][] {
  const groups: [string, TimelineItem[]][] = [];
  for (const item of items) {
    const year = yearOf(item.date);
    const last = groups.at(-1);
    if (last && last[0] === year) {
      last[1].push(item);
    } else {
      groups.push([year, [item]]);
    }
  }
  return groups;
}

/**
 * Newest-first split for the collapsible journey: the `recent` entries are
 * always visible, the `earlier` ones sit behind "Show full journey".
 */
export function splitJourney(items: TimelineItem[], visible: number) {
  const newestFirst = [...items].reverse();
  return {
    recent: newestFirst.slice(0, visible),
    earlier: newestFirst.slice(visible),
  };
}
