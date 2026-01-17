// Local Imports
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { Providers } from "./providers";

// Styles
import { Inter } from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";
import { GA_MEASUREMENT_ID } from "../components/lib/analytics";
import { AnalyticsPageview } from "../components/analytics-pageview";
import Script from "next/script";

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

                {GA_MEASUREMENT_ID && process.env.NODE_ENV === 'production' && (
                    <>
                        <Script
                            strategy="afterInteractive"
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        />
                        <Script
                            id="google-analytics"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${GA_MEASUREMENT_ID}', {
                                        page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
                <Providers>
                    <AnalyticsPageview />
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
