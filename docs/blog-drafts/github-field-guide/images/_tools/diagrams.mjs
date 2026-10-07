import { arrow, esc, line, node, rect, svg, text } from "./lib.mjs";

const pill = (cx, cy, w, label, cls = "n", tcls = "mk", h = 26) =>
  rect(cx - w / 2, cy - h / 2, w, h, cls, h / 2) + text(cx, cy + 4, label, tcls, "middle");

const dot = (x, y, on = false, r = 4.5) => `<circle class="dot${on ? " on" : ""}" cx="${x}" cy="${y}" r="${r}"/>`;
const ring = (x, y, on = false, r = 6) => `<circle class="ring${on ? " on" : ""}" cx="${x}" cy="${y}" r="${r}"/>`;
/** knockout label sitting on a line */
const tag = (cx, cy, lines, w) => {
  const h = 10 + lines.length * 14;
  let o = rect(cx - w / 2, cy - h / 2, w, h, "n", 6).replace('class="n"', 'class="n" style="fill:var(--bg)"');
  lines.forEach((l, i) => {
    o += text(cx, cy - h / 2 + 18 + i * 14, l, "m", "middle");
  });
  return o;
};

/* ───────────── (a) ecosystem map ───────────── */
function ecosystemWide() {
  let b = "";
  b += text(100, 32, "YOUR MACHINE", "cap", "middle");
  b += text(340, 32, "GITHUB.COM", "cap", "middle");
  b += text(580, 32, "AUTOMATION", "cap", "middle");
  b += rect(12, 44, 176, 288, "zone", 12);
  b += node(24, 60, 70, 54, "VS Code", ["editor"]);
  b += node(106, 60, 70, 54, "gh", ["CLI"]);
  // local git with a tiny commit graph
  b += rect(24, 196, 152, 120, "n");
  b += text(100, 224, "Git", "t", "middle");
  b += text(100, 242, "history on your disk", "s", "middle");
  b += line(44, 284, 148, 284, "ln");
  b += dot(52, 284) + dot(82, 284) + dot(112, 284) + ring(144, 284);
  b += text(144, 304, "HEAD", "m", "middle");
  b += arrow([[59, 116], [59, 194]]);
  b += text(66, 160, "commit", "m");
  // github hub
  b += rect(260, 44, 160, 288, "n on", 12);
  b += text(340, 80, "GitHub", "tl", "middle");
  b += text(340, 99, "the shared remote", "s", "middle");
  ["repositories", "issues", "pull requests", "releases"].forEach((l, i) => {
    b += pill(340, 138 + i * 44, 128, l, "n", "mk", 30);
  });
  b += arrow([[178, 87], [256, 87]]);
  b += text(217, 79, "API", "m", "middle");
  b += arrow([[178, 248], [256, 248]]);
  b += text(217, 240, "push", "m", "middle");
  b += arrow([[258, 266], [180, 266]]);
  b += text(219, 284, "pull", "m", "middle");
  // automation
  b += node(500, 60, 160, 104, "Actions", ["runners do CI/CD", "on every event"]);
  b += node(500, 212, 160, 104, "AI agents", ["Copilot · Claude · Codex", "issue in, PR out"]);
  b += arrow([[422, 104], [496, 104]]);
  b += text(459, 96, "event", "m", "middle");
  b += arrow([[498, 122], [424, 122]]);
  b += text(461, 140, "status", "m", "middle");
  b += arrow([[422, 256], [496, 256]]);
  b += text(459, 248, "issue", "m", "middle");
  b += arrow([[498, 274], [424, 274]]);
  b += text(461, 292, "PR", "m", "middle");
  return b;
}
function ecosystemNarrow() {
  let b = "";
  b += text(16, 26, "YOUR MACHINE", "cap");
  b += rect(12, 36, 336, 150, "zone", 12);
  b += node(24, 50, 96, 54, "VS Code", ["editor"]);
  b += node(24, 118, 96, 54, "gh", ["CLI"]);
  b += rect(180, 50, 156, 122, "n");
  b += text(258, 76, "Git", "t", "middle");
  b += text(258, 94, "history on your disk", "s", "middle");
  b += line(204, 136, 312, 136, "ln");
  b += dot(212, 136) + dot(242, 136) + dot(272, 136) + ring(304, 136);
  b += text(304, 157, "HEAD", "m", "middle");
  b += arrow([[122, 77], [178, 77]]);
  b += text(150, 69, "commit", "m", "middle");
  b += arrow([[72, 174], [72, 226]]);
  b += text(80, 204, "API", "m");
  b += arrow([[232, 174], [232, 226]]);
  b += text(226, 204, "push", "m", "end");
  b += arrow([[290, 228], [290, 176]]);
  b += text(296, 204, "pull", "m");
  // hub
  b += rect(12, 230, 336, 132, "n on", 12);
  b += text(28, 258, "GitHub", "tl");
  b += text(28, 277, "the shared remote", "s");
  b += text(332, 258, "GITHUB.COM", "cap", "end");
  ["repositories", "issues", "pull requests", "releases"].forEach((l, i) => {
    b += pill(102 + (i % 2) * 156, 304 + Math.floor(i / 2) * 34, 148, l, "n", "mk", 26);
  });
  // automation
  b += arrow([[60, 364], [60, 420]]);
  b += text(66, 396, "event", "m");
  b += arrow([[124, 418], [124, 366]]);
  b += text(130, 396, "status", "m");
  b += arrow([[236, 364], [236, 420]]);
  b += text(242, 396, "issue", "m");
  b += arrow([[300, 418], [300, 366]]);
  b += text(306, 396, "PR", "m");
  b += node(12, 422, 160, 86, "Actions", ["runners do CI/CD", "on every event"]);
  b += node(188, 422, 160, 86, "AI agents", ["Copilot · Claude · Codex", "issue in, PR out"]);
  return b;
}

