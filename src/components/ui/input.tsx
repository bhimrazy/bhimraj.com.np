import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-site-border/50 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-site-text file:text-sm placeholder:text-site-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-site-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-white/6",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
