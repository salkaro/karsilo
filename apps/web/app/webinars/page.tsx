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
  title: "Webinars & Events | Karsilo",
  description:
    "Join live sessions with our team and learn tips from power users managing multiple Stripe accounts.",
};

interface Webinar {
  title: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  role: string;
  type: "Upcoming" | "On-Demand";
  topics: string[];
}

const webinars: Webinar[] = [
  {
    title: "Managing 10+ Stripe Accounts Like a Pro",
    description:
      "Learn organisation strategies, entity management, and dashboard workflows from teams running large Stripe portfolios on Karsilo.",
    date: "March 12, 2026",
    time: "2:00 PM EST",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "Upcoming",
    topics: ["Entity organisation", "Team permissions", "Dashboard workflows"],
  },
  {
    title: "Revenue Analytics Deep Dive",
    description:
      "Understand MRR calculations, balance transaction breakdowns, and how to use the revenue dashboard for data-driven decisions.",
    date: "March 26, 2026",
    time: "2:00 PM EST",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "Upcoming",
    topics: ["MRR tracking", "Balance transactions", "Revenue trends"],
  },
  {
    title: "Getting Started with the Karsilo API",
    description:
      "A hands-on walkthrough of the API — authentication, pagination, filtering, and building your first integration.",
    date: "April 9, 2026",
    time: "2:00 PM EST",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "Upcoming",
    topics: ["API authentication", "Endpoint reference", "Building integrations"],
  },
  {
    title: "From Zero to Dashboard: Karsilo Quickstart",
    description:
      "Watch a complete setup walkthrough — creating an account, connecting Stripe, and navigating the dashboard for the first time.",
    date: "February 5, 2026",
    time: "45 min",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "On-Demand",
    topics: ["Account setup", "Stripe OAuth", "Dashboard navigation"],
  },
  {
    title: "Security & Compliance for SaaS Founders",
    description:
      "How Karsilo encrypts your data, manages sessions, and what you should do to keep your multi-Stripe setup secure.",
    date: "January 22, 2026",
    time: "38 min",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "On-Demand",
    topics: ["Encryption", "2FA setup", "Session management"],
  },
  {
    title: "Customer Insights Across Multiple Accounts",
    description:
      "See how to view, filter, and understand customers across all your Stripe accounts using the unified customer dashboard.",
    date: "January 8, 2026",
    time: "32 min",
    speaker: "Nick Salkeld",
    role: "Co-Founder, Karsilo",
    type: "On-Demand",
    topics: ["Unified customer view", "Filtering", "Customer analytics"],
  },
];

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

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WebinarCard({ webinar }: { webinar: Webinar }) {
  const isUpcoming = webinar.type === "Upcoming";
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={isUpcoming ? "brand.200" : "gray.100"}
      p={{ base: 5, md: 6 }}
      transition="all 0.3s ease"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      height="full"
      position="relative"
      overflow="hidden"
    >
      {isUpcoming && (
        <Box position="absolute" top={0} right={0} width="80px" height="80px" bg="brand.50" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
      )}

      <Box position="relative" zIndex={1}>
        <HStack gap={2} mb={3}>
          <Box px={2} py={0.5} bg={isUpcoming ? "brand.50" : "gray.100"} borderRadius="md">
            <Text fontSize="xs" fontWeight="semibold" color={isUpcoming ? "brand.600" : "gray.500"}>
              {webinar.type}
            </Text>
          </Box>
        </HStack>

        <Heading as="h3" fontSize="md" fontWeight="semibold" color="gray.900" mb={2}>
          {webinar.title}
        </Heading>
        <Text fontSize="sm" color="gray.600" lineHeight="1.6" mb={4}>
          {webinar.description}
        </Text>

        <HStack gap={4} mb={4} flexWrap="wrap">
          <HStack gap={1.5}>
            <Box color="gray.400"><CalendarIcon /></Box>
            <Text fontSize="xs" color="gray.500">{webinar.date}</Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">{webinar.time}</Text>
        </HStack>

        <HStack gap={2} mb={4} flexWrap="wrap">
          {webinar.topics.map((topic) => (
            <Box key={topic} px={2} py={0.5} bg="gray.100" borderRadius="md">
              <Text fontSize="xs" color="gray.600">{topic}</Text>
            </Box>
          ))}
        </HStack>

        <Box borderTop="1px solid" borderColor="gray.100" pt={3}>
          <Text fontSize="sm" color="gray.700" fontWeight="medium">{webinar.speaker}</Text>
          <Text fontSize="xs" color="gray.500">{webinar.role}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default function WebinarsPage() {
  const upcoming = webinars.filter((w) => w.type === "Upcoming");
  const onDemand = webinars.filter((w) => w.type === "On-Demand");

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
            <Text fontSize="sm" color="gray.900" fontWeight="medium">Webinars & Events</Text>
          </HStack>
        </FadeIn>

        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Video</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" mb={4}>
              Webinars & Events
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join live sessions with our team and learn tips from power users. Can't make it live? Watch the recordings on demand.
            </Text>
          </Flex>
        </FadeIn>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <FadeIn delay={0.1}>
            <Box mb={12}>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.900">
                  Upcoming
                </Heading>
                <Text fontSize="sm" color="gray.500">{upcoming.length} sessions</Text>
              </HStack>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={6}
              >
                {upcoming.map((webinar, index) => (
                  <FadeIn key={webinar.title} delay={0.1 + 0.05 * index} direction="up">
                    <WebinarCard webinar={webinar} />
                  </FadeIn>
                ))}
              </Grid>
            </Box>
          </FadeIn>
        )}

        {/* On-Demand */}
        {onDemand.length > 0 && (
          <FadeIn delay={0.3}>
            <Box mb={16}>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.900">
                  On-Demand Recordings
                </Heading>
                <Text fontSize="sm" color="gray.500">{onDemand.length} recordings</Text>
              </HStack>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={6}
              >
                {onDemand.map((webinar, index) => (
                  <FadeIn key={webinar.title} delay={0.3 + 0.05 * index} direction="up">
                    <WebinarCard webinar={webinar} />
                  </FadeIn>
                ))}
              </Grid>
            </Box>
          </FadeIn>
        )}

        {/* CTA */}
        <FadeIn delay={0.5}>
          <Box p={{ base: 8, md: 12 }} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" textAlign="center" position="relative" overflow="hidden">
            <Box position="absolute" top={0} right={0} width="250px" height="250px" bg="gray.100" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
            <Box position="absolute" bottom={0} left={0} width="180px" height="180px" bg="gray.100" opacity={0.3} borderRadius="full" transform="translate(-30%, 30%)" />
            <Box position="relative" zIndex={1}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
                Want us to cover a topic?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                We plan webinars based on what our users want to learn. Send us your suggestions and we'll add them to the schedule.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/contact">
                  <Button size="lg" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-2px)" }} transition="all 0.2s">
                    Suggest a Topic
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