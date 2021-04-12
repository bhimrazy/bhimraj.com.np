import React from "react";
import Link from "next/link";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="justify-center items-center space-x-8 px-8 space-y-2 flex flex-col md:flex-row py-9">
      <div className="flex flex-col space-y-8">
        <div className="space-y-10">
          <h1 className="text-4xl md:text-6xl  font-bold text-left">
            Hi,
            <br />
            I'am <br />
            <span className="text-indigo-600">Bhimraj</span>
            <br />
            <span className="">Software Developer</span>
          </h1>

          <Link href="mailto:bhimrajyadav977@gmail.com">
            <button
              title="Contact"
              className="bg-indigo-600 transition-all font-medium text-lg tracking-wider delay-50 hover:bg-indigo-500 text-white text-center w-10/12 sm:w-5/12 py-3 rounded-md focus:outline-none cursor-pointer"
            >
              Contact me
            </button>
          </Link>
        </div>
        <div className="flex flex-1 space-x-5">
          <Link href="https://www.linkedin.com/in/bhimrazy/">
            <a target="_blank">
              <Image
                className="h-8 w-8 shadow-md transition-all delay-100 hover:opacity-90 cursor-pointer"
                src="/social/linkedin.svg"
                alt="LinkedIn"
                width={30}
                height={30}
                loading="eager"
              />
            </a>
          </Link>
          <Link href="https://www.instagram.com/bhimrazyadav/">
            <a target="_blank">
              <Image
                className="h-8 w-8 shadow-md transition-all delay-100 hover:opacity-90 cursor-pointer"
                src="/social/instagram.svg"
                alt="Instagram"
                width={30}
                height={30}
                loading="eager"
              />
            </a>
          </Link>
          <Link href="https://www.twitter.com/bhimrazyadav/">
            <a target="_blank">
              <Image
                className="h-8 w-8 shadow-md transition-all delay-100 hover:opacity-90 cursor-pointer"
                src="/social/twitter.svg"
                alt="Twitter"
                width={30}
                height={30}
                loading="eager"
              />
            </a>
          </Link>
          <Link href="https://www.behance.net/bhimrazy">
            <a target="_blank">
              <Image
                className="h-8 w-8 shadow-md transition-all delay-100 hover:opacity-90 cursor-pointer"
                src="/social/behance.svg"
                alt="Behance"
                width={30}
                height={30}
                loading="eager"
              />
            </a>
          </Link>
          <Link href="https://github.com/bhimrazy">
            <a target="_blank">
              <Image
                className="h-8 w-8 shadow-md transition-all delay-100 hover:opacity-90 cursor-pointer"
                src="/social/github.svg"
                alt="Github"
                width={30}
                height={30}
                loading="eager"
              />
            </a>
          </Link>
        </div>
      </div>
      <div>
        <Image
          className="rounded-full bg-cover filter-grayscale"
          src="/bhimraj_yadav.png"
          alt="Bhimraj Yadav"
          width={350}
          height={350}
          loading="eager"
        />
      </div>
    </section>
  );
}
