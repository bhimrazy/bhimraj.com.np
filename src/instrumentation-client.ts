import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // `defaults` wires up SPA-aware pageviews, autocapture, web vitals and
    // pageleave — so App Router route changes are tracked without a manual
    // capture in a provider.
    defaults: "2025-05-24",
    // Don't create persistent person records for anonymous visitors — this
    // site never calls identify(), so "identified_only" means no profiles
    // are ever stored. Events still flow; you get aggregate counts/funnels,
    // just no per-visitor tracking. Cheaper and more privacy-respecting.
    person_profiles: "identified_only",
    // Session replay is intentionally off — the feedback widget collects
    // name/email/message and we don't want that on tape.
    disable_session_recording: true,
  });
}
