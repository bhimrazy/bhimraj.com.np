export const NAV_LINKS = [
  { label: "Open Source", href: "/oss" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
];

/** The nav entry owning the current URL, or null when none matches. */
export function activeNavHref(pathname: string): string | null {
  return (
    NAV_LINKS.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.href ?? null
  );
}
