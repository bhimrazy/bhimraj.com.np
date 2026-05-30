type TimelineQuote = {
  text: string;
  author: string;
  role: string;
};

type TimelineLink = {
  label: string;
  href: string;
};

type TimelineItem = {
  date: string;
  title: string;
  body: string;
  link?: TimelineLink;
  quotes?: TimelineQuote[];
};

const TIMELINE: TimelineItem[] = [
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
  },
  {
    date: "Oct 2025",
    title: "100th commit to LitData",
    body: "Crossed 100 commits to LitData — by now my home base in the ecosystem, from streaming datasets to releases.",
  },
  {
    date: "Dec 2025",
    title: "50th commit to PyTorch Lightning",
    body: "Hit 50 commits to PyTorch Lightning itself — the framework that started it all for me.",
  },
  {
    date: "Jan 2026",
    title: "Cut my first PyTorch Lightning release",
    body: "Owned a release of the core framework end to end — Lightning v2.6.1.",
    link: {
      label: "PyTorch Lightning v2.6.1 release notes",
      href: "https://github.com/Lightning-AI/pytorch-lightning/releases/tag/2.6.1",
    },
  },
];

export function Timeline() {
  return (
    <ol className="relative ml-2 border-site-border border-l">
      {[...TIMELINE].reverse().map((item) => (
        <li key={item.title} className="relative pb-10 pl-8 last:pb-0">
          <span className="absolute top-1.5 -left-1.25 h-2.5 w-2.5 rounded-full border-2 border-site-bg bg-site-accent" />
          <span className="font-medium font-mono text-[11px] text-site-accent uppercase tracking-[1px]">
            {item.date}
          </span>
          <h3 className="mt-1 font-display font-semibold text-base text-site-text">
            {item.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-site-text-secondary text-sm leading-relaxed">
            {item.body}
          </p>

          {item.quotes && item.quotes.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {item.quotes.map((q) => (
                <blockquote
                  key={q.author}
                  className="rounded-lg border border-site-border/60 border-l-2 border-l-site-accent bg-site-card px-4 py-2.5"
                >
                  <p className="text-site-text text-sm italic leading-relaxed">
                    “{q.text}”
                  </p>
                  <footer className="mt-1.5 font-mono text-[11px] text-site-text-tertiary">
                    {q.author} · {q.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}

          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 font-mono text-[12px] text-site-accent transition-colors hover:text-site-accent-hover"
            >
              {item.link.label}
              <span aria-hidden>→</span>
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
