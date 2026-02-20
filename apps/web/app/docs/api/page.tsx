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
  title: "API Documentation | Karsilo",
  description:
    "Complete reference for integrating Karsilo data into your own applications via the REST API.",
};

const endpoints = [
  {
    method: "GET",
    path: "/v1/accounts",
    description: "List all connected Stripe accounts for your organisation.",
    params: [],
  },
  {
    method: "GET",
    path: "/v1/customers",
    description: "Retrieve customers across all connected Stripe accounts.",
    params: ["accountId", "starting_after"],
  },
  {
    method: "GET",
    path: "/v1/payments",
    description: "Fetch payment charges with optional date filtering.",
    params: ["accountId", "starting_after", "from", "to"],
  },
  {
    method: "GET",
    path: "/v1/products",
    description: "List products and their associated prices.",
    params: ["accountId", "starting_after"],
  },
  {
    method: "GET",
    path: "/v1/subscriptions",
    description: "Retrieve active and past subscriptions.",
    params: ["accountId", "starting_after"],
  },
  {
    method: "GET",
    path: "/v1/invoices",
    description: "List invoices across your connected accounts.",
    params: ["accountId", "starting_after"],
  },
  {
    method: "GET",
    path: "/v1/revenue",
    description: "Get balance and balance transaction data.",
    params: ["accountId", "starting_after", "from", "to"],
  },
  {
    method: "GET",
    path: "/v1/refunds",
    description: "List refunds with optional date range filtering.",
    params: ["accountId", "starting_after", "from", "to"],
  },
  {
    method: "GET",
    path: "/v1/reports",
    description: "Retrieve generated Stripe report runs.",
    params: ["accountId", "starting_after"],
  },
];

