import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { postHref, sortedPosts } from "@/components/blog/posts";
import { Container } from "@/components/container";
import { formatDate } from "@/lib/utils";

export default function PostNotFound() {
  return (
    <main className="pt-32 pb-24">
      <Container>
        <div className="mx-auto max-w-measure">
          <p className="mb-3 font-medium font-mono text-[13px] text-site-accent uppercase tracking-[1.5px]">
            404
          </p>
          <h1 className="text-balance font-bold font-display text-4xl text-site-text leading-tight tracking-tight">
            This post doesn&apos;t exist
          </h1>
          <p className="mt-4 text-site-text-secondary">
            It may have moved, or the link has a typo. Here&apos;s what&apos;s
            on the blog instead.
          </p>

          <ul className="mt-10 divide-y divide-site-border border-site-border border-y">
            {sortedPosts.slice(0, 5).map((post) => (
              <li key={post._meta.path}>
                <Link
                  href={postHref(post)}
                  className="group block rounded-sm py-4 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
                >
                  <span className="block font-display font-semibold text-site-text transition-colors group-hover:text-site-accent">
                    {post.title}
                  </span>
                  <span className="mt-1 block font-mono text-site-text-tertiary text-xs">
                    {formatDate(post.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/blog"
            className="group mt-8 inline-flex items-center gap-2 rounded-sm font-mono text-site-text-secondary text-xs uppercase tracking-[1.5px] transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4"
          >
            <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
            All writing
          </Link>
        </div>
      </Container>
    </main>
  );
}
