"use client";

import type { MouseEvent } from "react";
import { useState } from "react";

export function CiteButton({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context); fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-site-border bg-site-bg-secondary px-2.5 py-1 font-mono text-[11px] text-site-text-secondary transition-colors hover:border-site-border-hover hover:text-site-text"
      aria-label="Copy BibTeX citation"
    >
      {copied ? "Copied!" : "Cite"}
    </button>
  );
}
