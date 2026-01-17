import type { Metadata } from "next";
import { LandingHero } from "../components/dom/landing-hero";
import { TrustedBy } from "../components/dom/trusted-by";
import { Features } from "../components/dom/features";
import { StatsSection } from "../components/dom/stats-section";
import { HowItWorks } from "../components/dom/how-it-works";
import { CTASection } from "../components/dom/cta-section";

export const metadata: Metadata = {
  title: "Karsilo | Your Single Source of Truth for Stripe",
  description:
    "Aggregate all your Stripe accounts into one powerful dashboard. Finally know exactly how much money you're making across every product, every entity, every account.",
  keywords: [
    "Stripe dashboard",
    "multi-Stripe accounts",
    "revenue tracking",
    "MRR analytics",
    "subscription management",
    "payment aggregation",
    "SaaS metrics dashboard",
  ],
  openGraph: {
    title: "Karsilo | Your Single Source of Truth for Stripe",
    description:
      "Aggregate all your Stripe accounts into one powerful dashboard. Finally know exactly how much money you're making across every product, every entity, every account.",
    url: "https://karsilo.com",
    type: "website",
    images: [
      {
        url: "/og/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo Dashboard - Unified Stripe Revenue Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karsilo | Your Single Source of Truth for Stripe",
    description:
      "Aggregate all your Stripe accounts into one powerful dashboard. Track revenue across every product and account.",
    images: ["/og/og-home.jpg"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <LandingHero />
      <TrustedBy />
      <Features />
      <StatsSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
