import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import NewsletterForm from "@/components/homepage/news-letter";
import { surface } from "@/components/homepage/surface";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Chapter } from "./chapter";

/* No public email in the repo yet, so the direct channels are the profiles. */
const CHANNELS = [
  {
    label: "LinkedIn",
    note: "send a message",
    href: siteConfig.links.linkedin,
    icon: LinkedInLogoIcon,
  },
  {
    label: "X",
    note: siteConfig.author.handle,
    href: siteConfig.links.twitter,
    icon: TwitterLogoIcon,
  },
  {
    label: "GitHub",
    note: siteConfig.author.username,
    href: siteConfig.links.github,
    icon: GitHubLogoIcon,
  },
] as const;

export function Hello() {
  return (
    <Chapter id="hello">
      <div className={cn(surface, "p-6 sm:p-8")}>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-20 size-72 rounded-full bg-site-accent-subtle blur-3xl"
        />
        <div className="relative">
          <p className="max-w-lg text-pretty font-display font-medium text-site-text text-xl leading-snug sm:text-2xl">
            Something you&rsquo;re building, a bug in LitData, a research idea,
            or just a hello from wherever you are: my messages are open.
          </p>

          <ul className="mt-6 grid grid-cols-3 gap-2">
            {CHANNELS.map(({ label, note, href, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2.5 rounded-lg border border-site-border bg-site-bg/60 px-3 py-3 transition-colors hover:border-site-accent/50 focus-visible:outline-2 focus-visible:outline-site-accent sm:justify-start sm:px-3.5 dark:border-white/8"
                >
                  <Icon
                    aria-hidden
                    className="size-4 text-site-text-secondary group-hover:text-site-accent"
                  />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-medium text-site-text text-sm">
                      {label}
                    </span>
                    <span className="hidden truncate font-mono text-[11px] text-site-text-tertiary sm:block">
                      {note}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-site-border/70 border-t pt-6 dark:border-white/5">
            <p className="mb-3 text-pretty text-site-text-secondary text-sm leading-relaxed">
              Or get the occasional letter, sent only when I ship or learn
              something worth sharing.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <p className="mt-10 text-site-text-secondary text-sm italic">
        Thanks for reading this far.
        <span className="mt-1 block font-display text-base text-site-text not-italic">
          — Bhimraj
        </span>
      </p>
    </Chapter>
  );
}
