import { MDXContent } from "@content-collections/mdx/react";
import { allBlogPosts } from "content-collections";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CodeCopyButtons from "@/components/blog/code-copy-buttons";
import MobileToc from "@/components/blog/mobile-toc";
import PostEnd from "@/components/blog/post-end";
import { coverInBody, getPost, splitDek } from "@/components/blog/posts";
import ReadingProgress from "@/components/blog/reading-progress";
import ShareSidebar from "@/components/blog/share-sidebar";
import SponsorCard from "@/components/blog/sponsor-card";
import TitleSection from "@/components/blog/title-section";
import Toc from "@/components/blog/toc";
import { Container } from "@/components/container";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ads } from "@/config/ads";
import { siteConfig } from "@/config/site";
import { extractToc } from "@/lib/toc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p._meta.path === slug);
  if (!post) notFound();

  const blogURL = `/blog/${post?._meta.path}`;
  const images = post?.image
    ? [
        {
          url: post.image,
          width: 1920,
          height: 1080,
          alt: post.title,
          type: "image/png",
        },
      ]
    : [];

  return {
    title: post?.title,
    description: post?.description,
    alternates: { canonical: blogURL },
    keywords: post?.tags,
    openGraph: {
      title: post?.title,
      description: post?.description,
      url: blogURL,
      siteName: siteConfig.name,
      authors: siteConfig.author.name,
      images,
      publishedTime: post?.publishedAt,
      modifiedTime: post?.updatedAt,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title,
      description: post?.description,
      creator: siteConfig.author.handle,
      images,
      site: siteConfig.author.handle,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post._meta.path }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { dek, body } = splitDek(post.html);
  const tocItems = extractToc(body);
  const postUrl = `${siteConfig.url}/blog/${post._meta.path}`;
  const showCover = Boolean(post.image) && !coverInBody(post);

  return (
    <main id="top" className="pt-28 pb-24 sm:pt-32">
      <ReadingProgress targetId="post-body" />
      <CodeCopyButtons />

      <Container className="px-5 sm:px-8">
        {/* Wide screens: TOC rail | article | share rail. The side rails are
            equal so the reading column sits on the page's optical centre. */}
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-wide))_minmax(0,1fr)] xl:gap-12">
          <aside className="hidden xl:block">
            <div className="sticky top-28 ml-auto max-w-52">
              <Toc items={tocItems} />
              {ads[0]?.enabled && <SponsorCard ad={ads[0]} />}
            </div>
          </aside>

          <article className="mx-auto min-w-0 max-w-wide xl:mx-0">
            <TitleSection blog={post} dek={dek} />

            {showCover && (
              <figure className="mb-12 overflow-hidden rounded-xl border border-site-border dark:border-white/6">
                <Image
                  src={post.image}
                  alt=""
                  width={1920}
                  height={1080}
                  preload
                  sizes="(min-width: 768px) 736px, 100vw"
                  className="h-auto w-full"
                />
              </figure>
            )}

            <MobileToc items={tocItems} className="xl:hidden" />

            <div id="post-body" className="prose article-prose max-w-none">
              <MDXContent code={post.mdx} components={mdxComponents} />
            </div>

            <PostEnd post={post} url={postUrl} />
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-28 w-fit">
              <ShareSidebar title={post.title} url={postUrl} />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
