import { chromium } from "playwright";
const out = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("https://github.com/bhimrazy/bhimraj.com.np/pull/87/checks", { waitUntil: "networkidle" });
await p.getByText("CI Testing", { exact: true }).first().click();
await p.waitForTimeout(800);
const job = p.getByRole("link", { name: /^test$/ }).first();
if (await job.count()) { await job.click(); await p.waitForLoadState("networkidle"); }
await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/pr-87-checks.jpg`, type: "jpeg", quality: 80 });
console.log("checks url", p.url());
const q = await ctx.newPage();
await q.goto("https://github.com/bhimrazy/bhimraj.com.np/pull/87", { waitUntil: "networkidle" });
const merged = q.getByText("8 checks passed").first();
await merged.scrollIntoViewIfNeeded();
const box = await merged.boundingBox();
await q.screenshot({ path: `${out}/pr-87-merge-timeline.jpg`, type: "jpeg", quality: 80, fullPage: true,
  clip: { x: 100, y: box.y + (await q.evaluate(() => scrollY)) - 160, width: 1000, height: 330 } });
await browser.close();
