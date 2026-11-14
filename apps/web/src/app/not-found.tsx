import { Container } from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header/header";
import { ArrowLink, PageHeader } from "@/components/section-heading";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/oss", label: "Open source" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70dvh] pt-32 pb-24">
        <Container className="px-4 sm:px-8">
          <PageHeader
            eyebrow="404"
            title="This page doesn't exist"
            description="It may have moved, or the link has a typo. These are good places to start."
          />
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <ArrowLink href={link.href}>{link.label}</ArrowLink>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
