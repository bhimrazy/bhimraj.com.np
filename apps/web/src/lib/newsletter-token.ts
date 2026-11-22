import { createHmac, timingSafeEqual } from "node:crypto";

// `<base64url payload>.<base64url HMAC-SHA256>`: double opt-in without a database.

export const CONFIRM_TTL_SECONDS = 48 * 60 * 60;

type Purpose = "confirm" | "unsubscribe";

export type VerifiedToken =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid" | "expired" };

const MAX_TOKEN_LENGTH = 1024;

const mac = (secret: string, body: string) =>
  createHmac("sha256", secret).update(`newsletter:v1:${body}`).digest();

export function signNewsletterToken(
  secret: string,
  purpose: Purpose,
  email: string,
  { now = Date.now(), ttlSeconds }: { now?: number; ttlSeconds?: number } = {},
): string {
  if (!secret) throw new Error("Newsletter tokens need a signing secret");
  const payload = {
    p: purpose,
    e: email.trim().toLowerCase(),
    ...(ttlSeconds ? { x: Math.floor(now / 1000) + ttlSeconds } : {}),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${mac(secret, body).toString("base64url")}`;
}

export function verifyNewsletterToken(
  secret: string,
  purpose: Purpose,
  token: string,
  now = Date.now(),
): VerifiedToken {
  const invalid = { ok: false, reason: "invalid" } as const;
  if (!secret || token.length > MAX_TOKEN_LENGTH) return invalid;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return invalid;

  const given = Buffer.from(signature, "base64url");
  const expected = mac(secret, body);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return invalid;
  }

  let payload: { p?: unknown; e?: unknown; x?: unknown };
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return invalid;
  }
  if (payload.p !== purpose || typeof payload.e !== "string" || !payload.e) {
    return invalid;
  }
  // We only mint confirm tokens with an expiry.
  if (purpose === "confirm" && typeof payload.x !== "number") return invalid;
  if (typeof payload.x === "number" && payload.x * 1000 < now) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, email: payload.e };
}
