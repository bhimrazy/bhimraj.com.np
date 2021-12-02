
export default function Header() {
    const nav_items = [
        "Home", "Blog", "Projects", "Library", "About"
    ]
    const button_content = "Sign up ->"
    return (
        <header className="flex bg-white sticky top-0 w-full place-content-center border-b py-4 ">
            <nav className="flex justify-between px-4 lg:px-0 w-full max-w-7xl mx-auto items-center">
                <ul className="flex space-x-2 font-medium text-gray-700">
                    {nav_items.map((item, idx) => (
                        <li className="hover:text-gray-900 cursor-pointer" key={idx}>{item}</li>
                    ))}
                </ul>
                <button className="bg-blue-600 text-white px-3 py-[6px] rounded-md hover:bg-white border border-opacity-0 hover:border-opacity-100 hover:text-blue-700 border-blue-600">
                    {button_content}
                </button>
            </nav>
        </header>
    )
}
