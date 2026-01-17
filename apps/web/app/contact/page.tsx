"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Input,
  Grid,
} from "@repo/ui/index";
import { FadeIn } from "../../components/dom/scroll-animations";

export default function ContactPage() {
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

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
          {/* Left side - Contact info */}
          <FadeIn direction="left">
            <Box>
              <Box mb={4}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.600"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Contact Us
                </Text>
              </Box>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color="gray.900"
                mb={4}
              >
                Let's talk about your needs
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={8}>
                Whether you have questions about our product, need help with
                your account, or want to discuss enterprise solutions, we're
                here to help.
              </Text>

              <VStack align="stretch" gap={6}>
                {[
                  {
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    title: "Email",
                    value: "hello@karsilo.com",
                    description: "We'll respond within 24 hours",
                  },
                  {
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    title: "Office",
                    value: "San Francisco, CA",
                    description: "Mon-Fri, 9am-6pm PST",
                  },
                  {
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                    title: "Phone",
                    value: "+1 (555) 123-4567",
                    description: "Enterprise customers only",
                  },
                ].map((item, index) => (
                  <HStack key={index} gap={4} align="flex-start">
                    <Box
                      p={3}
                      bg="brand.50"
                      borderRadius="xl"
                      color="brand.600"
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="gray.500">
                        {item.title}
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        color="gray.900"
                      >
                        {item.value}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.description}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </FadeIn>

          {/* Right side - Contact form */}
          <FadeIn direction="right" delay={0.2}>
            <Box
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="bold"
                color="gray.900"
                mb={6}
              >
                Send us a message
              </Heading>

              <VStack as="form" gap={4}>
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={4}
                  width="full"
                >
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      First name
                    </Text>
                    <Input
                      type="text"
                      placeholder="John"
                      size="lg"
                      bg="white"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                  </Box>
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Last name
                    </Text>
                    <Input
                      type="text"
                      placeholder="Doe"
                      size="lg"
                      bg="white"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                  </Box>
                </Grid>

                <Box width="full">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Work email
                  </Text>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    size="lg"
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                  />
                </Box>

                <Box width="full">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Company
                  </Text>
                  <Input
                    type="text"
                    placeholder="Acme Inc."
                    size="lg"
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                  />
                </Box>

                <Box width="full">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    How can we help?
                  </Text>
                  <textarea
                    placeholder="Tell us about your needs..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      fontSize: "1rem",
                      resize: "vertical",
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  width="full"
                  size="lg"
                  bg="brand.600"
                  color="white"
                  _hover={{ bg: "brand.700" }}
                  mt={2}
                >
                  Send Message
                </Button>

                <Text fontSize="xs" color="gray.500" textAlign="center">
                  By submitting this form, you agree to our{" "}
                  <Text as="span" color="brand.600">
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </VStack>
            </Box>
          </FadeIn>
        </Grid>
      </Container>
    </Box>
  );
}
