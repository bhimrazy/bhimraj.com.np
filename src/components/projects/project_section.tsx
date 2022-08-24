import { Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function ProjectSection({ projects }) {
  const projects_content = {
    title: "Projects",
    description: "Some of my recent projects",
    projects,
  };
  return (
    <section className="relative flex flex-col py-10">
      <div className="space-y-2 py-12 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-5xl">
          {projects_content?.title}
        </h1>
        <p className="text-base text-slate-700 dark:text-slate-400">
          {projects_content?.description}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects_content?.projects.map((project: Project, idx) => (
          <Link
            key={idx}
            href="/project/[slug]/"
            as={`/project/${project.slug}/`}
          >
            <a className={`${idx === 0 ? "md:col-span-2" : ""}`}>
              <article className="bg-gray-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-row space-x-2">
                    {project?.data?.tags.split(",").map((tag: string, i) => (
                      <span key={i} className="bg-gray-200 p-2 text-xs font-medium uppercase tracking-wider dark:bg-slate-700 dark:text-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className={`grid grid-cols-1${
                      idx === 0 ? " md:grid-cols-2" : ""
                    } gap-6`}
                  >
                    <div className="relative aspect-video">
                      <Image
                        loading="eager"
                        className="h-full w-full object-cover"
                        src={project?.data?.image}
                        blurDataURL={project?.data?.image}
                        layout="responsive"
                        height={1080}
                        width={1920}
                        alt={project?.data?.title}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <h3 className="prose mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                        {project?.data?.title}
                      </h3>
                      <dl>
                        <dt className="sr-only">Date</dt>
                        <dd className="text-sm font-semibold leading-6 text-gray-700 dark:text-slate-400">
                          <time dateTime={project?.data?.published_at}>
                            {project?.data?.published_at}
                          </time>
                        </dd>
                      </dl>
                      <p
                        className={`${
                          idx === 0 ? "line-clamp-4" : "line-clamp-2"
                        } mb-6 text-gray-600 dark:text-slate-400`}
                      >
                        {project?.data?.description}
                      </p>
                      <div className="flex justify-end pt-2">
                        <Link
                          href="/project/[slug]/"
                          as={`/project/${project.slug}/`}
                        >
                          <a className="group inline-flex h-9 items-center whitespace-nowrap rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500">
                            Read more
                            <svg
                              className="ml-3 overflow-visible text-slate-300 group-hover:text-slate-400 dark:text-slate-500 dark:group-hover:text-slate-400"
                              width="3"
                              height="6"
                              viewBox="0 0 3 6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M0 0L3 3L0 6"></path>
                            </svg>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
