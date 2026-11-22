import {
  Body,
  Button,
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

export type ConfirmEmailProps = {
  confirmUrl: string;
  unsubscribeUrl: string;
};

export function ConfirmEmail({
  confirmUrl,
  unsubscribeUrl,
}: ConfirmEmailProps) {
  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>
          One click to confirm your subscription to my newsletter.
        </Preview>
        <Body className="bg-warm-page p-6 font-sans text-warm-text">
          <Container className="mx-auto max-w-[540px] rounded-2xl border border-warm-border bg-warm-card">
            <Section className="px-10 pt-10 pb-9">
              <Text className="m-0 mb-3 font-semibold text-[12px] text-warm-accent uppercase tracking-[1.5px]">
                Newsletter
              </Text>
              <Heading className="m-0 mb-4 font-display font-bold text-[26px] text-warm-text">
                Confirm your subscription
              </Heading>
              <Text className="m-0 mb-7 text-[16px] text-warm-muted leading-[1.7]">
                Someone, hopefully you, asked to get my occasional notes on
                engineering, open source and AI at this address. Press the
                button to confirm. The link works for 48 hours.
              </Text>

              <Button
                href={confirmUrl}
                className="rounded-lg bg-warm-accent px-6 py-3 font-semibold text-[15px] text-white no-underline"
              >
                Confirm subscription
              </Button>

              <Hr className="my-8 border-warm-border" />

              <Text className="m-0 text-[14px] text-warm-muted leading-[1.6]">
                Didn&apos;t ask for this? Ignore this email and you won&apos;t
                hear from me.
              </Text>
            </Section>
          </Container>
          <Text className="mx-auto mt-5 max-w-[540px] text-center text-[12px] text-warm-muted leading-[1.6] tracking-[0.3px]">
            Sent because this address was entered at bhimraj.com.np ·{" "}
            <Link href={unsubscribeUrl} className="text-warm-muted underline">
              Unsubscribe
            </Link>
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
