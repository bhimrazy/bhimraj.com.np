// Cloudflare fronts Vercel; requests straight to Vercel lack cf-connecting-ip.
export function clientIpFrom(h: Headers): string {
  const cf = h.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return h.get("x-real-ip") ?? "unknown";
}
