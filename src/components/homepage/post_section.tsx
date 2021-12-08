import Image from 'next/image'
import Link from 'next/link'

export default function PostSection() {
  const post_content = {
    title: 'Featured Posts',
    description: 'Some of the most visited posts of mine.',
    see_more: 'See more post',
    posts: [
      {
        title: 'How to Build and Deploy an Image Recognition App',
        slug: '',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        link: '/',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '5 min read',
        views: '200 views',
        published_at: 'November 12, 2021',
      },
      {
        title: 'How to Build and Deploy an Image Recognition App',
        slug: '',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        link: '/',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '5 min read',
        views: '200 views',
        published_at: 'November 12, 2021',
      },
      {
        title: 'How to Build and Deploy an Image Recognition App',
        slug: '',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        link: '/',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '5 min read',
        views: '200 views',
        published_at: 'November 12, 2021',
      },
      //   {
      //     title: '',
      //     slug: '',
      //     description: '',
      //     thumbnail_url: '',
      //     link: '',
      //     tags: ['', ''],
      //     reading_time: '',
      //     views: '',
      //     published_at: '',
      //   },
    ],
  }
  return (
    <section className="flex flex-col justify-center text-left space-y-8 py-2 ">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">{post_content?.title}</h2>
        <p className="text-gray-500">{post_content?.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {post_content?.posts.map((post, idx) => (
          <Link href={post?.link} key={idx}>
            <a target="_blank">
              <article className="flex flex-col rounded-lg border shadow-xs hover:shadow-lg overflow-hidden transition-all">
                <div className="rounded-lg overflow-hidden">
                  <Image
                  className="p-1 h-10"
                    src={post?.thumbnail_url}
                    blurDataURL={post?.thumbnail_url}
                    height={1080}
                    width={1920}
                    placeholder="blur"
                    alt={post?.title}
                  />
                </div>
                <div className="flex flex-col text-gray-600 p-4 space-y-2">
                  <h2 className="text-lg font-bold text-gray-800 hover:text-gray-900">
                    {post?.title}
                  </h2>
                  <span className="font-semibold text-gray-800">{post?.published_at}</span>
                  <div className="flex flex-row space-x-3 font-medium">
                    <div className="flex flex-row space-x-1 items-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{post?.reading_time}</span>
                    </div>
                    <div className="flex flex-row space-x-1 items-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{post?.views}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{post?.description}</p>
                </div>
              </article>
            </a>
          </Link>
        ))}
      </div>
      <div>
        <button className="px-8 py-2 rounded-lg shadow-sm hover:shadow transition-all bg-white border font-semibold text-base ">
          {post_content?.see_more}
        </button>
      </div>
    </section>
  )
}
