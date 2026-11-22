import type { Metadata } from "next";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PathCard } from "@/components/resources/path-card";
import { ResourceExplorer } from "@/components/resources/resource-explorer";
import {
  getPaths,
  getSortedResources,
  toCardData,
} from "@/components/resources/resources";
import { PageHeader } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildResourceCollectionJsonLd,
} from "@/lib/structured-data";

const TITLE = "Free AI and systems courses, books and talks";
const DESCRIPTION =
  "Free courses, books and talks on LLMs, agents, efficient AI, ML systems and reliability, from Stanford, MIT, Harvard and Google, with a short summary of each.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/resources",
  keywords: [
    "free AI courses",
    "LLM course",
    "AI agents course",
    "efficient AI",
    "ML systems",
    "SRE book",
    "learning resources",
  ],
});

export default function Resources() {
  const resources = getSortedResources();
  const paths = getPaths();

  return (
    <main>
      <JsonLd
        data={[
          buildResourceCollectionJsonLd({
            path: "/resources",
            name: TITLE,
            description: DESCRIPTION,
            resources,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
          ]),
        ]}
      />
      <Container className="px-4 pt-28 pb-10 sm:px-8 sm:pt-32 sm:pb-12">
        <PageHeader
          eyebrow="Resources"
          title="Courses, books and talks I keep coming back to"
          description="The material I learn from on LLMs, agents, efficient AI and running systems. Nearly all of it is free, and each entry says in a line what it covers."
        />
      </Container>
      {paths.length > 0 && (
        <section
          id="paths"
          aria-labelledby="paths-heading"
          className="scroll-mt-24 pb-14"
        >
          <Container className="px-4 sm:px-8">
            <h2
              id="paths-heading"
              className="flex items-baseline gap-3 font-display font-semibold text-2xl text-site-text tracking-tight"
            >
              Learning paths
              <span className="font-mono font-normal text-site-text-tertiary text-xs">
                {paths.length}
              </span>
            </h2>
            <p className="mt-2 mb-5 max-w-2xl text-pretty text-site-text-secondary text-sm">
              A few of these in the order I'd take them, with a line on why each
              comes where it does.
            </p>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {paths.map((path) => (
                <li key={path.slug}>
                  <PathCard path={path} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <section className="pb-20 sm:pb-24">
        <Container className="px-4 sm:px-8">
          <ResourceExplorer resources={resources.map(toCardData)} />
        </Container>
      </section>
    </main>
  );
}
