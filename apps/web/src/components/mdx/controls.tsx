"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

/** A row of figure controls; every control in it is h-8. */
export function ControlBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-2xs text-site-text-secondary",
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
    <Button
      variant="figure"
      size="icon-sm"
      onClick={onToggle}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      className="[&_svg]:size-2.5"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true" className="fill-current">
        <path d={playing ? "M2 1h2v8H2zM6 1h2v8H6z" : "M2 1.2v7.6L8.6 5z"} />
      </svg>
    </Button>
  );
}

/** One-of-n toggle; clicking the active option keeps it selected. */
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
    <ToggleGroup
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value}>
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
