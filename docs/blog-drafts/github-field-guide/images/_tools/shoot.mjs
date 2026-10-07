// Render index.html (full page) and every figure in both themes to PNG.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PNG = path.join(ROOT, "diagrams/png");
fs.mkdirSync(PNG, { recursive: true });
const only = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(`file://${ROOT}/index.html`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
if (!only) await page.screenshot({ path: path.join(ROOT, "index.png"), fullPage: true });

const sections = await page.locator("section.dg").all();
for (const s of sections) {
  const slug = await s.getAttribute("id");
  if (only && !slug.includes(only)) continue;
  for (const theme of ["dark", "light"]) {
    for (const v of ["wide", "narrow"]) {
      const f = s.locator(`.theme.${theme} .fig.${v} .frame`);
      await f.screenshot({ path: path.join(PNG, `${slug}${v === "narrow" ? "-narrow" : ""}-${theme}.png`) });
    }
  }
}
// mobile check of the page itself
if (!only) {
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await m.goto(`file://${ROOT}/index.html`);
  await m.evaluate(() => document.fonts.ready);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log("mobile horizontal overflow px:", overflow);
  await m.screenshot({ path: path.join(ROOT, "index-mobile.png"), fullPage: true });
}
await browser.close();
console.log("done");
