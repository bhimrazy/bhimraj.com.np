import { createHash } from "node:crypto";
import { siteConfig } from "@/config/site";
import { ConfirmEmail } from "@/emails/confirm-email";
import { WelcomeEmail } from "@/emails/welcome-email";
import {
  CONFIRM_TTL_SECONDS,
  signNewsletterToken,
  verifyNewsletterToken,
} from "@/lib/newsletter-token";
import { rateLimit } from "@/lib/rate-limit";
import { resend, resendConfig } from "@/lib/resend";

// Addresses are personal data: never log them.

const secret = () => process.env.NEWSLETTER_SECRET ?? "";

export const newsletterEnabled = () =>
  Boolean(resend && resendConfig.audienceId && secret());

const MAILS_PER_ADDRESS_PER_HOUR = 2;

// Never from request headers, which a sender could spoof.
const origin = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : siteConfig.url;

const unsubscribeUrl = (email: string) =>
  `${origin()}/newsletter/unsubscribe?token=${signNewsletterToken(secret(), "unsubscribe", email)}`;

export type RequestOutcome =
  | "sent"
  | "rate_limited"
  | "not_configured"
  | "failed";

export async function requestSubscription(
  email: string,
): Promise<RequestOutcome> {
  if (!resend || !newsletterEnabled()) return "not_configured";
  const digest = createHash("sha256").update(email).digest("hex");
  if (
    !rateLimit(
      `newsletter:to:${digest}`,
      MAILS_PER_ADDRESS_PER_HOUR,
      60 * 60_000,
    ).allowed
  ) {
    return "rate_limited";
  }
  const token = signNewsletterToken(secret(), "confirm", email, {
    ttlSeconds: CONFIRM_TTL_SECONDS,
  });
  try {
    const { error } = await resend.emails.send({
      from: resendConfig.fromEmail,
      to: email,
      subject: "Confirm your subscription",
      react: ConfirmEmail({
        confirmUrl: `${origin()}/newsletter/confirm?token=${token}`,
        unsubscribeUrl: unsubscribeUrl(email),
      }),
    });
    if (error) {
      console.error("[newsletter] confirm email", error.name);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[newsletter] confirm email", err);
    return "failed";
  }
}

export type TokenOutcome = "done" | "invalid" | "expired" | "unavailable";

const check = (purpose: "confirm" | "unsubscribe", token: unknown) =>
  typeof token === "string"
    ? verifyNewsletterToken(secret(), purpose, token)
    : ({ ok: false, reason: "invalid" } as const);

export async function confirmSubscription(
  token: unknown,
): Promise<TokenOutcome> {
  const { audienceId } = resendConfig;
  if (!resend || !audienceId || !newsletterEnabled()) return "unavailable";
  const verified = check("confirm", token);
  if (!verified.ok) return verified.reason;
  const { email } = verified;
  try {
    const created = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (created.error) {
      // Most likely it exists already.
      const updated = await resend.contacts.update({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (updated.error) {
        console.error("[newsletter] contact update", updated.error.name);
        return "unavailable";
      }
    }
  } catch (err) {
    console.error("[newsletter] confirm", err);
    return "unavailable";
  }

  // Best effort, but awaited: serverless may stop once the response is sent.
  await resend.emails
    .send({
      from: resendConfig.fromEmail,
      to: email,
      subject: "You're subscribed 🎉",
      react: WelcomeEmail({ unsubscribeUrl: unsubscribeUrl(email) }),
    })
    .catch((err) => console.error("[newsletter] welcome email", err));
  return "done";
}

export async function unsubscribe(token: unknown): Promise<TokenOutcome> {
  const { audienceId } = resendConfig;
  if (!resend || !audienceId || !newsletterEnabled()) return "unavailable";
  const verified = check("unsubscribe", token);
  if (!verified.ok) return verified.reason;
  try {
    const { error } = await resend.contacts.update({
      email: verified.email,
      audienceId,
      unsubscribed: true,
    });
    if (error && error.statusCode !== 404) {
      console.error("[newsletter] unsubscribe", error.name);
      return "unavailable";
    }
    return "done";
  } catch (err) {
    console.error("[newsletter] unsubscribe", err);
    return "unavailable";
  }
}
