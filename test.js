const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const POSTS_PATH = path.join(process.cwd(),'src','content','blog')
const get_posts = ()=> fs.readdirSync(POSTS_PATH).filter((path) => /\.mdx?$/.test(path)).map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
    const { content, data } = matter(source)
    return {
        slug: filePath.replace(".mdx", ""),
        data,
        content
    }
})
console.log(get_posts())