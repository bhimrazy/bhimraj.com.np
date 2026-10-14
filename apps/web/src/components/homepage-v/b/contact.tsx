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
import NewsletterForm from "../../homepage/news-letter";
import { surface } from "../../homepage/surface";

const CHANNELS = [
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
    primary: false,
  },
  {
    label: "GitHub",
    href: siteConfig.links.github,
    icon: GitHubLogoIcon,
    primary: false,
  },
] as const;

/** Same shape as the main ContactSection, with copy that covers every thread. */
export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 pb-24 sm:pb-28">
      <Container className="px-4 sm:px-8">
        <div
          className={cn(surface, "grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]")}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-site-accent-subtle blur-3xl"
          />

          <div className="relative p-7 sm:p-10 lg:p-12">
            <SectionHeading
              index="05"
              eyebrow="Contact"
              title="Say hello."
              description="Products, open-source tools, infrastructure, or a research idea: I'm open to talking about any of them. A direct message is the fastest way to reach me."
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
                      ? "border-0 bg-site-accent text-site-on-accent hover:bg-site-accent/85"
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
              New posts, releases, and the occasional research note, sent only
              when there&apos;s something worth sharing.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
