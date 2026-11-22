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
  resource_opened: { slug: string; kind: string };
  /** Course pages; `course` is the resource slug, `video` the YouTube ID. */
  course_started: { course: string };
  lecture_played: {
    course: string;
    video: string;
    index: number;
    /** False when the lecture opened on YouTube instead. */
    embedded: boolean;
  };
  lecture_completed: { course: string; video: string };
  progress_exported: { lectures: number };
  progress_imported: { lectures: number };
  progress_reset: { course: string };
  /** Debounced; `query` is trimmed, lowercased and capped at 60 chars. */
  resources_filtered: {
    kind: string | null;
    topic: string | null;
    query: string | null;
    results: number;
  };
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
