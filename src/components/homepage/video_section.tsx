import Image from 'next/image'
import Link from 'next/link'

export default function VideoSection() {
  const video_content = {
    title: 'Recent Videos',
    description: "Videos on what I'm building and learning.",
    videos: [
      {
        title: 'How to Build and Deploy an Image Recognition App using FastAPI and PyTorch ?',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App using FastAPI and PyTorch.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        video_url: 'https://www.youtube.com/watch?v=7Rm5mGhYWVI',
        height: '1080',
        width: '1920',
      },
      {
        title: 'SendStack Clone with NextJs & Tailwind CSS',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to implement a design from dribble.com by James using Next JS & Tailwind CSS.',
        thumbnail_url: 'https://i3.ytimg.com/vi/Zn8aqyGYG4Q/maxresdefault.jpg',
        video_url: 'https://www.youtube.com/watch?v=Zn8aqyGYG4Q',
        height: '1080',
        width: '1920',
      },
    ],
  }
  return (
    <section className="flex flex-col justify-center text-left space-y-8 py-2 ">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">{video_content?.title}</h2>
        <p className="text-gray-500">{video_content?.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {video_content?.videos.map((video, idx) => (
          <Link href={video?.video_url} key={idx}>
            <a target="_blank">
              <div className="relative">
                <Image
                  className="rounded-lg hover:shadow-md hover:opacity-95 transition-all"
                  src={video?.thumbnail_url}
                  placeholder="blur"
                  blurDataURL={video?.thumbnail_url}
                  alt={video?.title}
                  width={video?.width}
                  height={video?.height}
                  loading="eager"
                />
                <div className="absolute inset-y-0 inset-x-[41%] flex items-center">
                  <svg
                    className="w-16 h-16 text-gray-50 hover:text-red-500 transition-all"
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
              <div className="flex flex-col text-gray-600 py-2 space-y-1">
                <h2 className="text-lg font-bold hover:text-gray-800 line-clamp-1">
                  {video?.title}
                </h2>
                <p className="text-gray-700 line-clamp-2">{video?.description}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  )
}
