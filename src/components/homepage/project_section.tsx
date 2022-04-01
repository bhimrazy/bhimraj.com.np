import Image from "next/image";
import Link from "next/link";

export default function ProjectSection() {
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
    <section className="flex flex-col justify-center space-y-2 pt-8 text-left ">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">
          {featured_content?.title}
        </h2>
        <p className="text-gray-500">{featured_content?.description}</p>
      </div>
      <Link href={featured_content?.project?.repo_url}>
        <a
          target="_blank"
          className="flex flex-col justify-between sm:flex-row"
        >
          <div className="flex flex-col space-y-1 py-2 text-gray-600">
            <h2 className="text-xl font-bold hover:text-gray-800">
              {featured_content?.project?.title}
            </h2>
            <p className="max-w-md text-gray-700">
              {featured_content?.project?.description}
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border transition-all hover:shadow">
            <Image
              src={featured_content?.project?.thumbnail_url}
              placeholder="blur"
              blurDataURL={featured_content?.project?.thumbnail_url}
              alt={featured_content?.project?.title}
              width={featured_content?.project?.width}
              height={featured_content?.project?.height}
              loading="eager"
            />
          </div>
        </a>
      </Link>
    </section>
  );
}
