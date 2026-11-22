import { z } from "zod";
import { newsletterEnabled, requestSubscription } from "@/lib/newsletter";
import { rateLimit } from "@/lib/rate-limit";
import { clientIpFrom } from "@/lib/security";
import { turnstileConfig, verifyTurnstile } from "@/lib/turnstile";

const SubscribeSchema = z.object({
  email: z.email().max(254).toLowerCase(),
  // Honeypot: real users never see or fill this.
  website: z.string().optional(),
  turnstileToken: z.string().max(2048).optional(),
});

const TURNSTILE_ERRORS = {
  missing: [400, "Please finish the security check, then try again."],
  rejected: [403, "The security check failed. Reload the page and try again."],
  unavailable: [503, "Couldn't run the security check. Please try again."],
} as const;

// Same answer for new, pending, subscribed and capped addresses: no enumeration.
const OK = () => Response.json({ ok: true });

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Invalid request." }, { status: 415 });
  }

  const ip = clientIpFrom(req.headers);
  if (!rateLimit(`subscribe:${ip}`, 5, 10 * 60_000).allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (parsed.data.website) return OK();

  if (!newsletterEnabled()) {
    console.error("[subscribe] newsletter not configured");
    return Response.json(
      { error: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    );
  }

  const turnstile = turnstileConfig();
  if (turnstile) {
    const human = await verifyTurnstile(
      parsed.data.turnstileToken,
      ip,
      turnstile,
    );
    if (!human.ok) {
      const [status, error] = TURNSTILE_ERRORS[human.reason];
      return Response.json({ error }, { status });
    }
  }

  await requestSubscription(parsed.data.email);
  return OK();
}
