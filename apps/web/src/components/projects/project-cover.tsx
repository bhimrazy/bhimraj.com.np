import { cn } from "@/lib/utils";

const COLS = 14;
const ROWS = 4;
const STARS = 5;

/** FNV-1a: a stable 32-bit seed from the project slug. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: a tiny deterministic PRNG. */
function random(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { col: number; row: number };

/** Distinct grid cells (partial Fisher–Yates), retried until not all collinear. */
function pickCells(rand: () => number): Cell[] {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  for (;;) {
    for (let i = 0; i < STARS; i++) {
      const j = i + Math.floor(rand() * (cells.length - i));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    const picked = cells
      .slice(0, STARS)
      .map((i) => ({ col: i % COLS, row: Math.floor(i / COLS) }));
    const [a, b] = picked;
    const flat = picked.every(
      (c) =>
        (b.col - a.col) * (c.row - a.row) -
          (b.row - a.row) * (c.col - a.col) ===
        0,
    );
    if (!flat) return picked;
  }
}

/**
 * Orders cells by angle around their centroid, so the outline is a simple
 * closed shape. Integer maths (coordinates scaled by STARS) keeps it exact.
 */
function byAngle(cells: Cell[]): Cell[] {
  const sx = cells.reduce((s, c) => s + c.col, 0);
  const sy = cells.reduce((s, c) => s + c.row, 0);
  const rel = (c: Cell) => ({
    x: c.col * cells.length - sx,
    y: c.row * cells.length - sy,
  });
  const half = (v: { x: number; y: number }) =>
    v.y < 0 || (v.y === 0 && v.x < 0) ? 1 : 0;

  return [...cells].sort((p, q) => {
    const a = rel(p);
    const b = rel(q);
    return (
      half(a) - half(b) ||
      a.y * b.x - a.x * b.y ||
      a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y)
    );
  });
}

const pct = (i: number, n: number) => `${((i + 0.5) / n) * 100}%`;

/**
 * A thin decorative band: a dot field with a constellation seeded by the slug,
 * so projects that share a repo still look distinct. Percent coordinates let it
 * stretch to any card width without distorting the dots.
 */
export function ProjectCover({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const stars = byAngle(pickCells(random(hash(slug)))).map((c) => ({
    x: pct(c.col, COLS),
    y: pct(c.row, ROWS),
  }));
  const dotsId = `project-dots-${slug}`;

  return (
    <div
      aria-hidden
      className={cn(
        "relative h-16 overflow-hidden bg-site-bg-secondary",
        className,
      )}
    >
      <svg aria-hidden="true" className="absolute inset-0 size-full">
        <defs>
          <pattern
            id={dotsId}
            width={12}
            height={12}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={6}
              cy={6}
              r={0.9}
              className="fill-site-text-tertiary opacity-40"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${dotsId})`} />
        {stars.map((s, i) => {
          const t = stars[(i + 1) % stars.length];
          return (
            <line
              key={`${s.x}-${s.y}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              strokeWidth={1}
              className="stroke-site-accent/50 transition-colors duration-300 group-hover:stroke-site-accent/90 motion-reduce:transition-none"
            />
          );
        })}
        {stars.map((s) => (
          <circle
            key={`star-${s.x}-${s.y}`}
            cx={s.x}
            cy={s.y}
            r={2.5}
            className="fill-site-accent"
          />
        ))}
      </svg>
    </div>
  );
}
