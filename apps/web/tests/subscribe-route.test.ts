import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const create = vi.fn();
const update = vi.fn();

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send }, contacts: { create, update } },
  resendConfig: { audienceId: "aud_test", fromEmail: "Test <t@example.com>" },
}));

const { POST } = await import("@/app/api/subscribe/route");
const { confirmSubscription, unsubscribe } = await import("@/lib/newsletter");
const { signNewsletterToken } = await import("@/lib/newsletter-token");

let ipCounter = 0;
function post(body: unknown, ip = `203.0.113.${++ipCounter}`) {
  return POST(
    new Request("https://bhimraj.com.np/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": ip },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  vi.stubEnv("NEWSLETTER_SECRET", "route-secret");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  send.mockResolvedValue({ data: { id: "e" }, error: null });
  create.mockResolvedValue({ data: { id: "c" }, error: null });
  update.mockResolvedValue({ data: { id: "c" }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("POST /api/subscribe", () => {
  it("mails only a confirmation link and creates no contact", async () => {
    const res = await post({ email: "New@Example.com" });
    expect(await res.json()).toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalledTimes(1);
    const mail = send.mock.calls[0]?.[0];
    expect(mail.to).toBe("new@example.com");
    expect(mail.subject).toMatch(/confirm/i);
  });

  it("answers the same when the address is capped or the mail fails", async () => {
    const email = "capped@example.com";
    const answers = [];
    for (let i = 0; i < 3; i++)
      answers.push(await (await post({ email })).json());
    send.mockRejectedValueOnce(new Error("down"));
    answers.push(await (await post({ email: "fails@example.com" })).json());
    expect(answers).toEqual(Array(4).fill({ ok: true }));
    // 2 per address per hour, plus the failed one.
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("drops honeypot submissions with the same answer", async () => {
    const res = await post({ email: "bot@example.com", website: "x" });
    expect(await res.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("keeps validation, content-type and per-IP limits", async () => {
    expect((await post({ email: "nope" })).status).toBe(400);
    const plain = await POST(
      new Request("https://bhimraj.com.np/api/subscribe", {
        method: "POST",
        body: "email=a@b.co",
      }),
    );
    expect(plain.status).toBe(415);
    const statuses = [];
    for (let i = 0; i < 6; i++) {
      statuses.push(
        (await post({ email: `u${i}@example.com` }, "198.51.100.9")).status,
      );
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
  });

  it("is unavailable without a signing secret", async () => {
    vi.stubEnv("NEWSLETTER_SECRET", "");
    expect((await post({ email: "a@example.com" })).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  describe("with Turnstile configured", () => {
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
      vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    });

    const siteverify = (body: unknown) =>
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));

    it("requires a token", async () => {
      expect((await post({ email: "a@example.com" })).status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    });

    it("accepts a token verified for our hostname", async () => {
      siteverify({ success: true, hostname: "bhimraj.com.np" });
      const res = await post({ email: "a@example.com", turnstileToken: "tok" });
      expect(await res.json()).toEqual({ ok: true });
      expect(send).toHaveBeenCalledTimes(1);
      const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
      expect(JSON.parse(String(init?.body))).toMatchObject({
        secret: "secret",
        response: "tok",
      });
    });

    it("rejects a token from another hostname or a failed check", async () => {
      siteverify({ success: true, hostname: "evil.example" });
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(403);
      siteverify({ success: false });
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(403);
      expect(send).not.toHaveBeenCalled();
    });

    it("fails closed when siteverify is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(503);
    });
  });
});

describe("clientIpFrom", () => {
  it("prefers cf-connecting-ip, then the first x-forwarded-for hop", async () => {
    const { clientIpFrom } = await import("@/lib/security");
    const h = (init: Record<string, string>) => clientIpFrom(new Headers(init));
    expect(
      h({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }),
    ).toBe("1.1.1.1");
    expect(h({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" })).toBe("2.2.2.2");
    expect(h({})).toBe("unknown");
  });
});

describe("confirm and unsubscribe", () => {
  const confirm = (email: string) =>
    signNewsletterToken("route-secret", "confirm", email, { ttlSeconds: 60 });

  it("creates the contact and sends the welcome mail", async () => {
    expect(await confirmSubscription(confirm("a@example.com"))).toBe("done");
    expect(create).toHaveBeenCalledWith({
      email: "a@example.com",
      audienceId: "aud_test",
      unsubscribed: false,
    });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("re-subscribes an existing contact", async () => {
    create.mockResolvedValueOnce({ data: null, error: { name: "exists" } });
    expect(await confirmSubscription(confirm("b@example.com"))).toBe("done");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ email: "b@example.com", unsubscribed: false }),
    );
  });

  it("rejects bad tokens without touching Resend", async () => {
    expect(await confirmSubscription("garbage")).toBe("invalid");
    expect(await confirmSubscription(null)).toBe("invalid");
    expect(create).not.toHaveBeenCalled();
  });

  it("marks the contact unsubscribed", async () => {
    const token = signNewsletterToken(
      "route-secret",
      "unsubscribe",
      "c@example.com",
    );
    expect(await unsubscribe(token)).toBe("done");
    expect(update).toHaveBeenCalledWith({
      email: "c@example.com",
      audienceId: "aud_test",
      unsubscribed: true,
    });
  });
});
