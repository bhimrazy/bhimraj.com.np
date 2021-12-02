export default function Header() {
  const top_bar = 'Accelerating our mission to give rich content. →'
  const nav_items = [
    { title: 'Home', is_home: true },
    { title: 'Blog' },
    { title: 'Projects' },
    { title: 'Library' },
    { title: 'About' },
  ]
  const button_content = 'Sign up ->'
  return (
    <>
      <p className="text-sm font-medium text-center py-2 bg-gray-50 border-b cursor-pointer">
        {top_bar}
      </p>
      <header className="flex flex-col bg-white sticky top-0 w-full place-content-center border-b">
        <nav className="flex justify-between px-4 py-4 xl:px-0 w-full max-w-5xl mx-auto items-center">
          <ul className="flex space-x-2 sm:space-x-4 md:space-x-5 lg:space-x-6 font-medium text-gray-600">
            {nav_items.map((item, idx) => (
              <li
                className={`${
                  item?.is_home ? 'text-gray-800' : ''
                } hover:text-gray-900 cursor-pointer`}
                key={idx}
              >
                {item?.title}
              </li>
            ))}
          </ul>
          <button className="bg-blue-600  text-white text-sm sm:text-base px-3 py-[6px] rounded-md hover:bg-white border border-opacity-0 hover:border-opacity-100 hover:text-blue-700 border-blue-600">
            {button_content}
          </button>
        </nav>
      </header>
    </>
  )
}
