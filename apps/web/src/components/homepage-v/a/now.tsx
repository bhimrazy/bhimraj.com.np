import { PERSONAL, THREADS } from "../facts";
import { Ph } from "../ph";
import { Section, SmartLink } from "./primitives";

/** The parallel threads, as a definition list. Equal weight, one row each. */
export function Now() {
  const { building, reading } = PERSONAL.currently;
  return (
    <Section label="Now">
      <dl className="divide-y divide-site-border/70 border-site-border/70 border-y">
        {THREADS.map((t) => (
          <div
            key={t.key}
            className="grid grid-cols-1 gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[10.5rem_1fr]"
          >
            <dt className="text-site-text-tertiary text-sm sm:pt-px">
              {t.verb}
            </dt>
            <dd className="min-w-0">
              {t.orgHref ? (
                <SmartLink
                  href={t.orgHref}
                  className="group/org rounded-sm font-medium text-[15px] text-site-text transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
                >
                  {t.org}
                  <span
                    aria-hidden
                    className="ml-1 inline-block text-site-text-tertiary opacity-0 transition-[opacity,translate] group-hover/org:translate-x-0.5 group-hover/org:text-site-accent group-hover/org:opacity-100 group-focus-visible/org:opacity-100 motion-reduce:transition-none"
                  >
                    {t.orgHref.startsWith("http") ? "↗" : "→"}
                  </span>
                </SmartLink>
              ) : (
                <span className="font-medium text-[15px] text-site-text">
                  {t.org}
                </span>
              )}
              <p className="mt-0.5 font-mono text-[11.5px] text-site-text-tertiary leading-relaxed">
                {t.role}
              </p>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-site-text-secondary text-sm leading-relaxed">
        <span className="text-site-text-tertiary">Lately:</span> building{" "}
        {building.charAt(0).toLowerCase() + building.slice(1)}; reading{" "}
        <Ph value={reading} />.
      </p>
    </Section>
  );
}
