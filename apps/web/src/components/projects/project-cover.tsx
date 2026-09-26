const COLS = 16;
const ROWS = 8;
const STEP = 12.5;
const STARS = 5;

/** FNV-1a — a stable 32-bit seed from the project slug. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — tiny deterministic PRNG, so server and client render alike. */
function random(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "github.com/bhimrazy/litserve-examples/tree/main/x" → "litserve-examples/x" */
function repoPath(githubLink: string): string {
  const [, , repo, , , ...rest] = new URL(githubLink).pathname.split("/");
  return [repo, ...rest].filter(Boolean).join("/");
}

/**
 * A generated cover: a dot field with a constellation seeded by the slug, so
 * every project gets a distinct, on-brand image — even the ones that share a
 * GitHub repo (and therefore GitHub's OpenGraph card).
 */
export function ProjectCover({
  slug,
  githubLink,
  category,
}: {
  slug: string;
  githubLink: string;
  category: string;
}) {
  const rand = random(hash(slug));

  const dots = Array.from({ length: COLS * ROWS }, (_, i) => ({
    x: (i % COLS) * STEP + STEP / 2,
    y: Math.floor(i / COLS) * STEP + STEP / 2,
    opacity: 0.12 + rand() * 0.35,
  }));

  // Scatter the stars, then order them by angle around their centroid so the
  // outline is a simple closed shape — it should read as a constellation, not
  // as a line chart of some metric.
  const picked = Array.from({ length: STARS }, () => {
    const col = 2 + Math.floor(rand() * (COLS - 4));
    const row = 1 + Math.floor(rand() * (ROWS - 2));
    return dots[row * COLS + col];
  });
  const cx = picked.reduce((sum, p) => sum + p.x, 0) / picked.length;
  const cy = picked.reduce((sum, p) => sum + p.y, 0) / picked.length;
  const stars = [...new Set(picked)].sort(
    (a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx),
  );

  return (
    <div className="relative size-full">
      <svg
        viewBox={`0 0 ${COLS * STEP} ${ROWS * STEP}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        {dots.map((d) => (
          <circle
            key={`${d.x}-${d.y}`}
            cx={d.x}
            cy={d.y}
            r={0.9}
            opacity={d.opacity}
            className="fill-site-text-tertiary"
          />
        ))}
        <polygon
          points={stars.map((s) => `${s.x},${s.y}`).join(" ")}
          strokeWidth={0.6}
          strokeLinejoin="round"
          className="fill-site-accent/6 stroke-site-accent/55 transition-colors duration-300 group-hover:fill-site-accent/12 group-hover:stroke-site-accent/90"
        />
        {stars.map((s) => (
          <circle
            key={`star-${s.x}-${s.y}`}
            cx={s.x}
            cy={s.y}
            r={2}
            className="fill-site-accent"
          />
        ))}
      </svg>

      <span className="absolute top-3 left-4 font-mono text-[10px] text-site-accent uppercase tracking-[1.2px]">
        {category}
      </span>
      <span className="absolute bottom-3 left-4 max-w-[85%] truncate font-mono text-[11px] text-site-text-secondary">
        {repoPath(githubLink)}
      </span>
    </div>
  );
}
