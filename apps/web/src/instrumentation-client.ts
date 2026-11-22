import { setPosthog } from "@/lib/posthog-client";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

async function loadPosthog(key: string) {
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // `defaults` wires up SPA-aware pageviews, autocapture and pageleave, so
    // App Router route changes are tracked without a manual capture.
    defaults: "2026-01-30",
    // Set explicitly: the project settings leave both off, and these options
    // take precedence over them.
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    // Don't create persistent person records for anonymous visitors — this
    // site never calls identify(), so "identified_only" means no profiles
    // are ever stored. Events still flow; you get aggregate counts/funnels,
    // just no per-visitor tracking. Cheaper and more privacy-respecting.
    person_profiles: "identified_only",
    // Session replay is intentionally off — the feedback widget collects
    // name/email/message and we don't want that on tape.
    disable_session_recording: true,
    // The site has no surveys.
    disable_surveys: true,
  });
  setPosthog(posthog);
}

// Same setup as @next/third-parties' <GoogleAnalytics>. Route changes are
// covered by gtag's enhanced measurement (history events).
function loadGoogleAnalytics(id: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag.js needs `arguments` objects in the dataLayer, not arrays.
  function gtag(..._args: unknown[]) {
    // biome-ignore lint/complexity/noArguments: gtag.js requires Arguments
    w.dataLayer?.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", id);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

function start() {
  if (posthogKey) void loadPosthog(posthogKey).catch(() => {});
  if (gaId) loadGoogleAnalytics(gaId);
}

// Analytics must not compete with hydration or LCP: wait for load, then idle.
function afterIdle() {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 4000 });
  } else {
    setTimeout(start, 2000);
  }
}

if (posthogKey || gaId) {
  if (document.readyState === "complete") afterIdle();
  else window.addEventListener("load", afterIdle, { once: true });
}
