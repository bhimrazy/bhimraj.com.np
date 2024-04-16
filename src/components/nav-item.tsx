"use client"

import { usePathname } from "next/navigation";

type Props = {
    link: string;
    title: string;
}

export default function NavItem({ link, title }: Props) {
    const pathname = usePathname();

    return (
        <li
            className={`${link === pathname
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400"
                } cursor-pointer text-base hover:text-slate-700 dark:hover:text-slate-300`}
        >
            {title}
        </li>
    )
}