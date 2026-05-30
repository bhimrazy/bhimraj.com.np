import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { emailTailwindConfig } from "@/emails/theme";

export type FeedbackEmailProps = {
  message: string;
  reason?: string;
  name?: string;
  email?: string;
  path?: string;
  referrer?: string;
  ip: string;
  userAgent: string;
};

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Row>
      <Column className="w-[92px] py-[7px] align-top text-[12px] text-warm-muted">
        {label}
      </Column>
      <Column className="break-words py-[7px] text-[13px] text-warm-text">
        {value}
      </Column>
    </Row>
  );
}

export function FeedbackEmail(props: FeedbackEmailProps) {
  const who = props.name || "Anonymous";
  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>{`New site feedback from ${who}`}</Preview>
        <Body className="bg-warm-bg p-6 font-sans text-warm-text">
          <Container className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border border-warm-border bg-warm-card">
            <Section className="h-[3px] bg-warm-accent" />
            <Section className="p-7">
              <Text className="m-0 mb-[10px] inline-block rounded-full bg-warm-accent/10 px-[10px] py-[3px] font-semibold text-[11px] text-warm-accent uppercase tracking-[0.4px]">
                New feedback
              </Text>
              <Heading className="m-0 mb-[18px] font-bold text-[20px] text-warm-text">
                {who}
              </Heading>
              <Section className="mb-[18px] rounded-xl border border-warm-border bg-warm-bg p-4">
                <Text className="m-0 whitespace-pre-wrap text-[14px] text-warm-text leading-[1.65]">
                  {props.message}
                </Text>
              </Section>
              <MetaRow label="Looking for" value={props.reason} />
              <MetaRow label="Email" value={props.email} />
              <MetaRow label="Page" value={props.path} />
              <MetaRow label="Referrer" value={props.referrer} />
              <MetaRow label="IP" value={props.ip} />
              <MetaRow label="Device" value={props.userAgent} />
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
