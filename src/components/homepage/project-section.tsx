// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { allProjects } from "content-collections";

export default function ProjectSection() {
  const featuredContent = {
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
          {featuredContent?.title}
        </h2>
        <p className="text-gray-500">{featuredContent?.description}</p>
      </div>

      <div className="flex flex-col gap-6 sm:ml-2">
        {allProjects.slice(0, 3).map((project, idx) => (
          <Link
            key={idx}
            href="/projects/[slug]/"
            as={`/projects/${project._meta.path}/`}
            className="flex flex-col justify-between sm:flex-row"
            passHref
          >
            <div className="flex max-w-2xl flex-col space-y-1 py-2 text-gray-600">
              <h2 className="text-xl font-bold hover:text-gray-800">
                {project?.title}
              </h2>
              <p className="line-clamp-2 max-w-lg text-gray-700">
                {project?.description}
              </p>
            </div>
            <div className="relative aspect-video h-48 overflow-hidden rounded-lg border transition-all hover:shadow sm:h-24">
              <Image
                src={project?.image}
                placeholder="blur"
                blurDataURL={project?.image}
                alt={project?.title}
                width={192}
                height={108}
                loading="eager"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
