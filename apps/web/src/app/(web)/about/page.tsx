import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AtAGlance } from "@/components/about/at-a-glance";
import { SOCIAL_LINKS } from "@/components/about/data";
import { FocusAreas } from "@/components/about/focus-areas";
import { GetInTouch } from "@/components/about/get-in-touch";
import { KindWords } from "@/components/about/kind-words";
import { PathTimeline } from "@/components/about/path-timeline";
import { Toolbox } from "@/components/about/toolbox";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { buildPersonJsonLd, type JsonLdObject } from "@/lib/structured-data";

// The root layout's title template appends " · Bhimraj Yadav" to `title`;
// share cards get the full name.
const TITLE = "About · Bhimraj Yadav";
const DESCRIPTION =
  "Software engineer in Kathmandu, Nepal. Fetchly Labs, LitData core team, Tier 2 OSS contributor at Lightning AI, and IEEE Access–published researcher.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/about",
    title: TITLE,
    description: DESCRIPTION,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: siteConfig.author.handle,
  },
};

/** schema.org ProfilePage around the same Person the homepage declares. */
function profileJsonLd(): JsonLdObject {
  const { "@context": _context, ...person } = buildPersonJsonLd();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteConfig.url}/about`,
    mainEntity: {
      ...person,
      worksFor: { "@type": "Organization", name: "Fetchly Labs" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      knowsAbout: [
        "Machine learning infrastructure",
        "Model serving",
        "Computer vision",
        "PyTorch Lightning",
        "LitServe",
        "LitData",
      ],
      sameAs: [
        ...new Set([
          ...(person.sameAs as string[]),
          ...SOCIAL_LINKS.map((link) => link.href),
        ]),
      ],
    },
  };
}

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={profileJsonLd()} />
      <AboutHero />
      <AtAGlance />
      <PathTimeline />
      <FocusAreas />
      <Toolbox />
      <KindWords />
      <GetInTouch />
    </main>
  );
}
