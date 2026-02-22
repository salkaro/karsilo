import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from "@repo/ui/index";
import { FadeIn } from "../../components/dom/scroll-animations";

export const metadata = {
  title: "Accessibility | Karsilo",
  description:
    "Learn about Karsilo's commitment to accessibility and how we strive to make our platform usable for everyone.",
};

export default function AccessibilityPage() {
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
              Accessibility
            </Text>
          </Box>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.900"
            mb={4}
          >
            Accessibility Statement
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={10}>
            Karsilo is committed to making our platform accessible to everyone,
            regardless of ability or technology.
          </Text>
        </FadeIn>

        <VStack align="stretch" gap={6}>
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
                <Heading as="h2" fontSize="xl" color="gray.800">
                  Our Commitment
                </Heading>
                <Text fontSize="md" color="gray.700">
                  We strive to ensure that our website and services are
                  accessible to people with disabilities. We are continually
                  improving the user experience for everyone and applying the
                  relevant accessibility standards.
                </Text>
              </VStack>
            </Box>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Box
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack align="stretch" gap={4}>
                <Heading as="h2" fontSize="xl" color="gray.800">
                  Standards
                </Heading>
                <Text fontSize="md" color="gray.700">
                  We aim to conform to the Web Content Accessibility Guidelines
                  (WCAG) 2.1 at Level AA. These guidelines explain how to make
                  web content more accessible for people with disabilities and
                  more user-friendly for everyone.
                </Text>
              </VStack>
            </Box>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Box
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack align="stretch" gap={4}>
                <Heading as="h2" fontSize="xl" color="gray.800">
                  What We Do
                </Heading>
                <VStack align="stretch" gap={2} pl={4}>
                  <Text fontSize="sm" color="gray.600">
                    • Provide text alternatives for non-text content
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • Ensure sufficient colour contrast throughout the interface
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • Support keyboard navigation across the platform
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • Use semantic HTML and ARIA attributes where appropriate
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • Design responsive layouts that work across devices and
                    screen sizes
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • Test with assistive technologies including screen readers
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </FadeIn>

          <FadeIn delay={0.25}>
            <Box
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack align="stretch" gap={4}>
                <Heading as="h2" fontSize="xl" color="gray.800">
                  Feedback
                </Heading>
                <Text fontSize="md" color="gray.700">
                  We welcome your feedback on the accessibility of Karsilo. If
                  you encounter any accessibility barriers or have suggestions
                  for improvement, please contact us at{" "}
                  <Text as="span" color="brand.600" fontWeight="medium">
                    contact@salkaro.com
                  </Text>
                  . We aim to respond to accessibility feedback within 5
                  business days.
                </Text>
              </VStack>
            </Box>
          </FadeIn>
        </VStack>
      </Container>
    </Box>
  );
}
