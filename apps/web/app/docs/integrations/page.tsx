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
  title: "Integration Guides | Karsilo",
  description:
    "Connect Karsilo with your favourite tools like Slack, Notion, spreadsheets, and custom apps via the API.",
};

interface Integration {
  name: string;
  description: string;
  status: "Available" | "Coming Soon";
  steps: string[];
  icon: React.ReactNode;
}

const integrations: Integration[] = [
  {
    name: "Slack",
    description:
      "Get real-time notifications in your Slack workspace. Receive alerts for new payments, failed charges, subscription changes, and connection issues.",
    status: "Coming Soon",
    steps: [
      "Navigate to Settings → Integrations in your Karsilo dashboard",
      "Click 'Connect Slack' and authorise access to your workspace",
      "Choose which channel to receive notifications in",
      "Configure which events trigger notifications",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M14 20.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
      </svg>
    ),
  },
  {
    name: "Webhooks",
    description:
      "Send real-time event data to any URL. Use webhooks to trigger custom workflows, update external databases, or integrate with tools that accept HTTP callbacks.",
    status: "Coming Soon",
    steps: [
      "Go to Settings → Webhooks and click 'Add Endpoint'",
      "Enter your destination URL and select event types",
      "Karsilo signs every payload so you can verify authenticity",
      "Test your endpoint with a sample event before going live",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 16.98h-5.99c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2h5.99c1.1 0 1.99-.9 1.99-2s-.89-2-1.99-2z" />
        <path d="M12 3.02c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
        <path d="M16.98 6.02H11c-1.1 0-2 .9-2 2s.9 2 2 2h5.98c1.1 0 2-.9 2-2s-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    name: "REST API",
    description:
      "Build custom integrations using the Karsilo API. Pull customer, payment, subscription, and revenue data into your own applications programmatically.",
    status: "Available",
    steps: [
      "Generate an API key from Settings → API Keys",
      "Make authenticated requests to the /v1/ endpoints",
      "Use pagination and filtering to fetch exactly the data you need",
      "See the full API reference for detailed endpoint documentation",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "Google Sheets",
    description:
      "Export Karsilo data directly into Google Sheets for custom reports, charts, and sharing with stakeholders who prefer spreadsheets.",
    status: "Coming Soon",
    steps: [
      "Install the Karsilo add-on from the Google Workspace Marketplace",
      "Authenticate with your Karsilo API key",
      "Use the sidebar to select data types and date ranges",
      "Data refreshes automatically on a schedule you set",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
  },
  {
    name: "Notion",
    description:
      "Sync key metrics and reports to Notion databases. Keep your team's workspace updated with live revenue and customer data from Karsilo.",
    status: "Coming Soon",
    steps: [
      "Connect your Notion workspace from Settings → Integrations",
      "Select which Notion database to sync data into",
      "Map Karsilo fields to your Notion database properties",
      "Enable auto-sync to keep data fresh on a daily schedule",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M8 4v16" />
        <path d="M4 8h4" />
        <path d="M4 12h4" />
        <path d="M4 16h4" />
      </svg>
    ),
  },
  {
    name: "Zapier",
    description:
      "Connect Karsilo to 5,000+ apps through Zapier. Automate workflows like sending payment receipts to CRM, updating dashboards, or triggering email sequences.",
    status: "Coming Soon",
    steps: [
      "Search for 'Karsilo' in the Zapier app directory",
      "Authenticate with your Karsilo API key",
      "Choose a trigger event (e.g. new payment, new customer)",
      "Connect to any of Zapier's 5,000+ supported apps",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
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

function IntegrationCard({ integration }: { integration: Integration }) {
  const isAvailable = integration.status === "Available";
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 5, md: 6 }}
      transition="all 0.3s ease"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      height="full"
    >
      <HStack gap={3} mb={4}>
        <Box p={2.5} bg="brand.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" color="brand.500">
          {integration.icon}
        </Box>
        <Box>
          <Heading as="h3" fontSize="md" fontWeight="semibold" color="gray.900">
            {integration.name}
          </Heading>
        </Box>
        <Box ml="auto">
          <Box px={2} py={0.5} bg={isAvailable ? "green.100" : "gray.100"} borderRadius="md">
            <Text fontSize="xs" fontWeight="semibold" color={isAvailable ? "green.700" : "gray.500"}>
              {integration.status}
            </Text>
          </Box>
        </Box>
      </HStack>

      <Text fontSize="sm" color="gray.600" lineHeight="1.6" mb={4}>
        {integration.description}
      </Text>

      <VStack align="stretch" gap={2}>
        {integration.steps.map((step, i) => (
          <HStack key={i} gap={3} align="start">
            <Box
              px={1.5}
              py={0.5}
              bg="gray.100"
              borderRadius="md"
              flexShrink={0}
              minW="22px"
              textAlign="center"
            >
              <Text fontSize="xs" fontWeight="bold" color="gray.500">{i + 1}</Text>
            </Box>
            <Text fontSize="sm" color="gray.600" lineHeight="1.5">{step}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default function IntegrationsPage() {
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
            <Text fontSize="sm" color="gray.900" fontWeight="medium">Integration Guides</Text>
          </HStack>
        </FadeIn>

        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Documentation</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" mb={4}>
              Integration Guides
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Connect Karsilo with your favourite tools. Pull data into spreadsheets, get alerts in Slack, or build custom integrations with our API.
            </Text>
          </Flex>
        </FadeIn>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={6}
          mb={16}
        >
          {integrations.map((integration, index) => (
            <FadeIn key={integration.name} delay={0.1 + 0.05 * index} direction="up">
              <IntegrationCard integration={integration} />
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
                Need a custom integration?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Our API gives you full access to your data. If you need help building an integration, our team is here to assist.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/docs/api">
                  <Button size="lg" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-2px)" }} transition="all 0.2s">
                    View API Docs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" borderColor="gray.300" _hover={{ borderColor: "gray.400", bg: "gray.50" }}>
                    Contact Us
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