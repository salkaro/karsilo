import { Providers } from "./providers";

import type { Metadata } from "next";

// Styles
import { Inter } from "next/font/google";
import "@/styles/globals.css"
import "@/styles/animations.css"


const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Karsilo | #1 Multi-Stripe Account Monitor",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
            <body className={`${inter.className} h-full`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
