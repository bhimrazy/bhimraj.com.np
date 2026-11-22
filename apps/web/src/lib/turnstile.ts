import { siteConfig } from "@/config/site";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5_000;

type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "rejected" | "unavailable" };

type TurnstileConfig = { secretKey: string; allowedHostnames: string[] };

const ERRORS = {
  missing: [400, "Please finish the security check, then try again."],
  rejected: [403, "The security check failed. Reload the page and try again."],
  unavailable: [503, "Couldn't run the security check. Please try again."],
} as const;

// Enforced whenever the secret is set; unset (local dev) skips the check.
function turnstileConfig(
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
async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string,
  { secretKey, allowedHostnames }: TurnstileConfig,
): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: "missing" };
  try {
    const res = await fetch(SITEVERIFY_URL, {
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

/** The error response a route should return, or null when the request may go on. */
export async function turnstileGate(
  token: string | undefined,
  remoteIp: string,
): Promise<Response | null> {
  const config = turnstileConfig();
  if (!config) return null;
  const result = await verifyTurnstile(token, remoteIp, config);
  if (result.ok) return null;
  const [status, error] = ERRORS[result.reason];
  return Response.json({ error }, { status });
}
