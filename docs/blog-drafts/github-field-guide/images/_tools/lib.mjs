// Tiny SVG helpers for the GitHub field guide diagrams.
// Every colour comes from a CSS variable: --site-* tokens when the SVG is
// inlined on bhimraj.com.np, with built-in light/dark fallbacks standalone.

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const LIGHT = {
  bg: "#ffffff", bg2: "#f5f5f4", bg3: "#e7e5e4", tx: "#1c1917", tx2: "#57534e",
  tx3: "#a8a29e", ac: "#d97706", acs: "rgba(217,119,6,0.08)", bd: "#e7e5e4",
  bdh: "#d6d3d1", act: "#b45309",
};
const DARK = {
  bg: "#17150f", bg2: "#16140f", bg3: "#1f1c16", tx: "#f5f0e8", tx2: "#a09882",
  tx3: "#706a58", ac: "#f59e0b", acs: "rgba(245,158,11,0.1)", bd: "#2a2620",
  bdh: "#3a3530", act: "#f59e0b",
};
const vars = (t) =>
  Object.entries(t).map(([k, v]) => `--f-${k}:${v}`).join(";");

// Node fills use bg2 (light) / bg3 (dark) so boxes read against the card.
export const STYLE = `
.gf{${vars(LIGHT)};--f-node:#f5f5f4}
@media (prefers-color-scheme:dark){.gf{${vars(DARK)};--f-node:#1f1c16}}
:where(.light,[data-theme=light]) .gf{${vars(LIGHT)};--f-node:#f5f5f4}
:where(.dark,[data-theme=dark]) .gf{${vars(DARK)};--f-node:#1f1c16}
.gf{--bg:var(--site-card-bg,var(--f-bg));--tx:var(--site-text,var(--f-tx));--tx2:var(--site-text-secondary,var(--f-tx2));--tx3:var(--site-text-tertiary,var(--f-tx3));--ac:var(--site-accent,var(--f-ac));--acs:var(--site-accent-subtle,var(--f-acs));--bd:var(--site-border,var(--f-bd));--bdh:var(--site-border-hover,var(--f-bdh));--node:var(--f-node);--act:var(--f-act)}
.gf .bg{fill:var(--bg)}
.gf .n{fill:var(--node);stroke:var(--bdh);stroke-width:1}
.gf .n.on{fill:var(--acs);stroke:var(--ac);stroke-width:1.5}
.gf .zone{fill:none;stroke:var(--bdh);stroke-width:1;stroke-dasharray:3 4}
.gf .ln{fill:none;stroke:var(--tx3);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}
.gf .ln.on{stroke:var(--ac);stroke-width:2}
.gf .ln.dim{stroke:var(--bdh)}
.gf .ln.dash{stroke-dasharray:4 4}
.gf .hd{fill:var(--tx3)}
.gf .hd.on{fill:var(--ac)}
.gf .hd.dim{fill:var(--bdh)}
.gf .dot{fill:var(--tx2)}
.gf .dot.on{fill:var(--ac)}
.gf .ring{fill:var(--bg);stroke:var(--tx3);stroke-width:1.5}
.gf .ring.on{stroke:var(--ac);stroke-width:2}
.gf .ac{fill:var(--ac)}
.gf text{font-family:var(--font-body,"DM Sans"),system-ui,sans-serif;fill:var(--tx)}
.gf .t{font-family:var(--font-display,"Space Grotesk"),system-ui,sans-serif;font-weight:600;font-size:14px;fill:var(--tx)}
.gf .tl{font-family:var(--font-display,"Space Grotesk"),system-ui,sans-serif;font-weight:700;font-size:18px;fill:var(--tx)}
.gf .s{font-size:12px;fill:var(--tx2)}
.gf .m{font-family:var(--font-mono,"JetBrains Mono"),ui-monospace,monospace;font-size:11px;fill:var(--tx2)}
.gf .mk{font-family:var(--font-mono,"JetBrains Mono"),ui-monospace,monospace;font-size:12px;fill:var(--tx)}
.gf .cap{font-family:var(--font-mono,"JetBrains Mono"),ui-monospace,monospace;font-size:10.5px;letter-spacing:.12em;fill:var(--tx2)}
.gf .act{fill:var(--act)}
.gf .big{font-family:var(--font-display,"Space Grotesk"),system-ui,sans-serif;font-weight:700;font-size:22px}
`.trim();

export function svg({ id, w, h, title, desc, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="gf" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-title ${id}-desc">
<title id="${id}-title">${esc(title)}</title>
<desc id="${id}-desc">${esc(desc)}</desc>
<style>${STYLE}</style>
<rect class="bg" width="${w}" height="${h}" rx="12"/>
${body}
</svg>
`;
}

export const rect = (x, y, w, h, cls = "n", rx = 10) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;

export const text = (x, y, s, cls = "s", anchor = "start", extra = "") =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}"${extra}>${esc(s)}</text>`;

/** A box with a title and up to two sub lines, centred. */
export function node(x, y, w, h, title, subs = [], { on = false, subCls = "s", titleCls = "t" } = {}) {
  const lines = [title, ...subs];
  const lh = [20, ...subs.map(() => 16)];
  const total = lh.reduce((a, b) => a + b, 0);
  let cy = y + (h - total) / 2 + 14;
  let out = rect(x, y, w, h, on ? "n on" : "n");
  lines.forEach((l, i) => {
    out += text(x + w / 2, cy, l, i === 0 ? titleCls : subCls, "middle");
    cy += lh[i + 1] ?? 0;
  });
  return out;
}

function head(x, y, angle, cls) {
  const s = 7;
  const a1 = angle + Math.PI - 0.45;
  const a2 = angle + Math.PI + 0.45;
  const p = (a) => `${(x + s * Math.cos(a)).toFixed(1)} ${(y + s * Math.sin(a)).toFixed(1)}`;
  return `<path class="hd${cls}" d="M${x} ${y}L${p(a1)}L${p(a2)}Z"/>`;
}

/**
 * Polyline arrow through points [[x,y],...]; rounded corners (r) on bends.
 * opts: on, dim, dash, both (head at start too), noHead.
 */
export function arrow(pts, { on = false, dim = false, dash = false, both = false, noHead = false, r = 10 } = {}) {
  const mod = on ? " on" : dim ? " dim" : "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (i < pts.length - 1 && r > 0) {
      const [px, py] = pts[i - 1];
      const [nx, ny] = pts[i + 1];
      const l1 = Math.hypot(x - px, y - py);
      const l2 = Math.hypot(nx - x, ny - y);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const ax = x - ((x - px) / l1) * rr;
      const ay = y - ((y - py) / l1) * rr;
      const bx = x + ((nx - x) / l2) * rr;
      const by = y + ((ny - y) / l2) * rr;
      d += `L${ax.toFixed(1)} ${ay.toFixed(1)}Q${x} ${y} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    } else d += `L${x} ${y}`;
  }
  let out = `<path class="ln${mod}${dash ? " dash" : ""}" d="${d}"/>`;
  const n = pts.length;
  if (!noHead) {
    const [ex, ey] = pts[n - 1];
    const [qx, qy] = pts[n - 2];
    out += head(ex, ey, Math.atan2(ey - qy, ex - qx), mod);
  }
  if (both) {
    const [sx, sy] = pts[0];
    const [tx, ty] = pts[1];
    out += head(sx, sy, Math.atan2(sy - ty, sx - tx), mod);
  }
  return out;
}

export const line = (x1, y1, x2, y2, cls = "ln") =>
  `<path class="${cls}" d="M${x1} ${y1}L${x2} ${y2}"/>`;
