import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { Education } from "@/components/about/education";
import { KindWords } from "@/components/about/kind-words";
import { PathTimeline } from "@/components/about/path-timeline";
import { Toolbox } from "@/components/about/toolbox";
import ContactSection from "@/components/homepage/contact-section";
import { JsonLd } from "@/components/json-ld";
import { PageSection } from "@/components/page-section";
import { SectionHeading } from "@/components/section-heading";
import { SectionSeparator } from "@/components/section-separator";
import { pageMetadata } from "@/lib/metadata";
import {
  buildAboutPageJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/structured-data";

const DESCRIPTION =
  "Bhimraj Yadav is a software engineer in Kathmandu, Nepal. He leads product teams at Fetchly Labs, helps maintain Lightning AI's open-source tools, and has published in IEEE Access.";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: DESCRIPTION,
  path: "/about",
  ownCard: true,
});

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={[
          buildAboutPageJsonLd(DESCRIPTION),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <AboutIntro />

      <SectionSeparator />
      <PageSection id="path">
        <SectionHeading
          index="01"
          eyebrow="The path so far"
          title="Where I am now, and how I got here"
          description="The short version, newest first."
          action={{ href: "/oss", label: "The full open-source journey" }}
        />
        <PathTimeline />
      </PageSection>

      <SectionSeparator />
      <PageSection id="toolbox">
        <SectionHeading index="02" eyebrow="Toolbox" title="What I reach for" />
        <Toolbox />
      </PageSection>

      <SectionSeparator />
      <PageSection id="education">
        <SectionHeading
          index="03"
          eyebrow="Education"
          title="Where I studied"
        />
        <Education />
      </PageSection>

      <SectionSeparator />
      <PageSection id="kind-words">
        <SectionHeading
          index="04"
          eyebrow="Kind words"
          title="From the people I build with"
          description="A few words from clients, the Lightning AI team and fellow maintainers."
        />
        <KindWords />
      </PageSection>

      <ContactSection index="05" />
    </main>
  );
}
