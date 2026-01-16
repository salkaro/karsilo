import type { Metadata } from "next";
import { getAllPosts, getCategoriesWithCounts } from "../../lib/blog";
import { BlogListingClient } from "../../components/blog/BlogListingClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stay up to date with the latest product updates, tutorials, and company news from the Karsilo team. Learn about Stripe analytics, MRR tracking, and revenue optimization.",
  keywords: [
    "Karsilo blog",
    "Stripe analytics",
    "SaaS metrics",
    "MRR tracking",
    "revenue analytics blog",
    "subscription business",
    "Stripe tips",
    "product updates",
  ],
  openGraph: {
    title: "Blog | Karsilo",
    description:
      "Product updates, tutorials, and insights on Stripe analytics and revenue tracking from the Karsilo team.",
    url: "https://karsilo.com/blog",
    type: "website",
    images: [
      {
        url: "/og/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo Blog - Stripe Analytics Insights and Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Karsilo",
    description:
      "Product updates, tutorials, and insights on Stripe analytics and revenue tracking.",
    images: ["/og/og-blog.jpg"],
  },
};

export default function BlogPage() {
  // Fetch data on the server
  const posts = getAllPosts();
  const categories = getCategoriesWithCounts();

  // Pass data to client component for interactivity
  return <BlogListingClient initialPosts={posts} categories={categories} />;
}