/* ───────────── (b) collaborators vs teams ───────────── */
const PEOPLE = ["@asha", "@ben", "@chen"];
const REPOS = ["web", "api", "infra", "docs"];
const PY = [76, 126, 176];
const RY = [62, 104, 146, 188];
function teamsPanel(px, py, mode) {
  let b = "";
  const pr = px + 88; // person right edge
  const rl = px + 226; // repo left edge
  b += text(px + 4, py + 30, mode === "direct" ? "ADDED DIRECTLY" : "THROUGH A TEAM", "cap");
  if (mode === "direct") {
    const access = { 0: [0, 1, 2, 3], 1: [0, 1, 2], 2: [1, 3] };
    for (const p of [2, 1, 0]) {
      for (const r of access[p]) {
        b += `<path class="ln${p === 0 ? " on" : " dim"}" d="M${pr} ${py + PY[p]}L${rl} ${py + RY[r]}"/>`;
      }
    }
  } else {
    const tx = px + 118;
    const tw = 80;
    const tcy = py + 126;
    for (const p of [2, 1, 0]) {
      b += `<path class="ln${p === 0 ? " on" : " dim"}" d="M${pr} ${py + PY[p]}L${tx} ${tcy}"/>`;
    }
    REPOS.forEach((_, r) => {
      b += `<path class="ln dim" d="M${tx + tw} ${tcy}L${rl} ${py + RY[r]}"/>`;
    });
    b += node(tx, tcy - 24, tw, 48, "eng", ["team"]);
  }
  PEOPLE.forEach((p, i) => {
    b += pill(px + 50, py + PY[i], 76, p, i === 0 ? "n on" : "n", "mk", 28);
  });
  REPOS.forEach((r, i) => {
    b += pill(px + 268, py + RY[i], 84, r, "n", "mk", 28);
  });
  const n = mode === "direct" ? "4 edits" : "1 edit";
  const s = mode === "direct" ? "remove @asha from every repo" : "remove @asha from the team";
  b += text(px + 4, py + 244, n, "big act");
  b += text(px + 4, py + 266, s, "s");
  return b;
}
const teamsWide = () => teamsPanel(16, 0, "direct") + line(340, 24, 340, 268, "ln dim dash") + teamsPanel(356, 0, "team");
const teamsNarrow = () => teamsPanel(18, 0, "direct") + line(18, 290, 342, 290, "ln dim dash") + teamsPanel(18, 296, "team");

