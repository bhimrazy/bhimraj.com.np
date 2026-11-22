import type { Metadata } from "next";
import { Chip } from "@/components/chip";
import { Container } from "@/components/container";
import ContactSection from "@/components/homepage/contact-section";
import { JsonLd } from "@/components/json-ld";
import { CiteButton } from "@/components/research/cite-button";
import {
  ArrowLink,
  PageHeader,
  SectionHeading,
} from "@/components/section-heading";
import { SectionSeparator } from "@/components/section-separator";
import { surface } from "@/components/surface";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { buildScholarlyArticleJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Research: IEEE Access paper & reading list",
  description:
    "An IEEE Access paper comparing deep learning models for segmenting pores in SEM images, plus a short reading list on model architecture and training.",
  path: "/research",
  keywords: [
    "semantic segmentation",
    "SEM images",
    "deep learning",
    "IEEE Access",
    "computer vision research",
  ],
});

type Author = { given: string; family: string };

type Publication = {
  bibKey: string;
  title: string;
  authors: readonly Author[];
  journal: string;
  volume: string;
  pages: readonly [first: string, last: string];
  year: string;
  doi: string;
  url: string;
  abstract: string;
  tags: readonly string[];
};

const PUBLICATIONS: readonly Publication[] = [
  {
    bibKey: "pokharel2024comparative",
    title:
      "A Comparative Study of State-of-the-Art Deep Learning Models for Semantic Segmentation of Pores in Scanning Electron Microscope Images of Activated Carbon",
    authors: [
      { given: "Bishwas", family: "Pokharel" },
      { given: "Deep Shankar", family: "Pandey" },
      { given: "Anjuli", family: "Sapkota" },
      { given: "Bhimraj", family: "Yadav" },
      { given: "Vasanta", family: "Gurung" },
      { given: "Mandira Pradhananga", family: "Adhikari" },
      { given: "Lok Nath", family: "Regmi" },
      { given: "Nanda Bikram", family: "Adhikari" },
    ],
    journal: "IEEE Access",
    volume: "12",
    pages: ["50217", "50243"],
    year: "2024",
    doi: "10.1109/ACCESS.2024.3381523",
    url: "https://ieeexplore.ieee.org/document/10478488",
    abstract:
      "A systematic comparison of modern deep learning architectures for semantic segmentation of pore structures in scanning electron microscope (SEM) images, with applications in materials science and quality control.",
    tags: ["Computer vision", "Semantic segmentation", "SEM", "Deep learning"],
  },
];

const fullName = (a: Author) => `${a.given} ${a.family}`;

function buildBibtex(pub: Publication): string {
  const fields = [
    ["author", pub.authors.map((a) => `${a.family}, ${a.given}`).join(" and ")],
    // Double braces stop BibTeX styles from lower-casing the title.
    ["title", `{${pub.title}}`],
    ["journal", pub.journal],
    ["volume", pub.volume],
    ["pages", pub.pages.join("--")],
    ["year", pub.year],
    ["doi", pub.doi],
    ["url", pub.url],
  ];
  const body = fields.map(([k, v]) => `  ${k}={${v}}`).join(",\n");
  return `@article{${pub.bibKey},\n${body}\n}`;
}

const RESEARCH_INTERESTS = [
  "Generative models",
  "Medical imaging",
  "Efficient inference",
] as const;

const READING_LIST = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: "2017",
    arxiv: "1706.03762",
    notes:
      "Introduced the transformer. Multi-head attention and positional encoding are still central to modern LLMs.",
    tags: ["Transformers", "NLP", "Attention"],
  },
  {
    title:
      "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: "Dosovitskiy et al.",
    year: "2020",
    arxiv: "2010.11929",
    notes:
      "ViT showed that a plain transformer can match CNNs on image tasks when pre-trained on enough data, by treating image patches as tokens.",
    tags: ["ViT", "Computer vision", "Transformers"],
  },
  {
    title: "LLaMA: Open and Efficient Foundation Language Models",
    authors: "Touvron et al.",
    year: "2023",
    arxiv: "2302.13971",
    notes:
      "Showed that smaller models trained on more tokens can outperform larger ones, and its open weights started the open-source LLM ecosystem.",
    tags: ["LLM", "Open source", "Efficiency"],
  },
] as const;

