import { SiteInfo } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./logo";
import Theme from "./theme";

export default function Header({ site_info }: { site_info: SiteInfo }) {
  const router = useRouter();
  const nav_items = [
    { title: "Home", link: "/" },
    { title: "Blog", link: "/blog" },
    { title: "Projects", link: "/projects" },
  ];
  return (
    <>
      <Link href="https://consciousplanet.org/">
        <a rel="noreferrer" target="_blank">
          <p className="z-[1] cursor-pointer bg-white/90 py-2 text-center text-sm font-normal tracking-widest text-lime-700 backdrop-blur transition hover:text-lime-800 dark:bg-slate-900/75 dark:text-white">
            {site_info?.tagline}
          </p>
        </a>
      </Link>
      <header className="sticky top-0 z-10 flex w-full flex-col place-content-center border-t border-b bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 xl:px-0">
          <Link href="/">
            <a>
              {/* {icon_name} */}
              <Logo site_info={site_info} />
            </a>
          </Link>
          <ul className="hidden space-x-2 font-medium text-slate-600 dark:text-slate-100 sm:flex sm:space-x-4 md:space-x-5 lg:space-x-6">
            {nav_items.map((item, idx) => (
              <Link href={item?.link} key={idx}>
                <a>
                  <li
                    className={`${
                      item?.link === router.asPath
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-500 dark:text-slate-400"
                    } cursor-pointer text-base hover:text-slate-700 dark:hover:text-slate-300`}
                  >
                    {item?.title}
                  </li>
                </a>
              </Link>
            ))}
          </ul>
          <div className="flex flex-row items-center space-x-3 divide-x divide-slate-600 dark:divide-slate-600">
            <Theme />
            {/* Github Logo */}
            <span className="pl-3">
              <svg
                viewBox="0 0 16 16"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
