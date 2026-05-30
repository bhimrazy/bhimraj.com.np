import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { emailTailwindConfig } from "@/emails/theme";

const TOPICS = [
  "Software engineering & what I'm building",
  "Open-source work across the PyTorch Lightning ecosystem",
  "AI & ML research worth your time",
];

export function WelcomeEmail() {
  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>
          You&apos;re in — occasional notes on engineering, OSS & AI. No spam.
        </Preview>
        <Body className="bg-warm-page p-6 font-sans text-warm-text">
          <Container className="mx-auto max-w-[540px] rounded-2xl border border-warm-border bg-warm-card">
            <Section className="px-10 pt-10 pb-9">
              <Text className="m-0 mb-3 font-semibold text-[12px] text-warm-accent uppercase tracking-[1.5px]">
                Newsletter
              </Text>
              <Heading className="m-0 mb-4 font-display font-bold text-[26px] text-warm-text">
                You&apos;re in 🎉
              </Heading>
              <Text className="m-0 mb-7 text-[16px] text-warm-muted leading-[1.7]">
                Hey 👋 Thanks for subscribing — really glad to have you here.
                You&apos;ll hear from me every now and then: no fixed schedule,
                no fluff, just things I think are worth sharing.
              </Text>

              <Text className="m-0 mb-3 font-semibold text-[12px] text-warm-text uppercase tracking-[0.8px]">
                What to expect
              </Text>
              <Section className="mb-8">
                {TOPICS.map((topic) => (
                  <Text
                    key={topic}
                    className="m-0 mb-2.5 text-[15px] text-warm-muted leading-[1.6]"
                  >
                    <span className="font-bold text-warm-accent">→</span>
                    &nbsp;&nbsp;{topic}
                  </Text>
                ))}
              </Section>

              <Hr className="my-0 border-warm-border" />

              <Text className="m-0 mt-7 text-[16px] text-warm-text leading-[1.6]">
                Glad you&apos;re along for the ride.
              </Text>
              <Text className="m-0 mt-2 font-semibold text-[16px] text-warm-text">
                — Bhimraj
              </Text>
              <Text className="m-0 mt-1 text-[13px] text-warm-muted">
                Software Engineer ·{" "}
                <Link
                  href="https://bhimraj.com.np"
                  className="font-medium text-warm-accent no-underline"
                >
                  bhimraj.com.np
                </Link>
              </Text>
            </Section>
          </Container>
          <Text className="mx-auto mt-5 max-w-[540px] text-center text-[12px] text-warm-muted leading-[1.6] tracking-[0.3px]">
            You&apos;re receiving this because you subscribed at bhimraj.com.np
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
