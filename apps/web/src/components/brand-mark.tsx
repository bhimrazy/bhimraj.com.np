import { MARK_CUT, RIDGE_PATH, SUN } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Ridge-and-sun mark: the ridge takes the text colour, the sun the accent. */
export function BrandMark({
  size = 28,
  className,
  sunClassName,
}: {
  size?: number;
  className?: string;
  sunClassName?: string;
}) {
  const cut = size <= 20 ? MARK_CUT.small : MARK_CUT.regular;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d={RIDGE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={cut.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={SUN.cx}
        cy={SUN.cy}
        r={cut.sunR}
        className={cn("fill-site-accent", sunClassName)}
      />
    </svg>
  );
}

/** "bhimraj" with the amber dot that matches the sun. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("tracking-tight", className)}>
      bhimraj
      <span
        aria-hidden
        className="ml-[0.07em] inline-block size-[0.26em] rounded-full bg-site-accent"
      />
    </span>
  );
}
