/**
 * Canonical GitHub fetch targets — the single source of truth shared by the
 * snapshot sync command (which fetches these) and the web app (which reads the
 * resulting snapshot and reuses these slugs for display logic).
 */

const lightningRepos = [
  "litdata",
  "LitServe",
  "litgpt",
  "LitModels",
  "pytorch-lightning",
  "torchmetrics",
  "utilities",
  "lightning-thunder",
  "LitLogger",
  "litAI",
].map((repo) => `Lightning-AI/${repo}`);

const otherRepos = ["ekzhu/datasketch", "bhimrazy/receipt-ocr"];

export const githubConfig = {
  /** GitHub username the stats belong to. */
  username: "bhimrazy",
  /** "owner/repo" slugs summed for the OSS contributions stats. */
  ossRepos: [...lightningRepos, ...otherRepos],
  /** Self-authored repo spotlighted on the homepage with its star-growth curve. */
  featuredRepo: "bhimrazy/receipt-ocr",
  /** First year of OSS activity, used to derive "years active". */
  ossStartYear: 2024,
} as const;

export const { username, ossRepos, featuredRepo, ossStartYear } = githubConfig;
