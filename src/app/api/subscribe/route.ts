import { z } from "zod";
import { WelcomeEmail } from "@/emails/welcome-email";
import { rateLimit } from "@/lib/rate-limit";
import { resend, resendConfig } from "@/lib/resend";
import { getClientIp } from "@/lib/security";

const SubscribeSchema = z.object({
  email: z.email().max(254).toLowerCase(),
  // Honeypot: real users never see or fill this.
  website: z.string().optional(),
});

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Invalid request." }, { status: 415 });
  }

  const ip = await getClientIp();
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000).allowed) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
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

  // Honeypot tripped — pretend success, drop silently.
  if (parsed.data.website) {
    return Response.json({ message: "🎉 You're subscribed!" }, { status: 200 });
  }

  if (!resend || !resendConfig.audienceId) {
    console.error("[subscribe] Resend not configured");
    return Response.json(
      { error: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const { error } = await resend.contacts.create({
      email: parsed.data.email,
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

    // Best-effort welcome email; don't fail the subscribe if it can't send
    // (e.g. sending domain not yet verified in Resend).
    resend.emails
      .send({
        from: resendConfig.fromEmail,
        to: parsed.data.email,
        subject: "You're subscribed 🎉",
        react: WelcomeEmail(),
      })
      .catch((err) => console.error("[subscribe] welcome email", err));

    return Response.json(
      { message: "🎉 You're in! I just sent a little hello to your inbox." },
      { status: 201 },
    );
  } catch (err) {
    console.error("[subscribe] unexpected", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
