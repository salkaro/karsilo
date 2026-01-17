// Types that can be safely used in client components
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

// Categories constant
export const BLOG_CATEGORIES: BlogCategory[] = [
  "Product Updates",
  "Tutorials",
  "Company News",
];

// Format date for display - safe for client
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
