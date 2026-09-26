import Link from "next/link";
import { Container } from "@/components/container";
import { PATH } from "./data";
import { SectionHeading } from "./section-heading";

function EntryLink({ label, href }: { label: string; href: string }) {
  const className =
    "mt-2 inline-flex items-center gap-1 rounded-sm font-mono text-[12px] text-site-accent transition-colors hover:text-site-accent-hover focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
        <span aria-hidden>→</span>
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={className}
    >
      {label}
      <span aria-hidden>↗</span>
    </a>
  );
}

export function PathTimeline() {
  return (
    <section
      aria-labelledby="path"
      className="relative border-site-border/40 border-y bg-site-bg-secondary/40 py-20 sm:py-24 dark:bg-white/1.5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-site-accent/40 to-transparent"
      />
      <Container>
        <SectionHeading
          id="path"
          index="02"
          eyebrow="The path so far"
          title="From client work to cutting framework releases"
        >
          Five years, condensed. The{" "}
          <Link
            href="/oss"
            className="text-site-accent underline decoration-site-accent/40 underline-offset-4 hover:decoration-site-accent"
          >
            OSS journey
          </Link>{" "}
          has the full story with live numbers.
        </SectionHeading>

        <ol className="flex flex-col">
          {PATH.map((chapter) => (
            <li
              key={chapter.year}
              className="grid grid-cols-1 gap-x-12 border-site-border border-t py-10 first:border-t-0 first:pt-2 lg:grid-cols-[300px_1fr] dark:border-white/5"
            >
              {/* Year */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p
                  aria-hidden
                  className="about-outline-numeral font-bold font-display text-6xl leading-none tracking-tighter sm:text-7xl lg:text-8xl"
                >
                  {chapter.year}
                </p>
                <h3 className="mt-3 font-display font-semibold text-lg text-site-text">
                  <span className="sr-only">{chapter.year}: </span>
                  {chapter.heading}
                </h3>
              </div>

              {/* Entries */}
              <ul className="relative mt-6 flex flex-col gap-6 border-site-border border-l pl-6 lg:mt-1 dark:border-white/8">
                {chapter.entries.map((entry) => (
                  <li key={entry.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-2 -left-7.25 size-2.5 rounded-full border-2 border-site-bg bg-site-accent"
                    />
                    <p className="font-medium font-mono text-[11px] text-site-accent uppercase tracking-[1px]">
                      {entry.date}
                    </p>
                    <p className="mt-1 font-display font-semibold text-base text-site-text">
                      {entry.title}
                    </p>
                    {entry.body && (
                      <p className="mt-1 max-w-xl text-site-text-secondary text-sm leading-relaxed">
                        {entry.body}
                      </p>
                    )}
                    {entry.link && <EntryLink {...entry.link} />}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
