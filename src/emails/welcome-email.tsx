import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { emailTailwindConfig } from "@/emails/theme";

export function WelcomeEmail() {
  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>
          You&apos;re subscribed — occasional notes, signal over noise.
        </Preview>
        <Body className="bg-warm-bg p-6 font-sans text-warm-text">
          <Container className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border border-warm-border bg-warm-card">
            <Section className="h-[3px] bg-warm-accent" />
            <Section className="p-[30px]">
              <Heading className="m-0 mb-3 font-bold text-[20px] text-warm-text">
                You&apos;re in 🎉
              </Heading>
              <Text className="m-0 mb-4 text-[15px] text-warm-muted leading-[1.65]">
                Thanks for subscribing. I&apos;ll send occasional notes on
                software engineering, open source, AI research, and what
                I&apos;m building — signal over noise.
              </Text>
              <Text className="m-0 text-[15px] text-warm-text">— Bhimraj</Text>
            </Section>
          </Container>
          <Text className="mx-auto mt-[18px] max-w-[520px] text-center text-[12px] text-warm-muted tracking-[0.3px]">
            bhimraj.com.np
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
