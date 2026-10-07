import { chromium } from "playwright";
const out = process.argv[2];
const pages = [
  ["actions-sync-github-workflow", "https://github.com/bhimrazy/bhimraj.com.np/actions/workflows/sync-github.yml"],
  ["pr-87-conversation", "https://github.com/bhimrazy/bhimraj.com.np/pull/87"],
  ["pr-87-checks", "https://github.com/bhimrazy/bhimraj.com.np/pull/87/checks"],
  ["releases", "https://github.com/bhimrazy/bhimraj.com.np/releases"],
  ["tags", "https://github.com/bhimrazy/bhimraj.com.np/tags"],
];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", deviceScaleFactor: 1 });
for (const [name, url] of pages) {
  const p = await ctx.newPage();
  const res = await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(e => ({ status: () => "ERR " + e.message }));
  await p.waitForTimeout(1500);
  const finalUrl = p.url();
  const title = await p.title();
  await p.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 80 });
  // a taller variant for PR page so the merge/checks box is visible
  if (name === "pr-87-conversation") {
    await p.screenshot({ path: `${out}/${name}-full.jpg`, type: "jpeg", quality: 80, fullPage: true });
  }
  console.log(name, res.status?.(), finalUrl, "|", title);
  await p.close();
}
await browser.close();
