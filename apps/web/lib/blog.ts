import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// Types - exported for use in client components
export type BlogCategory = "Product Updates" | "Tutorials" | "Company News";

export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: BlogCategory;
  author: BlogAuthor;
  image: string;
  readingTime: number;
  content: string;
}

export interface BlogPostMeta
  extends Omit<BlogPost, "content" | "readingTime"> {
  readingTime: number;
}

// Path to blog content
const contentDirectory = path.join(process.cwd(), "../../content/blog");

// Calculate reading time (avg 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Get all post slugs
export function getPostSlugs(): string[] {
  try {
    const files = fs.readdirSync(contentDirectory);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Process markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      date: data.date || "",
      category: data.category || "Company News",
      author: {
        name: data.author?.name || "Karsilo Team",
        avatar: data.author?.avatar || "/authors/default.jpg",
      },
      image: data.image || "/blog/default-cover.jpg",
      readingTime: calculateReadingTime(content),
      content: contentHtml,
    };
  } catch {
    return null;
  }
}

// Get post metadata (without content) for listing pages
export function getPostMeta(slug: string): BlogPostMeta | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      date: data.date || "",
      category: data.category || "Company News",
      author: {
        name: data.author?.name || "Karsilo Team",
        avatar: data.author?.avatar || "/authors/default.jpg",
      },
      image: data.image || "/blog/default-cover.jpg",
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}

// Get all posts sorted by date (newest first)
export function getAllPosts(): BlogPostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostMeta(slug))
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

// Get posts by category
export function getPostsByCategory(category: BlogCategory): BlogPostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

// Get related posts (same category, excluding current post)
export function getRelatedPosts(
  currentSlug: string,
  category: BlogCategory,
  limit: number = 3
): BlogPostMeta[] {
  return getAllPosts()
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

// Get all categories with post counts
export function getCategoriesWithCounts(): {
  category: BlogCategory;
  count: number;
}[] {
  const posts = getAllPosts();
  const categories: BlogCategory[] = [
    "Product Updates",
    "Tutorials",
    "Company News",
  ];

  return categories.map((category) => ({
    category,
    count: posts.filter((post) => post.category === category).length,
  }));
}

// Format date for display - this can be used on client
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
