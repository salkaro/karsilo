"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  VStack,
  HStack,
  Input,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";

interface HelpCategory {
  title: string;
  description: string;
  articles: string[];
  icon: React.ReactNode;
}

interface Resource {
  title: string;
  description: string;
  category: string;
  href: string;
  icon: "book" | "video" | "file" | "code";
}

const helpCategories: HelpCategory[] = [
  {
    title: "Getting Started",
    description: "New to Karsilo? Start here.",
    articles: [
      "Creating your account",
      "Connecting your first Stripe account",
      "Understanding your dashboard",
      "Setting up notifications",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    title: "Account Management",
    description: "Manage your Stripe connections.",
    articles: [
      "Adding more Stripe accounts",
      "Removing a connected account",
      "Reconnecting after token expiry",
      "Account permissions explained",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Analytics & Reports",
    description: "Understand your revenue data.",
    articles: [
      "Reading the analytics dashboard",
      "Exporting your data",
      "Setting up email reports",
      "Understanding MRR calculations",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Billing & Plans",
    description: "Manage your subscription.",
    articles: [
      "Upgrading your plan",
      "Viewing invoices",
      "Canceling your subscription",
      "Refund policy",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    title: "Security",
    description: "Keep your data safe.",
    articles: [
      "Two-factor authentication",
      "Data encryption explained",
      "Session management",
      "Security best practices",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "API & Integrations",
    description: "Connect with other tools.",
    articles: [
      "Getting your API key",
      "Slack integration setup",
      "Webhook configuration",
      "Rate limits explained",
    ],
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const resources: Resource[] = [
  {
    title: "Getting Started Guide",
    description:
      "Learn how to connect your first Stripe account and set up your dashboard in minutes.",
    category: "Guide",
    href: "/docs/getting-started",
    icon: "book",
  },
  {
    title: "API Documentation",
    description:
      "Complete reference for integrating Karsilo data into your own applications.",
    category: "Documentation",
    href: "/docs/api",
    icon: "code",
  },
  {
    title: "Video Tutorials",
    description:
      "Step-by-step video guides covering everything from setup to advanced features.",
    category: "Video",
    href: "/tutorials",
    icon: "video",
  },
  {
    title: "Best Practices",
    description:
      "Learn how successful founders organize and manage multiple Stripe accounts.",
    category: "Guide",
    href: "/docs/best-practices",
    icon: "book",
  },
  {
    title: "Integration Guides",
    description:
      "Connect Karsilo with your favorite tools like Slack, Notion, and spreadsheets.",
    category: "Documentation",
    href: "/docs/integrations",
    icon: "file",
  },
  {
    title: "Webinars & Events",
    description:
      "Join live sessions with our team and learn tips from power users.",
    category: "Video",
    href: "/webinars",
    icon: "video",
  },
];

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ResourceIcon({ type }: { type: Resource["icon"] }) {
  const icons = {
    book: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    video: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    file: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    code: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  };
  return <Box color="brand.500">{icons[type]}</Box>;
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={resource.href} style={{ textDecoration: "none" }}>
      <Box
        p={{ base: 5, md: 6 }}
        bg="white"
        borderRadius="2xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "lg",
          borderColor: "brand.200",
          transform: "translateY(-4px)",
        }}
        height="full"
        cursor="pointer"
      >
        <HStack gap={3} mb={3}>
          <Box
            p={2.5}
            bg="brand.50"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ResourceIcon type={resource.icon} />
          </Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="brand.600"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {resource.category}
          </Text>
        </HStack>
        <Heading
          as="h3"
          fontSize="md"
          fontWeight="semibold"
          color="gray.900"
          mb={2}
        >
          {resource.title}
        </Heading>
        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
          {resource.description}
        </Text>
      </Box>
    </Link>
  );
}

// Circle position variants for visual diversity
interface CirclePosition {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  width: string;
  height: string;
  opacity: number;
  transform: string;
}

const circleVariants: { circles: CirclePosition[] }[] = [
  // Variant 0: Top-right large + bottom-left small
  {
    circles: [
      {
        top: 0,
        right: 0,
        width: "130px",
        height: "130px",
        opacity: 0.12,
        transform: "translate(35%, -35%)",
      },
      {
        bottom: "10%",
        left: 0,
        width: "60px",
        height: "60px",
        opacity: 0.08,
        transform: "translate(-40%, 0)",
      },
    ],
  },
  // Variant 1: Bottom-right large + top-left small
  {
    circles: [
      {
        bottom: 0,
        right: 0,
        width: "140px",
        height: "140px",
        opacity: 0.1,
        transform: "translate(40%, 40%)",
      },
      {
        top: "15%",
        left: 0,
        width: "50px",
        height: "50px",
        opacity: 0.08,
        transform: "translate(-30%, 0)",
      },
    ],
  },
  // Variant 2: Top-left large + center-right small
  {
    circles: [
      {
        top: 0,
        left: 0,
        width: "120px",
        height: "120px",
        opacity: 0.1,
        transform: "translate(-35%, -35%)",
      },
      {
        top: "50%",
        right: 0,
        width: "70px",
        height: "70px",
        opacity: 0.08,
        transform: "translate(40%, -50%)",
      },
    ],
  },
];

function HelpCard({
  category,
  variant = 0,
}: {
  category: HelpCategory;
  variant?: number;
}) {
  const circleConfig = circleVariants[variant % circleVariants.length]!;

  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg="gray.900"
      borderRadius="2xl"
      transition="all 0.3s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
      height="full"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative circles - variant based */}
      {circleConfig.circles.map((circle, idx) => (
        <Box
          key={idx}
          position="absolute"
          top={circle.top}
          right={circle.right}
          left={circle.left}
          width={circle.width}
          height={circle.height}
          bg="brand.500"
          opacity={circle.opacity}
          borderRadius="full"
          transform={circle.transform}
        />
      ))}

      <Box position="relative" zIndex={1}>
        <Box
          p={2.5}
          bg="whiteAlpha.100"
          borderRadius="lg"
          width="fit-content"
          color="brand.400"
          mb={4}
        >
          {category.icon}
        </Box>

        <Heading as="h3" fontSize="md" fontWeight="bold" color="white" mb={2}>
          {category.title}
        </Heading>
        <Text fontSize="sm" color="gray.400" mb={4}>
          {category.description}
        </Text>

        <VStack align="stretch" gap={2}>
          {category.articles.map((article, index) => (
            <Link
              key={index}
              href={`/resources/${category.title.toLowerCase().replace(/ /g, "-")}/${article.toLowerCase().replace(/ /g, "-")}`}
              style={{ textDecoration: "none" }}
            >
              <HStack
                gap={2}
                py={1.5}
                px={2}
                mx={-2}
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                <Box color="brand.400" opacity={0.6}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Box>
                <Text
                  fontSize="sm"
                  color="gray.300"
                  _hover={{ color: "white" }}
                  transition="color 0.2s"
                >
                  {article}
                </Text>
              </HStack>
            </Link>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter resources and help categories based on search
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return resources;
    const query = searchQuery.toLowerCase();
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const filteredHelpCategories = useMemo(() => {
    if (!searchQuery.trim()) return helpCategories;
    const query = searchQuery.toLowerCase();
    return helpCategories.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.articles.some((a) => a.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const hasResults =
    filteredResources.length > 0 || filteredHelpCategories.length > 0;

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
        top="-80px"
        left="-120px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="20%"
        right="-150px"
        width="400px"
        height="400px"
        bg="gray.200"
        opacity={0.25}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        width="180px"
        height="180px"
        bg="gray.300"
        opacity={0.15}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="20%"
        width="250px"
        height="250px"
        bg="gray.200"
        opacity={0.2}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Resources & Help
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              How can we help?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mb={8}>
              Find answers to common questions, explore our guides, or get in
              touch with our support team.
            </Text>

            {/* Search with icon */}
            <Box maxW="lg" width="full" position="relative">
              <Box
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
                zIndex={2}
              >
                <SearchIcon />
              </Box>
              <Input
                placeholder="Search resources, guides, articles..."
                size="lg"
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                pl={12}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
            </Box>

            {/* Search results indicator */}
            {searchQuery && (
              <Text fontSize="sm" color="gray.500" mt={4}>
                {hasResults
                  ? `Found ${filteredResources.length} resources and ${filteredHelpCategories.length} help topics`
                  : "No results found. Try a different search term."}
              </Text>
            )}
          </Flex>
        </FadeIn>

        {/* No results state */}
        {searchQuery && !hasResults && (
          <FadeIn>
            <Box textAlign="center" py={12}>
              <Box color="gray.300" mb={4}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ margin: "0 auto" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 8l6 6M14 8l-6 6" />
                </svg>
              </Box>
              <Text fontSize="lg" color="gray.600" mb={2}>
                No results for "{searchQuery}"
              </Text>
              <Text fontSize="sm" color="gray.500">
                Try searching for something else or browse the categories below.
              </Text>
              <Button
                mt={4}
                variant="outline"
                borderColor="gray.300"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </Box>
          </FadeIn>
        )}

        {/* Resources Section - Light cards */}
        {filteredResources.length > 0 && (
          <FadeIn delay={0.1}>
            <Box mb={16}>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading
                  as="h2"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="gray.900"
                >
                  Learn & Grow
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {filteredResources.length} resources
                </Text>
              </HStack>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {filteredResources.map((resource, index) => (
                  <FadeIn
                    key={resource.title}
                    delay={0.1 + 0.05 * index}
                    direction="up"
                  >
                    <ResourceCard resource={resource} />
                  </FadeIn>
                ))}
              </Grid>
            </Box>
          </FadeIn>
        )}

        {/* Help Categories Section - Dark cards */}
        {filteredHelpCategories.length > 0 && (
          <FadeIn delay={0.3}>
            <Box mb={16}>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading
                  as="h2"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="gray.900"
                >
                  Help Center
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {filteredHelpCategories.length} topics
                </Text>
              </HStack>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {filteredHelpCategories.map((category, index) => (
                  <FadeIn
                    key={category.title}
                    delay={0.3 + 0.05 * index}
                    direction="up"
                  >
                    <HelpCard category={category} variant={index} />
                  </FadeIn>
                ))}
              </Grid>
            </Box>
          </FadeIn>
        )}

        {/* Support Section - White with grey circles */}
        <FadeIn delay={0.5}>
          <Box
            p={{ base: 8, md: 12 }}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative circles - grey on white */}
            <Box
              position="absolute"
              top={0}
              right={0}
              width="250px"
              height="250px"
              bg="gray.100"
              opacity={0.5}
              borderRadius="full"
              transform="translate(30%, -30%)"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              width="180px"
              height="180px"
              bg="gray.100"
              opacity={0.3}
              borderRadius="full"
              transform="translate(-30%, 30%)"
            />
            <Box
              position="absolute"
              top="60%"
              right="15%"
              width="80px"
              height="80px"
              bg="gray.200"
              opacity={0.3}
              borderRadius="full"
            />

            <Box position="relative" zIndex={1}>
              <Heading
                as="h2"
                fontSize="2xl"
                fontWeight="bold"
                color="gray.900"
                mb={4}
              >
                Still need help?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Our support team is available Monday through Friday, 9am to 6pm
                EST. We typically respond within 24 hours.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/contact">
                  <Button
                    size="lg"
                    bg="gray.900"
                    color="white"
                    _hover={{ bg: "gray.800", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Contact Support
                  </Button>
                </Link>
                <Link href="mailto:support@karsilo.com">
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400", bg: "gray.50" }}
                  >
                    Email Us
                  </Button>
                </Link>
              </Flex>
            </Box>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
