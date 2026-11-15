import { OSS_START_LABEL } from "@/components/oss/start-date";

type Link = { label: string; href: string };

type PathEntry = {
  date: string;
  title: string;
  body?: string;
  link?: Link;
};

type PathChapter = {
  year: string;
  heading: string;
  entries: readonly PathEntry[];
};

/**
 * The /about story. Facts are copied from the homepage, the OSS journey,
 * research and projects; edit them together.
 */
export const PATH: readonly PathChapter[] = [
  {
    year: "2022",
    heading: "Client work by day, medical imaging on the side",
    entries: [
      {
        date: "Apr 2022",
        title: "3D lung tumour segmentation with MONAI",
        body: "Segmenting lung tumours from CT scans, trained with PyTorch Lightning.",
        link: { label: "Project", href: "/projects/lung-tumours-segmentation" },
      },
      {
        date: "2022",
        title: "Joined Fetchly Labs as a Software Engineer",
        body: "Taking products and features from idea to launch.",
      },
    ],
  },
  {
    year: "2023",
    heading: "Writing it down, open-sourcing it",
    entries: [
      {
        date: "Apr 2023",
        title: "Wrote a from-scratch UNet guide in PyTorch",
        link: {
          label: "Read it",
          href: "/blog/pytorch-unet-image-segmentation-implementation",
        },
      },
      {
        date: "Dec 2023",
        title: "Open-sourced Receipt OCR",
        body: "Receipts to structured data: a Python package, and a web app to scan, check and export them.",
        link: { label: "Project", href: "/projects/receipt-ocr" },
      },
    ],
  },
  {
    year: "2024",
    heading: "Lightning AI, a paper, and consulting",
    entries: [
      {
        // Same source as the OSS journey and the "Active since" stat.
        date: OSS_START_LABEL,
        title: "Joined the Lightning AI Studios Publisher Program",
        body: "Published my first Lightning Studio the same month.",
      },
      {
        date: "May 2024",
        title: "First PR to LitServe",
        link: {
          label: "LitServe #113",
          href: "https://github.com/Lightning-AI/LitServe/pull/113",
        },
      },
      {
        date: "Aug 2024",
        title: "Joined the LitData core team",
        body: "Then cut my first release, LitData v0.2.24, end to end.",
        link: {
          label: "v0.2.24 notes",
          href: "https://github.com/Lightning-AI/litdata/releases/tag/v0.2.24",
        },
      },
      {
        date: "2024",
        title: "Co-authored a paper in IEEE Access",
        body: "A comparative study of deep learning models for segmenting pores in SEM images.",
        link: { label: "Research", href: "/research" },
      },
      {
        date: "2024",
        title: "Started consulting with StableCluster",
        body: "Cloud infrastructure, deployment workflows and production-ready systems for AI and software teams.",
      },
    ],
  },
  {
    year: "2025",
    heading: "From contributor to release owner",
    entries: [
      {
        date: "Feb 2025",
        title: "Became a Tier 2 open-source contributor at Lightning AI",
      },
      {
        date: "2025",
        title: "Handed over a client product at acquisition",
        body: "Saw it through the handover after the client was acquired.",
      },
      {
        date: "Dec 2025",
        title: "Cut my first LitServe release",
        link: {
          label: "v0.2.17 notes",
          href: "https://github.com/Lightning-AI/LitServe/releases/tag/v0.2.17",
        },
      },
    ],
  },
  {
    year: "2026",
    heading: "Core framework releases, and tools of my own",
    entries: [
      {
        date: "Jan 2026",
        title: "Cut PyTorch Lightning v2.6.1",
        body: "My first release of the core framework, owned end to end.",
        link: {
          label: "Release notes",
          href: "https://github.com/Lightning-AI/pytorch-lightning/releases/tag/2.6.1",
        },
      },
      {
        date: "Mar 2026",
        title: "Shipped RF-DETR and Chatterbox TTS APIs with LitServe",
        link: { label: "Projects", href: "/projects" },
      },
      {
        date: "Aug 2026",
        title: "Reached 250 merged PRs across Lightning AI",
        link: {
          label: "LitServe #727",
          href: "https://github.com/Lightning-AI/LitServe/pull/727",
        },
      },
      {
        date: "Oct 2026",
        title: "Released vps-ready",
        body: "A Rust CLI that makes a fresh VPS ready and secure, without locking yourself out.",
        link: { label: "Project", href: "/projects/vps-ready" },
      },
    ],
  },
];

export const TOOLBOX: readonly { group: string; items: readonly string[] }[] = [
  {
    group: "ML & AI",
    items: [
      "PyTorch",
      "PyTorch Lightning",
      "LitServe",
      "LitData",
      "LitGPT",
      "MONAI",
      "Tesseract OCR",
    ],
  },
  {
    group: "Product & web",
    items: ["Python", "FastAPI", "TypeScript", "React", "Next.js", "Rust"],
  },
  {
    group: "Infra & delivery",
    items: ["AWS", "Docker", "Lightning Studios"],
  },
];

type Quote = {
  text: string;
  author: string;
  role: string;
  context?: string;
  href?: string;
};

/** Quotes from outside the OSS journey: verbatim, with cuts marked "…", swaps in [brackets] and hashtags written as plain words. */
export const ABOUT_QUOTES: readonly Quote[] = [
  {
    text: "Over the past few months, he has been the invisible force keeping the open-source stack (PyTorch Lightning ⚡ and several others) running smoothly—reviewing contributions, jumping in to resolve critical issues, and coordinating with code owners on what needs approval.",
    author: "Jiri Borovec",
    role: "Research engineer, open source",
    context: "On LinkedIn · Feb 2026",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7427789453596745728/",
  },
  {
    // A private note, so neither the person nor the company is named.
    text: "THANK YOU x a million for being an incredible developer, leader, and person. You have saved [us] over and over again in a pinch… You are a unique talent, and I'm so excited to see where you go in your career!",
    author: "Founder and CEO",
    role: "a former client, since acquired",
  },
  {
    text: "@bhimrazyadav knows how to ship 🔥",
    author: "Luca Antiga",
    role: "then CTO, Lightning AI",
    context: "On OpenAI-compatible embeddings in LitServe · Nov 2024",
    href: "https://x.com/bhimrazy/status/1861866608513445941",
  },
  {
    text: "Super! Yet another cool idea Bhimraj, keep shipping ⚡️",
    author: "Luca Antiga",
    role: "then CTO, Lightning AI",
    context: "On using LitData with MinIO · Jun 2024",
    href: "https://x.com/bhimrazy/status/1801909093872943315",
  },
];

/** Journey quotes that stay on the /oss timeline but don't stand alone as cards. */
export const SKIPPED_JOURNEY_QUOTES: ReadonlySet<string> = new Set([
  "Let's goo! Merged 🚀",
]);

export const EDUCATION: readonly {
  school: string;
  via?: string;
  degree: string;
  years: string;
  current?: boolean;
}[] = [
  {
    school: "Coventry University",
    via: "Softwarica College of IT and E-Commerce",
    degree: "MSc Data Science and Computational Intelligence",
    years: "2026 – 2027",
    current: true,
  },
  {
    school: "Kathford International College of Engineering and Management",
    via: "Tribhuvan University",
    degree: "Bachelor of Computer Engineering (BCT)",
    years: "2018 – 2023",
  },
];
