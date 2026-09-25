import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { QUOTES } from "./data";
import { SectionHeading } from "./section-heading";

export function KindWords() {
  const [featured, ...rest] = QUOTES;

  return (
    <section
      aria-labelledby="kind-words"
      className="relative overflow-hidden border-site-border/40 border-y bg-site-bg-secondary/40 py-20 sm:py-24 dark:bg-white/1.5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-site-accent/40 to-transparent"
      />
      <Container>
        <SectionHeading
          id="kind-words"
          index="05"
          eyebrow="Kind words"
          title="From the people I build with"
        >
          A few words from the Lightning AI team, kept from the moments they
          were said.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Featured */}
          <figure className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-site-accent/25 bg-site-card p-7 sm:p-9 lg:col-span-3 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary">
            <span
              aria-hidden
              className="pointer-events-none absolute top-4 right-7 select-none font-bold font-display text-[140px] text-site-accent leading-[0.8] opacity-15"
            >
              &ldquo;
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-site-accent-subtle blur-3xl"
            />
            <blockquote className="relative lg:pr-10">
              <p className="font-display text-site-text text-xl leading-snug sm:text-2xl lg:text-[28px] lg:leading-[1.3]">
                &ldquo;{featured.text}&rdquo;
              </p>
            </blockquote>
            <QuoteCaption quote={featured} className="mt-8" />
          </figure>

          {/* The rest */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {rest.map((quote) => (
              <figure
                key={quote.author}
                className="flex flex-1 flex-col justify-between rounded-2xl border border-site-border bg-site-card p-6 dark:border-white/5 dark:bg-site-bg"
              >
                <blockquote>
                  <p className="text-[15px] text-site-text leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                </blockquote>
                <QuoteCaption quote={quote} className="mt-4" />
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function QuoteCaption({
  quote,
  className,
}: {
  quote: (typeof QUOTES)[number];
  className?: string;
}) {
  return (
    <figcaption className={cn("relative flex items-center gap-3", className)}>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-site-accent/30 bg-site-accent-subtle font-display font-semibold text-[13px] text-site-accent"
      >
        {quote.author
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-site-text text-sm">
          {quote.author}
          <span className="font-normal text-site-text-tertiary">
            {" "}
            · {quote.role}
          </span>
        </span>
        {quote.href ? (
          <a
            href={quote.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="block font-mono text-[11px] text-site-text-tertiary transition-colors hover:text-site-accent"
          >
            {quote.context} ↗
          </a>
        ) : (
          <span className="block font-mono text-[11px] text-site-text-tertiary">
            {quote.context}
          </span>
        )}
      </span>
    </figcaption>
  );
}