function AuthorList({ authors }: { authors: readonly Author[] }) {
  return (
    <p className="mt-3 text-pretty text-site-text-tertiary text-sm leading-relaxed">
      {authors.map((a, i) => {
        const name = fullName(a);
        return (
          <span key={name}>
            {i > 0 && ", "}
            {name === siteConfig.author.name ? (
              <span className="font-medium text-site-text">{name}</span>
            ) : (
              name
            )}
          </span>
        );
      })}
    </p>
  );
}

export default function ResearchPage() {
  return (
    <main>
      <JsonLd
        data={PUBLICATIONS.map((pub) =>
          buildScholarlyArticleJsonLd({
            ...pub,
            authors: pub.authors.map(fullName),
          }),
        )}
      />
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20">
        <Container className="px-4 sm:px-8">
          <PageHeader
            eyebrow="Research"
            title="A published paper, and the ones I keep rereading."
            description="A peer-reviewed study in IEEE Access on segmenting pores in electron microscope images, and a short list of papers on model architecture and training that I return to."
          >
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[12px] text-site-text-tertiary">
                Interests
              </span>
              {RESEARCH_INTERESTS.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>
          </PageHeader>
        </Container>
      </section>

      <SectionSeparator />

      <section className="py-20 sm:py-24">
        <Container className="px-4 sm:px-8">
          <SectionHeading
            index="01"
            eyebrow="Publication"
            title="Peer-reviewed work"
          />

          <ul className="flex flex-col gap-4">
            {PUBLICATIONS.map((pub) => (
              <li key={pub.doi} className={cn(surface, "p-6 sm:p-7")}>
                <div className="flex flex-wrap gap-2">
                  <Chip>
                    {pub.journal} · {pub.year}
                  </Chip>
                  <Chip tone="neutral">Journal article</Chip>
                </div>

                <h3 className="mt-4 max-w-4xl text-balance font-display font-semibold text-site-text text-xl leading-snug tracking-tight">
                  {pub.title}
                </h3>
                <AuthorList authors={pub.authors} />
                <p className="mt-1 font-mono text-[12px] text-site-text-tertiary">
                  {pub.journal}, vol. {pub.volume}, pp. {pub.pages.join("–")},{" "}
                  {pub.year}
                </p>

                <p className="mt-4 max-w-3xl text-pretty text-site-text-secondary text-sm leading-relaxed">
                  {pub.abstract}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {pub.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <CiteButton bibtex={buildBibtex(pub)} />
                  <ArrowLink href={pub.url} external>
                    View on IEEE
                  </ArrowLink>
                  <ArrowLink href={`https://doi.org/${pub.doi}`} external>
                    DOI {pub.doi}
                  </ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <SectionSeparator />

      <section className="py-20 sm:py-24">
        <Container className="px-4 sm:px-8">
          <SectionHeading
            index="02"
            eyebrow="Reading list"
            title="Papers that shaped my thinking"
            description="A short list of papers whose ideas I keep coming back to when reasoning about model architecture and training."
          />

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {READING_LIST.map((paper, i) => (
              <li
                key={paper.arxiv}
                className={cn(surface, "flex flex-col p-6 sm:p-7")}
              >
                <span className="font-mono text-[12px] text-site-accent-text tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display font-semibold text-lg text-site-text leading-snug tracking-tight">
                  <a
                    href={`https://arxiv.org/abs/${paper.arxiv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm underline-offset-4 transition-colors hover:text-site-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
                  >
                    {paper.title}
                  </a>
                </h3>
                <p className="mt-2 font-mono text-[12px] text-site-text-tertiary">
                  {paper.authors} · {paper.year}
                </p>
                <p className="mt-4 flex-1 text-pretty text-site-text-secondary text-sm leading-relaxed">
                  {paper.notes}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {paper.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ContactSection index="03" />
    </main>
  );
}
