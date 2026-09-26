import { ArrowLink } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { ColumnTitle } from "./column-title";
import { chip, surface } from "./surface";

// Mirrors the first entry on /research.
const PUBLICATION = {
  title:
    "A Comparative Study of State-of-the-Art Deep Learning Models for Semantic Segmentation of Pores in SEM Images",
  authors: "B. Pokharel, B. Yadav, et al.",
  venue: "IEEE Access",
  year: "2024",
  volume: "vol. 12, pp. 50217–50243",
  url: "https://ieeexplore.ieee.org/document/10458140",
  tags: ["Computer Vision", "Semantic Segmentation", "Deep Learning"],
} as const;

/** The peer-reviewed paper — one column of the Writing & research pair. */
export default function ResearchPreview() {
  return (
    <div className="flex flex-col">
      <ColumnTitle
        title="Published research"
        action={<ArrowLink href="/research">Research</ArrowLink>}
      />

      <article className={cn(surface, "flex flex-1 flex-col p-6 sm:p-7")}>
        <div
          aria-hidden
          className="absolute inset-y-6 left-0 w-0.75 rounded-r-full bg-linear-to-b from-site-accent to-transparent"
        />
        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="rounded-md bg-site-accent-subtle px-2 py-0.5 text-site-accent">
            {PUBLICATION.venue} · {PUBLICATION.year}
          </span>
          <span className="text-site-text-tertiary">Journal article</span>
        </p>

        <h4 className="mt-4 text-pretty font-display font-semibold text-lg text-site-text leading-snug">
          {PUBLICATION.title}
        </h4>
        <p className="mt-2 text-site-text-tertiary text-sm">
          {PUBLICATION.authors} · {PUBLICATION.volume}
        </p>

        <ul className="mt-5 flex flex-1 flex-wrap content-start gap-1.5">
          {PUBLICATION.tags.map((tag) => (
            <li key={tag} className={chip}>
              {tag}
            </li>
          ))}
        </ul>

        <ArrowLink href={PUBLICATION.url} external className="mt-6 self-start">
          Read on IEEE Xplore
        </ArrowLink>
      </article>
    </div>
  );
}
