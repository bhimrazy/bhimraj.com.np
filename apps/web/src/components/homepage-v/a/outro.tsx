import NewsletterForm from "@/components/homepage/news-letter";
import { siteConfig } from "@/config/site";
import { PERSON } from "../facts";
import { Section, TextLink } from "./primitives";

/** One line of life outside work. */
export function OutsideWork() {
  return (
    <Section label="Outside work">
      <p className="text-[15px] text-site-text-secondary leading-[1.8]">
        I grew up in Nepal&apos;s Terai and now live in Kathmandu. Away from the
        keyboard I love the gym, travelling, exploring new things, and music.
      </p>
    </Section>
  );
}

const CHANNELS = [
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "X", href: siteConfig.links.twitter },
  { label: "GitHub", href: siteConfig.links.github },
  { label: "YouTube", href: PERSON.youtube },
] as const;

/** Where to reach him, plus the newsletter, kept understated. */
export function Contact() {
  return (
    <Section label="Contact">
      <p className="text-[15px] text-site-text-secondary leading-[1.8]">
        Say hi on{" "}
        {CHANNELS.map((ch, i) => (
          <span key={ch.label}>
            <TextLink href={ch.href}>{ch.label}</TextLink>
            {i < CHANNELS.length - 2
              ? ", "
              : i === CHANNELS.length - 2
                ? " or "
                : ""}
          </span>
        ))}
        . New posts also go out by email.
      </p>
      <div className="mt-5 max-w-md">
        <NewsletterForm />
      </div>
    </Section>
  );
}
