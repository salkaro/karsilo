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
import { TERMS_OF_SERVICE_URL } from "../../components/constants/links";

export const metadata = {
  title: "Terms of Service | Karsilo",
  description:
    "Review the terms and conditions that govern your use of the Karsilo platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={10}>
            Please review the terms and conditions that govern your use of the
            Karsilo platform and services.
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
                Our Terms of Service outline the rules and guidelines for using
                Karsilo. Key areas covered include:
              </Text>
              <VStack align="stretch" gap={2} pl={4}>
                <Text fontSize="sm" color="gray.600">
                  • Account registration and user responsibilities
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Acceptable use of the platform
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Payment terms and billing
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Intellectual property rights
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Limitation of liability and disclaimers
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Termination and account suspension
                </Text>
              </VStack>
              <Box pt={4}>
                <Link
                  href={TERMS_OF_SERVICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    bg="brand.600"
                    color="white"
                    _hover={{ bg: "brand.700" }}
                  >
                    Read Full Terms of Service
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
