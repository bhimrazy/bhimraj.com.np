import { cn } from "@/lib/utils";

type StationId = "device" | "source" | "deps" | "ci" | "prod";

type Incident = { name: string[]; date: string };

type Station = {
  id: StationId;
  name: string;
  /** What lives here; one line each on desktop, joined on phones. */
  parts: string[];
  incidents: Incident[];
};

const STATIONS: Station[] = [
  {
    id: "device",
    name: "Your device",
    parts: ["editor, terminal,", "AI agents"],
    incidents: [
      { name: ["Binance"], date: "Oct 2026" },
      { name: ["LiteLLM"], date: "Oct 2026" },
      { name: ["Claude Code", "in Cursor"], date: "Oct 2026" },
      { name: ["GlassWorm"], date: "Oct 2025" },
    ],
  },
  {
    id: "source",
    name: "Source",
    parts: ["git, GitHub"],
    incidents: [
      { name: ["GhostAction"], date: "Sep 2025" },
      { name: ["Copilot prompt", "injection"], date: "Aug 2025" },
    ],
  },
  {
    id: "deps",
    name: "Dependencies",
    parts: ["npm, PyPI,", "MCP servers,", "extensions"],
    incidents: [
      { name: ["chalk & debug"], date: "Sep 2025" },
      { name: ["Shai-Hulud"], date: "Sep & Nov 2025" },
      { name: ["postmark-mcp"], date: "Sep 2025" },
    ],
  },
  {
    id: "ci",
    name: "CI/CD",
    parts: ["GitHub Actions"],
    incidents: [
      { name: ["tj-actions"], date: "Mar 2025" },
      { name: ["Trivy action", "tags"], date: "Mar 2026" },
      { name: ["TanStack", "pwn request"], date: "May 2026" },
    ],
  },
  {
    id: "prod",
    name: "Production",
    parts: ["cloud, servers,", "hosting platforms"],
    incidents: [
      { name: ["Black October"], date: "Oct 2026" },
      { name: ["xz backdoor"], date: "Mar 2024" },
    ],
  },
];

/** 20×20 stroke glyphs, one per station. */
const ICON: Record<StationId, string> = {
  device: "M4 4.5h12v8H4zM1.5 15.5h17",
  source:
    "M6 3v14M6 13c0-3.5 8-3 8-7M6 4.5a1.5 1.5 0 1 0 0-.01M14 4.5a1.5 1.5 0 1 0 0-.01M6 17a1.5 1.5 0 1 0 0-.01",
  deps: "M10 2.5l6.5 3.5v8L10 17.5 3.5 14V6zM3.5 6L10 9.5 16.5 6M10 9.5v8",
  ci: "M15.5 7A6 6 0 1 0 16 12M16 3.5V7h-3.5M8.5 7.5v5l4-2.5z",
  prod: "M3 3.5h14v5H3zM3 11.5h14v5H3zM6 6h.01M6 14h.01",
};

const NODE = 40;
/** Mono advance is 0.6em; 2xs = 11px, 3xs = 10px. */
const LINE = 14;
const TAG_PAD = 8;

const tagHeight = (i: Incident) => TAG_PAD * 2 + (i.name.length + 1) * LINE - 4;

function Icon({
  id,
  x,
  y,
  active,
}: {
  id: StationId;
  x: number;
  y: number;
  active: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE}
        height={NODE}
        rx={10}
        strokeWidth={active ? 1.5 : 1}
        className={
          active
            ? "fill-site-accent-subtle stroke-site-accent"
            : "fill-site-card stroke-site-border-hover"
        }
      />
      <path
        d={ICON[id]}
        transform={`translate(${x + 10} ${y + 10})`}
        fill="none"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "stroke-site-accent" : "stroke-site-text-secondary"}
      />
    </g>
  );
}

function Tag({
  incident,
  x,
  y,
  width,
  active,
}: {
  incident: Incident;
  x: number;
  y: number;
  width: number;
  active: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={tagHeight(incident)}
        rx={6}
        className={cn(
          "fill-site-bg-secondary",
          active ? "stroke-site-accent" : "stroke-site-border",
        )}
        strokeWidth={1}
      />
      {incident.name.map((line, i) => (
        <text
          key={line}
          x={x + 8}
          y={y + TAG_PAD + 10 + i * LINE}
          className="fill-site-text font-mono text-2xs"
        >
          {line}
        </text>
      ))}
      <text
        x={x + 8}
        y={y + TAG_PAD + 10 + incident.name.length * LINE}
        className="fill-site-text-tertiary font-mono text-3xs"
      >
        {incident.date}
      </text>
    </g>
  );
}

const summary = (active?: StationId) =>
  `Five stations a change passes through, from your device to production, each with real incidents.${
    active
      ? ` Highlighted: ${STATIONS.find((s) => s.id === active)?.name}.`
      : ""
  }`;

