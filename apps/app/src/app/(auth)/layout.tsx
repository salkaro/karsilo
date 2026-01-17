// Local Imports
import { Providers } from "../providers";
import ChartsAndMetrics from "@/components/ui/demo-charts-and-metrics";
import { shortenedTitle, title } from "@/constants/site";
import { Flex, Text, Avatar, Grid } from "@repo/ui";

// External Imports
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Onboarding | Karsilo",
    description: "Onboarding | Karsil",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Providers>
            <Grid minH="100vh" templateColumns={{ base: "1fr", lg: "2fr 3fr" }}>
                {/* Left Side - Auth Form */}
                <Flex
                    direction="column"
                    px={8}
                    py={12}
                    bg="white"
                >
                    <Flex mb={16} align="center" gap={3} maxW="420px" mx="auto" w="full">
                        <Avatar.Root size="sm" bg="transparent">
                            <Avatar.Image src="/logos/icon.svg" />
                            <Avatar.Fallback name={shortenedTitle} />
                        </Avatar.Root>
                        <Text fontSize="xl" fontWeight="600" color="gray.900">
                            {title}
                        </Text>
                    </Flex>

                    <Flex direction="column" flex={1} justify="center" maxW="420px" mx="auto" w="full">
                        <Suspense fallback={<div>Loading...</div>}>
                            {children}
                        </Suspense>
                    </Flex>
                </Flex>

                {/* Right Side - Revenue Info */}
                <ChartsAndMetrics />
            </Grid>
        </Providers>
    );
}