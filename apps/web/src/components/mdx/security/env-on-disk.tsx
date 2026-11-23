"use client";

import { type ReactNode, useState } from "react";
import { ControlBar, Segmented } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { cn } from "@/lib/utils";

type Mode = "plain" | "refs";

const OPTIONS = [
  { value: "plain", label: "Plaintext .env" },
  { value: "refs", label: "Secret references" },
] as const;

/** One row per variable: the plaintext value, its 1Password reference, and what it unlocks. */
const ENV = [
  {
    key: "STRIPE_SECRET_KEY",
    plain: "sk_live_51Nx…",
    ref: "op://dev/Stripe/secret_key",
    what: "Stripe live key",
  },
  {
    key: "DATABASE_URL",
    plain: "postgres://app:hunter2@db…",
    ref: "op://dev/Postgres/url",
    what: "Database password",
  },
  {
    key: "OPENAI_API_KEY",
    plain: "sk-proj-…",
    ref: "op://dev/OpenAI/api_key",
    what: "OpenAI API key",
  },
];

const STORY: Record<Mode, ReactNode> = {
  plain: `Every value is the real secret, so one glob of **/.env takes away ${ENV.length} live keys that work from anywhere until you rotate them.`,
  refs: (
    <>
      The file only holds op:// paths, which resolve to nothing without your
      unlocked vault. The real values still exist in the process's environment
      while{" "}
      <code className="whitespace-nowrap font-mono text-xs">
        op run -- npm run dev
      </code>{" "}
      is running.
    </>
  ),
};

const fade = "transition-opacity duration-300 motion-reduce:transition-none";

/** Both variants share one grid cell, so the layout doesn't move when the toggle flips. */
function Swap({
  mode,
  plain,
  refs,
}: {
  mode: Mode;
  plain: ReactNode;
  refs: ReactNode;
}) {
  return (
    <span className="grid">
      {(["plain", "refs"] as const).map((m) => (
        <span
          key={m}
          aria-hidden={m !== mode}
          className={cn(
            "col-start-1 row-start-1",
            fade,
            m === mode ? "opacity-100" : "opacity-0",
          )}
        >
          {m === "plain" ? plain : refs}
        </span>
      ))}
    </span>
  );
}

function Glyph({ live }: { live: boolean }) {
  return (
    <svg
      viewBox="0 0 24 12"
      aria-hidden="true"
      className="mt-0.5 h-3 w-6 shrink-0"
    >
      {live ? (
        <path
          d="M11 6a5 5 0 1 1 0-.01M11 6h12M19.5 6v3.5M22.5 6v2.5"
          fill="none"
          strokeWidth={1.4}
          strokeLinecap="round"
          className="stroke-site-accent"
        />
      ) : (
        <path
          d="M7 5.5h9v6H7zM9 5.5V3.75a2.5 2.5 0 0 1 5 0V5.5"
          fill="none"
          strokeWidth={1.2}
          strokeLinejoin="round"
          className="stroke-site-text-tertiary"
        />
      )}
    </svg>
  );
}

/** The file on disk, then what a `**\/.env` glob takes off the machine. */
export function EnvOnDisk() {
  const [mode, setMode] = useState<Mode>("plain");
  const live = mode === "plain";

  return (
    <div>
      <ControlBar className="mb-5">
        <Segmented
          label=".env contents"
          value={mode}
          options={OPTIONS}
          onChange={setMode}
        />
      </ControlBar>

      <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4">
        <div>
          <p className="mb-2 font-mono text-2xs text-site-text-secondary leading-5 sm:min-h-10">
            On disk
          </p>
          <div className="overflow-hidden rounded-lg border border-site-border bg-site-bg-secondary">
            <p className="border-site-border border-b px-3 py-1.5 font-mono text-3xs text-site-text-tertiary">
              ~/code/app/.env
            </p>
            <div className="space-y-2 px-3 py-3 font-mono text-2xs leading-relaxed">
              {ENV.map((e) => (
                <p key={e.key} className="flex flex-wrap">
                  <span className="text-site-text">{e.key}</span>
                  <span className="text-site-text-tertiary">=</span>
                  <Swap
                    mode={mode}
                    plain={
                      <span className="break-all text-site-accent-text">
                        {e.plain}
                      </span>
                    }
                    refs={
                      <span className="break-all text-site-text-secondary">
                        "{e.ref}"
                      </span>
                    }
                  />
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-2 font-mono text-3xs text-site-text-tertiary sm:flex-col sm:gap-1 sm:pt-24 sm:pl-0 sm:text-center">
          <svg
            viewBox="0 0 32 12"
            aria-hidden="true"
            className="h-3 w-8 rotate-90 sm:rotate-0"
          >
            <path
              d="M1 6h29M26 2l4 4-4 4"
              fill="none"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-site-text-tertiary"
            />
          </svg>
          <span>
            glob <span className="sm:block">**/.env</span>
          </span>
        </div>

        <div>
          <p className="mb-2 font-mono text-2xs text-site-text-secondary leading-5 sm:min-h-10">
            What a stealer that globs **/.env takes away
          </p>
          <ul className="space-y-3 rounded-lg border border-site-border px-3 py-3">
            {ENV.map((e) => (
              <li key={e.key} className="flex gap-2">
                <Glyph live={live} />
                <Swap
                  mode={mode}
                  plain={
                    <span className="block">
                      <span className="block font-medium text-site-accent-text text-sm">
                        {e.what}
                      </span>
                      <span className="block font-mono text-3xs text-site-text-secondary">
                        works now
                      </span>
                    </span>
                  }
                  refs={
                    <span className="block">
                      <span className="block break-all font-mono text-2xs text-site-text-secondary">
                        {e.ref}
                      </span>
                      <span className="block font-mono text-3xs text-site-text-tertiary">
                        nothing without your vault
                      </span>
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
          <p
            className={cn(
              "mt-3 font-display font-medium text-base",
              live ? "text-site-accent-text" : "text-site-text",
            )}
          >
            {live ? `${ENV.length} live keys` : "0 usable secrets"}
          </p>
        </div>
      </div>

      <Narration>{STORY[mode]}</Narration>
    </div>
  );
}
