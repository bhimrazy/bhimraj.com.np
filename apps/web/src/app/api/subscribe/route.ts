import { createHash } from "node:crypto";
import { z } from "zod";
import { WelcomeEmail } from "@/emails/welcome-email";
import { rateLimit } from "@/lib/rate-limit";
import { resend, resendConfig } from "@/lib/resend";
import { clientIpFrom } from "@/lib/security";
import { turnstileGate } from "@/lib/turnstile";

const SubscribeSchema = z.object({
  email: z.email().max(254).toLowerCase(),
  // Honeypot: real users never see or fill this.
  website: z.string().optional(),
  turnstileToken: z.string().max(2048).optional(),
});

const SUBSCRIBED = "🎉 You're in! I just sent a little hello to your inbox.";
const subscribed = () =>
  Response.json({ message: SUBSCRIBED }, { status: 201 });

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

  if (parsed.data.website) return subscribed();

  const blocked = await turnstileGate(parsed.data.turnstileToken, ip);
  if (blocked) return blocked;

  if (!resend || !resendConfig.audienceId) {
    console.error("[subscribe] Resend not configured");
    return Response.json(
      { error: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    );
  }

  const { email } = parsed.data;
  // Caps welcome mails to one address, whichever IPs ask; answered as success.
  const digest = createHash("sha256").update(email).digest("hex");
  if (!rateLimit(`subscribe:to:${digest}`, 2, 60 * 60_000).allowed) {
    return subscribed();
  }

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId: resendConfig.audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error("[subscribe] contacts.create", error);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }

    // Best effort, but awaited: serverless may stop once the response is sent.
    await resend.emails
      .send({
        from: resendConfig.fromEmail,
        to: email,
        subject: "You're subscribed 🎉",
        react: WelcomeEmail(),
      })
      .catch((err) => console.error("[subscribe] welcome email", err));

    return subscribed();
  } catch (err) {
    console.error("[subscribe] unexpected", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
