import { cacheLife } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/config/site";

const SOCIAL_LINKS = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Twitter", href: "https://twitter.com/bhimrazy" },
  { label: "YouTube", href: "https://youtube.com/@bhimrajyadav" },
];

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Open Source", href: "/oss" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
];

export default async function Footer() {
  "use cache";
  cacheLife("days");

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-site-border/50 border-t dark:border-white/4">
      <Container className="py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <p className="font-display font-semibold text-base text-site-text">
              Bhimraj Yadav
            </p>
            <p className="mt-1 text-site-text-tertiary text-sm">
              Software Engineer · OSS Contributor · Kathmandu, Nepal
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium font-mono text-site-text-tertiary text-xs uppercase tracking-widest">
                Pages
              </p>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-site-text-secondary text-sm transition-colors hover:text-(--site-text)"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium font-mono text-site-text-tertiary text-xs uppercase tracking-widest">
                Connect
              </p>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-site-text-secondary text-sm transition-colors hover:text-(--site-text)"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-site-border/50 border-t pt-6 text-site-text-tertiary text-xs dark:border-white/4">
          <span>© {year} Bhimraj Yadav. All rights reserved.</span>
          <span>Built with passion and open source.</span>
        </div>
      </Container>
    </footer>
  );
}
