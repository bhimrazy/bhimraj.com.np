"use client";

import { useState } from "react";
import { ControlBar, Segmented } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { cn } from "@/lib/utils";

type Mode = "shared" | "isolated";

const OPTIONS = [
  { value: "shared", label: "One shared machine" },
  { value: "isolated", label: "Isolated per project" },
] as const;

/** The malicious install happens in `side-project`; everything else is collateral. */
const PROJECTS = [
  {
    name: "client-dashboard",
    kind: "client work",
    secrets: ["Stripe live key", "production database URL"],
  },
  {
    name: "side-project",
    kind: "npm install pulls a bad version",
    secrets: ["OpenAI API key"],
    infected: true,
  },
  {
    name: "oss-library",
    kind: "open source",
    secrets: ["npm publish token"],
  },
];

/** Credentials that live in your home directory, not in any one project. */
const SHARED = [
  "~/.aws credentials",
  "~/.npmrc token",
  "GitHub CLI token",
  "browser sessions",
];

const projectSecrets = PROJECTS.flatMap((p) => p.secrets).length;
const ownSecrets = PROJECTS.filter((p) => p.infected).flatMap(
  (p) => p.secrets,
).length;

const STORY: Record<Mode, string> = {
  shared: `One bad package in side-project runs as you, so it reads every project's .env and every login in your home directory: ${projectSecrets + SHARED.length} credentials across ${PROJECTS.length} projects, including a client's production database.`,
  isolated: `The same package now runs in side-project's own container with its own scoped key. It reaches ${ownSecrets} credential, and the shared logins are short-lived and scoped per project, so the client's systems stay out of reach.`,
};

const fade =
  "transition-[opacity,border-color,background-color,color] duration-300 motion-reduce:transition-none";

function Chip({ hit, children }: { hit: boolean; children: string }) {
  return (
    <li
      className={cn(
        "rounded-md border px-2 py-1 font-mono text-2xs",
        fade,
        hit
          ? "border-site-accent bg-site-accent-subtle text-site-accent-text"
          : "border-site-border text-site-text-tertiary",
      )}
    >
      {children}
    </li>
  );
}

/** One machine, three projects: how far one malicious install reaches, shared vs isolated. */
export function BlastRadius() {
  const [mode, setMode] = useState<Mode>("shared");
  const shared = mode === "shared";

  return (
    <div>
      <ControlBar>
        <Segmented
          label="Machine setup"
          value={mode}
          options={OPTIONS}
          onChange={setMode}
        />
      </ControlBar>

      <div
        className={cn(
          "mt-5 rounded-xl border p-3 sm:p-4",
          fade,
          shared ? "border-site-accent" : "border-site-border",
        )}
      >
        <p className="mb-3 font-mono text-3xs text-site-text-secondary uppercase tracking-widest">
          your machine
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {PROJECTS.map((p) => {
            const hit = shared || Boolean(p.infected);
            return (
              <div
                key={p.name}
                className={cn(
                  "rounded-lg border p-3",
                  fade,
                  !shared && "border-dashed",
                  hit ? "border-site-accent" : "border-site-border",
                )}
              >
                <p className="font-mono text-site-text text-xs">
                  {p.infected ? "⚠ " : ""}
                  {p.name}
                </p>
                <p className="mt-0.5 mb-2 text-2xs text-site-text-secondary">
                  {p.kind}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {p.secrets.map((s) => (
                    <Chip key={s} hit={hit}>
                      {s}
                    </Chip>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-lg border border-site-border p-3">
          <p className="mb-2 text-2xs text-site-text-secondary">
            {shared
              ? "in your home directory, shared by every project"
              : "short-lived, scoped per project"}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {SHARED.map((s) => (
              <Chip key={s} hit={shared}>
                {s}
              </Chip>
            ))}
          </ul>
        </div>
      </div>

      <p
        className={cn(
          "mt-4 font-display text-lg",
          fade,
          shared ? "text-site-accent-text" : "text-site-text",
        )}
      >
        {shared
          ? `${projectSecrets + SHARED.length} credentials reachable`
          : `${ownSecrets} credential reachable`}
      </p>
      <Narration>{STORY[mode]}</Narration>
    </div>
  );
}
