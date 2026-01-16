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

// Month names for consistent formatting
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Format date for display - uses manual formatting to avoid hydration mismatch
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = MONTH_NAMES[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}
