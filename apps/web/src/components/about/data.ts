/**
 * Everything the /about page says, kept in one place so the facts are easy to
 * audit. Every entry is sourced from elsewhere on the site: the experience
 * section, the OSS timeline, the research page, and the projects/blog content.
 * Live numbers (PRs, commits, stars) come from `@bhimrazy/github` instead.
 */

import { siteConfig } from "@/config/site";

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

export const PATH: readonly PathChapter[] = [
  {
    year: "2022",
    heading: "Shipping software for clients",
    entries: [
      {
        date: "2022",
        title: "Joined Fetchly Labs as a Software Engineer",
        body: "Building production software at a custom software consultancy serving clients across the US.",
      },
      {
        date: "Apr 2022",
        title: "3D lung tumour segmentation with MONAI",
        body: "Segmenting lung tumours from CT scans, trained with PyTorch Lightning.",
        link: { label: "Project", href: "/projects/lung-tumours-segmentation" },
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
        body: "Tesseract for raw text, an LLM for structured fields — as a CLI and a FastAPI service.",
        link: { label: "Project", href: "/projects/receipt-ocr" },
      },
    ],
  },
  {
    year: "2024",
    heading: "Into the Lightning AI ecosystem",
    entries: [
      {
        date: "Mar 2024",
        title: "Joined the Lightning AI Studios Publisher Program",
        body: "And published my first Lightning Studio.",
      },
      {
        date: "2024",
        title: "Co-authored a paper in IEEE Access",
        body: "A comparative study of deep learning models for semantic segmentation of pores in SEM images.",
        link: { label: "Research", href: "/research" },
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
        title: "Started consulting with StableCluster",
        body: "Cloud infrastructure, deployment workflows and production-ready systems for AI and software teams.",
      },
    ],
  },
  {
    year: "2025",
    heading: "Going deeper",
    entries: [
      {
        date: "Feb 2025",
        title: "Became a Tier 2 OSS Contributor at Lightning AI",
      },
      {
        date: "Oct 2025",
        title: "100th commit to LitData",
      },
      {
        date: "Dec 2025",
        title: "50th commit to PyTorch Lightning",
      },
    ],
  },
  {
    year: "2026",
    heading: "Releasing the core framework",
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
        title: "Shipped RF-DETR and Chatterbox TTS APIs on LitServe",
        link: { label: "Projects", href: "/projects" },
      },
    ],
  },
];

type Quote = {
  text: string;
  author: string;
  role: string;
  context: string;
  href?: string;
};

/** Verbatim from the OSS timeline (`components/oss/timeline.tsx`). */
export const QUOTES: readonly Quote[] = [
  {
    text: "I want to welcome Bhimraj Yadav to the LitData core-team. He made some splendid contributions to LitData in the past months and we are quite eager to see what comes next 😉",
    author: "Thomas Chaton",
    role: "LitData maintainer, Lightning AI",
    context: "Welcoming me to the LitData core team · Aug 2024",
  },
  {
    text: "congrats @bhimrazy! solid contribution",
    author: "William Falcon",
    role: "CEO, Lightning AI",
    context: "On my first LitServe PR · May 2024",
    href: "https://github.com/Lightning-AI/LitServe/pull/113",
  },
  {
    text: "Let's goo! Merged 🚀",
    author: "Luca Antiga",
    role: "CTO, Lightning AI",
    context: "On my first LitServe PR · May 2024",
    href: "https://github.com/Lightning-AI/LitServe/pull/113",
  },
  {
    text: "We're excited for you to collaborate with us and build some great Studios.",
    author: "Corey Strausman",
    role: "Lightning AI",
    context: "Inviting me to the Studios Publisher Program · Mar 2024",
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
    items: ["Python", "FastAPI", "Streamlit", "React", "Next.js"],
  },
  {
    group: "Infra & delivery",
    items: ["AWS", "Docker", "Lightning Studios", "Cloud", "DevOps"],
  },
];

/** Where to find me. YouTube matches the channel in `content/site-info.md`. */
export const SOCIAL_LINKS = [
  { label: "GitHub", handle: "@bhimrazy", href: siteConfig.links.github },
  { label: "LinkedIn", handle: "in/bhimrazy", href: siteConfig.links.linkedin },
  { label: "X", handle: "@bhimrazy", href: "https://x.com/bhimrazy" },
  {
    label: "YouTube",
    handle: "@bhimrajyadav",
    href: "https://www.youtube.com/@bhimrajyadav",
  },
  {
    label: "Lightning Studios",
    handle: "lightning.ai/bhimrajyadav",
    href: "https://lightning.ai/bhimrajyadav",
  },
] as const;
