import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import NavItem from "@/components/nav-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export default function Header() {
  const navItems = [
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
        passHref
      >
        <p className="z-1 cursor-pointer bg-white/90 py-2 text-center font-normal text-lime-700 text-sm tracking-widest backdrop-blur-xs transition hover:text-lime-800 dark:bg-slate-900/75 dark:text-white">
          {siteConfig.tagline}
        </p>
      </Link>
      <header className="sticky top-0 z-10 flex w-full flex-col place-content-center border-t border-b bg-white/90 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/75">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 xl:px-0">
          <Link href="/" passHref>
            <Logo />
          </Link>
          <ul className="hidden space-x-2 font-medium text-slate-600 sm:flex sm:space-x-4 md:space-x-5 lg:space-x-6 dark:text-slate-100">
            {navItems.map((item, _idx) => (
              <Link href={item?.link} key={item?.link} passHref>
                <NavItem link={item.link} title={item.title} />
              </Link>
            ))}
          </ul>
          <div className="flex flex-row items-center gap-2">
            {/* Github Logo */}
            <Button variant="ghost" size="icon">
              <GitHubLogoIcon className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
