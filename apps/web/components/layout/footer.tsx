'use client';

import { HStack, Stack, VStack, Box, Container, Grid, GridItem, Link, Separator } from '@repo/ui/index';


interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface FooterProps {
    logo?: React.ReactNode;
    sections?: FooterSection[];
    socialLinks?: SocialLink[];
    companyName?: string;
    showComplianceBadges?: boolean;
}

const defaultSections: FooterSection[] = [
    {
        title: 'Company',
        links: [
            { label: 'Plans', href: '/plans' },
            { label: 'Blog', href: '/blog' },
            { label: 'Team', href: '/team' },
            { label: 'Status', href: '/status' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Library', href: '/library' },
            { label: 'Guides', href: '/guides' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Help Center', href: '/help' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Security', href: '/security' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    },
];

const defaultSocialLinks: SocialLink[] = [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
];

export function Footer({
    logo,
    sections = defaultSections,
    socialLinks = defaultSocialLinks,
    companyName = 'Karsilo',
    showComplianceBadges = false,
}: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            as="footer"
            bg="gray.50"
            borderTop="1px"
            borderColor="gray.200"
            mt="auto"
        >
            <Container maxW="container.xl" py={12}>
                {/* Logo */}
                {logo && (
                    <Box mb={8}>
                        <Link href="/" textDecoration="none">
                            {logo}
                        </Link>
                    </Box>
                )}

                {/* Main Footer Content */}
                <Grid
                    templateColumns={{
                        base: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                    gap={8}
                    mb={8}
                >
                    {sections.map((section, index) => (
                        <GridItem key={index}>
                            <VStack align="flex-start" gap={3}>
                                <Box
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="gray.800"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                >
                                    {section.title}
                                </Box>
                                <Stack gap={2}>
                                    {section.links.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            href={link.href}
                                            fontSize="sm"
                                            color="gray.600"
                                            textDecoration="none"
                                            _hover={{ color: 'gray.800' }}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </Stack>
                            </VStack>
                        </GridItem>
                    ))}

                    {/* Social Links Column */}
                    <GridItem>
                        <VStack align="flex-start" gap={3}>
                            <Box
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.800"
                                textTransform="uppercase"
                                letterSpacing="wide"
                            >
                                Follow Us
                            </Box>
                            <Stack gap={2}>
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        fontSize="sm"
                                        color="gray.600"
                                        textDecoration="none"
                                        _hover={{ color: 'gray.800' }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <HStack gap={2}>
                                            {social.icon && <Box>{social.icon}</Box>}
                                            <Box>{social.label}</Box>
                                        </HStack>
                                    </Link>
                                ))}
                            </Stack>
                        </VStack>
                    </GridItem>
                </Grid>

                {/* Compliance Badges */}
                {showComplianceBadges && (
                    <Box mb={6}>
                        <HStack gap={4} flexWrap="wrap">
                            <Box fontSize="xs" color="gray.500" fontWeight="semibold">
                                GDPR Compliant
                            </Box>
                            <Box fontSize="xs" color="gray.500" fontWeight="semibold">
                                CCPA Compliant
                            </Box>
                            <Box fontSize="xs" color="gray.500" fontWeight="semibold">
                                SOC 2 Type II
                            </Box>
                        </HStack>
                    </Box>
                )}

                <Separator mb={6} borderColor="gray.300" />

                {/* Bottom Bar */}
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', md: 'center' }}
                    gap={4}
                >
                    <Box fontSize="sm" color="gray.600">
                        © {currentYear} {companyName}. All rights reserved.
                    </Box>

                    {/* Additional Links */}
                    <HStack gap={4} flexWrap="wrap">
                        <Link
                            href="/sitemap"
                            fontSize="sm"
                            color="gray.600"
                            textDecoration="none"
                            _hover={{ color: 'gray.800' }}
                        >
                            Sitemap
                        </Link>
                        <Link
                            href="/accessibility"
                            fontSize="sm"
                            color="gray.600"
                            textDecoration="none"
                            _hover={{ color: 'gray.800' }}
                        >
                            Accessibility
                        </Link>
                    </HStack>
                </Stack>
            </Container>
        </Box>
    );
}
