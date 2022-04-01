import Link from 'next/link'
import Theme from './theme'
export default function Header() {
  const top_bar = 'all lives matter'
  const icon_name = 'Bhimraj Yadav'
  const nav_items = [
    { title: 'Home', is_home: true, link: '/' },
    { title: 'Blog', link: '/blog' },
    { title: 'Projects', link: '/' },
    { title: 'About', link: '/' },
  ]
  const button_content = 'Sign up ->'
  return (
    <>
      <p className="text-sm tracking-widest uppercase font-medium text-center py-2 bg-gray-50 dark:bg-black  cursor-pointer">
        {top_bar}
      </p>
      <header className="flex flex-col bg-white dark:bg-black sticky top-0 z-10 w-full place-content-center border-t border-b dark:border-gray-900">
        <nav className="flex justify-between px-4 py-4 xl:px-0 w-full max-w-5xl mx-auto items-center">
          <Link href="/">
            <a className="text-base font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {icon_name}
            </a>
          </Link>
          <ul className="hidden sm:flex space-x-2 sm:space-x-4 md:space-x-5 lg:space-x-6 font-medium text-gray-600 dark:text-gray-100">
            {nav_items.map((item, idx) => (
              <Link href={item?.link} key={idx}>
                <a>
                  <li
                    className={`${
                      item?.is_home ? 'text-gray-900 dark:text-gray-100' : ''
                    } hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer`}
                  >
                    {item?.title}
                  </li>
                </a>
              </Link>
            ))}
          </ul>
         <Theme/>
        </nav>
      </header>
    </>
  )
}
