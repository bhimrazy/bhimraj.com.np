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
        link: '',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '',
        views: '',
        published_at: '',
      },
      {
        title: 'How to Build and Deploy an Image Recognition App',
        slug: '',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        link: '',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '',
        views: '',
        published_at: '',
      },
      {
        title: 'How to Build and Deploy an Image Recognition App',
        slug: '',
        description:
          'Hi 👏 I am Bhimraj Yadav. In this video, I have tried to build and deploy an Image Recognition App.',
        thumbnail_url: 'https://i3.ytimg.com/vi/7Rm5mGhYWVI/maxresdefault.jpg',
        link: '',
        tags: ['pytorch', 'python', 'fastapi'],
        reading_time: '',
        views: '',
        published_at: '',
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
              <article className="flex flex-col rounded-lg border shadow-sm hover:shadow-lg overflow-hidden transition-all">
                <div>
                  <Image
                    src={post?.thumbnail_url}
                    blurDataURL={post?.thumbnail_url}
                    height={1080}
                    width={1920}
                    placeholder="blur"
                    alt={post?.title}
                  />
                </div>
                <div className="flex flex-col text-gray-600 p-4 space-y-1">
                  <h2 className="text-lg font-bold hover:text-gray-800">{post?.title}</h2>
                  <p className="text-gray-700 line-clamp-3">{post?.description}</p>
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
