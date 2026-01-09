import { allProjects } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allProjects.find((post) => post._meta.path === slug);

  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: `/blog/${post?._meta.path}`,
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
export async function generateStaticParams() {
  const paths = allProjects.map((project) => ({
    slug: project._meta.path,
  }));

  return paths;
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((project) => project._meta.path === slug);
  const projectContent = project?.html.split("\n").splice(1).join("\n") || "";
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
      <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-linear-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] md:left-1/2 lg:left-3/4 dark:block"></div>
      <section className="flex flex-col py-6">
        <article className="flex flex-col">
          <div className="space-y-2 py-10 text-center">
            <div className="flex justify-start">
              <Link
                href="/projects"
                className="group flex cursor-pointer font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                passHref
              >
                <svg
                  viewBox="0 -9 3 24"
                  className="mr-3 h-6 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  role="img"
                  aria-label="Back arrow"
                >
                  <title>Back arrow</title>
                  <path
                    d="M3 0L0 3L3 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Go back to projects
              </Link>
            </div>
            <div className="flex flex-row space-x-2">
              {project?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-200 p-2 font-medium text-xs uppercase tracking-wider dark:bg-slate-700 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-left font-extrabold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-slate-200">
              {project?.title}
            </h1>
            <div className="flex flex-row space-x-2 text-left">
              <span>
                by{" "}
                <Link
                  className="text-blue-600"
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  @bhimrazy
                </Link>
              </span>
              <span>on</span>
              <dl>
                <dt className="sr-only">Date</dt>
                <dd className="text-slate-700 dark:text-slate-400">
                  <time dateTime={project?.publishedAt}>
                    {project?.publishedAt}
                  </time>
                </dd>
              </dl>
            </div>
          </div>

          <div className="flex w-full flex-col items-center">
            <div
              className="prose prose-slate dark:prose-invert max-w-xs overflow-hidden whitespace-normal break-words sm:max-w-md lg:max-w-4xl dark:text-slate-400"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: MDX content is trusted
              dangerouslySetInnerHTML={{ __html: projectContent }}
            ></div>
          </div>
        </article>
      </section>
    </main>
  );
}
