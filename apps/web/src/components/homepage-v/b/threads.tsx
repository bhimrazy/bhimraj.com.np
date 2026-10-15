import { Container } from "@/components/container";
import { ArrowLink, SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { CompanyLogo, LOGOS } from "../../homepage/company-logo";
import { surface } from "../../homepage/surface";
import { THREADS } from "../facts";

type Thread = (typeof THREADS)[number];
type ThreadLink = { href: string; label: string; external?: boolean };

/** Link labels per thread; the hrefs come from facts. */
const LINKS: Partial<Record<Thread["key"], ThreadLink[]>> = {
  oss: [{ href: "/oss", label: "Open-source work" }],
  infra: [
    {
      href: "https://stablecluster.com",
      label: "stablecluster.com",
      external: true,
    },
  ],
};

/** Optical sizing: the Lightning mark carries a tagline, so it needs more height. */
const LOGO_SIZE = {
  fetchly: "h-6",
  lightning: "h-8",
  stablecluster: "h-5.5",
} as const;

/** Experience lists the three roles held at organisations, each with a logo. */
const EXPERIENCE = THREADS.flatMap((t) =>
  t.logo ? [{ ...t, logo: t.logo }] : [],
);
type Role = (typeof EXPERIENCE)[number];

function Mark({ role }: { role: Role }) {
  return (
    <CompanyLogo
      logo={LOGOS[role.logo]}
      company={role.org}
      className={LOGO_SIZE[role.logo]}
    />
  );
}

export default function Threads() {
  return (
    <section id="what-i-do" className="scroll-mt-20 py-20 sm:py-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="Work"
          title="Experience"
          description="Products, open source, and infrastructure."
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EXPERIENCE.map((thread) => {
            const links = LINKS[thread.key] ?? [];
            return (
              <li
                key={thread.key}
                className={cn(surface, "flex flex-col p-5 sm:p-7")}
              >
                <div className="flex h-8 items-center">
                  <Mark role={thread} />
                </div>
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-site-text text-xl leading-snug tracking-tight">
                    {thread.verb}
                  </h3>
                  <p className="mt-1 text-site-text-secondary text-sm">
                    {thread.org}
                  </p>
                  <p className="mt-0.5 text-pretty font-mono text-[11px] text-site-text-tertiary leading-relaxed">
                    {thread.role}
                  </p>
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <p className="flex-1 text-pretty text-site-text-secondary text-sm leading-relaxed">
                    {thread.line}
                  </p>
                  {links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {links.map((link) => (
                        <ArrowLink
                          key={link.href}
                          href={link.href}
                          external={link.external}
                        >
                          {link.label}
                        </ArrowLink>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
