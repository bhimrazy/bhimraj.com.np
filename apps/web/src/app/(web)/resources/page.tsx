import type { Metadata } from "next";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { ResourceExplorer } from "@/components/resources/resource-explorer";
import {
  getSortedResources,
  toCardData,
} from "@/components/resources/resources";
import { PageHeader } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildResourceCollectionJsonLd,
} from "@/lib/structured-data";

const TITLE = "Resources: free courses, books and talks on AI and systems";
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
      <section className="pb-20 sm:pb-24">
        <Container className="px-4 sm:px-8">
          <ResourceExplorer resources={resources.map(toCardData)} />
        </Container>
      </section>
    </main>
  );
}
