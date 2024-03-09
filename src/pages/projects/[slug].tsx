import Layout from "src/components/layout";
import { GetStaticProps, GetStaticPaths } from "next";
import { getProjects, getSiteInfo } from "@/lib/info";
import { Project, SiteInfo } from "@/lib/types";
import Link from "next/link";
import { useSiteUrl } from "@/lib/helper";

export default function ProjectDetail({
  site_info,
  project,
}: {
  site_info: SiteInfo;
  project: Project;
}) {
  const meta_data = {
    title: project?.data?.title + " | Bhimraj Yadav",
    description: project?.data?.description,
    image: project?.data?.image,
    url: useSiteUrl(),
    createdAt: project?.data?.published_at,
  };

  const project_content = project.content.split("\n").splice(1).join("\n");
  return (
    <Layout meta_data={meta_data} site_info={site_info}>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2  lg:left-3/4"></div>
        <section className="flex flex-col py-6">
          <article className="flex flex-col">
            <div className="space-y-2 py-10 text-center">
              <div className="flex justify-start">
                <Link href="/projects" className="group flex cursor-pointer font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                  <svg
                    viewBox="0 -9 3 24"
                    className="mr-3 h-6 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  >
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
                {project?.data?.tags.split(",").map((tag: string, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 p-2 text-xs font-medium uppercase tracking-wider dark:bg-slate-700 dark:text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-left text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-4xl">
                {project?.data?.title}
              </h1>
              <div className="flex flex-row space-x-2 text-left">
                <span>
                  by{" "}
                  <Link
                    className="text-blue-600"
                    href={site_info?.github}
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
                    <time dateTime={project?.data?.published_at}>
                      {project?.data?.published_at}
                    </time>
                  </dd>
                </dl>
              </div>
            </div>

            <div className="flex w-full flex-col items-center ">
              <div
                className="prose prose-slate max-w-xs overflow-hidden whitespace-normal break-words dark:prose-invert dark:text-slate-400 sm:max-w-md lg:max-w-2xl"
                dangerouslySetInnerHTML={{ __html: project_content }}
              ></div>
            </div>
          </article>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getProjects().map((project) => {
    return {
      params: {
        slug: project.slug,
      },
    };
  });
  return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: site_info } = getSiteInfo();
  const project = getProjects().find((project) => project.slug === params.slug);
  return {
    props: {
      site_info,
      project,
    },
  };
};
