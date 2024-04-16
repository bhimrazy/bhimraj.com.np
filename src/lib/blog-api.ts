import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import path from "path";


const POSTS_PATH = path.join(process.cwd(), "src", "content", "blog");
export const getPosts = () =>
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

// const SITE_INFO = path.join(process.cwd(), "src", "content", "site-info.md");
// export const getSiteInfo = async (): Promise<SiteInfo> => {
//   const source = await fs.promises.readFile(SITE_INFO, 'utf-8');
//   const { content, data } = matter(source);
//   return data as SiteInfo;
// };