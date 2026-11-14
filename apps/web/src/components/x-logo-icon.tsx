import type { SVGProps } from "react";

/**
 * The X (formerly Twitter) mark, sized like a Radix icon (15×15 by default).
 * Radix only ships the old bird, so every X link uses this instead.
 */
export function XLogoIcon({
  width = 15,
  height = 15,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
