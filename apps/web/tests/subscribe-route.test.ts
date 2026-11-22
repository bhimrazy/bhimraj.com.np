import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const create = vi.fn();

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send }, contacts: { create } },
  resendConfig: { audienceId: "aud_test", fromEmail: "Test <t@example.com>" },
}));

const { POST } = await import("@/app/api/subscribe/route");

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
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  send.mockResolvedValue({ data: { id: "e" }, error: null });
  create.mockResolvedValue({ data: { id: "c" }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("POST /api/subscribe", () => {
  it("adds the contact and sends the welcome mail", async () => {
    const res = await post({ email: "New@Example.com" });
    expect(res.status).toBe(201);
    expect(create).toHaveBeenCalledWith({
      email: "new@example.com",
      audienceId: "aud_test",
      unsubscribed: false,
    });
    expect(send.mock.calls[0]?.[0].to).toBe("new@example.com");
  });

  it("caps mail to one address at 2 an hour with the same answer", async () => {
    const statuses = [];
    for (let i = 0; i < 3; i++) {
      statuses.push((await post({ email: "capped@example.com" })).status);
    }
    expect(statuses).toEqual([201, 201, 201]);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("drops honeypot submissions as success", async () => {
    const res = await post({ email: "bot@example.com", website: "x" });
    expect(res.status).toBe(201);
    expect(create).not.toHaveBeenCalled();
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
    expect(statuses).toEqual([201, 201, 201, 201, 201, 429]);
  });

  it("returns a generic error when Resend refuses the contact", async () => {
    create.mockResolvedValueOnce({ data: null, error: { name: "x" } });
    const res = await post({ email: "a@example.com" });
    expect(res.status).toBe(502);
    expect(send).not.toHaveBeenCalled();
  });

  describe("with TURNSTILE_SECRET_KEY set", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "secret"));

    const siteverify = (body: unknown) =>
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));

    it("requires a token", async () => {
      expect((await post({ email: "a@example.com" })).status).toBe(400);
      expect(create).not.toHaveBeenCalled();
    });

    it("accepts a token verified for our hostname", async () => {
      siteverify({ success: true, hostname: "bhimraj.com.np" });
      const res = await post(
        { email: "a@example.com", turnstileToken: "tok" },
        "192.0.2.7",
      );
      expect(res.status).toBe(201);
      const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
      expect(JSON.parse(String(init?.body))).toEqual({
        secret: "secret",
        response: "tok",
        remoteip: "192.0.2.7",
      });
    });

    it("rejects another hostname or a failed check", async () => {
      siteverify({ success: true, hostname: "evil.example" });
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(403);
      siteverify({ success: false });
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(403);
      expect(create).not.toHaveBeenCalled();
    });

    it("honours TURNSTILE_ALLOWED_HOSTNAMES", async () => {
      vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "preview.example, other.test");
      siteverify({ success: true, hostname: "preview.example" });
      expect(
        (await post({ email: "a@example.com", turnstileToken: "t" })).status,
      ).toBe(201);
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
