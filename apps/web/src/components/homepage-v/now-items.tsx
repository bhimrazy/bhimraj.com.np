import Link from "next/link";
import type { NowItem } from "./facts";

const linkClass =
  "rounded-sm text-site-text underline decoration-site-accent/40 decoration-1 underline-offset-4 transition-colors hover:text-site-accent hover:decoration-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

function Item({ text, note, href }: NowItem) {
  const name = !href ? (
    <span className="text-site-text">{text}</span>
  ) : href.startsWith("/") ? (
    <Link href={href} className={linkClass}>
      {text}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {text}
    </a>
  );
  return (
    <>
      {name}
      {note && <span className="text-site-text-tertiary"> · {note}</span>}
    </>
  );
}

/** A "Currently" row's items, one per line. */
export function NowItems({ items }: { items: readonly NowItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.text}>
          <Item {...item} />
        </li>
      ))}
    </ul>
  );
}
