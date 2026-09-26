import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import NewsletterForm from "./news-letter";
import { surface } from "./surface";

/*
 * There's no public contact email in the repo, so the direct channels are the
 * social profiles in siteConfig. Swap the primary CTA for a mailto: once one
 * is chosen.
 */
type Channel = {
  label: string;
  href: string;
  icon: typeof GitHubLogoIcon;
  primary?: boolean;
};

const CHANNELS: readonly Channel[] = [
  {
    label: "Message on LinkedIn",
    href: siteConfig.links.linkedin,
    icon: LinkedInLogoIcon,
    primary: true,
  },
  {
    label: `${siteConfig.author.handle} on X`,
    href: siteConfig.links.twitter,
    icon: TwitterLogoIcon,
  },
  {
    label: "GitHub",
    href: siteConfig.links.github,
    icon: GitHubLogoIcon,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 pb-24 sm:pb-28">
      <Container>
        <div
          className={cn(surface, "grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]")}
        >
          {/* Warm glow anchoring the page's final call to action */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-site-accent-subtle blur-3xl"
          />

          <div className="relative p-7 sm:p-10 lg:p-12">
            <SectionHeading
              index="04"
              eyebrow="Contact"
              title="Let's work together."
              description="Open to collaboration on open-source ML tooling, AI infrastructure, and production systems. The fastest way to reach me is a direct message."
              className="mb-0 sm:mb-0"
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {CHANNELS.map(({ label, href, icon: Icon, primary }) => (
                <Button
                  key={href}
                  asChild
                  size="lg"
                  variant={primary ? "default" : "outline"}
                  className={cn(
                    "rounded-lg px-5 font-semibold focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 focus-visible:ring-offset-site-bg",
                    primary
                      ? "border-0 bg-site-accent text-white hover:bg-site-accent/85"
                      : "text-site-text",
                  )}
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon aria-hidden />
                    {label}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative border-site-border/70 border-t p-7 sm:p-10 lg:border-t-0 lg:border-l lg:p-12 dark:border-white/5">
            <h3 className="font-display font-semibold text-lg text-site-text">
              Not ready to talk? Stay in the loop.
            </h3>
            <p className="mt-2 mb-6 text-pretty text-site-text-secondary text-sm leading-relaxed">
              Notes on software engineering, OSS, and AI research — sent only
              when I ship or learn something worth sharing. No filler.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
