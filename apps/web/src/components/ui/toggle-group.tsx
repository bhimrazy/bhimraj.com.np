"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* Segmented control in the figure style: mono, small, hairline border. */

function ToggleGroup({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "inline-flex h-8 items-center rounded-md border border-site-border p-0.5",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "h-full rounded-sm px-2.5 font-mono text-2xs text-site-text-secondary transition-colors hover:text-site-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-accent data-[state=on]:bg-site-bg-tertiary data-[state=on]:text-site-text",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
