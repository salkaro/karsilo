import type { Metadata } from "next";
import PlansClient from "./PlansClient";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Simple, transparent pricing for Karsilo. Choose from Starter ($29/mo), Growth ($79/mo), or Enterprise plans. All plans include a 14-day free trial with no credit card required.",
  keywords: [
    "Karsilo pricing",
    "Stripe dashboard pricing",
    "SaaS analytics pricing",
    "subscription plans",
    "revenue tracking plans",
    "multi-Stripe account pricing",
  ],
  openGraph: {
    title: "Pricing Plans | Karsilo",
    description:
      "Simple, transparent pricing starting at $29/mo. Track all your Stripe accounts in one dashboard. 14-day free trial, no credit card required.",
    url: "https://karsilo.com/plans",
    type: "website",
    images: [
      {
        url: "/og/og-plans.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo Pricing Plans - Starter, Growth, and Enterprise tiers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | Karsilo",
    description:
      "Simple, transparent pricing starting at $29/mo. Track all your Stripe accounts in one dashboard.",
    images: ["/og/og-plans.jpg"],
  },
};

export default function PlansPage() {
  return <PlansClient />;
}
