import Image from "next/image";
import { cn } from "@/lib/utils";

export type Logo =
  | { src: string; srcDark: string; mono?: never }
  | { src: string; srcDark?: never; mono: true };

export const LOGOS = {
  fetchly: { src: "/logos/fetchly.svg", mono: true },
  lightning: {
    src: "/logos/lightning-light.svg",
    srcDark: "/logos/lightning-dark.svg",
  },
  stablecluster: {
    src: "/logos/stablecluster-blue.svg",
    srcDark: "/logos/stablecluster-white.svg",
  },
} as const satisfies Record<string, Logo>;

/**
 * Theme-aware company logo. `mono` logos are recoloured to the text colour;
 * the others swap between a light- and dark-mode asset.
 */
export function CompanyLogo({
  logo,
  company,
  className = "h-6 sm:h-7",
}: {
  logo: Logo;
  company: string;
  className?: string;
}) {
  const alt = `${company} logo`;
  if (logo.mono) {
    return (
      <Image
        src={logo.src}
        alt={alt}
        width={160}
        height={32}
        className={cn(
          "filter-[brightness(0)] dark:filter-[brightness(0)_invert(1)] w-auto opacity-90",
          className,
        )}
      />
    );
  }
  return (
    <>
      <Image
        src={logo.src}
        alt={alt}
        width={160}
        height={32}
        className={cn("w-auto dark:hidden", className)}
      />
      <Image
        src={logo.srcDark}
        alt={alt}
        width={160}
        height={32}
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}
