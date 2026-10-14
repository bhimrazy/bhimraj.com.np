"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics";

/** Copies the code of the `<pre>` it sits in. Shown on hover/focus, always on touch. */
export function CopyButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (button: HTMLButtonElement) => {
    const code = button.closest("pre")?.querySelector("code");
    try {
      await navigator.clipboard.writeText(code?.innerText ?? "");
    } catch {
      return; // Clipboard permission denied or unavailable.
    }
    capture("code_copied", { slug: window.location.pathname });
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={(e) => copy(e.currentTarget)}
      className="absolute top-2.5 right-2.5 size-7 bg-site-bg-secondary text-site-text-tertiary opacity-0 pointer-coarse:opacity-100 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 data-[copied=true]:text-site-accent [&_svg]:size-3.5"
      data-copied={copied}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
