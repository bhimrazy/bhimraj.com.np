import Link from "next/link";
import Theme from "./theme";
export default function Header() {
  const top_bar = "all lives matter";
  const icon_name = "Bhimraj Yadav";
  const nav_items = [
    { title: "Home", is_home: true, link: "/" },
    { title: "Blog", link: "/blog" },
    { title: "Projects", link: "/" },
    { title: "About", link: "/" },
  ];
  const button_content = "Sign up ->";
  return (
    <>
      <p className="cursor-pointer bg-gray-50 py-2 text-center text-sm font-medium uppercase tracking-widest  dark:bg-black">
        {top_bar}
      </p>
      <header className="sticky top-0 z-10 flex w-full flex-col place-content-center border-t border-b bg-white dark:border-gray-900 dark:bg-black">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 xl:px-0">
          <Link href="/">
            <a className="text-base font-medium uppercase tracking-wider text-gray-900 dark:text-gray-100">
              {icon_name}
            </a>
          </Link>
          <ul className="hidden space-x-2 font-medium text-gray-600 dark:text-gray-100 sm:flex sm:space-x-4 md:space-x-5 lg:space-x-6">
            {nav_items.map((item, idx) => (
              <Link href={item?.link} key={idx}>
                <a>
                  <li
                    className={`${
                      item?.is_home ? "text-gray-900 dark:text-gray-100" : ""
                    } cursor-pointer hover:text-blue-500 dark:hover:text-blue-400`}
                  >
                    {item?.title}
                  </li>
                </a>
              </Link>
            ))}
          </ul>
          <div className="flex flex-row items-center space-x-3 divide-x divide-gray-600 dark:divide-gray-600">
            <Theme />
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
