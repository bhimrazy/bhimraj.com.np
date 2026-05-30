import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-16 w-full rounded-md border border-site-border/50 bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-site-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-site-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-white/6",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
