import { Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function ProjectSection({ projects }) {
  const featured_content = {
    title: "Featured Projects",
    description: "Some projects that I'm proud of.",
    project: {
      title: "Image Recognition App using FastAPI and PyTorch",
      description:
        "This is an image recognition application based on the FastAPI framework and PyTorch which uses pretrained DenseNet 121 model to detect the image.",
      thumbnail_url:
        "https://pbs.twimg.com/card_img/1508111716827414533/4RMUmnce?format=jpg&name=large",
      repo_url:
        "https://github.com/bhimrazy/Image-Recognition-App-using-FastAPI-and-PyTorch",
      height: "160",
      width: "320",
    },
  };
  return (
    <section className="flex flex-col justify-center space-y-2 pt-8 text-left dark:invert">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">
          {featured_content?.title}
        </h2>
        <p className="text-gray-500">{featured_content?.description}</p>
      </div>

      <div className="flex flex-col gap-6 sm:ml-2">
        {projects.slice(0, 3).map((project: Project, idx) => (
          <Link
            key={idx}
            href="/projects/[slug]/"
            as={`/projects/${project.slug}/`}
            className="flex flex-col justify-between sm:flex-row"
          >
              <div className="flex max-w-2xl flex-col space-y-1 py-2 text-gray-600">
                <h2 className="text-xl font-bold hover:text-gray-800">
                  {project?.data?.title}
                </h2>
                <p className="max-w-lg text-gray-700 line-clamp-2">
                  {project?.data?.description}
                </p>
              </div>
              <div className="relative aspect-video h-48 overflow-hidden rounded-lg border transition-all hover:shadow sm:h-24">
                <Image
                  src={project?.data?.image}
                  placeholder="blur"
                  blurDataURL={project?.data?.image}
                  alt={project?.data?.title}
                  layout="fill"
                  loading="eager"
                />
              </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
