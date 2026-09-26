"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import { ControlButton } from "@/components/mdx/controls";
import { Figure } from "@/components/mdx/figure";
import { usePrefersReducedMotion } from "@/components/mdx/hooks";
import { cn } from "@/lib/utils";

export type WalkthroughStep = {
  lines: number[];
  title: string;
  content: ReactNode;
  aside?: ReactNode;
};

export function WalkthroughClient({
  steps,
  caption,
  children,
}: {
  steps: WalkthroughStep[];
  caption?: ReactNode;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const scopeId = useId();
  const codeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const step = steps[index];

  const go = (next: number) => {
    const i = Math.max(0, Math.min(steps.length - 1, next));
    setIndex(i);
    // Bring the step's first line into view inside the code panel only.
    const panel = codeRef.current;
    const first = steps[i]?.lines[0];
    const line = panel?.querySelector<HTMLElement>(
      `.line[data-line="${first}"]`,
    );
    if (panel && line) {
      const top =
        line.getBoundingClientRect().top -
        panel.getBoundingClientRect().top +
        panel.scrollTop -
        24;
      panel.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
  };

  // Dim every line except the active step's. Rendered as a scoped <style> so
  // the server-rendered first frame already shows step 1 highlighted.
  const selector = step?.lines
    .map((n) => `[data-walkthrough="${scopeId}"] .line[data-line="${n}"]`)
    .join(",");

  return (
    <Figure caption={caption} className="p-0 sm:p-0">
      {selector ? (
        <style>{`${selector}{opacity:1;background:var(--site-accent-subtle);box-shadow:inset 2px 0 var(--site-accent)}`}</style>
      ) : null}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: arrow-key shortcuts for the step buttons inside */}
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-site-border border-b px-4 py-3 sm:px-5">
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-site-text-tertiary">
            <span className="text-site-accent tabular-nums">
              {index + 1}/{steps.length}
            </span>{" "}
            <span className="text-site-text">{step?.title}</span>
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === index ? "step" : undefined}
                className={cn(
                  "hidden size-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:block",
                  i === index
                    ? "bg-site-accent"
                    : "bg-site-border-hover hover:bg-site-text-tertiary",
                )}
              />
            ))}
            <ControlButton
              className="ml-2 w-7 justify-center px-0"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous step"
            >
              ←
            </ControlButton>
            <ControlButton
              className="w-7 justify-center px-0"
              onClick={() => go(index + 1)}
              disabled={index === steps.length - 1}
              aria-label="Next step"
            >
              →
            </ControlButton>
          </div>
        </div>

        <div
          aria-live="polite"
          className="grid px-4 py-4 text-[14px] text-site-text-secondary leading-relaxed sm:px-5 [&_code]:rounded [&_code]:bg-site-bg-tertiary [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-site-text [&_p+p]:mt-2"
        >
          {/* Steps share one grid cell, so the panel is as tall as the
              tallest step and the code below never jumps. */}
          {steps.map((s, i) => (
            <div
              key={s.title}
              aria-hidden={i !== index}
              className={cn(
                "col-start-1 row-start-1",
                i !== index && "invisible",
                s.aside &&
                  "grid content-start items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]",
              )}
            >
              <div>{s.content}</div>
              {s.aside ? <div>{s.aside}</div> : null}
            </div>
          ))}
        </div>

        <div
          ref={codeRef}
          data-walkthrough={scopeId}
          className="relative max-h-88 overflow-auto border-site-border border-t"
        >
          {children}
        </div>
      </div>
    </Figure>
  );
}
