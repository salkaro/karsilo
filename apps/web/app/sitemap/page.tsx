"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  VStack,
  Link,
} from "@repo/ui/index";
import { FadeIn } from "../../components/dom/scroll-animations";

interface SitemapLink {
  label: string;
  href: string;
  description?: string;
}

interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

const sitemapSections: SitemapSection[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/", description: "Welcome to Karsilo" },
      { label: "Plans", href: "/plans", description: "Pricing and subscription options" },
      { label: "Solutions", href: "/solutions", description: "How Karsilo can help you" },
      { label: "Demo", href: "/demo", description: "Try Karsilo in action" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Library", href: "/library", description: "Browse our content library" },
      { label: "Guides", href: "/guides", description: "Step-by-step tutorials" },
      { label: "Documentation", href: "/docs", description: "Technical documentation" },
      { label: "Help Center", href: "/help", description: "Get support and answers" },
      { label: "Blog", href: "/blog", description: "Latest news and insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "/team", description: "Meet the people behind Karsilo" },
      { label: "Contact", href: "/contact", description: "Get in touch with us" },
      { label: "Status", href: "/status", description: "System status and uptime" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms", description: "Our terms and conditions" },
      { label: "Privacy Policy", href: "/privacy", description: "How we handle your data" },
      { label: "Security", href: "/security", description: "Our security practices" },
      { label: "Cookie Policy", href: "/cookies", description: "How we use cookies" },
      { label: "Accessibility", href: "/accessibility", description: "Accessibility statement" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign Up", href: "/sign-up", description: "Create a new account" },
      { label: "Log In", href: "/login", description: "Access your account" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
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
        top="-100px"
        right="-80px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-100px"
        width="300px"
        height="300px"
        bg="gray.200"
        opacity={0.25}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Header */}
        <FadeIn direction="up">
          <Box mb={{ base: 12, md: 16 }} textAlign="center">
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Navigation
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              Sitemap
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
              Find your way around Karsilo. All our pages organized in one place.
            </Text>
          </Box>
        </FadeIn>

        {/* Sitemap Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(5, 1fr)",
          }}
          gap={{ base: 8, md: 10 }}
        >
          {sitemapSections.map((section, sectionIndex) => (
            <FadeIn
              key={section.title}
              direction="up"
              delay={sectionIndex * 0.1}
            >
              <GridItem>
                <Box
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  height="full"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "lg",
                    borderColor: "brand.200",
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Gradient corner accent */}
                  <Box
                    position="absolute"
                    top={-50}
                    right={-50}
                    width="100px"
                    height="100px"
                    bgGradient="radial(brand.100, transparent 70%)"
                    borderRadius="full"
                  />

                  <VStack align="flex-start" gap={4} position="relative">
                    <Heading
                      as="h2"
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.900"
                      pb={2}
                      borderBottom="2px solid"
                      borderColor="brand.400"
                    >
                      {section.title}
                    </Heading>

                    <VStack align="flex-start" gap={3} width="full">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          display="block"
                          width="full"
                          textDecoration="none"
                          _hover={{
                            "& > div": {
                              color: "brand.600",
                            },
                          }}
                        >
                          <Box transition="color 0.2s">
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.800"
                              _hover={{ color: "brand.600" }}
                            >
                              {link.label}
                            </Text>
                            {link.description && (
                              <Text fontSize="xs" color="gray.500" mt={0.5}>
                                {link.description}
                              </Text>
                            )}
                          </Box>
                        </Link>
                      ))}
                    </VStack>
                  </VStack>

                  {/* Bottom accent bar */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={8}
                    width="40px"
                    height="3px"
                    bg="brand.400"
                    borderRadius="full"
                  />
                </Box>
              </GridItem>
            </FadeIn>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
