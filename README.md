<div align="center">
  <br/>
    <img src="https://user-images.githubusercontent.com/46085301/145169259-0ad36299-c8ae-460b-ac66-5cb7940f3c51.png" height="75" alt="Bhimraj Yadav Logo" />
  
  # bhimraj.com.np

**Personal Portfolio & Blog**

  <br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

[Website](https://bhimraj.com.np) • [Blog](https://bhimraj.com.np/blog) • [Projects](https://bhimraj.com.np/projects)

</div>

---

## 📖 About

This is the source code for my personal portfolio website, built with modern web technologies. The site showcases my projects, blog posts about AI/ML and software development, and provides a way to connect with me.

## ✨ Features

- 🎨 **Modern Design** - Clean, responsive UI with dark/light theme support
- 📝 **Blog** - MDX-powered blog posts with syntax highlighting
- 🚀 **Projects** - Showcase of personal and professional projects
- 📰 **Newsletter** - Email subscription integration
- 🔍 **SEO Optimized** - Meta tags, OpenGraph, and sitemap generation
- 📊 **RSS Feed** - Automatic RSS feed generation for blog posts
- ⚡ **Performance** - Built with Next.js 15 and Turbopack for blazing fast builds
- 🎯 **Type-Safe** - Full TypeScript support with strict type checking

## 🛠️ Tech Stack

| Category          | Technologies                                                         |
| ----------------- | -------------------------------------------------------------------- |
| **Framework**     | [Next.js 15](https://nextjs.org/) with App Router                    |
| **Language**      | [TypeScript](https://www.typescriptlang.org/)                        |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/) v4                          |
| **Content**       | [Content Collections](https://www.content-collections.dev/) with MDX |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) primitives                     |
| **Animations**    | [Motion](https://motion.dev/) (Framer Motion)                        |
| **Theme**         | [next-themes](https://github.com/pacocoursey/next-themes)            |
| **Code Quality**  | ESLint, Prettier, TypeScript, Husky                                  |
| **Runtime**       | [Bun](https://bun.sh/)                                               |
| **Deployment**    | [Vercel](https://vercel.com)                                         |

## 📁 Project Structure

```
bhimraj.com.np/
├── public/              # Static assets (images, fonts, icons)
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (web)/     # Main website routes
│   │   ├── api/       # API routes (newsletter, etc.)
│   │   └── feed.xml/  # RSS feed generation
│   ├── components/     # React components
│   │   ├── blog/      # Blog-specific components
│   │   ├── homepage/  # Homepage sections
│   │   ├── projects/  # Project showcase components
│   │   ├── seo/       # SEO components
│   │   └── ui/        # Reusable UI components
│   ├── config/        # Configuration files
│   ├── content/       # MDX blog posts and projects
│   ├── lib/           # Utility functions and types
│   └── types/         # TypeScript type definitions
├── .husky/            # Git hooks configuration
└── content-collections.ts  # Content collections config
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0 or later
- Node.js 18+ (for compatibility)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bhimrazy/bhimraj.com.np.git
   cd bhimraj.com.np
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your environment variables (newsletter API keys, analytics, etc.)

4. **Run the development server**

   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `bun run dev`          | Start development server with Turbopack                 |
| `bun run build`        | Build for production                                    |
| `bun run start`        | Start production server                                 |
| `bun run typecheck`    | Run TypeScript type checking                            |
| `bun run lint`         | Run ESLint                                              |
| `bun run lint:fix`     | Fix ESLint errors automatically                         |
| `bun run format:check` | Check code formatting with Prettier                     |
| `bun run format:write` | Format code with Prettier                               |
| `bun run check`        | Run all quality checks (typecheck, lint, format, build) |

## 🎨 Customization

### Adding a Blog Post

1. Create a new `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields:

   ```mdx
   ---
   title: "Your Post Title"
   publishedAt: "2025-01-15"
   summary: "Brief description"
   image: "/blog/your-image.jpg"
   ---

   Your content here...
   ```

### Adding a Project

1. Create a new `.mdx` file in `src/content/projects/`
2. Add frontmatter with required fields:

   ```mdx
   ---
   title: "Project Name"
   publishedAt: "2025-01-15"
   summary: "Project description"
   image: "/projects/project-image.jpg"
   ---

   Project details...
   ```

### Customizing Site Configuration

Edit `src/config/site.ts` to update:

- Site metadata (title, description, URLs)
- Social media links
- Navigation items
- Contact information

## 🔧 Development Workflow

This project uses:

- **Husky** for Git hooks
- **lint-staged** for running linters on staged files
- **ESLint** for code linting
- **Prettier** for code formatting

Pre-commit hooks automatically:

- Type check your code
- Lint and format staged files
- Ensure code quality before commits

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bhimrazy/bhimraj.com.np)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

Vercel will automatically deploy on every push to the main branch.

## 📝 License

This project is open source and available under the [MIT License](./LICENSE).

## 🤝 Contributing

While this is a personal portfolio, suggestions and bug reports are welcome! Feel free to open an issue or submit a pull request.

## 📧 Contact

- **Website**: [bhimraj.com.np](https://bhimraj.com.np)
- **GitHub**: [@bhimrazy](https://github.com/bhimrazy)
- **LinkedIn**: [@bhimrazy](https://linkedin.com/in/bhimrazy)
- **Twitter/X**: [@bhimrazyadav](https://twitter.com/bhimrazyadav)

---

<div align="center">
  Made with ❤️ by <a href="https://bhimraj.com.np">Bhimraj Yadav</a>
</div>
