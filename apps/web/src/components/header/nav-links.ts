export const NAV_LINKS = [
  { label: "Open Source", href: "/oss" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
];

/** Header menus lead with Home; the footer lists it on its own. */
export const MENU_LINKS = [{ label: "Home", href: "/" }, ...NAV_LINKS];

/** The nav entry owning the current URL, or null when none matches. */
export function activeNavHref(pathname: string): string | null {
  if (pathname === "/") return "/";
  return (
    NAV_LINKS.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.href ?? null
  );
}
