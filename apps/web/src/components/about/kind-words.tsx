import { journeyQuotes } from "@/components/oss/journey-data";
import { surface } from "@/components/surface";
import { cn } from "@/lib/utils";
import { ABOUT_QUOTES, SKIPPED_JOURNEY_QUOTES } from "./data";

type Quote = (typeof ABOUT_QUOTES)[number];

export function KindWords() {
  const quotes: Quote[] = [
    ...ABOUT_QUOTES,
    ...journeyQuotes().filter((q) => !SKIPPED_JOURNEY_QUOTES.has(q.text)),
  ];
  // The longest quote takes the large card; a one-liner would look lost there.
  const featured = quotes.reduce<Quote | undefined>(
    (a, b) => (a && a.text.length >= b.text.length ? a : b),
    undefined,
  );
  if (!featured) return null;
  const rest = quotes.filter((q) => q !== featured);

  return (
    <div className="flex flex-col gap-4">
      <figure
        className={cn(
          surface,
          "relative p-7 sm:p-9 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-4 right-7 select-none font-bold font-display text-[120px] text-site-accent leading-[0.8] opacity-15"
        >
          &ldquo;
        </span>
        <blockquote className="relative max-w-4xl lg:pr-10">
          <p className="text-pretty font-display text-site-text text-xl leading-snug sm:text-2xl">
            &ldquo;{featured.text}&rdquo;
          </p>
        </blockquote>
        <QuoteCaption quote={featured} className="mt-8 lg:mt-0 lg:max-w-56" />
      </figure>

      {/* Masonry, so one-liners don't sit in tall, half-empty cards. */}
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {rest.map((quote) => (
          <figure
            key={`${quote.author}-${quote.text}`}
            className={cn(surface, "mb-4 break-inside-avoid p-6")}
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
  );
}

function QuoteCaption({
  quote,
  className,
}: {
  quote: Quote;
  className?: string;
}) {
  return (
    <figcaption className={cn("relative", className)}>
      <span className="block font-medium text-site-text text-sm">
        {quote.author}
        <span className="font-normal text-site-text-secondary">
          {" "}
          · {quote.role}
        </span>
      </span>
      {quote.context && quote.href ? (
        <a
          href={quote.href}
          {...(!quote.href.startsWith("/") && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
          className="mt-0.5 inline-block rounded-sm font-mono text-[11px] text-site-text-secondary transition-colors hover:text-site-accent-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
        >
          {quote.context} {quote.href.startsWith("/") ? "→" : "↗"}
        </a>
      ) : (
        quote.context && (
          <span className="mt-0.5 block font-mono text-[11px] text-site-text-secondary">
            {quote.context}
          </span>
        )
      )}
    </figcaption>
  );
}
