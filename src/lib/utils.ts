import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_PATH = path.join(process.cwd(), "src", "content", "blog");
export const get_posts = () =>
  fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path))
    .map((filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
      const { content, data } = matter(source);
      const html = marked.parse(content);
      return {
        slug: filePath.replace(".mdx", ""),
        data,
        content: html,
      };
    });
