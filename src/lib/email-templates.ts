import { escapeHtml } from "@/lib/security";

// Warm-dark palette mirrored from globals.css (.dark). Email clients can't
// read CSS vars, so these hexes are hardcoded inline.
const BG = "#0f0d0a";
const CARD = "#17150f";
const BORDER = "#2a2620";
const TEXT = "#f5f0e8";
const MUTED = "#a09882";
const ACCENT = "#f59e0b";
const ACCENT_SUBTLE = "rgba(245, 158, 11, 0.1)";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function shell(inner: string): string {
  return `<!doctype html><html><head><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:24px;background:${BG};font-family:${FONT};color:${TEXT};-webkit-font-smoothing:antialiased;">
  <div style="max-width:520px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
    <div style="height:3px;background:${ACCENT};"></div>
    ${inner}
  </div>
  <p style="max-width:520px;margin:18px auto 0;color:${MUTED};font-size:12px;text-align:center;letter-spacing:0.3px;">bhimraj.com.np</p>
</body></html>`;
}

export function welcomeEmail(): { subject: string; html: string } {
  const inner = `
    <div style="padding:32px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:${TEXT};">You're in 🎉</h1>
      <p style="margin:0 0 16px;line-height:1.65;color:${MUTED};font-size:15px;">
        Thanks for subscribing. I'll send occasional notes on software engineering,
        open source, AI research, and what I'm building — signal over noise.
      </p>
      <p style="margin:0;line-height:1.65;color:${TEXT};font-size:15px;">— Bhimraj</p>
    </div>`;
  return { subject: "You're subscribed 🎉", html: shell(inner) };
}

export type FeedbackPayload = {
  message: string;
  reason?: string;
  name?: string;
  email?: string;
  path?: string;
  referrer?: string;
  ip: string;
  userAgent: string;
};

export function feedbackEmail(data: FeedbackPayload): {
  subject: string;
  html: string;
} {
  const who = data.name ? escapeHtml(data.name) : "Anonymous";
  const row = (label: string, value?: string) =>
    value
      ? `<tr>
          <td style="padding:7px 0;color:${MUTED};font-size:12px;width:92px;vertical-align:top;">${label}</td>
          <td style="padding:7px 0;color:${TEXT};font-size:13px;word-break:break-word;">${escapeHtml(value)}</td>
        </tr>`
      : "";

  const inner = `
    <div style="padding:28px;">
      <span style="display:inline-block;margin-bottom:10px;padding:3px 10px;border-radius:999px;background:${ACCENT_SUBTLE};color:${ACCENT};font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;">New feedback</span>
      <h1 style="margin:0 0 18px;font-size:18px;font-weight:700;color:${TEXT};">${who}</h1>
      <div style="background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:16px;margin-bottom:18px;line-height:1.65;color:${TEXT};font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Looking for", data.reason)}
        ${row("Email", data.email)}
        ${row("Page", data.path)}
        ${row("Referrer", data.referrer)}
        ${row("IP", data.ip)}
        ${row("Device", data.userAgent)}
      </table>
    </div>`;
  return {
    subject: `Feedback from ${data.name || "a visitor"}`,
    html: shell(inner),
  };
}
