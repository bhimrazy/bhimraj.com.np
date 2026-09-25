import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AtAGlance } from "@/components/about/at-a-glance";
import { SOCIAL_LINKS } from "@/components/about/data";
import { FocusAreas } from "@/components/about/focus-areas";
import { GetInTouch } from "@/components/about/get-in-touch";
import { KindWords } from "@/components/about/kind-words";
import { PathTimeline } from "@/components/about/path-timeline";
import { Toolbox } from "@/components/about/toolbox";
import { siteConfig } from "@/config/site";

const TITLE = "About — Bhimraj Yadav";
const DESCRIPTION =
  "Software engineer in Kathmandu, Nepal. Building production software at Fetchly Labs, on the LitData core team and a Tier 2 OSS contributor at Lightning AI, and an IEEE Access–published researcher.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: TITLE,
    description: DESCRIPTION,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.handle,
  },
};

/** schema.org ProfilePage — helps search engines connect the profiles. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${siteConfig.url}/about`,
  mainEntity: {
    "@type": "Person",
    name: siteConfig.author.name,
    alternateName: siteConfig.author.username,
    jobTitle: siteConfig.author.designation,
    image: `${siteConfig.url}${siteConfig.author.avatar}`,
    url: siteConfig.url,
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
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  },
};

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from site config, with `<` escaped
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
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
