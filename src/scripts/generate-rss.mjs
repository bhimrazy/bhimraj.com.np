import { writeFileSync } from 'fs';
import RSS from 'rss';
import { get_posts } from "../lib/utils.mjs";

async function generate() {
  const feed = new RSS({
    title: 'Bhimraj Yadav',
    site_url: 'https://bhimraj.com.np',
    feed_url: 'https://bhimraj.com.np/feed.xml'
  });
  const posts = get_posts();
  posts.map((post) => {
    feed.item({
      title: post.title,
      url: `https://bhimraj.com.np/blog/${post.slug}`,
      date: post.publishedAt,
      description: post.summary
    });
  });

  writeFileSync('./public/feed.xml', feed.xml({ indent: true }));
}

generate();