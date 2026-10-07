import {
  ChatBubbleIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  LightningBoltIcon,
  TrackNextIcon,
} from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "tip" | "note" | "warning" | "skip" | "founder";

const variants: Record<
  CalloutType,
  { label: string; Icon: typeof InfoCircledIcon; box: string; kicker: string }
> = {
  note: {
    label: "Note",
    Icon: InfoCircledIcon,
    box: "border-site-border bg-site-card",
    kicker: "text-site-text-tertiary",
  },
  tip: {
    label: "Tip",
    Icon: LightningBoltIcon,
    box: "border-site-border bg-site-card",
    kicker: "text-site-accent",
  },
  warning: {
    label: "Watch out",
    Icon: ExclamationTriangleIcon,
    box: "border-site-accent/45 bg-site-card",
    kicker: "text-site-accent",
  },
  skip: {
    label: "Already know this?",
    Icon: TrackNextIcon,
    box: "border-site-border border-dashed bg-transparent text-[0.95rem]",
    kicker: "text-site-text-tertiary",
  },
  founder: {
    label: "In plain English",
    Icon: ChatBubbleIcon,
    box: "border-site-accent/15 bg-site-accent-subtle",
    kicker: "text-site-accent",
  },
};

/**
 * An aside in the flow of a post. `founder` is the plain-English summary for
 * non-engineers, `skip` tells readers who already know the topic where to go.
 *
 * ```mdx
 * <Callout type="tip" title="Optional title">Markdown body.</Callout>
 * ```
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { label, Icon, box, kicker } = variants[type] ?? variants.note;

  return (
    <div
      role="note"
      aria-label={title ?? label}
      className={cn("my-8 rounded-xl border px-5 py-4 sm:px-6 sm:py-5", box)}
    >
      <p
        className={cn(
          "not-prose flex items-center gap-2 font-medium font-mono text-[11px] uppercase tracking-[0.14em]",
          kicker,
        )}
      >
        <Icon aria-hidden className="size-3.5 shrink-0" />
        {label}
      </p>
      {title ? (
        <p className="not-prose mt-2 text-pretty font-display font-semibold text-base text-site-text leading-snug">
          {title}
        </p>
      ) : null}
      <div className="mt-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_li]:my-1">
        {children}
      </div>
    </div>
  );
}
