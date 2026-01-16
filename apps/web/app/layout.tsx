// Local Imports
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { Providers } from "./providers";

// Styles
import { Inter } from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karsilo.com"),
  title: {
    default: "Karsilo | #1 Multi-Stripe Account Monitor",
    template: "%s | Karsilo",
  },
  description:
    "Aggregate all your Stripe accounts into one powerful dashboard. Track MRR, revenue, and customers across every product, entity, and account in real-time.",
  keywords: [
    "Stripe dashboard",
    "multi-Stripe management",
    "revenue analytics",
    "MRR tracking",
    "subscription analytics",
    "Stripe aggregator",
    "payment monitoring",
    "SaaS metrics",
    "recurring revenue",
    "Stripe accounts",
  ],
  authors: [{ name: "Karsilo" }],
  creator: "Karsilo",
  publisher: "Karsilo",
  icons: {
    icon: "/KarsiloLogo.png",
    apple: "/KarsiloLogo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Karsilo",
    title: "Karsilo | #1 Multi-Stripe Account Monitor",
    description:
      "Aggregate all your Stripe accounts into one powerful dashboard. Track MRR, revenue, and customers across every product, entity, and account in real-time.",
    images: [
      {
        url: "/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Karsilo - Multi-Stripe Account Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karsilo | #1 Multi-Stripe Account Monitor",
    description:
      "Aggregate all your Stripe accounts into one powerful dashboard. Track MRR, revenue, and customers in real-time.",
    images: ["/og/og-default.jpg"],
    creator: "@karsilo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar />
            <main className="flex-1 w-full pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
