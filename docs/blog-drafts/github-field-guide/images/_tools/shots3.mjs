import { chromium } from "playwright";
const out = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("https://github.com/bhimrazy/bhimraj.com.np/pull/87/checks", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/pr-87-checks.jpg`, type: "jpeg", quality: 80 });
await browser.close();
