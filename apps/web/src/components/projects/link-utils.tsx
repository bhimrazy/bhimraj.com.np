/**
 * Shared UTM tagging + external-link icon used by the project list and
 * project detail page. Kept in one place so the two don't drift.
 */

const UTM =
  "utm_source=bhimraj.com.np&utm_medium=portfolio&utm_campaign=projects";

export function withUtm(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${UTM}`;
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
