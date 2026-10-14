import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { CodeWalkthrough, Step } from "./code-walkthrough";
import { CopyButton } from "./copy-button";
import { RequestVsEvent } from "./events/request-vs-event";
import { Figure } from "./figure";
import { UNetExplorer } from "./unet/unet-explorer";
import { Shape, UNetTrace } from "./unet/unet-trace";

/** Code blocks get a copy button. */
function Pre({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre className={cn("group relative", className)} {...props}>
      {children}
      <CopyButton />
    </pre>
  );
}

/** Components available by name inside blog `.mdx` posts. */
export const mdxComponents = {
  pre: Pre,
  Figure,
  CodeWalkthrough,
  Step,
  UNetExplorer,
  UNetTrace,
  Shape,
  RequestVsEvent,
};
