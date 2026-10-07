import fs from "node:fs";
import path from "node:path";
import { DIAGRAMS, esc, render } from "./diagrams.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "diagrams");
fs.mkdirSync(OUT, { recursive: true });

for (const d of DIAGRAMS) {
  fs.writeFileSync(path.join(OUT, `${d.slug}.svg`), render(d, "wide"));
  fs.writeFileSync(path.join(OUT, `${d.slug}-narrow.svg`), render(d, "narrow"));
}

const fonts = fs
  .readFileSync(path.join(ROOT, "_tools/fonts/fonts.css"), "utf8")
  .replace(/url\(/g, "url(_tools/fonts/");

let n = 0;
/** Inline an SVG with ids made unique for this copy. */
const inline = (d, variant) => {
  n++;
  return render(d, variant).replace(/(id="|aria-labelledby="|\s)(gf-[\w-]+)/g, (m, pre, id) => `${pre}${id}-${n}`);
};

const figure = (d, variant) => `
<figure class="fig ${variant}">
  <div class="frame">
    <p class="label">${esc(d.label)}</p>
    ${inline(d, variant)}
  </div>
  <figcaption>${esc(d.caption)}</figcaption>
</figure>`;

const section = (d, i) => `
<section class="dg" id="${d.slug}">
  <header><span class="num">${String.fromCharCode(97 + i)}</span><h2>${esc(d.title)}</h2><span class="part">${esc(d.part)} · <code>diagrams/${d.slug}.svg</code> + <code>-narrow.svg</code></span></header>
  <div class="row">
    <div class="theme dark">${figure(d, "wide")}${figure(d, "narrow")}</div>
    <div class="theme light">${figure(d, "wide")}${figure(d, "narrow")}</div>
  </div>
</section>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Field Guide Diagrams</title>
<style>
${fonts}
:root{--font-display:"Space Grotesk",sans-serif;--font-body:"DM Sans",sans-serif;--font-mono:"JetBrains Mono",monospace}
.dark{--site-bg:#0f0d0a;--site-bg-secondary:#16140f;--site-text:#f5f0e8;--site-text-secondary:#a09882;--site-text-tertiary:#706a58;--site-accent:#f59e0b;--site-accent-subtle:rgba(245,158,11,.1);--site-border:#2a2620;--site-border-hover:#3a3530;--site-card-bg:#17150f}
.light{--site-bg:#fafaf9;--site-bg-secondary:#f5f5f4;--site-text:#1c1917;--site-text-secondary:#57534e;--site-text-tertiary:#a8a29e;--site-accent:#d97706;--site-accent-subtle:rgba(217,119,6,.08);--site-border:#e7e5e4;--site-border-hover:#d6d3d1;--site-card-bg:#ffffff}
*{box-sizing:border-box}
body{margin:0;background:#0f0d0a;color:#f5f0e8;font-family:var(--font-body)}
.top{padding:40px 32px 8px}
.top h1{font-family:var(--font-display);font-size:28px;margin:0 0 6px}
.top p{color:#a09882;margin:0;max-width:72ch;font-size:14px}
.dg{padding:24px 32px 8px}
.dg header{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.dg h2{font-family:var(--font-display);font-size:20px;margin:0}
.num{font-family:var(--font-mono);color:#f59e0b;font-size:14px}
.part{font-family:var(--font-mono);font-size:12px;color:#706a58}
.part code{color:#a09882}
.row{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:16px;overflow:hidden;border:1px solid #2a2620}
.theme{background:var(--site-bg);color:var(--site-text);padding:24px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap}
.fig{margin:0;min-width:0}
.theme{min-width:0}
.fig.wide{width:730px;max-width:100%}
.fig.narrow{width:375px;max-width:100%}
.frame{border:1px solid var(--site-border);background:var(--site-card-bg);border-radius:12px;padding:24px}
.fig.narrow .frame{padding:16px 8px}
.label{margin:0 0 16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--site-text-tertiary)}
.frame svg{display:block;width:100%;height:auto}
figcaption{margin-top:12px;padding:0 4px;font-size:13px;line-height:1.55;color:var(--site-text-secondary)}
@media (max-width:1600px){.row{grid-template-columns:1fr}}
@media (max-width:600px){.dg,.top{padding-left:16px;padding-right:16px}.theme{padding:16px}.fig.wide{display:none}}
</style>
</head>
<body>
<div class="top">
<h1>GitHub field guide: diagram prototypes</h1>
<p>Six standalone SVGs, each with a 680-wide layout and a 360-wide mobile layout. Colours resolve from the site's <code>--site-*</code> tokens when inlined, with built-in light/dark fallbacks when used standalone. Left: warm-dark; right: light.</p>
</div>
${DIAGRAMS.map(section).join("\n")}
</body>
</html>`;
fs.writeFileSync(path.join(ROOT, "index.html"), html);
console.log("built", DIAGRAMS.length * 2, "svgs + index.html");
