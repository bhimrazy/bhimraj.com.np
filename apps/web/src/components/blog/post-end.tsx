import {
  ArrowRightIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn, formatDate, getReadingTime } from "@/lib/utils";
import {
  type BlogPost,
  getRelatedPosts,
  postHref,
  type RelatedPost,
  tagLabel,
} from "./posts";
import ShareSidebar from "./share-sidebar";
import SubscribeForm from "./subscribe-form";

const kicker =
  "font-medium font-mono text-[11px] uppercase tracking-[1.5px] text-site-text-tertiary";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

/** Everything after the article body: tags, share, author, subscribe, next reads. */
export default function PostEnd({
  post,
  url,
}: {
  post: BlogPost;
  url: string;
}) {
  const related = getRelatedPosts(post);

  return (
    <footer className="mt-16 sm:mt-20">
      {/* End mark + tags + share */}
      <div className="mx-auto max-w-measure">
        <div aria-hidden className="mb-10 flex items-center gap-3">
          <span className="h-px flex-1 bg-site-border" />
          <span className="size-1.5 rotate-45 bg-site-accent" />
          <span className="h-px flex-1 bg-site-border" />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {post.tags.length > 0 && (
            <div className="min-w-0">
              <p className={cn(kicker, "mb-3")}>Filed under</p>
              <ul className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-site-border px-2 py-0.5 font-mono text-[11px] text-site-text-secondary"
                  >
                    {tagLabel(tag)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* xl+ has the sticky share rail beside the article instead. */}
          <div className="shrink-0 xl:hidden">
            <ShareSidebar
              title={post.title}
              url={url}
              orientation="horizontal"
            />
          </div>
        </div>
      </div>

      {/* Author + subscribe */}
      <section
        aria-labelledby="about-author"
        className="mx-auto mt-12 max-w-measure overflow-hidden rounded-2xl border border-site-border bg-site-card dark:border-white/6 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary"
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 p-6 sm:items-start sm:gap-x-5 sm:p-7">
          <Image
            src={siteConfig.author.avatar}
            alt=""
            width={56}
            height={56}
            className="size-12 shrink-0 rounded-full object-cover ring-1 ring-site-border sm:row-span-2 sm:size-14"
          />
          <div>
            <p className={cn(kicker, "mb-1")}>Written by</p>
            <h2
              id="about-author"
              className="font-display font-semibold text-lg text-site-text"
            >
              {siteConfig.author.name}
            </h2>
          </div>
          <div className="col-span-2 mt-4 sm:col-span-1 sm:col-start-2 sm:mt-0">
            <p className="text-site-text-secondary text-sm leading-relaxed sm:mt-2">
              {siteConfig.description}
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {[
                {
                  href: siteConfig.links.github,
                  label: "GitHub",
                  Icon: GitHubLogoIcon,
                },
                {
                  href: siteConfig.links.twitter,
                  label: "X",
                  Icon: XLogoIcon,
                },
                {
                  href: siteConfig.links.linkedin,
                  label: "LinkedIn",
                  Icon: LinkedInLogoIcon,
                },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-sm text-site-text-secondary transition-colors hover:text-site-accent",
                      focusRing,
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-site-border border-t bg-site-bg-secondary/50 p-6 sm:p-7 dark:border-white/6 dark:bg-site-bg/40">
          <h2 className="font-display font-semibold text-base text-site-text">
            Get the next post in your inbox
          </h2>
          <p className="mt-1 mb-4 text-site-text-secondary text-sm leading-relaxed">
            Notes on software engineering, OSS, and AI research — sent only when
            I ship or learn something worth sharing.
          </p>
          <SubscribeForm />
        </div>
      </section>

      {related.length > 0 && <KeepReading related={related} />}
    </footer>
  );
}

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.633 5.905-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function KeepReading({ related }: { related: RelatedPost[] }) {
  const single = related.length === 1;

  return (
    <section
      aria-labelledby="keep-reading"
      className="mx-auto mt-16 max-w-wide"
    >
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2
          id="keep-reading"
          className="font-bold font-display text-site-text text-xl"
        >
          Keep reading
        </h2>
        <Link
          href="/blog"
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-sm font-mono text-site-text-secondary text-xs transition-colors hover:text-site-accent",
            focusRing,
          )}
        >
          All writing
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>

      <ul className={cn("grid gap-4", !single && "sm:grid-cols-2")}>
        {related.map(({ post, reason }) => (
          <li key={post._meta.path}>
            <Link
              href={postHref(post)}
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-xl border border-site-border bg-site-card transition-colors hover:border-site-border-hover dark:border-white/6 dark:hover:border-white/12",
                single && "sm:flex-row",
                focusRing,
              )}
            >
              <div
                className={cn(
                  "relative aspect-video shrink-0 overflow-hidden border-site-border border-b bg-site-bg-secondary dark:border-white/6",
                  single && "sm:aspect-auto sm:w-2/5 sm:border-r sm:border-b-0",
                )}
              >
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 320px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className={cn(kicker, "mb-2 text-site-accent")}>{reason}</p>
                <h3 className="text-pretty font-display font-semibold text-base text-site-text leading-snug transition-colors group-hover:text-site-accent">
                  {post.title}
                </h3>
                <p className="mt-auto pt-4 font-mono text-site-text-tertiary text-xs">
                  {formatDate(post.publishedAt)} · {getReadingTime(post.html)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
