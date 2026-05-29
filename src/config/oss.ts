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

/** "owner/repo" slugs summed for the OSS contributions stat. */
export const ossRepos = [...lightningRepos, ...otherRepos];
