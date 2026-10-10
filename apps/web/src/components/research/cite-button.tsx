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
        className="inline-flex items-center gap-1.5 rounded-md border border-site-border bg-site-bg-secondary px-2.5 py-1 font-mono text-[11px] text-site-text-secondary transition-colors hover:border-site-border-hover hover:text-site-text"
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
