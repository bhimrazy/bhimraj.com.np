import React from "react";
import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-gray-50 w-full">
      <div className="flex flex-row justify-between items-center  container mx-auto px-20 py-6 ">
        <Link href="/">
          <a
            title="Bhimraj Yadav"
            className="font-semibold text-xl md:text-2xl xl:3xl"
          >
            Bhimraj
          </a>
        </Link>
        <nav className="">
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
        <button className="hidden" title="Menu"></button>
      </div>
    </header>
  );
}