/* ───────────── (c) PR lifecycle ───────────── */
const STEPS = [
  ["Branch", "git switch -c"],
  ["Commit", "git commit"],
  ["Open PR", "gh pr create"],
  ["Checks", "CI runs"],
  ["Review", "gh pr review"],
  ["Merge", "gh pr merge"],
  ["Release", "gh release create"],
];
function prWide() {
  let b = "";
  const X = [50, 145, 240, 335, 430, 525, 620];
  const M = 236; // main y
  const B = 156; // branch y
  STEPS.forEach(([n, c], i) => {
    b += text(X[i], 30, String(i + 1).padStart(2, "0"), "cap", "middle");
    b += text(X[i], 50, n, "t", "middle");
    if (i === 6) {
      b += text(X[i], 68, "gh release", "m", "middle");
      b += text(X[i], 82, "create", "m", "middle");
    } else b += text(X[i], 68, c, "m", "middle");
  });
  const guideEnd = [M - 10, B - 12, B - 16, B - 16, B - 16, M - 12, M - 10];
  X.forEach((x, i) => {
    b += line(x, i === 6 ? 92 : 80, x, guideEnd[i], "ln dim dash");
  });
  // main
  b += line(16, M, 664, M, "ln");
  b += text(16, M + 22, "main", "m");
  // branch
  b += `<path class="ln on" d="M50 ${M}C70 ${M} 70 ${B} 95 ${B}L475 ${B}C500 ${B} 500 ${M} 525 ${M}"/>`;
  b += text(100, B + 24, "feat/login", "m act");
  b += dot(50, M) + dot(300, M, false, 3.5);
  b += dot(120, B, true) + dot(145, B, true) + dot(170, B, true);
  b += pill(240, B, 66, "PR #42", "n");
  b += pill(335, B, 66, "3/3 ✓", "n");
  b += pill(430, B, 80, "approved", "n");
  b += ring(525, M, true, 7);
  b += dot(620, M);
  // tag shape
  const tx = 620;
  const ty = M + 14;
  b += `<path class="n" d="M${tx} ${ty}l9 9h30v24h-78v-24h30z"/>`;
  b += text(tx, ty + 26, "v1.4.0", "mk", "middle");
  return b;
}
function prNarrow() {
  let b = "";
  const Y = [52, 118, 184, 250, 316, 382, 448];
  const MX = 40;
  const BX = 96;
  b += line(MX, 24, MX, 484, "ln");
  b += text(MX, 16, "main", "m", "middle");
  b += `<path class="ln on" d="M${MX} 52C${MX} 74 ${BX} 74 ${BX} 96L${BX} 350C${BX} 372 ${MX} 372 ${MX} 382"/>`;
  b += dot(MX, 52) + dot(MX, 220, false, 3.5);
  b += dot(BX, 104, true) + dot(BX, 118, true) + dot(BX, 132, true);
  b += pill(BX, 184, 66, "PR #42", "n");
  b += pill(BX, 250, 66, "3/3 ✓", "n");
  b += pill(BX, 316, 80, "approved", "n");
  b += ring(MX, 382, true, 7);
  b += dot(MX, 448);
  b += `<path class="n" d="M${MX + 12} 448l9 -12h52v24h-52z"/>`;
  b += text(MX + 50, 452, "v1.4.0", "mk", "middle");
  const startX = [MX + 12, BX + 10, BX + 38, BX + 38, BX + 45, MX + 12, MX + 120];
  STEPS.forEach(([n, c], i) => {
    b += line(startX[i], Y[i], 182, Y[i], "ln dim dash");
    b += text(192, Y[i] - 3, `${String(i + 1).padStart(2, "0")}  ${n}`, "t");
    b += text(192, Y[i] + 15, c, "m");
  });
  return b;
}

