import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CiteButton } from "@/components/research/cite-button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Research — Bhimraj Yadav",
  description:
    "Academic publications and research notes on AI, computer vision, and deep learning.",
  alternates: { canonical: "/research" },
};

const PUBLICATIONS = [
  {
    title:
      "A Comparative Study of State-of-the-Art Deep Learning Models for Semantic Segmentation of Pores in SEM Images",
    authors: "B. Pokharel, B. Yadav, et al.",
    venue: "IEEE Access",
    year: "2024",
    volume: "vol. 12, pp. 50217–50243",
    doi: "https://ieeexplore.ieee.org/document/10458140",
    abstract:
      "A systematic comparison of modern deep learning architectures for semantic segmentation of pore structures in scanning electron microscope (SEM) images, with applications in materials science and quality control.",
    tags: ["Computer Vision", "Semantic Segmentation", "SEM", "Deep Learning"],
    type: "Journal",
  },
] as const;

/**
 * Bare-minimum BibTeX built only from fields already shown on this page.
 * Authors are listed as "B. Pokharel, B. Yadav, et al." in the source data,
 * so the entry uses `and others` rather than inventing the full author list.
 */
function buildBibtex(pub: (typeof PUBLICATIONS)[number]): string {
  const volumeMatch = pub.volume.match(/vol\.\s*(\d+)/i);
  const pagesMatch = pub.volume.match(/pp\.\s*([\d–-]+)/i);
  const volume = volumeMatch ? volumeMatch[1] : "";
  const pages = pagesMatch ? pagesMatch[1].replace(/–/g, "--") : "";
  const key = `pokharel${pub.year}sem`;

  return [
    `@article{${key},`,
    `  title={${pub.title}},`,
    `  author={Pokharel, B. and Yadav, B. and others},`,
    `  journal={${pub.venue}},`,
    volume && `  volume={${volume}},`,
    pages && `  pages={${pages}},`,
    `  year={${pub.year}},`,
    `  url={${pub.doi}}`,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Research interests, derived verbatim from the existing hero copy below
// (generative models, medical imaging, and efficient inference).
const RESEARCH_INTERESTS = [
  "Generative models",
  "Medical imaging",
  "Efficient inference",
] as const;

// TODO: link to a Google Scholar profile once one exists in the repo/config —
// no such link is currently defined, so none is added here.

const READING_NOTES = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: "2017",
    notes:
      "Foundational transformer paper. The multi-head attention mechanism and positional encoding are still central to modern LLMs.",
    tags: ["Transformers", "NLP", "Attention"],
  },
  {
    title:
      "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: "Dosovitskiy et al.",
    year: "2020",
    notes:
      "ViT showed that pure transformers can match CNNs on image tasks when pre-trained on large datasets. Key insight: patch embeddings bridge vision and NLP.",
    tags: ["ViT", "Computer Vision", "Transformers"],
  },
  {
    title: "LLaMA: Open and Efficient Foundation Language Models",
    authors: "Touvron et al.",
    year: "2023",
    notes:
      "Demonstrated that smaller models trained on more data can outperform larger ones. Sparked the open-source LLM ecosystem.",
    tags: ["LLM", "Open Source", "Efficiency"],
  },
] as const;

export default function ResearchPage() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        {/* Hero */}
        <div className="mb-16">
          <span className="mb-3 inline-block font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            Research
          </span>
          <h1 className="mb-4 font-bold font-display text-4xl text-site-text leading-tight sm:text-5xl">
            Academic Work
          </h1>
          <p className="max-w-2xl text-lg text-site-text-secondary leading-relaxed">
            Publications and reading notes on AI, computer vision, and deep
            learning. Research interests span generative models, medical
            imaging, and efficient inference.
          </p>

          {/* Research interests, pulled from the sentence above */}
          <div className="mt-5 flex flex-wrap gap-2">
            {RESEARCH_INTERESTS.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-site-border bg-site-card px-3 py-1 font-mono text-[11px] text-site-text-secondary"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Publications */}
        <h2 className="mb-6 font-bold font-display text-2xl text-site-text">
          Publications
        </h2>
        <div className="mb-16 flex flex-col gap-4">
          {PUBLICATIONS.map((pub) => (
            <Card
              key={pub.title}
              className="group relative overflow-hidden border border-site-border bg-site-card transition-all duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary dark:hover:border-white/10 dark:hover:shadow-site-accent-subtle"
            >
              <span className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-site-accent-subtle opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="flex gap-5">
                  {/* Accent bar */}
                  <div
                    className="w-1 shrink-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(180deg, var(--site-accent), transparent)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[11px] text-site-accent">
                        {pub.venue} · {pub.year}
                      </span>
                      <span className="rounded-md bg-site-accent-subtle px-2 py-0.5 font-mono text-[11px] text-site-accent">
                        {pub.type}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <CiteButton bibtex={buildBibtex(pub)} />
                        <a
                          href={pub.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-site-border bg-site-bg-secondary px-2.5 py-1 font-mono text-[11px] text-site-text-secondary transition-colors hover:border-site-border-hover hover:text-site-text"
                        >
                          View on IEEE
                        </a>
                      </div>
                    </div>

                    <h3 className="mb-2 font-display font-semibold text-base text-site-text leading-snug">
                      {pub.title}
                    </h3>
                    <p className="mb-2 text-site-text-tertiary text-sm">
                      {pub.authors} · {pub.volume}
                    </p>
                    <p className="mb-4 text-site-text-secondary text-sm leading-relaxed">
                      {pub.abstract}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-site-bg-tertiary px-2 py-0.5 font-mono text-[11px] text-site-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reading notes */}
        <h2 className="mb-2 font-bold font-display text-2xl text-site-text">
          Papers That Shaped My Thinking
        </h2>
        <p className="mb-6 max-w-2xl text-site-text-secondary text-sm leading-relaxed">
          Not a reading log — a short, deliberate list of papers whose ideas I
          keep coming back to when reasoning about model architecture and
          training.
        </p>
        <ol className="mb-4 flex flex-col gap-4">
          {READING_NOTES.map((note, i) => (
            <Card
              key={note.title}
              className="border border-site-border bg-site-card dark:border-white/4 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary"
            >
              <CardContent className="flex gap-4 p-5">
                <span className="shrink-0 font-display font-semibold text-site-accent text-sm tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="mb-1 font-display font-semibold text-site-text text-sm leading-snug">
                    {note.title}
                  </h3>
                  <p className="mb-3 font-mono text-[11px] text-site-text-tertiary">
                    {note.authors} · {note.year}
                  </p>
                  <p className="mb-4 text-[13px] text-site-text-secondary leading-relaxed">
                    {note.notes}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-site-accent-subtle px-1.5 py-0.5 font-mono text-[10px] text-site-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ol>
      </Container>
    </main>
  );
}
