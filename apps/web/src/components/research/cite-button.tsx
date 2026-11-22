"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

export function CiteButton({ bibtex }: { bibtex: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setState("copied");
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context).
      setState("failed");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2000);
  }

  const label =
    state === "copied"
      ? "Copied!"
      : state === "failed"
        ? "Copy failed"
        : "Cite";

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy BibTeX citation"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-site-border bg-site-bg-secondary px-3.5 font-medium text-site-text-secondary text-sm transition-colors hover:border-site-border-hover hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
      >
        {label}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "BibTeX citation copied"
          : state === "failed"
            ? "Copying the citation failed"
            : ""}
      </span>
    </>
  );
}
