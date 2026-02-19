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
import { FadeIn } from "../../../components/dom/scroll-animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started Guide | Karsilo",
  description:
    "Learn how to connect your first Stripe account and set up your Karsilo dashboard in minutes.",
};

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up for Karsilo using your email address or Google account. You'll be guided through a quick onboarding flow that takes less than a minute.",
    details: [
      "Visit the Karsilo sign-up page and enter your details",
      "Verify your email address via the confirmation link",
      "Choose your plan — start free or pick a plan that fits your needs",
      "Set up your organisation name and invite team members",
    ],
  },
  {
    number: "02",
    title: "Connect Your Stripe Account",
    description:
      "Link your first Stripe account using our secure OAuth flow. Your credentials are encrypted end-to-end and never stored in plain text.",
    details: [
      "Navigate to Settings → Connections in your dashboard",
      "Click 'Connect Stripe Account' and authorise via Stripe's OAuth page",
      "Select the Stripe account you want to connect",
      "Karsilo will begin syncing your data immediately",
    ],
  },
  {
    number: "03",
    title: "Explore Your Dashboard",
    description:
      "Once connected, your dashboard populates with real-time data. Explore revenue, customers, subscriptions, and more — all in one place.",
    details: [
      "View consolidated revenue across all connected accounts",
      "Browse your customers, payments, and subscription metrics",
      "Set up entities to group and organise related Stripe accounts",
      "Enable notifications to stay on top of key changes",
    ],
  },
  {
    number: "04",
    title: "Add More Accounts",
    description:
      "Karsilo shines when you connect multiple Stripe accounts. Add as many as your plan allows and see the full picture of your business.",
    details: [
      "Repeat the connection flow for each additional Stripe account",
      "Assign accounts to entities for cleaner organisation",
      "Use the unified dashboard to compare performance across accounts",
      "Upgrade your plan anytime to add more connections",
    ],
  },
];

const quickLinks = [
  {
    title: "Understanding Your Dashboard",
    href: "/resources/getting-started/understanding-your-dashboard",
  },
  {
    title: "Setting Up Notifications",
    href: "/resources/getting-started/setting-up-notifications",
  },
  {
    title: "Account Permissions Explained",
    href: "/resources/account-management/account-permissions-explained",
  },
];

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
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
  );
}

export default function GettingStartedPage() {
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
      <Box position="absolute" top="-80px" left="-120px" width="350px" height="350px" bg="gray.200" opacity={0.3} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" top="20%" right="-150px" width="400px" height="400px" bg="gray.200" opacity={0.25} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" bottom="10%" left="5%" width="180px" height="180px" bg="gray.300" opacity={0.15} borderRadius="full" pointerEvents="none" />
      <Box position="absolute" bottom="-100px" right="20%" width="250px" height="250px" bg="gray.200" opacity={0.2} borderRadius="full" pointerEvents="none" />

      <Container maxW="container.md" position="relative" zIndex={1}>
        {/* Back link */}
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

        {/* Breadcrumb */}
        <FadeIn>
          <HStack gap={2} mb={6} flexWrap="wrap">
            <Link href="/resources" style={{ textDecoration: "none" }}>
              <Text fontSize="sm" color="gray.500" _hover={{ color: "brand.600" }} transition="color 0.2s">Resources</Text>
            </Link>
            <Box color="gray.400"><ChevronRightIcon /></Box>
            <Text fontSize="sm" color="gray.900" fontWeight="medium">Getting Started Guide</Text>
          </HStack>
        </FadeIn>

        {/* Header */}
        <FadeIn>
          <Box mb={8}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Guide</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" lineHeight="1.2" mb={4}>
              Getting Started with Karsilo
            </Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="1.7">
              Connect your first Stripe account and set up your dashboard in minutes. This guide walks you through everything you need to get up and running.
            </Text>
          </Box>
        </FadeIn>

        {/* Steps */}
        <VStack align="stretch" gap={6} mb={10}>
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={0.1 + 0.05 * index}>
              <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                p={{ base: 6, md: 10 }}
              >
                <HStack gap={4} mb={4} align="start">
                  <Box
                    px={3}
                    py={1.5}
                    bg="gray.900"
                    borderRadius="lg"
                    flexShrink={0}
                  >
                    <Text fontSize="sm" fontWeight="bold" color="white">{step.number}</Text>
                  </Box>
                  <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.900">
                    {step.title}
                  </Heading>
                </HStack>
                <Text fontSize="md" color="gray.600" lineHeight="1.8" mb={4}>
                  {step.description}
                </Text>
                <VStack align="stretch" gap={2}>
                  {step.details.map((detail, i) => (
                    <HStack key={i} gap={3} align="start">
                      <Box color="brand.500" mt={1} flexShrink={0}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Box>
                      <Text fontSize="sm" color="gray.600" lineHeight="1.6">{detail}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </FadeIn>
          ))}
        </VStack>

        {/* Quick links */}
        <FadeIn delay={0.3}>
          <Box mb={10}>
            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900" mb={4}>
              What's Next
            </Heading>
            <VStack align="stretch" gap={0}>
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} style={{ textDecoration: "none" }}>
                  <HStack
                    gap={3}
                    py={3}
                    px={4}
                    mx={-4}
                    borderRadius="lg"
                    transition="all 0.2s"
                    _hover={{ bg: "white", boxShadow: "sm" }}
                    justify="space-between"
                  >
                    <Text fontSize="sm" color="gray.700" fontWeight="medium" _hover={{ color: "brand.600" }} transition="color 0.2s">
                      {link.title}
                    </Text>
                    <Box color="gray.400" flexShrink={0}><ChevronRightIcon /></Box>
                  </HStack>
                </Link>
              ))}
            </VStack>
          </Box>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.4}>
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
            <Box position="absolute" top={0} right={0} width="250px" height="250px" bg="gray.100" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
            <Box position="absolute" bottom={0} left={0} width="180px" height="180px" bg="gray.100" opacity={0.3} borderRadius="full" transform="translate(-30%, 30%)" />

            <Box position="relative" zIndex={1}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
                Ready to get started?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Create your free account and connect your first Stripe account in under two minutes.
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