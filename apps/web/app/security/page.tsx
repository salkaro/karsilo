import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";
import { SECURITY_URL } from "../../components/constants/links";

export const metadata = {
  title: "Security | Karsilo",
  description:
    "Learn about the security measures Karsilo uses to protect your data and accounts.",
};

export default function SecurityPage() {
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

      <Container maxW="container.md" position="relative" zIndex={1}>
        <FadeIn>
          <Box mb={4}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="brand.600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Legal
            </Text>
          </Box>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.900"
            mb={4}
          >
            Security
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={10}>
            We take the security of your data seriously. Learn about the
            measures we use to keep your information safe.
          </Text>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Box
            p={{ base: 6, md: 8 }}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack align="stretch" gap={4}>
              <Text fontSize="md" color="gray.700">
                Karsilo is built with security at every layer. Our security
                practices include:
              </Text>
              <VStack align="stretch" gap={2} pl={4}>
                <Text fontSize="sm" color="gray.600">
                  • Encryption at rest and in transit (TLS 1.2+)
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • OAuth-only Stripe access — we never store your Stripe
                  credentials
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • No plain-text credential storage
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Secure session management with automatic expiry
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Regular security audits and vulnerability assessments
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Role-based access controls for team accounts
                </Text>
              </VStack>
              <Box pt={4}>
                <Link
                  href={SECURITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    bg="brand.600"
                    color="white"
                    _hover={{ bg: "brand.700" }}
                  >
                    Read Security Documentation
                  </Button>
                </Link>
              </Box>
            </VStack>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
