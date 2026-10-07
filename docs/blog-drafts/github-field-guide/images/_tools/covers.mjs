// Series covers: the OG card's typography + the project cover's dot field,
// with a commit-log "route" through the series as the shared motif.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "covers");
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: "#0f0d0a", text: "#f5f0e8", t2: "#a09882", t3: "#706a58", border: "#2a2620", accent: "#f59e0b" };

const PARTS = [
  ["hub", "map", "Start here", "Find your way around GitHub", "A map, four reading paths and a cheat sheet"],
  ["01-foundations", "foundations", "Part 01", "Git, GitHub and the mental model", "commits · branches · pull requests · issues"],
  ["02-setup", "setup", "Part 02", "Your setup, on every device", "gh auth · SSH and signing · dotfiles · Settings Sync"],
  ["03-org", "org", "Part 03", "Running a startup org", "members · teams · rulesets · CODEOWNERS · plans"],
  ["04-terminal", "terminal", "Part 04", "Working from the terminal", "gh for issues, PRs, runs, releases and Projects"],
  ["05-releases", "releases", "Part 05", "Branching and releases", "GitHub Flow · merge strategies · tags · release notes"],
  ["06-actions", "actions", "Part 06", "Automation with Actions", "triggers · reusable workflows · runners · OIDC"],
  ["07-agents", "agents", "Part 07", "AI agents on GitHub", "Copilot, Claude and Codex · guardrails · review"],
];

function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function random(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function motif(index, slug) {
  const rand = random(hash(slug));
  const STEP = 30;
  let s = "";
  // dot field, fading out toward the text on the left
  for (let x = STEP / 2; x < 1200; x += STEP) {
    for (let y = STEP / 2; y < 630; y += STEP) {
      const fade = Math.min(1, Math.max(0, (x - 560) / 420));
      const o = (0.1 + rand() * 0.3) * fade;
      if (o > 0.01) s += `<circle cx="${x}" cy="${y}" r="1.3" fill="${C.t3}" opacity="${o.toFixed(2)}"/>`;
    }
  }
  // the route: 8 stations on a vertical line (snapped to the dot grid)
  const LX = 885; // x of the main line
  const Y0 = 75;
  const DY = 52;
  const ys = PARTS.map((_, i) => Y0 + i * DY);
  s += `<path d="M${LX} ${Y0 - 30}V${ys[7] + 40}" stroke="${C.t3}" stroke-width="2" opacity=".7"/>`;
  // a topic branch merging into the current station (not on the hub)
  if (index > 0) {
    const y0 = ys[index - 1];
    const y1 = ys[index];
    const bx = LX - 48;
    const my = (y0 + y1) / 2;
    s += `<path d="M${LX} ${y0}C${LX} ${y0 + 14} ${bx} ${my - 14} ${bx} ${my}C${bx} ${my + 14} ${LX} ${y1 - 14} ${LX} ${y1}" fill="none" stroke="${C.accent}" stroke-width="2.5"/>`;
    s += `<circle cx="${bx}" cy="${my}" r="4.5" fill="${C.accent}"/>`;
  }
  PARTS.forEach(([, short], i) => {
    const y = ys[i];
    const label = `${String(i).padStart(2, "0")} ${short}`;
    if (i === index) {
      s += `<circle cx="${LX}" cy="${y}" r="20" fill="${C.accent}" opacity=".14"/>`;
      s += `<circle cx="${LX}" cy="${y}" r="9" fill="${C.accent}"/>`;
      s += `<text x="${LX + 30}" y="${y + 7}" font-family="JetBrains Mono" font-weight="600" font-size="20" fill="${C.accent}">${label}</text>`;
    } else if (i < index) {
      s += `<circle cx="${LX}" cy="${y}" r="6" fill="${C.t2}"/>`;
      s += `<text x="${LX + 30}" y="${y + 6}" font-family="JetBrains Mono" font-size="17" fill="${C.t2}">${label}</text>`;
    } else {
      s += `<circle cx="${LX}" cy="${y}" r="6" fill="${C.bg}" stroke="${C.t3}" stroke-width="2"/>`;
      s += `<text x="${LX + 30}" y="${y + 6}" font-family="JetBrains Mono" font-size="17" fill="${C.t3}">${label}</text>`;
    }
  });
  return `<svg class="motif" viewBox="0 0 1200 630" width="1200" height="630" aria-hidden="true">${s}</svg>`;
}

const cover = ([slug, , eyebrow, title, sub], i) => `
<div class="cover" id="c-${slug}">
  ${motif(i, slug)}
  <div class="content">
    <div class="eyebrow"><span class="dot"></span>GitHub field guide<span class="sep">/</span><span class="part">${eyebrow}</span></div>
    <div class="mid">
      <div class="title">${title}</div>
      <div class="sub">${sub}</div>
    </div>
    <div class="footer"><span class="mark">bhimraj<span>.</span></span><span class="url">bhimraj.com.np/blog</span></div>
  </div>
</div>`;

const fonts = fs.readFileSync(path.join(ROOT, "_tools/fonts/fonts.css"), "utf8").replace(/url\(/g, "url(_tools/fonts/");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Field Guide Covers</title><style>
${fonts}
body{margin:0;background:#000;display:flex;flex-direction:column;gap:24px;padding:24px}
.cover{position:relative;width:1200px;height:630px;overflow:hidden;background:${C.bg};
  background-image:radial-gradient(circle at 82% 8%, rgba(245,158,11,.12) 0%, rgba(0,0,0,0) 55%)}
.motif{position:absolute;inset:0}
.content{position:absolute;inset:0;padding:72px;display:flex;flex-direction:column;justify-content:space-between;font-family:"Space Grotesk"}
.eyebrow{display:flex;align-items:center;gap:12px;font-size:22px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.accent}}
.eyebrow .dot{width:10px;height:10px;border-radius:50%;background:${C.accent}}
.eyebrow .sep{color:${C.t3};font-weight:500}
.eyebrow .part{color:${C.text}}
.mid{display:flex;flex-direction:column;gap:20px;max-width:700px}
.title{font-size:68px;font-weight:700;line-height:1.08;color:${C.text};letter-spacing:-.5px}
.sub{font-family:"DM Sans";font-size:26px;font-weight:500;line-height:1.35;color:${C.t2}}
.footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${C.border};padding-top:28px}
.mark{font-size:28px;font-weight:700;color:${C.text}}
.mark span{color:${C.accent}}
.url{font-size:20px;font-weight:500;color:${C.t3}}
</style></head><body>${PARTS.map(cover).join("")}</body></html>`;
fs.writeFileSync(path.join(ROOT, "covers.html"), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1260, height: 700 } });
await page.goto(`file://${ROOT}/covers.html`);
await page.evaluate(() => document.fonts.ready);
for (const [slug] of PARTS) {
  await page.locator(`#c-${slug}`).screenshot({ path: path.join(OUT, `${slug}.png`) });
}
await browser.close();
console.log("covers:", PARTS.length);
