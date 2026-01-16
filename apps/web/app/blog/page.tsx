import { getAllPosts, getCategoriesWithCounts } from "../../lib/blog";
import { BlogListingClient } from "../../components/blog/BlogListingClient";

export const metadata = {
  title: "Blog | Karsilo",
  description:
    "Stay up to date with the latest product updates, tutorials, and company news from the Karsilo team.",
};

export default function BlogPage() {
  // Fetch data on the server
  const posts = getAllPosts();
  const categories = getCategoriesWithCounts();

  // Pass data to client component for interactivity
  return <BlogListingClient initialPosts={posts} categories={categories} />;
}
