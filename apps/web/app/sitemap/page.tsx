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
  Separator,
} from "@repo/ui/index";
import { appRoute } from "../../components/constants/site";

interface SitemapLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

const sitemapSections: SitemapSection[] = [
  {
    title: "Products",
    links: [
      { label: "Plans", href: "/plans" },
      { label: "Solutions", href: "/solutions" },
      { label: "Demo", href: "/demo" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "For Teams", href: "/solutions" },
      { label: "For Enterprise", href: "/solutions" },
      { label: "For Individuals", href: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Library", href: "/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/resources" },
      { label: "Documentation", href: "/resources" },
      { label: "Help Center", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Pricing",
    links: [
      { label: "Plans & Pricing", href: "/plans" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: `${appRoute}/login`, isExternal: true },
      { label: "Sign Up", href: `${appRoute}/sign-up`, isExternal: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "https://twitter.com", isExternal: true },
      { label: "LinkedIn", href: "https://linkedin.com", isExternal: true },
      { label: "GitHub", href: "https://github.com", isExternal: true },
      { label: "Facebook", href: "https://facebook.com", isExternal: true },
    ],
  },
];

export default function SitemapPage() {
  return (
    <Box bg="white" minH="100vh">
      {/* Header */}
      <Box
        borderBottom="1px"
        borderColor="gray.200"
        bg="gray.50"
      >
        <Container maxW="container.xl" py={{ base: 12, md: 16 }}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.900"
            mb={2}
          >
            Sitemap
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Find everything on Karsilo
          </Text>
        </Container>
      </Box>

      {/* Sitemap Sections */}
      <Container maxW="container.xl" py={{ base: 12, md: 16 }}>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: 10, md: 12 }}
        >
          {sitemapSections.map((section, index) => (
            <GridItem key={index}>
              <VStack align="flex-start" gap={3}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.900"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {section.title}
                </Text>
                <Separator borderColor="gray.200" width="32px" />
                <VStack align="flex-start" gap={2} mt={1}>
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      fontSize="sm"
                      color="gray.500"
                      textDecoration="none"
                      _hover={{ color: "brand.600" }}
                      {...(link.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
