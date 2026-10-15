import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { XLogoIcon } from "@/components/x-logo-icon";
import { siteConfig } from "@/config/site";
import { PERSON, PERSONAL } from "../facts";
import { Ph } from "../ph";
import { JournalNav } from "./journal-nav";
import { SECTIONS } from "./sections";

const SOCIALS = [
  { label: "GitHub", href: siteConfig.links.github, icon: GitHubLogoIcon },
  {
    label: "LinkedIn",
    href: siteConfig.links.linkedin,
    icon: LinkedInLogoIcon,
  },
  {
    label: "X / Twitter",
    href: siteConfig.links.twitter,
    icon: XLogoIcon,
  },
  { label: "YouTube", href: PERSON.youtube, icon: VideoIcon },
] as const;

/** A small tilted print of the portrait, like a photo tucked into a notebook. */
function Portrait() {
  return (
    <figure className="w-fit -rotate-3 rounded-md border border-site-border bg-site-card p-1.5 pb-0 shadow-lg/10 dark:border-white/8 dark:shadow-black/40">
      <Image
        src={PERSON.avatar}
        alt={`Portrait of ${PERSON.name}`}
        width={1891}
        height={2050}
        priority
        className="h-auto w-24 rounded-sm object-cover sm:w-28"
      />
      <figcaption className="py-1.5 text-center font-mono text-[10px] text-site-text-tertiary">
        {PERSON.handle}
      </figcaption>
    </figure>
  );
}

/**
 * The left column: who he is, in his own voice. Sticky on desktop so the
 * person stays on screen while the evidence scrolls past.
 */
export function Intro() {
  const socials = (
    <ul className="-mr-2 flex items-center gap-0.5">
      {SOCIALS.map(({ label, href, icon: Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex size-10 items-center justify-center rounded-lg text-site-text-tertiary transition-colors hover:bg-site-bg-secondary hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent"
          >
            <Icon aria-hidden className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header>
      <div className="flex max-w-2xl items-end justify-between gap-6 lg:max-w-md">
        <Portrait />
        {socials}
      </div>

      <h1 className="mt-8 font-bold font-display text-[2.6rem] text-site-text leading-[1.05] tracking-tight sm:text-5xl">
        Hi, I&rsquo;m Bhimraj.
      </h1>
      <p className="mt-3 font-mono text-[12px] text-site-text-tertiary tracking-wide">
        {PERSON.role} · {PERSON.city}
      </p>

      <div className="mt-6 max-w-2xl space-y-4 text-pretty text-[15px] text-site-text-secondary leading-relaxed sm:text-base lg:max-w-md">
        <p>
          I&apos;m a software engineer from Nepal, based in Kathmandu. I spend
          my days building products, and the rest of my time on open source,
          infrastructure, research, and writing things down.
        </p>
        <p className="border-site-accent/50 border-l-2 pl-4 text-site-text">
          <Ph value={PERSONAL.voiceLine} />
        </p>
      </div>

      <div className="mt-12 hidden lg:block">
        <JournalNav items={SECTIONS} />
      </div>
    </header>
  );
}
