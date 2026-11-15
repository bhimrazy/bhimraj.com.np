import Image from "next/image";
import { Container } from "@/components/container";
import { PERSON } from "@/components/homepage/data";
import { ArrowLink, PageHeader } from "@/components/section-heading";

export function AboutIntro() {
  return (
    <section className="pt-28 pb-20 sm:pt-32 sm:pb-24">
      <Container className="px-4 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_268px] lg:gap-12">
          <PageHeader eyebrow="About" title="Hi, I'm Bhimraj.">
            <p className="mt-5 text-pretty font-display text-site-text text-xl leading-snug sm:text-2xl">
              I build products and help maintain the open-source tools teams use
              to train and serve models.
            </p>
            <div className="mt-6 space-y-4 text-pretty text-site-text-secondary leading-relaxed sm:text-[17px]">
              <p>
                I&apos;m a software engineer from Lahan, based in Kathmandu,
                Nepal. Since 2022 I&apos;ve been at{" "}
                <strong className="font-semibold text-site-text">
                  Fetchly Labs
                </strong>
                , where I lead the team that takes products and features from
                idea to launch, and build right alongside them.
              </p>
              <p>
                Since 2024 I&apos;ve also been part of the{" "}
                <strong className="font-semibold text-site-text">
                  Lightning AI
                </strong>{" "}
                open-source ecosystem: I&apos;m on the LitData core team, a Tier
                2 open-source contributor, and I&apos;ve cut releases of
                LitData, LitServe and PyTorch Lightning. I also advise teams on
                cloud infrastructure and deployment with StableCluster.
              </p>
              <p>
                On the research side, I co-authored a study of segmentation
                models in IEEE Access. Lately I&apos;m interested in small,
                efficient vision-language models that can run where doctors are
                scarce.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <ArrowLink href="/oss">My open-source journey</ArrowLink>
              <ArrowLink href="/research">Research</ArrowLink>
            </div>
          </PageHeader>

          {/* Phones: a small portrait above the bio, not after it. */}
          <figure className="order-first w-full max-w-32 sm:max-w-40 lg:order-none lg:max-w-67">
            <div className="relative aspect-268/330 overflow-hidden rounded-2xl border border-site-border shadow-2xl/20">
              <Image
                src={PERSON.portrait}
                alt={PERSON.name}
                fill
                sizes="(min-width: 1024px) 268px, 160px"
                className="object-cover"
                // Eager, not preloaded: above the fold on desktop, below the text on phones.
                loading="eager"
              />
            </div>
            <figcaption className="mt-3 hidden font-mono text-[11px] text-site-text-secondary lg:block">
              From Lahan · based in Kathmandu, Nepal
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
