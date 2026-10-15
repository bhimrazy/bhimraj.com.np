/**
 * Shared facts for the homepage explorations (/v/a, /v/b, /v/c).
 *
 * Everything here is already stated elsewhere in the repo (experience section,
 * /about data, OSS timeline, research page, projects) or in the verified OSS
 * milestone research. Anything personal that only Bhimraj can supply is a
 * `PLACEHOLDER`, rendered by <Ph> so it's obvious on screen.
 *
 * Live numbers come from `@bhimrazy/github` inside each version, not from here.
 */

export const PLACEHOLDER = Symbol("placeholder");
/** A slot only Bhimraj can fill. `hint` is what the slot is for. */
export type Placeholder = { [PLACEHOLDER]: true; hint: string };
export const ph = (hint: string): Placeholder => ({
  [PLACEHOLDER]: true,
  hint,
});

export const PERSON = {
  name: "Bhimraj Yadav",
  handle: "@bhimrazy",
  role: "Software engineer",
  city: "Kathmandu, Nepal",
  hometown: "Lahan, Siraha (Terai, Nepal)",
  avatar: "/bhimraj-yadav.jpg",
  youtube: "https://www.youtube.com/@bhimrajyadav",
  studios: "https://lightning.ai/bhimrajyadav",
} as const;

/**
 * The parallel threads of work. Equal weight: none is "the" identity.
 * Order is a suggestion (full-time first).
 */
export const THREADS = [
  {
    key: "product",
    verb: "Build products",
    org: "Fetchly Labs",
    orgHref: undefined,
    role: "Software Engineer · full-time · since 2022",
    line: "Building products end to end, from the first version to production, and the AI features inside them.",
    logo: "fetchly",
  },
  {
    key: "oss",
    verb: "Maintain open source",
    org: "Lightning AI",
    orgHref: "/oss",
    role: "Tier 2 OSS contributor · LitData core team · since 2024",
    line: "Helping maintain open-source tools teams use to train and serve models, and cutting their releases.",
    logo: "lightning",
  },
  {
    key: "infra",
    verb: "Ship infrastructure",
    org: "StableCluster",
    orgHref: "https://stablecluster.com",
    role: "Consultant · since 2024",
    line: "Cloud infrastructure, deployment workflows and production-ready systems for AI and software teams.",
    logo: "stablecluster",
  },
  {
    key: "research",
    verb: "Do research",
    org: "Computer vision & healthcare AI",
    orgHref: "/research",
    role: "IEEE Access 2024 · MS in Applied AI (in progress)",
    line: "Co-authored a peer-reviewed study of segmentation models. Now interested in small, efficient vision-language models that can run where doctors are scarce.",
    logo: undefined,
  },
  {
    key: "community",
    verb: "Teach and share",
    org: "Writing, videos, community",
    orgHref: "/blog",
    role: "Blog · YouTube · KathFOSS",
    line: "Long-form posts with interactive figures, Lightning Studios templates, and KathFOSS, Kathmandu's free and open-source software community, where I served as vice-president and secretary.",
    logo: undefined,
  },
] as const;

/** Mixed "selected work": not all from one org. */
export const SELECTED_WORK = [
  {
    title: "Receipt OCR",
    kind: "My project",
    line: "Tesseract for raw text, an LLM for structured fields, as a CLI and a FastAPI service.",
    href: "/projects/receipt-ocr",
    meta: "stars", // filled from getFeaturedRepoStats()
  },
  {
    title: "PyTorch Lightning 2.6.1",
    kind: "Release",
    line: "My first release of the core framework, owned end to end.",
    href: "https://github.com/Lightning-AI/pytorch-lightning/releases/tag/2.6.1",
    meta: "Jan 2026",
  },
  {
    title: "LitData core team",
    kind: "Open source",
    line: "100 merged PRs and nine releases of the data-loading library for training at scale.",
    href: "/oss",
    meta: "since Aug 2024",
  },
  {
    title: "RF-DETR & Chatterbox TTS APIs",
    kind: "Lightning Studios",
    line: "Production-ready model APIs on LitServe, published as one-click Studios.",
    href: "/projects",
    meta: "Mar 2026",
  },
  {
    title: "Pore segmentation in SEM images",
    kind: "Paper · IEEE Access",
    line: "A comparative study of state-of-the-art deep-learning models for semantic segmentation.",
    href: "https://ieeexplore.ieee.org/document/10478488",
    meta: "2024",
  },
  {
    title: "3D lung tumour segmentation",
    kind: "Project",
    line: "Segmenting lung tumours from CT scans with MONAI and PyTorch Lightning.",
    href: "/projects/lung-tumours-segmentation",
    meta: "2022",
  },
] as const;

/** Short path, for versions that tell a story. */
export const PATH = [
  {
    year: "2018",
    text: "Started B.E. Computer Engineering at Kathford (TU), on a full scholarship.",
  },
  {
    year: "2022",
    text: "Joined Fetchly Labs; first deep-learning projects in medical imaging.",
  },
  {
    year: "2023",
    text: "Wrote a from-scratch UNet guide; open-sourced Receipt OCR.",
  },
  {
    year: "2024",
    text: "IEEE Access paper; first LitServe PR; joined the LitData core team; started consulting.",
  },
  { year: "2025", text: "Became a Tier 2 contributor at Lightning AI." },
  { year: "2026", text: "Cut my first PyTorch Lightning releases." },
] as const;

/**
 * Personality slots: Bhimraj has to fill these. Versions should show them
 * with <Ph> so the gap is visible, not invent anything.
 */
/** One entry in a "Currently" row: a short name, an optional note, a link. */
export type NowItem = { text: string; note?: string; href?: string };

/** The newest thing worth a one-line mention near the top of the page. */
export const LATEST: NowItem = {
  text: "vps-ready",
  note: "make a fresh VPS ready and secure, without locking yourself out",
  href: "https://github.com/bhimrazy/vps-ready",
};

export const PERSONAL = {
  interests: ["Travelling", "Exploring new things", "Working out", "Music"],
  currently: {
    building: [
      {
        text: "vps-ready",
        note: "make a fresh VPS ready and secure",
        href: "https://github.com/bhimrazy/vps-ready",
      },
      {
        text: "Receipt OCR",
        note: "structured data from receipts with OCR and LLMs",
        href: "https://github.com/bhimrazy/receipt-ocr",
      },
    ],
    learning: [
      {
        text: "CME 295: Transformers & LLMs",
        note: "Stanford",
        href: "https://cme295.stanford.edu/",
      },
      {
        text: "6.5940: TinyML and Efficient AI Computing",
        note: "MIT",
        href: "https://hanlab.mit.edu/courses/2026-fall-65940",
      },
    ],
    reading: [
      {
        text: "Building Secure & Reliable Systems",
        note: "Google",
        href: "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html",
      },
      {
        text: "Site Reliability Engineering",
        note: "Google",
        href: "https://sre.google/sre-book/table-of-contents/",
      },
    ],
    // Seasonal: update after Tihar.
    elsewhere: [{ text: "Enjoying the Dashain holidays" }],
  },
  voiceLine:
    "Away from the keyboard, you'll find me travelling, exploring new things, working out, or lost in a good playlist.",
} as const;
