import Layout from "src/components/layout";
import { GetStaticProps } from "next";
import { getProjects, getSiteInfo } from "@/lib/info";
import { SiteInfo } from "@/lib/types";
import ProjectSection from "@/components/projects/project_section";
import { getSiteUrl } from "@/lib/helper";

export default function Projects({
  site_info,
  projects,
}: {
  site_info: SiteInfo;
  projects: any;
}) {
  const meta_data = {
    ...site_info,
    title: "Projects | " + site_info?.title,
    description:
      "This is the projects page where you can find some of my recent projects with all the details. " +
      site_info?.description,
    url: getSiteUrl(),
  };
  return (
    <Layout site_info={site_info} meta_data={meta_data}>
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 xl:px-0">
        <div className="absolute -top-28 left-0 hidden h-full w-28 -rotate-45 bg-gradient-to-r from-indigo-600/80 via-sky-600/75 to-purple-600/80 blur-[150px] dark:block md:left-1/2 lg:left-3/4"></div>
        <ProjectSection projects={projects} />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: site_info } = getSiteInfo();
  const projects = getProjects();
  return {
    props: {
      site_info,
      projects,
    },
  };
};