/* Desktop: left to right. */
const DW = 600;
const COL = DW / STATIONS.length;
const TAGS_TOP = 132;
const TAG_GAP = 8;
const DH =
  TAGS_TOP +
  Math.max(
    ...STATIONS.map((s) =>
      s.incidents.reduce((h, i) => h + tagHeight(i) + TAG_GAP, 0),
    ),
  );

function Horizontal({ active }: { active?: StationId }) {
  return (
    <svg
      viewBox={`0 -2 ${DW} ${DH + 2}`}
      className="hidden h-auto w-full sm:block"
    >
      <title>{summary(active)}</title>
      {STATIONS.slice(1).map((s, i) => {
        const x1 = (i + 0.5) * COL + NODE / 2 + 8;
        const x2 = (i + 1.5) * COL - NODE / 2 - 8;
        return (
          <path
            key={s.id}
            d={`M${x1} 20H${x2}M${x2 - 5} 16l5 4-5 4`}
            fill="none"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-site-text-tertiary"
          />
        );
      })}
      {STATIONS.map((s, col) => {
        const cx = (col + 0.5) * COL;
        const on = s.id === active;
        let y = TAGS_TOP;
        return (
          <g key={s.id}>
            <Icon id={s.id} x={cx - NODE / 2} y={0} active={on} />
            <text
              x={cx}
              y={NODE + 22}
              textAnchor="middle"
              className={cn(
                "font-display font-medium text-sm",
                on ? "fill-site-accent-text" : "fill-site-text",
              )}
            >
              {s.name}
            </text>
            {s.parts.map((p, i) => (
              <text
                key={p}
                x={cx}
                y={NODE + 40 + i * 13}
                textAnchor="middle"
                className="fill-site-text-secondary font-mono text-3xs"
              >
                {p}
              </text>
            ))}
            {s.incidents.map((inc) => {
              const top = y;
              y += tagHeight(inc) + TAG_GAP;
              return (
                <Tag
                  key={inc.name.join(" ")}
                  incident={inc}
                  x={cx - COL / 2 + 6}
                  y={top}
                  width={COL - 12}
                  active={on}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* Phones: top to bottom, incidents one per line beside the rail. */
const PW = 290;
const TEXT_X = NODE + 14;
const ROW_TAG = 24;
const ROW_GAP = 22;
/** Name plus the one-line parts list. */
const HEAD = 42;
const rowHeight = (s: Station) => HEAD + s.incidents.length * ROW_TAG - 4;

function Vertical({ active }: { active?: StationId }) {
  let y = 0;
  const rows = STATIONS.map((s) => {
    const top = y;
    y += rowHeight(s) + ROW_GAP;
    return { s, top };
  });
  const PH = y - ROW_GAP;

  return (
    <svg
      viewBox={`-1 -1 ${PW + 2} ${PH + 2}`}
      className="block h-auto w-full sm:hidden"
    >
      <title>{summary(active)}</title>
      {rows.slice(1).map(({ s, top }, i) => {
        const y1 = (rows[i]?.top ?? 0) + NODE + 8;
        const y2 = top - 8;
        return (
          <path
            key={s.id}
            d={`M${NODE / 2} ${y1}V${y2}M${NODE / 2 - 4} ${y2 - 5}l4 5 4-5`}
            fill="none"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-site-text-tertiary"
          />
        );
      })}
      {rows.map(({ s, top }) => {
        const on = s.id === active;
        return (
          <g key={s.id}>
            <Icon id={s.id} x={0} y={top} active={on} />
            <text
              x={TEXT_X}
              y={top + 15}
              className={cn(
                "font-display font-medium text-sm",
                on ? "fill-site-accent-text" : "fill-site-text",
              )}
            >
              {s.name}
            </text>
            <text
              x={TEXT_X}
              y={top + 31}
              className="fill-site-text-secondary font-mono text-3xs"
            >
              {s.parts.join(" ")}
            </text>
            {s.incidents.map((inc, i) => {
              const ty = top + HEAD + i * ROW_TAG;
              return (
                <g key={inc.name.join(" ")}>
                  <rect
                    x={TEXT_X}
                    y={ty}
                    width={PW - TEXT_X}
                    height={ROW_TAG - 4}
                    rx={5}
                    className={cn(
                      "fill-site-bg-secondary",
                      on ? "stroke-site-accent" : "stroke-site-border",
                    )}
                    strokeWidth={1}
                  />
                  <text
                    x={TEXT_X + 7}
                    y={ty + 14}
                    className="font-mono text-2xs"
                  >
                    <tspan className="fill-site-text">
                      {inc.name.join(" ")}
                    </tspan>
                    <tspan dx={8} className="fill-site-text-tertiary text-3xs">
                      {inc.date}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/** Where a change travels from device to production, with real incidents at each stop. `active` marks one station, for use as a chapter marker. */
export function AttackPath({ active }: { active?: StationId }) {
  return (
    <div>
      <Horizontal active={active} />
      <Vertical active={active} />
    </div>
  );
}
