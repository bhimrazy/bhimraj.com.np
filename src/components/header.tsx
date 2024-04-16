import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import NavItem from "@/components/nav-item";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function Header() {
  const nav_items = [
    { title: "Home", link: "/" },
    { title: "Blog", link: "/blog" },
    { title: "Projects", link: "/projects" },
  ];

  return (
    <>
      <Link
        href="https://consciousplanet.org/"
        rel="noreferrer"
        target="_blank"
      >
        <p className="z-[1] cursor-pointer bg-white/90 py-2 text-center text-sm font-normal tracking-widest text-lime-700 backdrop-blur transition hover:text-lime-800 dark:bg-slate-900/75 dark:text-white">
          {siteConfig.tagline}
        </p>
      </Link>
      <header className="sticky top-0 z-10 flex w-full flex-col place-content-center border-b border-t bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 xl:px-0">
          <Link href="/">
            <Logo />
          </Link>
          <ul className="hidden space-x-2 font-medium text-slate-600 dark:text-slate-100 sm:flex sm:space-x-4 md:space-x-5 lg:space-x-6">
            {nav_items.map((item, idx) => (
              <Link href={item?.link} key={idx}>
                <NavItem link={item.link} title={item.title} />
              </Link>
            ))}
          </ul>
          <div className="flex flex-row items-center space-x-3 divide-x divide-slate-600 dark:divide-slate-600">
            {/* Github Logo */}
            <Button variant="ghost" size="icon">
              <GitHubLogoIcon className="h-5 w-5" />
            </Button>

            <span className="pl-3">
              <ModeToggle />
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