/* ───────────── (d) Actions triggers ───────────── */
const TRIG = [
  ["REPO", "you push commits", "push:", "branches: [main]", "you push commits"],
  ["REPO", "a PR is opened or updated", "pull_request:", "", "a PR opens or updates"],
  ["YOU", "Run button or gh workflow run", "workflow_dispatch:", "", "Run button or gh CLI"],
  ["CLOCK", "a cron schedule, in UTC", "schedule:", '- cron: "0 3 * * *"', "cron schedule (UTC)"],
  ["API", "an outside system calls in", "repository_dispatch:", "types: [sync]", "an outside system"],
  ["WORKFLOW", "another workflow calls this one", "workflow_call:", "", "another workflow"],
];
function triggersWide() {
  let b = "";
  b += text(20, 72, "WHAT FIRES IT", "cap");
  b += rect(376, 44, 288, 292, "n on", 12);
  b += text(394, 68, "# .github/workflows/ci.yml", "m");
  b += text(394, 90, "on:", "mk act", "start", ' font-weight="600"');
  TRIG.forEach(([cat, desc, key, val], i) => {
    const cy = 116 + i * 40;
    b += rect(16, cy - 16, 290, 32, "n", 8);
    b += text(28, cy + 4, cat, "cap");
    b += text(108, cy + 4, desc, "s");
    b += arrow([[308, cy], [372, cy]]);
    b += text(410, cy + 4, key, "mk");
    if (val) b += text(410 + key.length * 7.25 + 8, cy + 4, val, "m");
  });
  return b;
}
function triggersNarrow() {
  let b = "";
  b += rect(196, 14, 152, 332, "n on", 12);
  b += text(208, 38, "on:", "mk act", "start", ' font-weight="600"');
  b += text(16, 38, "WHAT FIRES IT", "cap");
  TRIG.forEach(([cat, , key, , short], i) => {
    const cy = 82 + i * 48;
    b += text(16, cy - 6, cat, "cap");
    b += text(16, cy + 12, short, "s");
    b += arrow([[166, cy + 2], [200, cy + 2]]);
    b += text(208, cy + 6, key.replace(":", ""), "m", "start", ' style="fill:var(--tx)"');
  });
  return b;
}

/* ───────────── (e) agent loop ───────────── */
const LOOP = [
  ["Issue", "scoped by you", "YOU"],
  ["Agent", "own branch", "AGENT"],
  ["Draft PR", "never main", "AGENT"],
  ["CI checks", "same gates", "ACTIONS"],
  ["Review", "human gate", "YOU"],
  ["Merge", "you decide", "YOU"],
];
function loopWide() {
  let b = "";
  const X = [21, 131, 241, 351, 461, 571];
  const W = 88;
  LOOP.forEach(([t, s, who], i) => {
    b += text(X[i] + W / 2, 36, who, i === 4 ? "cap act" : "cap", "middle");
    b += node(X[i], 48, W, 64, t, [s], { on: i === 4 });
    if (i < 5) b += arrow([[X[i] + W + 2, 80], [X[i + 1] - 3, 80]]);
  });
  // feedback arcs (outer one from the farther node so they never cross)
  b += arrow([[395, 114], [395, 148], [187, 148], [187, 116]], { dash: true });
  b += text(291, 166, "CI fails → agent pushes a fix", "m", "middle");
  b += arrow([[505, 114], [505, 196], [163, 196], [163, 116]], { dash: true });
  b += text(334, 214, "changes requested → agent revises", "m", "middle");
  return b;
}
function loopNarrow() {
  let b = "";
  const Y = [16, 80, 144, 208, 272, 336];
  LOOP.forEach(([t, s, who], i) => {
    const y = Y[i];
    b += rect(16, y, 170, 50, i === 4 ? "n on" : "n");
    b += text(30, y + 22, t, "t");
    b += text(30, y + 39, s, "s");
    b += text(174, y + 21, who, i === 4 ? "cap act" : "cap", "end");
    if (i < 5) b += arrow([[60, y + 52], [60, Y[i + 1] - 3]]);
  });
  b += arrow([[188, 233], [222, 233], [222, 111], [190, 111]], { dash: true });
  b += arrow([[188, 297], [300, 297], [300, 99], [190, 99]], { dash: true });
  b += tag(222, 172, ["CI", "fails"], 50);
  b += tag(300, 230, ["changes", "requested"], 82);
  return b;
}

