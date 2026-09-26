import {
  GitHubLogoIcon,
  LightningBoltIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import type { ComponentType } from "react";
import { Container } from "@/components/container";
import { SOCIAL_LINKS } from "./data";
import { KathmanduTime } from "./local-time";
import { SectionHeading } from "./section-heading";

const ICONS: Record<
  (typeof SOCIAL_LINKS)[number]["label"],
  ComponentType<{ className?: string }>
> = {
  GitHub: GitHubLogoIcon,
  LinkedIn: LinkedInLogoIcon,
  X: TwitterLogoIcon,
  YouTube: VideoIcon,
  "Lightning Studios": LightningBoltIcon,
};

const OPEN_TO = [
  "Open-source collaboration on model serving, data loading and training infrastructure.",
  "Helping teams take AI systems from prototype to production.",
  "Conversations about PyTorch Lightning, LitServe or LitData.",
];

export function GetInTouch() {
  return (
    <section aria-labelledby="contact" className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-site-border bg-site-card p-5 sm:p-10 lg:p-14 dark:border-white/6 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-site-accent opacity-10 blur-[120px]"
          />
          <span
            aria-hidden
            className="about-dot-grid pointer-events-none absolute inset-0 opacity-60"
          />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                id="contact"
                index="06"
                eyebrow="Get in touch"
                title={
                  <>
                    Let&apos;s build something
                    <span className="text-site-accent">.</span>
                  </>
                }
              >
                I&apos;m available for collaboration — say hello on any of
                these.
              </SectionHeading>

              <h3 className="font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.2px]">
                Open to
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {OPEN_TO.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[15px] text-site-text-secondary leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-4 shrink-0 bg-site-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-site-border bg-site-bg px-3.5 py-1.5 font-mono text-[12px] text-site-text-secondary dark:border-white/6">
                <span className="text-site-accent">
                  <KathmanduTime />
                </span>
                in Kathmandu right now
              </p>
            </div>

            {/* Links */}
            <ul className="flex flex-col gap-2.5 lg:pt-10">
              {SOCIAL_LINKS.map((link) => {
                const Icon = ICONS[link.label];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-site-border bg-site-bg px-4 py-3.5 transition-all duration-200 hover:border-site-accent/40 hover:bg-site-accent-subtle focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 dark:border-white/6"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-site-bg-tertiary text-site-text-secondary transition-colors group-hover:text-site-accent dark:bg-white/5">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-site-text text-sm">
                          {link.label}
                        </span>
                        <span className="block truncate font-mono text-[12px] text-site-text-tertiary">
                          {link.handle}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="motion-reduce:group-hover:translate-0 text-site-text-tertiary transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-site-accent"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
