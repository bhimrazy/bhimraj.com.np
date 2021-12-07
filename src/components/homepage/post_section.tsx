export default function PostSection() {
  const post_content = {
    title: 'Featured Posts',
    description: 'Some of the most visited posts of mine.',
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
        title: '',
        slug: '',
        description: '',
        thumbnail_url: '',
        link: '',
        tags: ['', ''],
        reading_time: '',
        views: '',
        published_at: '',
      },
    ],
  }
  return (
    <section className="flex flex-col justify-center text-left space-y-8 py-2 ">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">{post_content?.title}</h2>
        <p className="text-gray-500">{post_content?.description}</p>
      </div>
    </section>
  )
}
