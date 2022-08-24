import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_INFO = path.join(process.cwd(), "src", "content", "site-info.md");

export const getSiteInfo = () => {
  const source = fs.readFileSync(SITE_INFO);
  const { content, data } = matter(source);
  return {
    data,
  };
};
