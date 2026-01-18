"use client"

import { root } from "@repo/constants"
import { Box, Button, Grid, Heading, Text, VStack } from "@repo/ui"
import { useRouter } from "next/navigation"
import DemoChartsAndMetrics from "./demo-charts-and-metrics"

const NotFoundInfo = () => {
    const router = useRouter()

    return (
        <Grid minH="100vh" templateColumns={{ base: "1fr", lg: "2fr 3fr" }}>
            {/* Left Side - Not Found Info */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="100vh"
                bg="background"
                px={4}
            >
                <VStack gap={6} textAlign="center" maxW="md">
                    <Box>
                        <Heading
                            fontSize={{ base: "6xl", md: "8xl" }}
                            fontWeight="bold"
                            color="primary"
                            lineHeight="1"
                        >
                            404
                        </Heading>
                        <Heading
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="semibold"
                            mt={2}
                        >
                            Page Not Found
                        </Heading>
                    </Box>

                    <Text color="muted.foreground" fontSize={{ base: "md", md: "lg" }}>
                        Oops! The page you&apos;re looking for doesn&apos;t exist.
                        It might have been moved or deleted.
                    </Text>

                    <VStack gap={3} width="full" mt={2}>
                        <Button
                            onClick={() => router.push(`${root}/login`)}
                            colorScheme="blue"
                            size="lg"
                            width="full"
                        >
                            Go Back Home
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            size="lg"
                            width="full"
                        >
                            Go Back
                        </Button>
                    </VStack>
                </VStack>
            </Box>

            {/* Right Side - Revenue Info */}
            <DemoChartsAndMetrics />
        </Grid>
    )
}

export default NotFoundInfo
