/**
 * Homepage copy. Keep it general: the hero names no orgs or projects, and the
 * specifics live in the cards further down. Live numbers come from
 * `@bhimrazy/github` inside each section, not from here.
 */

export const PERSON = {
  name: "Bhimraj Yadav",
  handle: "@bhimrazy",
  role: "Software engineer",
  city: "Kathmandu, Nepal",
  avatar: "/bhimraj-yadav.jpg",
  youtube: "https://www.youtube.com/@bhimrajyadav",
  studios: "https://lightning.ai/bhimrajyadav",
} as const;

/**
 * The lines of work, with equal weight: none of them is "the" identity.
 * The first three are the Experience cards; research feeds the Writing column.
 */
export const THREADS = [
  {
    key: "product",
    verb: "Ship products",
    org: "Fetchly Labs",
    orgHref: "https://www.fetch.ly/",
    role: "Software Engineer · full-time",
    since: "2022",
    line: "Taking products from the first version to production, and building the AI features inside them.",
    logo: "fetchly",
  },
  {
    key: "oss",
    verb: "Maintain open source",
    org: "Lightning AI",
    orgHref: "/oss",
    role: "Tier 2 open-source contributor",
    since: "2024",
    line: "Helping maintain open-source tools teams use to train and serve models, and cutting their releases.",
    logo: "lightning",
  },
  {
    key: "infra",
    verb: "Consult on infrastructure",
    org: "StableCluster",
    orgHref: "https://stablecluster.com",
    role: "Consultant",
    since: "2024",
    line: "Guiding AI and software teams on cloud infrastructure, deployment workflows and production-ready systems, and getting hands-on when the work needs it.",
    logo: "stablecluster",
  },
  {
    key: "research",
    verb: "Do research",
    org: "Computer vision & healthcare AI",
    orgHref: "/research",
    role: "IEEE Access 2024 · MS in Applied AI (in progress)",
    since: null,
    line: "Co-authored a peer-reviewed study of segmentation models. Now interested in small, efficient vision-language models that can run where doctors are scarce.",
    logo: undefined,
  },
] as const;

/** Selected work: his own projects, model work, and research, not one org. */
export const SELECTED_WORK = [
  {
    title: "Receipt OCR",
    kind: "My project",
    line: "Tesseract for raw text, an LLM for structured fields, as a CLI and a FastAPI service.",
    href: "/projects/receipt-ocr",
    meta: "stars", // filled from getFeaturedRepoStats()
  },
  {
    title: "vps-ready",
    kind: "My project",
    line: "A Rust CLI that makes a fresh VPS ready and secure: audit, plan, apply and roll back, without locking yourself out.",
    href: "https://github.com/bhimrazy/vps-ready",
    meta: "Oct 2026",
  },
  {
    title: "Model APIs, demos and experiments",
    kind: "Projects",
    line: "Object detection and text-to-speech APIs, chat apps for vision-language models like Qwen2-VL and Llama 3.2 Vision, and 3D lung tumour segmentation.",
    href: "/projects",
    meta: "2022 – 2026",
  },
  {
    title:
      "A Comparative Study of State-of-the-Art Deep Learning Models for Semantic Segmentation of Pores in Scanning Electron Microscope Images of Activated Carbon",
    kind: "Research · IEEE Access",
    line: "Peer-reviewed journal paper, co-authored with B. Pokharel et al. Vol. 12, pp. 50217–50243.",
    href: "https://ieeexplore.ieee.org/document/10478488",
    meta: "2024",
  },
] as const;

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
  /** Things he's into at work, shown alongside the interests on B's card. */
  curiosities: ["LLMs", "Agents", "Open source", "Rust"],
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
    elsewhere: [{ text: "Celebrating Dashain, Nepal’s biggest festival" }],
  },
  voiceLine:
    "Away from the keyboard, you'll find me travelling, exploring new things, working out, or lost in a good playlist.",
} as const;
