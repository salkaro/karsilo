import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Grid,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Tutorials | Karsilo",
  description:
    "Step-by-step video guides covering everything from setup to advanced features in Karsilo.",
};

interface Tutorial {
  title: string;
  description: string;
  duration: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const tutorials: Tutorial[] = [
  {
    title: "Getting Started in 5 Minutes",
    description:
      "Create your account, connect your first Stripe account, and explore the dashboard — all in under five minutes.",
    duration: "4:32",
    category: "Getting Started",
    level: "Beginner",
  },
  {
    title: "Connecting Multiple Stripe Accounts",
    description:
      "Learn how to add and organise multiple Stripe accounts using entities for a clear overview of your business.",
    duration: "6:15",
    category: "Account Management",
    level: "Beginner",
  },
  {
    title: "Understanding Revenue Analytics",
    description:
      "Deep dive into the revenue dashboard — MRR, balance transactions, and how to track growth across accounts.",
    duration: "8:47",
    category: "Analytics",
    level: "Intermediate",
  },
  {
    title: "Managing Customers Across Accounts",
    description:
      "See how to view, search, and filter customers from all your Stripe accounts in a single unified view.",
    duration: "5:23",
    category: "Customers",
    level: "Beginner",
  },
  {
    title: "Setting Up Team Permissions",
    description:
      "Invite team members, assign roles, and control who can access what in your Karsilo organisation.",
    duration: "7:10",
    category: "Account Management",
    level: "Intermediate",
  },
  {
    title: "Using the Karsilo API",
    description:
      "Generate API keys, make your first request, and learn how to paginate through results programmatically.",
    duration: "10:22",
    category: "API",
    level: "Advanced",
  },
  {
    title: "Generating and Exporting Reports",
    description:
      "Create custom Stripe reports, schedule recurring exports, and download data for your accounting tools.",
    duration: "6:58",
    category: "Reports",
    level: "Intermediate",
  },
  {
    title: "Subscription Tracking & Churn Analysis",
    description:
      "Track active subscriptions, monitor churn, and understand your recurring revenue health.",
    duration: "9:14",
    category: "Analytics",
    level: "Advanced",
  },
  {
    title: "Security Best Practices",
    description:
      "Enable two-factor authentication, manage sessions, and learn how Karsilo keeps your data encrypted.",
    duration: "5:45",
    category: "Security",
    level: "Beginner",
  },
];

const levelColors: Record<Tutorial["level"], { bg: string; color: string }> = {
  Beginner: { bg: "green.100", color: "green.700" },
  Intermediate: { bg: "yellow.100", color: "yellow.700" },
  Advanced: { bg: "purple.100", color: "purple.700" },
};

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const level = levelColors[tutorial.level];
  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "lg", borderColor: "brand.200", transform: "translateY(-4px)" }}
      height="full"
      cursor="pointer"
    >
      {/* Video placeholder */}
      <Box
        bg="gray.900"
        borderRadius="xl"
        mb={4}
        position="relative"
        overflow="hidden"
        height="160px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          p={4}
          bg="whiteAlpha.200"
          borderRadius="full"
          color="white"
          transition="all 0.2s"
          _hover={{ bg: "whiteAlpha.300", transform: "scale(1.1)" }}
        >
          <PlayIcon />
        </Box>
        <Box position="absolute" bottom={3} right={3} px={2} py={0.5} bg="blackAlpha.700" borderRadius="md">
          <Text fontSize="xs" color="white" fontWeight="medium" fontFamily="mono">{tutorial.duration}</Text>
        </Box>
      </Box>

      <HStack gap={2} mb={3}>
        <Box px={2} py={0.5} bg={level.bg} borderRadius="md">
          <Text fontSize="xs" fontWeight="semibold" color={level.color}>{tutorial.level}</Text>
        </Box>
        <Text fontSize="xs" color="gray.500">{tutorial.category}</Text>
      </HStack>

      <Heading as="h3" fontSize="md" fontWeight="semibold" color="gray.900" mb={2}>
        {tutorial.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" lineHeight="1.6">
        {tutorial.description}
      </Text>
    </Box>
  );
}

export default function TutorialsPage() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.4} backgroundImage="radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)" backgroundSize="32px 32px" pointerEvents="none" />
      <Box position="absolute" top="-80px" left="-120px" width="350px" height="350px" bg="gray.200" opacity={0.3} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" top="20%" right="-150px" width="400px" height="400px" bg="gray.200" opacity={0.25} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" bottom="10%" left="5%" width="180px" height="180px" bg="gray.300" opacity={0.15} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" bottom="-100px" right="20%" width="250px" height="250px" bg="gray.200" opacity={0.2} borderRadius="full" pointerEvents="none" />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <FadeIn>
          <Box mb={6}>
            <Link href="/resources" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" color="gray.600" _hover={{ color: "gray.900", bg: "gray.100" }}>
                <ArrowLeftIcon />
                <Text ml={2}>Back to Resources</Text>
              </Button>
            </Link>
          </Box>
        </FadeIn>

        <FadeIn>
          <HStack gap={2} mb={6} flexWrap="wrap">
            <Link href="/resources" style={{ textDecoration: "none" }}>
              <Text fontSize="sm" color="gray.500" _hover={{ color: "brand.600" }} transition="color 0.2s">Resources</Text>
            </Link>
            <Box color="gray.400"><ChevronRightIcon /></Box>
            <Text fontSize="sm" color="gray.900" fontWeight="medium">Video Tutorials</Text>
          </HStack>
        </FadeIn>

        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Video</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" mb={4}>
              Video Tutorials
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Step-by-step video guides covering everything from setup to advanced features. Watch at your own pace and follow along.
            </Text>
          </Flex>
        </FadeIn>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={6}
          mb={16}
        >
          {tutorials.map((tutorial, index) => (
            <FadeIn key={tutorial.title} delay={0.1 + 0.05 * index} direction="up">
              <TutorialCard tutorial={tutorial} />
            </FadeIn>
          ))}
        </Grid>

        {/* CTA */}
        <FadeIn delay={0.5}>
          <Box p={{ base: 8, md: 12 }} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" textAlign="center" position="relative" overflow="hidden">
            <Box position="absolute" top={0} right={0} width="250px" height="250px" bg="gray.100" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
            <Box position="absolute" bottom={0} left={0} width="180px" height="180px" bg="gray.100" opacity={0.3} borderRadius="full" transform="translate(-30%, 30%)" />
            <Box position="relative" zIndex={1}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
                Want a tutorial on a specific topic?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Let us know what you'd like us to cover next. We create new tutorials based on user requests.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/contact">
                  <Button size="lg" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-2px)" }} transition="all 0.2s">
                    Request a Tutorial
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button size="lg" variant="outline" borderColor="gray.300" _hover={{ borderColor: "gray.400", bg: "gray.50" }}>
                    Browse Resources
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