const sections = [
  {
    title: "Authentication",
    content:
      "All API requests require a Bearer token in the Authorization header. You can generate API keys from your Karsilo dashboard under Settings → API Keys. Keep your keys secure and never expose them in client-side code.",
    code: 'curl -H "Authorization: Bearer sk_live_your_api_key_here" \\\n  https://api.karsilo.com/v1/customers',
  },
  {
    title: "Rate Limits",
    content:
      "The API enforces rate limits to ensure fair usage. You are allowed 60 requests per minute and 1,000 requests per hour. When rate limited, the API returns a 429 status code with a Retry-After header indicating how many seconds to wait.",
    code: "HTTP/1.1 429 Too Many Requests\nRetry-After: 42\nX-RateLimit-Limit: 60\nX-RateLimit-Remaining: 0",
  },
  {
    title: "Response Format",
    content:
      "All endpoints return a consistent JSON envelope. Data is keyed by connection ID so you can easily identify which Stripe account each record belongs to. The hasMore object indicates whether additional pages are available for each connection.",
    code: '{\n  "data": {\n    "conn_abc123": [ ...items ]\n  },\n  "hasMore": {\n    "conn_abc123": true\n  },\n  "meta": {\n    "connections": [\n      { "id": "conn_abc123", "stripeAccountId": "acct_..." }\n    ]\n  }\n}',
  },
  {
    title: "Pagination",
    content:
      "Use the starting_after query parameter to paginate through results. Pass the ID of the last item from the previous page. Each page returns up to 100 items. Continue fetching until hasMore is false for all connections.",
    code: "GET /v1/customers?starting_after=cus_last_id_from_previous_page",
  },
  {
    title: "Filtering",
    content:
      "Use the accountId parameter to fetch data from a specific Stripe connection. Use from and to parameters (Unix timestamps in seconds) to filter by date range on supported endpoints like payments, revenue, and refunds.",
    code: "GET /v1/payments?accountId=conn_abc123&from=1704067200&to=1706745600",
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

export default function ApiDocsPage() {
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
            <Text fontSize="sm" color="gray.900" fontWeight="medium">API Documentation</Text>
          </HStack>
        </FadeIn>

        <FadeIn>
          <Box mb={8}>
            <Box display="inline-block" px={3} py={1} bg="brand.50" borderRadius="full" mb={4}>
              <Text fontSize="xs" fontWeight="semibold" color="brand.600" textTransform="uppercase" letterSpacing="wide">Documentation</Text>
            </Box>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="gray.900" lineHeight="1.2" mb={4}>
              API Documentation
            </Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="1.7" mb={6}>
              Complete reference for integrating Karsilo data into your own applications. The API is available on Growth and Pro plans.
            </Text>
            <Link href="https://api.karsilo.com/playground" style={{ textDecoration: "none" }}>
              <Button size="md" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-1px)" }} transition="all 0.2s">
                <HStack gap={2}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  <Text>Try the API Playground</Text>
                </HStack>
              </Button>
            </Link>
          </Box>
        </FadeIn>

        {/* Core concepts */}
        <VStack align="stretch" gap={6} mb={10}>
          {sections.map((section, index) => (
            <FadeIn key={section.title} delay={0.1 + 0.05 * index}>
              <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={{ base: 6, md: 10 }}>
                <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.900" mb={3}>
                  {section.title}
                </Heading>
                <Text fontSize="md" color="gray.600" lineHeight="1.8" mb={4}>
                  {section.content}
                </Text>
                <Box
                  bg="gray.900"
                  borderRadius="xl"
                  p={5}
                  overflow="auto"
                >
                  <Text
                    as="pre"
                    fontSize="sm"
                    color="gray.100"
                    fontFamily="mono"
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                    wordBreak="break-all"
                  >
                    {section.code}
                  </Text>
                </Box>
              </Box>
            </FadeIn>
          ))}
        </VStack>

        {/* Endpoints reference */}
        <FadeIn delay={0.4}>
          <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={{ base: 6, md: 10 }} mb={10}>
            <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.900" mb={6}>
              Endpoints Reference
            </Heading>
            <VStack align="stretch" gap={4}>
              {endpoints.map((endpoint, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="gray.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <HStack gap={3} mb={2}>
                    <Box
                      px={2}
                      py={0.5}
                      bg="green.100"
                      borderRadius="md"
                    >
                      <Text fontSize="xs" fontWeight="bold" color="green.700" fontFamily="mono">
                        {endpoint.method}
                      </Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900" fontFamily="mono">
                      {endpoint.path}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={endpoint.params.length > 0 ? 2 : 0}>
                    {endpoint.description}
                  </Text>
                  {endpoint.params.length > 0 && (
                    <HStack gap={2} flexWrap="wrap">
                      {endpoint.params.map((param) => (
                        <Box key={param} px={2} py={0.5} bg="gray.200" borderRadius="md">
                          <Text fontSize="xs" color="gray.700" fontFamily="mono">{param}</Text>
                        </Box>
                      ))}
                    </HStack>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        </FadeIn>

        {/* Related Resources */}
        <FadeIn delay={0.5}>
          <Box mb={10}>
            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900" mb={6}>
              Related Resources
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
              {[
                {
                  title: "Getting Your API Key",
                  description: "Generate and manage API keys to access Karsilo data programmatically.",
                  href: "/resources/api-&-integrations/getting-your-api-key",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  ),
                },
                {
                  title: "Rate Limits Explained",
                  description: "Understand API rate limits and how to handle them in your integrations.",
                  href: "/resources/api-&-integrations/rate-limits-explained",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                },
                {
                  title: "Webhook Configuration",
                  description: "Set up webhooks to receive real-time event data in your applications.",
                  href: "/resources/api-&-integrations/webhook-configuration",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.003-.3.03-.6.08-.89a3.96 3.96 0 0 1 .78-1.63A4.02 4.02 0 0 1 6 13c.26 0 .51.03.77.08" />
                      <path d="M15 10.02c.48-.96 1.38-1.9 2.49-1.9H22a4 4 0 0 0-3.08-3.9A4 4 0 0 0 12 7c0 .26.03.51.08.76" />
                      <path d="M9.35 14.53C8.37 14.19 7.1 14 6 14c-1.1 0-1.96-.91-2.48-1.86A4 4 0 0 1 6 5c2.21 0 4 1.79 4 4 0 .26-.03.51-.08.76" />
                    </svg>
                  ),
                },
              ].map((resource, index) => (
                <FadeIn key={index} delay={0.5 + 0.05 * index}>
                  <Link href={resource.href} style={{ textDecoration: "none" }}>
                    <Box
                      p={5}
                      bg="white"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="gray.100"
                      boxShadow="sm"
                      transition="all 0.3s ease"
                      _hover={{ boxShadow: "md", borderColor: "gray.200", transform: "translateY(-2px)" }}
                      height="full"
                      cursor="pointer"
                    >
                      <Box p={2} bg="gray.100" borderRadius="lg" width="fit-content" color="gray.600" mb={3}>
                        {resource.icon}
                      </Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" mb={1}>
                        {resource.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500" lineHeight="1.5">
                        {resource.description}
                      </Text>
                      <HStack gap={1} mt={3} color="brand.600">
                        <Text fontSize="xs" fontWeight="medium">Read more</Text>
                        <ChevronRightIcon />
                      </HStack>
                    </Box>
                  </Link>
                </FadeIn>
              ))}
            </Grid>
          </Box>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <Box p={{ base: 8, md: 12 }} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" textAlign="center" position="relative" overflow="hidden">
            <Box position="absolute" top={0} right={0} width="250px" height="250px" bg="gray.100" opacity={0.5} borderRadius="full" transform="translate(30%, -30%)" />
            <Box position="absolute" bottom={0} left={0} width="180px" height="180px" bg="gray.100" opacity={0.3} borderRadius="full" transform="translate(-30%, 30%)" />
            <Box position="relative" zIndex={1}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
                Need help with the API?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Our engineering team is happy to help with integration questions. Reach out anytime.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/contact">
                  <Button size="lg" bg="gray.900" color="white" _hover={{ bg: "gray.800", transform: "translateY(-2px)" }} transition="all 0.2s">
                    Contact Support
                  </Button>
                </Link>
                <Link href="mailto:support@karsilo.com">
                  <Button size="lg" variant="outline" borderColor="gray.300" _hover={{ borderColor: "gray.400", bg: "gray.50" }}>
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