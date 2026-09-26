import { getSnapshotMeta } from "@bhimrazy/github";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/container";
import { NAV_LINKS } from "@/components/header/nav-links";
import { siteConfig } from "@/config/site";
import { formatShortDate } from "@/lib/format";

const REPO_URL = `${siteConfig.links.github}/bhimraj.com.np`;

const SOCIAL_LINKS = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "X / Twitter", href: siteConfig.links.twitter },
  // Not in siteConfig.links yet — kept from the previous footer.
  { label: "YouTube", href: "https://youtube.com/@bhimrajyadav" },
];

const linkClass =
  "rounded-sm text-site-text-secondary text-sm transition-colors hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

function ColumnLabel({ children }: { children: string }) {
  return (
    <p className="mb-1 font-medium font-mono text-[11px] text-site-text-tertiary uppercase tracking-widest">
      {children}
    </p>
  );
}

export default async function Footer() {
  "use cache";
  cacheLife("days");

  const year = new Date().getFullYear();
  const { generatedAt } = getSnapshotMeta();

  return (
    <footer className="mt-auto border-site-border/60 border-t dark:border-white/4">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand + contact */}
          <div className="col-span-2 max-w-sm md:col-span-1">
            <p className="font-display font-semibold text-lg text-site-text">
              Bhimraj Yadav
            </p>
            <p className="mt-2 text-pretty text-site-text-secondary text-sm leading-relaxed">
              Software Engineer at Fetchly Labs and Tier 2 OSS contributor at
              Lightning AI. Based in Kathmandu, Nepal.
            </p>
            <Link
              href="/#contact"
              className="mt-5 inline-flex items-center gap-1.5 rounded-sm font-medium text-site-accent text-sm transition-colors hover:text-site-accent-hover focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
            >
              Get in touch <span aria-hidden>→</span>
            </Link>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            <ColumnLabel>Pages</ColumnLabel>
            <Link href="/" className={linkClass}>
              Home
            </Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <ColumnLabel>Connect</ColumnLabel>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-site-border/60 border-t pt-6 text-site-text-tertiary text-xs sm:flex-row sm:items-center sm:justify-between dark:border-white/4">
          <span>© {year} Bhimraj Yadav</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-site-accent/70"
              />
              <span>
                GitHub data synced{" "}
                <time dateTime={generatedAt}>
                  {formatShortDate(generatedAt)}
                </time>
              </span>
            </span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
            >
              Source on GitHub ↗
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
