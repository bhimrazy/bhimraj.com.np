import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const SITE_INFO = path.join(process.cwd(), "src", "content", "site-info.md");

export const getSiteInfo = () => {
  const source = fs.readFileSync(SITE_INFO);
  const { content, data } = matter(source);
  return {
    data,
  };
};

const PROJECTS_PATH = path.join(process.cwd(), "src", "content", "projects");
export const getProjects = () =>
  fs
    .readdirSync(PROJECTS_PATH)
    .filter((path) => /\.md?$/.test(path))
    .map((filePath) => {
      const source = fs.readFileSync(path.join(PROJECTS_PATH, filePath));
      const { content, data } = matter(source);
      const html = marked.parse(content);
      return {
        slug: filePath.replace(".md", ""),
        data: data,
        content: html,
      };
    })
    .sort(function (a, b) {
      var dateA = new Date(a.data.published_at), dateB = new Date(b.data.published_at)
      return dateB - dateA
    });

export const getYoutubeData = async () => {
  const res = await fetch(process.env.YOUTUBE_API_URL)
  const data = await res.json()

  return data?.items.map((video) => {

    return {
      title: video?.snippet?.title,
      description: video?.snippet?.description,
      published_at: video?.snippet?.publishedAt,
      thumbnail: video?.snippet?.thumbnails?.default?.url.replace("default", "maxresdefault")
    }
  })
}