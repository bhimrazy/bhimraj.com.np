"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Small, quiet controls shared by the interactive figures. Mono labels,
 * hairline borders, amber only for the active state.
 */

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

export function ControlBar({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-site-text-tertiary",
        className,
      )}
      {...props}
    />
  );
}

export function ControlButton({
  className,
  active,
  ...props
}: ComponentPropsWithoutRef<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md border border-site-border px-2.5 font-mono text-[11px] text-site-text-secondary transition-colors hover:border-site-border-hover hover:text-site-text disabled:pointer-events-none disabled:opacity-40",
        active && "border-site-accent/60 text-site-accent",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function PlayButton({
  playing,
  onToggle,
  label = "animation",
}: {
  playing: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <ControlButton
      onClick={onToggle}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      className="w-7 justify-center rounded-full px-0"
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </ControlButton>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not a form fieldset
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-7 items-center rounded-md border border-site-border p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-full rounded-[5px] px-2.5 font-mono text-[11px] text-site-text-tertiary transition-colors hover:text-site-text",
            o.value === value && "bg-site-bg-tertiary text-site-text",
            focusRing,
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Scrubber({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type">) {
  return (
    <input
      type="range"
      className={cn(
        "figure-range h-7 min-w-0 flex-1 cursor-pointer rounded-sm",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 1.2v7.6L8.6 5z" className="fill-current" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 1h2v8H2zM6 1h2v8H6z" className="fill-current" />
    </svg>
  );
}
