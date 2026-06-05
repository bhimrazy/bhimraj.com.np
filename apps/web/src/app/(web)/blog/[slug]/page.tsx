import { allBlogPosts } from "content-collections";
import type { Metadata } from "next";
import CodeCopyButtons from "@/components/blog/code-copy-buttons";
import ShareSidebar from "@/components/blog/share-sidebar";
import SponsorCard from "@/components/blog/sponsor-card";
import TitleSection from "@/components/blog/title-section";
import Toc from "@/components/blog/toc";
import { Container } from "@/components/container";
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
  // biome-ignore lint/style/noNonNullAssertion: guaranteed by generateStaticParams
  const post = allBlogPosts.find((p) => p._meta.path === slug)!;

  const tocItems = extractToc(post.html);
  const postUrl = `${siteConfig.url}/blog/${post._meta.path}`;

  return (
    <main className="pt-24 pb-20">
      <Container>
        {/* 3-column layout: TOC | Article | Share */}
        <div className="gap-10 lg:grid lg:grid-cols-[200px_1fr_52px]">
          {/* Left: sticky TOC + sponsor */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc items={tocItems} />
              {ads[0]?.enabled && <SponsorCard ad={ads[0]} />}
            </div>
          </aside>

          {/* Center: article */}
          <article className="min-w-0">
            <TitleSection blog={post} />
            <CodeCopyButtons />

            <div
              className="prose dark:prose-invert wrap-break-word max-w-none prose-headings:scroll-mt-24 overflow-hidden whitespace-normal prose-code:rounded prose-img:rounded-xl prose-pre:rounded-xl prose-img:border prose-pre:border prose-blockquote:border-l-site-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-headings:font-bold prose-headings:font-display prose-a:text-site-accent prose-code:text-[13px] prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-li:text-site-text-secondary prose-p:text-site-text-secondary prose-pre:text-[13px] prose-blockquote:not-italic prose-p:leading-relaxed prose-headings:tracking-tight prose-a:no-underline prose-code:before:content-none prose-code:after:content-none hover:prose-a:underline dark:prose-img:border-site-border dark:prose-pre:border-site-border dark:prose-code:text-site-text dark:prose-headings:text-site-text dark:prose-li:text-site-text-secondary dark:prose-p:text-site-text-secondary dark:prose-strong:text-site-text"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: MDX content is trusted
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </article>

          {/* Right: sticky share buttons */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ShareSidebar title={post.title} url={postUrl} />
            </div>
          </aside>
        </div>

        {/* Mobile: share row below article */}
        <div className="mt-12 flex items-center gap-3 border-site-border border-t pt-8 lg:hidden">
          <span className="font-mono text-site-text-tertiary text-xs">
            Share:
          </span>
          <ShareSidebar title={post.title} url={postUrl} />
        </div>
      </Container>
    </main>
  );
}