/* ───────────── (f) two devices ───────────── */
const laptopGlyph = (cx, y) =>
  `<rect class="n" x="${cx - 22}" y="${y}" width="44" height="28" rx="3"/><path class="ln" d="M${cx - 30} ${y + 33}h60"/>`;
const desktopGlyph = (cx, y) =>
  `<rect class="n" x="${cx - 24}" y="${y}" width="48" height="30" rx="3"/><path class="ln" d="M${cx} ${y + 31}v6M${cx - 10} ${y + 38}h20"/>`;
const lockGlyph = (cx, y) =>
  `<rect class="n" x="${cx - 7}" y="${y + 7}" width="14" height="11" rx="2"/><path class="ln" d="M${cx - 4} ${y + 7}v-3a4 4 0 0 1 8 0v3"/>`;
const CHANNELS = [
  ["dotfiles repo", ".gitconfig · .zshrc", "push", "clone"],
  ["Settings Sync", "settings · extensions", "sign in", "sign in"],
  ["wip/* branch", "unfinished work", "push", "pull"],
];
function devicesWide() {
  let b = "";
  const dev = (x, name, where, glyph) => {
    let o = rect(x, 48, 150, 272, "n");
    o += glyph(x + 75, 84);
    o += text(x + 75, 152, name, "t", "middle");
    o += text(x + 75, 170, where, "s", "middle");
    o += line(x + 16, 238, x + 134, 238, "ln dim");
    o += lockGlyph(x + 75, 250);
    o += text(x + 75, 290, "own SSH key", "m", "middle");
    o += text(x + 75, 306, "never synced", "m", "middle");
    return o;
  };
  b += dev(16, "Laptop", "home", laptopGlyph);
  b += dev(514, "Desktop", "office", desktopGlyph);
  b += rect(236, 20, 208, 312, "n on", 12);
  b += text(340, 44, "GITHUB", "cap", "middle");
  CHANNELS.forEach(([t, s, l, r], i) => {
    const y = 60 + i * 88;
    const cy = y + 32;
    b += node(252, y, 176, 64, t, [s], { subCls: "m" });
    b += arrow([[168, cy], [248, cy]]);
    b += text(202, cy - 8, l, "m", "middle");
    b += arrow([[432, cy], [510, cy]]);
    b += text(477, cy - 8, r, "m", "middle");
  });
  return b;
}
function devicesNarrow() {
  let b = "";
  const dev = (y, name, where, glyph) => {
    let o = rect(16, y, 328, 70, "n");
    o += glyph(56, y + 18);
    o += text(100, y + 32, name, "t");
    o += text(100, y + 50, where, "s");
    o += lockGlyph(236, y + 22);
    o += text(250, y + 34, "own SSH key", "m");
    return o;
  };
  // the lock+label sits right-aligned
  b += dev(14, "Laptop", "home", laptopGlyph);
  b += rect(16, 140, 328, 168, "n on", 12);
  b += text(221, 162, "GITHUB", "cap", "middle");
  const XS = [70, 180, 290];
  const titles = [["dotfiles", "repo", ".gitconfig", ".zshrc"], ["Settings", "Sync", "settings", "extensions"], ["wip/*", "branch", "unfinished", "work"]];
  CHANNELS.forEach(([, , l, r], i) => {
    const cx = XS[i];
    b += rect(cx - 50, 176, 100, 116, "n");
    const [a, c, d, e] = titles[i];
    b += text(cx, 204, a, "t", "middle");
    b += text(cx, 222, c, "t", "middle");
    b += text(cx, 252, d, "m", "middle");
    b += text(cx, 268, e, "m", "middle");
    b += arrow([[cx - 14, 86], [cx - 14, 172]]);
    b += text(cx - 8, 124, l, "m");
    b += arrow([[cx + 14, 294], [cx + 14, 342]]);
    b += text(cx + 8, 322, r, "m", "end");
  });
  b += dev(346, "Desktop", "office", desktopGlyph);
  return b;
}

