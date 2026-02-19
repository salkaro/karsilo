import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../../components/dom/scroll-animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Practices | Karsilo",
  description:
    "Learn how successful founders organise and manage multiple Stripe accounts with Karsilo.",
};

const practices = [
  {
    title: "Organise With Entities",
    description:
      "Group related Stripe accounts into entities — one per brand, product line, or business unit. This gives you clean, segmented analytics and makes it easy to compare performance across your portfolio.",
    tips: [
      "Create one entity per brand or product line",
      "Name entities clearly so team members can navigate quickly",
      "Assign every connected Stripe account to an entity",
      "Use entities as the primary filter in your dashboard",
    ],
  },
  {
    title: "Set Up Team Roles Early",
    description:
      "Invite your team with the right permissions from day one. Viewers get read-only access, members can manage connections, and admins control billing and settings.",
    tips: [
      "Give accountants viewer-level access for read-only reporting",
      "Reserve admin and owner roles for founders and finance leads",
      "Use member access for team leads who manage connections",
      "Review permissions quarterly as roles change",
    ],
  },
  {
    title: "Monitor Revenue Daily",
    description:
      "Check your unified dashboard at least once a day. Karsilo consolidates balance and transaction data across all accounts so you can spot trends or issues before they become problems.",
    tips: [
      "Glance at the revenue overview each morning",
      "Watch for unusual dips in payment volume",
      "Compare month-over-month MRR across entities",
      "Export weekly summaries for your finance team",
    ],
  },
  {
    title: "Keep Connections Healthy",
    description:
      "Stripe OAuth tokens can expire if permissions change. Reconnect promptly when Karsilo flags a disconnected account to avoid gaps in your data.",
    tips: [
      "Enable email notifications for disconnection alerts",
      "Reconnect within 24 hours to minimise data gaps",
      "Verify Stripe app permissions after changing account settings",
      "Test connections after Stripe platform updates",
    ],
  },
  {
    title: "Use the API for Automation",
    description:
      "On Growth and Pro plans, the Karsilo API lets you pull data into your own tools. Build automated dashboards, pipe data to spreadsheets, or feed metrics into your internal reporting stack.",
    tips: [
      "Generate a dedicated API key for each integration",
      "Use pagination to fetch complete datasets",
      "Cache responses client-side to stay within rate limits",
      "Filter by accountId when you only need data from one connection",
    ],
  },
  {
    title: "Secure Your Account",
    description:
      "Enable two-factor authentication, use strong passwords, and manage active sessions. Karsilo encrypts all tokens at rest, but account security starts with you.",
    tips: [
      "Enable 2FA on your Karsilo account immediately",
      "Never share API keys in public repos or chat messages",
      "Revoke old API keys when team members leave",
      "Review active sessions periodically and sign out stale ones",
    ],
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

export default function BestPracticesPage() {
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

      <Container maxW="container.md" position="relative" zIndex={1}>
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
            <Text fontSize="sm" color="gray.900" fontWeight="medium">Best Practices</Text>
          </HStack>
        </FadeIn>

        <FadeIn>
          <Box mb={8}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Guide</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" lineHeight="1.2" mb={4}>
              Best Practices
            </Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="1.7">
              Learn how successful founders organise and manage multiple Stripe accounts. These patterns come from teams running dozens of accounts on Karsilo.
            </Text>
          </Box>
        </FadeIn>

        <VStack align="stretch" gap={6} mb={10}>
          {practices.map((practice, index) => (
            <FadeIn key={practice.title} delay={0.1 + 0.05 * index}>
              <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={{ base: 6, md: 10 }}>
                <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.900" mb={3}>
                  {practice.title}
                </Heading>
                <Text fontSize="md" color="gray.600" lineHeight="1.8" mb={4}>
                  {practice.description}
                </Text>
                <VStack align="stretch" gap={2}>
                  {practice.tips.map((tip, i) => (
                    <HStack key={i} gap={3} align="start">
                      <Box color="brand.500" mt={1} flexShrink={0}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Box>
                      <Text fontSize="sm" color="gray.600" lineHeight="1.6">{tip}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </FadeIn>
          ))}
        </VStack>

        {/* Related links */}
        <FadeIn delay={0.4}>
          <Box mb={10}>
            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900" mb={4}>
              Related Resources
            </Heading>
            <VStack align="stretch" gap={0}>
              {[
                { title: "Getting Started Guide", href: "/docs/getting-started" },
                { title: "API Documentation", href: "/docs/api" },
                { title: "Security Best Practices", href: "/resources/security/security-best-practices" },
              ].map((link, index) => (
                <Link key={index} href={link.href} style={{ textDecoration: "none" }}>
                  <HStack gap={3} py={3} px={4} mx={-4} borderRadius="lg" transition="all 0.2s" _hover={{ bg: "white", boxShadow: "sm" }} justify="space-between">
                    <Text fontSize="sm" color="gray.700" fontWeight="medium" _hover={{ color: "brand.600" }} transition="color 0.2s">{link.title}</Text>
                    <Box color="gray.400" flexShrink={0}><ChevronRightIcon /></Box>
                  </HStack>
                </Link>
              ))}
            </VStack>
          </Box>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.5}>
          <Box p={{ base: 8, md: 12 }} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" textAlign="center" position="relative" overflow="hidden">
            <Box position="absolute" top={0} right={0} width="250px" height="250px" bg="gray.100" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
            <Box position="absolute" bottom={0} left={0} width="180px" height="180px" bg="gray.100" opacity={0.3} borderRadius="full" transform="translate(-30%, 30%)" />
            <Box position="relative" zIndex={1}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
                Ready to put these into practice?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Start your free account and see how Karsilo helps you manage all your Stripe accounts in one place.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="https://app.karsilo.com">
                  <Button size="lg" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-2px)" }} transition="all 0.2s">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" borderColor="gray.300" _hover={{ borderColor: "gray.400", bg: "gray.50" }}>
                    Talk to Us
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