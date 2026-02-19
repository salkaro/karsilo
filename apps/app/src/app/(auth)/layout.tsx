// Local Imports
import { Providers } from "../providers";

// External Imports
import { Suspense } from "react";
import { Box, Flex, Spinner } from "@repo/ui";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Providers>
            <Box minH="100vh" bg="gray.50" position="relative" overflow="hidden">
                {/* Dot grid overlay */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.4}
                    backgroundImage="radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)"
                    backgroundSize="32px 32px"
                    pointerEvents="none"
                />

                {/* Decorative grey circles */}
                <Box
                    position="absolute"
                    top="-150px"
                    right="-100px"
                    width="400px"
                    height="400px"
                    bg="gray.200"
                    opacity={0.4}
                    borderRadius="full"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="-120px"
                    left="-80px"
                    width="350px"
                    height="350px"
                    bg="gray.200"
                    opacity={0.3}
                    borderRadius="full"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="30%"
                    left="-100px"
                    width="200px"
                    height="200px"
                    bg="gray.300"
                    opacity={0.2}
                    borderRadius="full"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="20%"
                    right="-60px"
                    width="180px"
                    height="180px"
                    bg="gray.200"
                    opacity={0.25}
                    borderRadius="full"
                    pointerEvents="none"
                />

                <Flex
                    minH="100vh"
                    justify="center"
                    align="center"
                    p={6}
                    position="relative"
                    zIndex={1}
                >
                    <Suspense fallback={
                        <Flex align="center" justify="center">
                            <Spinner />
                        </Flex>
                    }>
                        {children}
                    </Suspense>
                </Flex>
            </Box>
        </Providers>
    );
}
