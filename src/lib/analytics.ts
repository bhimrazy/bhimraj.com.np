import posthog from "posthog-js";

/**
 * Named events worth capturing explicitly — everything else (pageviews,
 * outbound clicks, web vitals) is left to PostHog autocapture. Keep this map
 * small: only events that autocapture can't reconstruct belong here.
 */
type EventProps = {
  feedback_auto_opened: undefined;
  feedback_opened: undefined;
  feedback_dismissed: undefined;
  feedback_submitted: { reason: string | null; has_email: boolean };
  newsletter_submitted: { result: "success" | "error" };
  code_copied: { slug: string };
  blog_link_copied: { slug: string };
};

/** Thin, typed wrapper over posthog.capture — no-ops if PostHog isn't loaded. */
export function capture<K extends keyof EventProps>(
  ...args: EventProps[K] extends undefined
    ? [event: K]
    : [event: K, props: EventProps[K]]
): void {
  if (!posthog.__loaded) return;
  const [event, props] = args;
  posthog.capture(event, props);
}
