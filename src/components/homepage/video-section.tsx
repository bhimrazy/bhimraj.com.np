import Image from "next/image";
import Link from "next/link";

type YoutubeData = {
  items: {
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: {
          url: string;
        };
      };
    };
    id: {
      videoId: string;
    };
  }[];
};

type Video = {
  title: string;
  description: string;
  published_at: string;
  thumbnail_url: string;
  video_url: string;
};
export default async function VideoSection() {
  const video_content = {
    title: "Most Viewed Videos",
    description: "Videos on what I'm building and learning.",
    videos: [
      {
        title:
          "How to Build and Deploy an Image Recognition App using FastAPI and PyTorch ?",
        description:
          "Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App using FastAPI and PyTorch.",
        thumbnail_url: "https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg",
        video_url: "https://www.youtube.com/watch?v=7Rm5mGhYWVI",
        height: "1080",
        width: "1920",
      },
      {
        title: "SendStack Clone with NextJs & Tailwind CSS",
        description:
          "Hi 👏 I am Bhimraj Yadav. In this video, I have tried to implement a design from dribble.com by James using Next JS & Tailwind CSS.",
        thumbnail_url: "https://i3.ytimg.com/vi/Zn8aqyGYG4Q/maxresdefault.jpg",
        video_url: "https://www.youtube.com/watch?v=Zn8aqyGYG4Q",
        height: "1080",
        width: "1920",
      },
    ],
  };

  const res = await fetch(process.env.YOUTUBE_API_URL!);
  const youtubeData: YoutubeData = await res.json();
  const videos: Video[] = youtubeData?.items?.map((video) => {
    return {
      title: video?.snippet?.title,
      description: video?.snippet?.description,
      published_at: video?.snippet?.publishedAt,
      thumbnail_url: video?.snippet?.thumbnails?.default?.url.replace(
        "default",
        "maxresdefault"
      ),
      video_url: "https://www.youtube.com/watch?v=" + video?.id?.videoId,
    };
  });
  return (
    <section className="flex flex-col justify-center space-y-8 py-2 text-left dark:invert">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">
          {video_content?.title}
        </h2>
        <p className="text-gray-500">{video_content?.description}</p>
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:ml-2">
        {videos?.slice(0, 4).map((video, idx: number) => (
          <Link href={video?.video_url} key={idx} target="_blank" passHref>
            <div className="relative">
              <Image
                className="rounded-lg transition-all hover:opacity-95 hover:shadow-md"
                src={video?.thumbnail_url}
                placeholder="blur"
                blurDataURL={video?.thumbnail_url}
                alt={video?.title}
                width={1920}
                height={1080}
                loading="eager"
              />
              <div className="absolute inset-x-[41%] inset-y-0 flex items-center">
                <svg
                  className="h-16 w-16 text-gray-50 transition-all hover:text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col space-y-1 py-2 text-gray-600">
              <h2 className="line-clamp-1 text-lg font-bold hover:text-gray-800">
                {video?.title}
              </h2>
              <p className="line-clamp-2 text-gray-700">{video?.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
