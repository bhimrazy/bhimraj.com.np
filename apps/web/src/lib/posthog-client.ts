import type { PostHog } from "posthog-js";

let client: PostHog | undefined;
// Events fired before PostHog loads (it starts after idle), flushed on init.
let pending: [event: string, props?: object][] = [];
const MAX_PENDING = 50;

export function capturePosthog(event: string, props?: object): void {
  if (client) client.capture(event, props);
  else if (process.env.NEXT_PUBLIC_POSTHOG_KEY && pending.length < MAX_PENDING)
    pending.push([event, props]);
}

export function setPosthog(instance: PostHog): void {
  client = instance;
  for (const [event, props] of pending) instance.capture(event, props);
  pending = [];
}
