import { siteConfig } from "@/config/site";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5_000;

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "rejected" | "unavailable" };

type TurnstileConfig = { secretKey: string; allowedHostnames: string[] };

// Enforced whenever the secret is set; unset (local dev) skips the check.
export function turnstileConfig(
  env: NodeJS.ProcessEnv = process.env,
): TurnstileConfig | null {
  const secretKey = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  // Refuses tokens minted on other hosts using the same widget.
  const pinned = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  return {
    secretKey,
    allowedHostnames: pinned.length
      ? pinned
      : [new URL(siteConfig.url).hostname],
  };
}

// Fails closed.
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string,
  { secretKey, allowedHostnames }: TurnstileConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: "missing" };
  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        ...(remoteIp !== "unknown" && { remoteip: remoteIp }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const body = (await res.json()) as { success?: boolean; hostname?: string };
    if (body.success !== true) return { ok: false, reason: "rejected" };
    if (!body.hostname || !allowedHostnames.includes(body.hostname)) {
      return { ok: false, reason: "rejected" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
