import { describe, expect, it } from "vitest";
import {
  CONFIRM_TTL_SECONDS,
  signNewsletterToken,
  verifyNewsletterToken,
} from "@/lib/newsletter-token";

const SECRET = "test-secret";
const NOW = Date.UTC(2026, 10, 1);

const confirmToken = (email = "Reader@Example.com") =>
  signNewsletterToken(SECRET, "confirm", email, {
    now: NOW,
    ttlSeconds: CONFIRM_TTL_SECONDS,
  });

describe("newsletter tokens", () => {
  it("round-trips a confirm token and normalizes the address", () => {
    expect(
      verifyNewsletterToken(SECRET, "confirm", confirmToken(), NOW),
    ).toEqual({ ok: true, email: "reader@example.com" });
  });

  it("expires confirm tokens after 48 hours", () => {
    const token = confirmToken();
    const justBefore = NOW + CONFIRM_TTL_SECONDS * 1000 - 1000;
    const after = NOW + CONFIRM_TTL_SECONDS * 1000 + 1000;
    expect(verifyNewsletterToken(SECRET, "confirm", token, justBefore).ok).toBe(
      true,
    );
    expect(verifyNewsletterToken(SECRET, "confirm", token, after)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("never expires unsubscribe tokens", () => {
    const token = signNewsletterToken(SECRET, "unsubscribe", "a@b.co", {
      now: NOW,
    });
    const years = NOW + 10 * 365 * 24 * 3600 * 1000;
    expect(verifyNewsletterToken(SECRET, "unsubscribe", token, years)).toEqual({
      ok: true,
      email: "a@b.co",
    });
  });

  it("rejects a tampered payload or signature", () => {
    const [body, mac] = confirmToken().split(".");
    const forged = Buffer.from(
      JSON.stringify({ p: "confirm", e: "victim@example.com", x: 9e9 }),
    ).toString("base64url");
    const flipped = `${mac?.[0] === "A" ? "B" : "A"}${mac?.slice(1)}`;
    for (const token of [`${forged}.${mac}`, `${body}.${flipped}`, `${body}`]) {
      expect(verifyNewsletterToken(SECRET, "confirm", token, NOW)).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });

  it("rejects another secret, the wrong purpose and an unexpiring confirm", () => {
    expect(
      verifyNewsletterToken("other", "confirm", confirmToken(), NOW).ok,
    ).toBe(false);
    expect(
      verifyNewsletterToken(SECRET, "unsubscribe", confirmToken(), NOW).ok,
    ).toBe(false);
    const noExpiry = signNewsletterToken(SECRET, "confirm", "a@b.co");
    expect(verifyNewsletterToken(SECRET, "confirm", noExpiry, NOW).ok).toBe(
      false,
    );
  });

  it("refuses to sign or verify without a secret", () => {
    expect(() => signNewsletterToken("", "confirm", "a@b.co")).toThrow();
    expect(verifyNewsletterToken("", "confirm", confirmToken(), NOW).ok).toBe(
      false,
    );
  });
});
