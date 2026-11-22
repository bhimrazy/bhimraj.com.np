"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { ControlBar } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACTION } from "./field-guide-data";

const W = 320;
const H = 108;
const NODE_Y = 66;
const X = { older: 40, good: 150, bad: 272 };
const EASE = "ease-out motion-reduce:transition-none";
/** Pause between Replay's reset and the force-push. */
const REPLAY_GAP = 700;

const BEFORE = `${ACTION.tag} points at ${ACTION.good}. Both workflows run the same reviewed commit.`;
const AFTER = `The attacker force-pushed ${ACTION.tag} to ${ACTION.bad}, so the tag-pinned workflow runs it next time; the SHA pin still runs ${ACTION.good}. In March 2025 attackers repointed tags on tj-actions/changed-files; repos pinned to a full SHA were not affected.`;

function Graph({ moved }: { moved: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto block h-auto w-full max-w-md"
    >
      <title>{`Commit graph of ${ACTION.repo}: tag ${ACTION.tag} points at ${moved ? `the malicious commit ${ACTION.bad}` : `the good commit ${ACTION.good}`}.`}</title>
      <line
        x1={X.older}
        x2={X.good}
        y1={NODE_Y}
        y2={NODE_Y}
        strokeWidth={1.25}
        className="stroke-site-text-tertiary"
      />
      {[
        { x: X.older, sha: ACTION.older },
        { x: X.good, sha: ACTION.good },
      ].map((c) => (
        <g key={c.sha}>
          <circle
            cx={c.x}
            cy={NODE_Y}
            r={6}
            strokeWidth={1.25}
            className="fill-site-card stroke-site-text-tertiary"
          />
          <text
            x={c.x}
            y={NODE_Y + 22}
            textAnchor="middle"
            className="fill-site-text-secondary font-mono text-2xs"
          >
            {c.sha}
          </text>
        </g>
      ))}

      {/* The attacker's commit appears first, then the tag moves onto it. */}
      <g
        className={cn(
          "transition-opacity duration-300",
          EASE,
          !moved && "opacity-0",
        )}
      >
        <line
          x1={X.good + 6}
          x2={X.bad - 6}
          y1={NODE_Y}
          y2={NODE_Y}
          strokeWidth={1.25}
          strokeDasharray="3 3"
          className="stroke-site-accent"
        />
        <circle
          cx={X.bad}
          cy={NODE_Y}
          r={6}
          className="fill-site-accent stroke-site-accent"
        />
        <text
          x={X.bad}
          y={NODE_Y + 22}
          textAnchor="middle"
          className="fill-site-accent-text font-mono text-2xs"
        >
          {ACTION.bad}
        </text>
        <text
          x={X.bad}
          y={NODE_Y + 36}
          textAnchor="middle"
          className="fill-site-accent-text font-mono text-3xs"
        >
          malicious
        </text>
      </g>

      <g
        className={cn(
          "transition-transform duration-700",
          EASE,
          moved && "delay-300",
        )}
        style={{ transform: `translateX(${moved ? X.bad - X.good : 0}px)` }}
      >
        <rect
          x={X.good - 18}
          y={10}
          width={36}
          height={20}
          rx={4}
          strokeWidth={1.25}
          className={cn(
            "transition-colors duration-700",
            EASE,
            moved
              ? "fill-site-accent-subtle stroke-site-accent"
              : "fill-site-card stroke-site-text-tertiary",
          )}
        />
        <text
          x={X.good}
          y={24}
          textAnchor="middle"
          className="fill-site-text font-mono text-xs"
        >
          {ACTION.tag}
        </text>
        <line
          x1={X.good}
          x2={X.good}
          y1={30}
          y2={NODE_Y - 9}
          strokeWidth={1.25}
          className={moved ? "stroke-site-accent" : "stroke-site-text-tertiary"}
        />
        <path
          d={`M${X.good - 3.5} ${NODE_Y - 13}L${X.good} ${NODE_Y - 8.5}L${X.good + 3.5} ${NODE_Y - 13}`}
          fill="none"
          strokeWidth={1.25}
          className={moved ? "stroke-site-accent" : "stroke-site-text-tertiary"}
        />
      </g>
    </svg>
  );
}

/** Two stacked results cross-fade so the row keeps its size; the switch to bad waits for the tag to land. */
function Run({ bad }: { bad: boolean }) {
  const cell = (show: boolean, children: ReactNode, className: string) => (
    <span
      aria-hidden={!show}
      className={cn(
        "col-start-1 row-start-1 transition-opacity duration-300",
        EASE,
        bad && "delay-1000",
        !show && "opacity-0",
        className,
      )}
    >
      {children}
    </span>
  );
  return (
    <span className="grid font-mono text-2xs">
      {cell(!bad, <>next run: {ACTION.good} ✓</>, "text-site-text-secondary")}
      {cell(
        bad,
        <>next run: {ACTION.bad} ✗ malicious</>,
        "text-site-accent-text",
      )}
    </span>
  );
}

function Row({
  label,
  code,
  bad,
}: {
  label: string;
  code: string;
  bad: boolean;
}) {
  return (
    <div
      className={cn(
        "gap-x-4 gap-y-2 rounded-lg border p-3 transition-colors duration-300 motion-reduce:transition-none sm:flex sm:items-end sm:justify-between",
        bad ? "border-site-accent delay-1000" : "border-site-border",
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-2xs text-site-text-secondary">{label}</p>
        <p className="mt-1 break-words font-mono text-site-text text-sm">
          {code}
        </p>
      </div>
      <div className="mt-2 shrink-0 sm:mt-0">
        <Run bad={bad} />
      </div>
    </div>
  );
}

/** Why a tag pin is mutable and a SHA pin is not. SSR: after the force-push. */
export function TagVsSha() {
  const [moved, setMoved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const go = () => {
    clearTimeout(timer.current);
    if (!moved) return setMoved(true);
    setMoved(false);
    timer.current = setTimeout(() => setMoved(true), REPLAY_GAP);
  };
  const reset = () => {
    clearTimeout(timer.current);
    setMoved(false);
  };

  return (
    <div>
      <Graph moved={moved} />
      <div className="mt-4 grid gap-3">
        <Row
          label={`Pinned to tag ${ACTION.tag}`}
          code={`uses: ${ACTION.repo}@${ACTION.tag}`}
          bad={moved}
        />
        <Row
          label={`Pinned to SHA ${ACTION.good}…`}
          code={`uses: ${ACTION.repo}@${ACTION.goodFull}… # ${ACTION.tag}`}
          bad={false}
        />
      </div>
      <Narration>{moved ? AFTER : BEFORE}</Narration>
      <ControlBar className="mt-3">
        <Button variant="figure" size="sm" onClick={go}>
          {moved ? "Replay" : `Attacker force-pushes ${ACTION.tag}`}
        </Button>
        <Button
          variant="figure"
          size="sm"
          onClick={reset}
          aria-disabled={!moved}
        >
          Reset
        </Button>
      </ControlBar>
    </div>
  );
}
