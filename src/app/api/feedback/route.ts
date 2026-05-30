import { z } from "zod";
import { feedbackEmail } from "@/lib/email-templates";
import { rateLimit } from "@/lib/rate-limit";
import { resend, resendConfig } from "@/lib/resend";
import { getClientIp } from "@/lib/security";

const FeedbackSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  reason: z.string().trim().max(200).optional(),
  name: z.string().trim().max(100).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(254)
    .optional()
    .or(z.literal("")),
  path: z.string().max(512).optional(),
  referrer: z.string().max(1024).optional(),
  // Honeypot.
  website: z.string().optional(),
});

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Invalid request." }, { status: 415 });
  }

  const ip = await getClientIp();
  if (!rateLimit(`feedback:${ip}`, 4, 60_000).allowed) {
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

  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please share a short message." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot tripped — pretend success, drop silently.
  if (data.website) {
    return Response.json({ message: "Thanks for the note!" }, { status: 200 });
  }

  if (!resend || !resendConfig.notifyEmail) {
    console.error("[feedback] Resend not configured");
    return Response.json(
      { error: "Feedback is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const { subject, html } = feedbackEmail({
      message: data.message,
      reason: data.reason,
      name: data.name,
      email: data.email || undefined,
      path: data.path,
      referrer: data.referrer,
      ip,
      userAgent: req.headers.get("user-agent") ?? "unknown",
    });

    const { error } = await resend.emails.send({
      from: resendConfig.fromEmail,
      to: resendConfig.notifyEmail,
      subject,
      html,
      ...(data.email ? { replyTo: data.email } : {}),
    });

    if (error) {
      console.error("[feedback] emails.send", error);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }

    return Response.json(
      { message: "Thanks — I read every note 🙏" },
      { status: 201 },
    );
  } catch (err) {
    console.error("[feedback] unexpected", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
