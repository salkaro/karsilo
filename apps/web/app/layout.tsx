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
  title: "Karsilo | #1 Multi-Stripe Account Monitor",
  description: "",
  icons: {
    icon: "/KarsiloLogo.png",
    apple: "/KarsiloLogo.png",
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
