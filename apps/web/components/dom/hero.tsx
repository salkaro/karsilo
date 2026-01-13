import { Box, Container, Flex, Heading, Stack, Text, Button, HStack } from '@repo/ui/index';
import Link from 'next/link';

interface HeroProps {
    badge?: {
        icon?: string;
        text: string;
    };
    title: string;
    highlightedText: string;
    description: string;
    primaryButton: {
        label: string;
        href: string;
    };
    secondaryButton?: {
        label: string;
        href: string;
    };
}

export function Hero({
    badge = {
        icon: '🚀',
        text: '100K+ Top Investors Added',
    },
    title = 'Unlock Investor',
    highlightedText = 'Connections in 2 mins',
    description = 'Access our comprehensive databases to find detailed contact information for over 100K+ VC and angel investors from top global markets.',
    primaryButton = {
        label: 'Get Started Now',
        href: '/sign-up',
    },
    secondaryButton = {
        label: 'Watch Demo',
        href: '/demo',
    },
}: HeroProps) {
    return (
        <Box
            as="section"
            py={{ base: 16, md: 24 }}
            bg="gradient-to-b"
            bgGradient="linear(to-b, brand.50, white)"
        >
            <Container maxW="container.xl">
                <Flex
                    direction="column"
                    align="center"
                    textAlign="center"
                    gap={8}
                >
                    {/* Badge */}
                    {badge && (
                        <Box
                            px={4}
                            py={2}
                            bg="brand.100"
                            borderRadius="full"
                            fontSize="sm"
                            fontWeight="medium"
                            color="brand.700"
                        >
                            {badge.icon && <Box as="span" mr={2}>{badge.icon}</Box>}
                            {badge.text}
                        </Box>
                    )}

                    {/* Heading */}
                    <Stack gap={2}>
                        <Heading
                            as="h1"
                            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                            fontWeight="bold"
                            lineHeight="1.1"
                            color="gray.900"
                        >
                            {title}
                        </Heading>
                        <Heading
                            as="h2"
                            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                            fontWeight="bold"
                            lineHeight="1.1"
                            color="brand.600"
                        >
                            {highlightedText}
                        </Heading>
                    </Stack>

                    {/* Description */}
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="gray.600"
                        maxW="3xl"
                        lineHeight="1.8"
                    >
                        {description}
                    </Text>

                    {/* CTA Buttons */}
                    <HStack gap={4} flexWrap="wrap" justify="center">
                        <Button
                            size="lg"
                            px={8}
                            py={6}
                            fontSize="lg"
                            bg="brand.600"
                            color="white"
                        >
                            <Link href={primaryButton.href}>
                                {primaryButton.label}
                            </Link>
                        </Button>
                        {secondaryButton && (
                            <Button
                                size="lg"
                                px={8}
                                py={6}
                                fontSize="lg"
                                variant="outline"
                                borderColor="gray.900"
                                color="gray.900"
                                _hover={{ bg: 'gray.50' }}
                            >

                                <Link href={primaryButton.href}>
                                    {secondaryButton.label}
                                </Link>
                            </Button>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}
