import React, { useState } from "react";
import Link from "next/link";
export default function Header() {
  const [menu, setMenu] = useState(false);
  const handleClick = () => {
    setMenu((v) => !v);
  };
  return (
    <header className="bg-gray-50 w-full">
      <div
        className={`${
          menu ? `block` : `hidden`
        } sm:hidden absolute min-h-screen w-screen bg-teal-400 z-50 flex flex-col p-6 transition ease-in-out duration-500`}
      >
        <button
          className=" p-6 absolute top-0 right-0"
          title="Menu"
          onClick={handleClick}
        >
          <svg
            className="w-10 h-10 focus:outline-none text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <nav className="text-white justify-center items-center mt-20">
          <ul className="flex flex-col transition-all duration-500">
            <Link href="/">
              <li className="hover:opacity-80 cursor-pointer px-6 py-5 bg-teal-300 ">
                <a>Home</a>
              </li>
            </Link>
            <Link href="/">
              <li className="hover:opacity-80 cursor-pointer px-6 py-5 bg-teal-300 ">
                <a>About</a>
              </li>
            </Link>
            <Link href="/">
              <li className="hover:opacity-80 cursor-pointer px-6 py-5 bg-teal-300 ">
                <a>Contact</a>
              </li>
            </Link>
          </ul>
        </nav>
      </div>
      <div className="flex flex-row justify-between items-center  container mx-auto px-8 sm:px-20 py-6 ">
        <Link href="/">
          <a
            title="Bhimraj Yadav"
            className="font-semibold text-xl md:text-2xl xl:3xl"
          >
            Bhimraj<span className="sm:hidden px-2 text-cyan-500">Yadav</span>
          </a>
        </Link>
        <nav className=" hidden sm:block">
          <ul className="flex flex-row space-x-4 transition-all duration-500">
            <li className="hover:opacity-80 cursor-pointer">
              <a>Home</a>
            </li>
            <li className="hover:opacity-80 cursor-pointer">
              <a>About</a>
            </li>
            <li className="hover:opacity-80 cursor-pointer">
              <a>Contact</a>
            </li>
          </ul>
        </nav>
        <button className="sm:hidden" title="Menu" onClick={handleClick}>
          <svg
            className="w-6 h-6 focus:outline-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
