import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-site-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-site-text text-site-bg shadow hover:bg-site-text/80",
        secondary:
          "border-transparent bg-site-bg-secondary text-site-text hover:bg-site-bg-tertiary",
        destructive:
          "border-transparent bg-red-500 text-gray-50 shadow hover:bg-red-500/80",
        outline: "text-site-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
