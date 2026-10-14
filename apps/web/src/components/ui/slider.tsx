"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* Single-thumb slider in the figure style: hairline track, amber thumb. */

function Slider({
  className,
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-8 touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-0.5 grow rounded-full bg-site-border-hover">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-site-accent/60" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        aria-valuetext={ariaValueText}
        className="block size-3.5 cursor-grab rounded-full border-2 border-site-card bg-site-accent transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 active:cursor-grabbing motion-reduce:transition-none"
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