export const DIAGRAMS = [
  {
    slug: "ecosystem-map",
    part: "Hub",
    label: "The map",
    title: "The GitHub ecosystem at a glance",
    desc: "Git keeps history on your machine, edited through VS Code. Git pushes and pulls to GitHub, the shared remote that holds repositories, issues, pull requests and releases. The gh CLI talks to GitHub's API. GitHub sends events to Actions runners and issues to AI agents; they report status and open pull requests back.",
    caption: "Git lives on your disk; GitHub is the shared remote. Everything else (gh, Actions, agents) talks to the remote, not to each other.",
    wide: { w: 680, h: 344, body: ecosystemWide },
    narrow: { w: 360, h: 520, body: ecosystemNarrow },
  },
  {
    slug: "teams-vs-direct",
    part: "Part 3",
    label: "Offboarding cost",
    title: "Direct collaborators versus a team",
    desc: "Left: three people are each added directly to repositories; when @asha leaves, four separate repository permissions must be removed. Right: the same people belong to an eng team that has access to the four repositories; removing @asha from the team is one edit.",
    caption: "Grant access to teams, not people. When someone leaves, direct grants cost one edit per repo; a team costs one edit.",
    wide: { w: 680, h: 284 , body: teamsWide },
    narrow: { w: 360, h: 572, body: teamsNarrow },
  },
  {
    slug: "pr-lifecycle",
    part: "Part 1 / 5",
    label: "Life of a pull request",
    title: "The pull request lifecycle",
    desc: "A feature branch leaves main, collects commits, opens pull request 42, passes three checks, gets approved, merges back into main, and a later commit on main is tagged v1.4.0 and released. Each step lists its command: git switch -c, git commit, gh pr create, CI runs, gh pr review, gh pr merge, gh release create.",
    caption: "Every change takes the same road: branch, commit, PR, checks, review, merge, then a tag when you ship.",
    wide: { w: 680, h: 290, body: prWide },
    narrow: { w: 360, h: 496, body: prNarrow },
  },
  {
    slug: "actions-triggers",
    part: "Part 6",
    label: "Six ways in",
    title: "What can start a GitHub Actions workflow",
    desc: "Six triggers feed the on: block of a workflow file: push (you push commits), pull_request (a PR opens or updates), workflow_dispatch (the Run button or gh workflow run), schedule (a cron in UTC), repository_dispatch (an outside system calls the API), and workflow_call (another workflow calls this one).",
    caption: "A workflow only runs when something in its on: block fires. This site's snapshot sync uses schedule plus workflow_dispatch.",
    wide: { w: 680, h: 352, body: triggersWide },
    narrow: { w: 360, h: 360, body: triggersNarrow },
  },
  {
    slug: "agent-loop",
    part: "Part 7",
    label: "The agent loop",
    title: "How an AI agent ships a change on GitHub",
    desc: "You write a scoped issue; the agent works on its own branch and opens a draft PR, never pushing to main; CI runs the same checks as for humans; a human reviews; you merge. If CI fails, the agent pushes a fix. If review requests changes, the agent revises. Both loops return to the agent.",
    caption: "The agent writes the code; CI and a human review are the gates. Nothing reaches main without you.",
    wide: { w: 680, h: 228, body: loopWide },
    narrow: { w: 360, h: 404, body: loopNarrow },
  },
  {
    slug: "two-devices",
    part: "Part 2",
    label: "Two machines, one setup",
    title: "Two devices kept in sync through GitHub",
    desc: "A laptop and a desktop share three things through GitHub: a dotfiles repository (pushed from one, cloned on the other), VS Code Settings Sync (sign in with GitHub on both), and a wip branch for unfinished work (push, then pull). Each machine keeps its own SSH key, which is never synced.",
    caption: "Config travels in a dotfiles repo, editor state through Settings Sync, unfinished work on a WIP branch. Keys stay put.",
    wide: { w: 680, h: 340, body: devicesWide },
    narrow: { w: 360, h: 430, body: devicesNarrow },
  },
];

export function render(d, variant) {
  const v = d[variant];
  const id = `gf-${d.slug}${variant === "narrow" ? "-sm" : ""}`;
  return svg({ id, w: v.w, h: v.h, title: d.title, desc: d.desc, body: v.body() });
}
export { esc };
