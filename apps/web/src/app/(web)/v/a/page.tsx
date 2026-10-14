import type { Metadata } from "next";
import HomepageA from "@/components/homepage-v/a";

export const metadata: Metadata = {
  title: "Homepage exploration A: Index",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomepageA />;
}
