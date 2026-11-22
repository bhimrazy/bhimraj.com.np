import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send } },
  resendConfig: {
    fromEmail: "Test <t@example.com>",
    notifyEmail: "me@example.com",
  },
}));

const { POST } = await import("@/app/api/feedback/route");

let ipCounter = 0;
function post(body: Record<string, unknown>) {
  return POST(
    new Request("https://bhimraj.com.np/api/feedback", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": `203.0.113.${++ipCounter}`,
      },
      body: JSON.stringify({ message: "Hello there", ...body }),
    }),
  );
}

const siteverify = (body: unknown) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  send.mockResolvedValue({ data: { id: "e" }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("POST /api/feedback", () => {
  it("sends without a token when Turnstile is off", async () => {
    expect((await post({})).status).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);
  });

  describe("with TURNSTILE_SECRET_KEY set", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "secret"));

    it("requires a token", async () => {
      expect((await post({})).status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    });

    it("sends with a token verified for our hostname", async () => {
      siteverify({ success: true, hostname: "bhimraj.com.np" });
      expect((await post({ turnstileToken: "tok" })).status).toBe(201);
      expect(send).toHaveBeenCalledTimes(1);
    });

    it("rejects a bad token", async () => {
      siteverify({ success: false, "error-codes": ["invalid-input-response"] });
      expect((await post({ turnstileToken: "bad" })).status).toBe(403);
      expect(send).not.toHaveBeenCalled();
    });

    it("fails closed when siteverify is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
      expect((await post({ turnstileToken: "tok" })).status).toBe(503);
      expect(send).not.toHaveBeenCalled();
    });
  });
});
