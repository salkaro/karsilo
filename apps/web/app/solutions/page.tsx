import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Karsilo solutions for solo founders, agencies, holding companies, and marketplaces. One dashboard for unlimited Stripe account management with tailored features for every use case.",
  keywords: [
    "Stripe solutions",
    "multi-account Stripe",
    "solo founder tools",
    "agency Stripe management",
    "holding company analytics",
    "marketplace payment tracking",
    "revenue dashboard",
    "SaaS analytics platform",
  ],
  openGraph: {
    title: "Solutions | Karsilo",
    description:
      "One dashboard, endless possibilities. Solutions for solo founders, agencies, holding companies, and marketplaces to manage multiple Stripe accounts.",
    url: "https://karsilo.com/solutions",
    type: "website",
    images: [
      {
        url: "/og/og-solutions.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo Solutions - For Founders, Agencies, Holding Companies, and Marketplaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solutions | Karsilo",
    description:
      "One dashboard, endless possibilities. Tailored solutions for every Stripe use case.",
    images: ["/og/og-solutions.jpg"],
  },
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
