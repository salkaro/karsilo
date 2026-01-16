import type { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";

export const metadata: Metadata = {
  title: "Resources & Help",
  description:
    "Karsilo resources, guides, tutorials, and help center. Learn how to connect Stripe accounts, understand analytics, manage billing, and integrate with other tools.",
  keywords: [
    "Karsilo help",
    "Stripe documentation",
    "revenue analytics guide",
    "MRR tutorial",
    "API documentation",
    "Karsilo support",
    "getting started guide",
    "integration guides",
  ],
  openGraph: {
    title: "Resources & Help | Karsilo",
    description:
      "Find guides, tutorials, API documentation, and help articles to get the most out of Karsilo's multi-Stripe account dashboard.",
    url: "https://karsilo.com/resources",
    type: "website",
    images: [
      {
        url: "/og/og-resources.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo Resources - Guides, Tutorials, and Help Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources & Help | Karsilo",
    description:
      "Find guides, tutorials, and help articles to get the most out of Karsilo.",
    images: ["/og/og-resources.jpg"],
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
