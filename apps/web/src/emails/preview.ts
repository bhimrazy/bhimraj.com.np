import { mkdir, writeFile } from "node:fs/promises";
import { render } from "@react-email/components";
import { FeedbackEmail } from "@/emails/feedback-email";
import { WelcomeEmail } from "@/emails/welcome-email";

const OUT_DIR = ".email-preview";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const welcome = await render(WelcomeEmail());
  const feedback = await render(
    FeedbackEmail({
      message:
        "Loved the OSS journey page — found you through a LitServe PR.\n\nOne idea: a dark/light toggle on the timeline.",
      reason: "Your work / OSS",
      name: "Jane Doe",
      email: "jane@example.com",
      path: "/oss",
      referrer: "https://github.com/Lightning-AI/LitServe",
      ip: "203.0.113.42",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1",
    }),
  );

  await writeFile(`${OUT_DIR}/welcome.html`, welcome);
  await writeFile(`${OUT_DIR}/feedback.html`, feedback);

  console.log(
    `✓ Rendered ${OUT_DIR}/welcome.html and ${OUT_DIR}/feedback.html`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
