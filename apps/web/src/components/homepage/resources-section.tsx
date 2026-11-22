import { Container } from "@/components/container";
import { PathCard } from "@/components/resources/path-card";
import { getPaths } from "@/components/resources/resources";
import { SectionHeading } from "@/components/section-heading";

/**
 * A teaser for /resources built only from the paths, so it needs no upkeep
 * and can't go stale. Renders nothing if every path is removed.
 */
export default function ResourcesSection({ index }: { index: string }) {
  const paths = getPaths();
  if (paths.length === 0) return null;

  return (
    <section id="resources" className="scroll-mt-20 pt-4 pb-20 sm:pb-24">
      <Container className="px-4 sm:px-8">
        <SectionHeading
          index={index}
          eyebrow="Learning"
          title="Resources"
          description="Courses, books and talks I'd point a friend to, and the order I'd take them in."
          action={{ href: "/resources", label: "Browse all resources" }}
        />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {paths.map((path) => (
            <li key={path.slug}>
              <PathCard path={path} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
