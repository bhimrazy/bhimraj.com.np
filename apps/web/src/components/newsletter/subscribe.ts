import { capture } from "@/lib/analytics";

const FAILED = "Something went wrong. Please try again.";

export async function submitSubscription(body: {
  email: string;
  website: string;
  turnstileToken: string | null;
}): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        turnstileToken: body.turnstileToken ?? undefined,
      }),
    });
    const data = await res.json().catch(() => null);
    capture("newsletter_submitted", { result: res.ok ? "success" : "error" });
    return res.ok
      ? { ok: true, message: data?.message ?? "🎉 You're in!" }
      : { ok: false, message: data?.error ?? FAILED };
  } catch {
    capture("newsletter_submitted", { result: "error" });
    return { ok: false, message: FAILED };
  }
}
