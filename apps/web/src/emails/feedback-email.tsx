import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
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
      <Column className="w-[84px] py-1.5 align-top text-[12px] text-warm-muted">
        {label}
      </Column>
      <Column className="break-words py-1.5 text-[13px] text-warm-text">
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
        <Body className="bg-warm-page p-6 font-sans text-warm-text">
          <Container className="mx-auto max-w-[540px] rounded-2xl border border-warm-border bg-warm-card">
            <Section className="px-9 pt-9 pb-8">
              <Text className="m-0 mb-3 font-semibold text-[12px] text-warm-accent uppercase tracking-[1.5px]">
                New feedback
              </Text>
              <Heading className="m-0 font-display font-bold text-[22px] text-warm-text">
                {who}
              </Heading>
              {props.email ? (
                <Text className="m-0 mt-1 text-[14px] text-warm-muted">
                  Reply to{" "}
                  <Link
                    href={`mailto:${props.email}`}
                    className="font-medium text-warm-accent no-underline"
                  >
                    {props.email}
                  </Link>
                </Text>
              ) : (
                <Text className="m-0 mt-1 text-[14px] text-warm-muted">
                  No email — anonymous
                </Text>
              )}

              {props.reason ? (
                <Text className="m-0 mt-5 mb-0 inline-block rounded-full border border-warm-border bg-warm-bg px-3 py-1.5 text-[12px] text-warm-muted">
                  Looking for{" "}
                  <span className="font-semibold text-warm-text">
                    {props.reason}
                  </span>
                </Text>
              ) : null}

              <Section className="mt-5 rounded-xl border border-warm-border bg-warm-bg px-5 py-4">
                <Text className="m-0 whitespace-pre-wrap text-[15px] text-warm-text leading-[1.65]">
                  {props.message}
                </Text>
              </Section>

              <Hr className="my-7 border-warm-border" />

              <Text className="m-0 mb-2 font-semibold text-[11px] text-warm-muted uppercase tracking-[0.8px]">
                Context
              </Text>
              <Section>
                <MetaRow label="Page" value={props.path} />
                <MetaRow label="Referrer" value={props.referrer} />
                <MetaRow label="IP" value={props.ip} />
                <MetaRow label="Device" value={props.userAgent} />
              </Section>
            </Section>
          </Container>
          <Text className="mx-auto mt-5 max-w-[540px] text-center text-[12px] text-warm-muted tracking-[0.3px]">
            Sent from the feedback widget at bhimraj.com.np
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
