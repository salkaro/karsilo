"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  Input,
  HStack,
} from "@repo/ui/index";
import Link from "next/link";
import Image from "next/image";

function CheckIcon() {
  return (
    <Box color="brand.500" flexShrink={0}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Box>
  );
}

export default function SignUpPage() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Flex minH="calc(100vh - 64px)">
        {/* Left side - Form */}
        <Flex
          flex={1}
          direction="column"
          justify="center"
          align="center"
          p={{ base: 6, md: 12 }}
        >
          <Box maxW="md" width="full">
            <VStack align="stretch" gap={8}>
              <Box textAlign="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb={2}
                >
                  Start your free trial
                </Heading>
                <Text fontSize="md" color="gray.600">
                  No credit card required. Get started in minutes.
                </Text>
              </Box>

              <VStack as="form" gap={4}>
                <Box width="full">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Full name
                  </Text>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    size="lg"
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      border: "2px solid",
                      borderColor: "brand.500",
                      boxShadow: "none",
                      outline: "none",
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
                      border: "2px solid",
                      borderColor: "brand.500",
                      boxShadow: "none",
                      outline: "none",
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
                    Password
                  </Text>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    size="lg"
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      border: "2px solid",
                      borderColor: "brand.500",
                      boxShadow: "none",
                      outline: "none",
                    }}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Must be at least 8 characters
                  </Text>
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
                  Create Account
                </Button>
              </VStack>

              <Box position="relative" textAlign="center">
                <Box
                  position="absolute"
                  top="50%"
                  left={0}
                  right={0}
                  height="1px"
                  bg="gray.200"
                />
                <Text
                  position="relative"
                  display="inline-block"
                  px={4}
                  bg="gray.50"
                  fontSize="sm"
                  color="gray.500"
                >
                  Or continue with
                </Text>
              </Box>

              <Button
                width="full"
                size="lg"
                variant="outline"
                borderColor="gray.300"
                _hover={{ bg: "gray.100" }}
              >
                <HStack gap={2}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <Text>Continue with Google</Text>
                </HStack>
              </Button>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Already have an account?{" "}
                <Link href="/login">
                  <Text as="span" color="brand.600" fontWeight="medium">
                    Sign in
                  </Text>
                </Link>
              </Text>
            </VStack>
          </Box>
        </Flex>

        {/* Right side - Benefits */}
        <Flex
          flex={1}
          direction="column"
          justify="center"
          p={{ base: 6, md: 12 }}
          bg="brand.600"
          display={{ base: "none", lg: "flex" }}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative purple circles */}
          <Box
            position="absolute"
            top="-100px"
            right="-80px"
            width="350px"
            height="350px"
            bg="brand.500"
            opacity={0.3}
            borderRadius="full"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-120px"
            left="-100px"
            width="400px"
            height="400px"
            bg="brand.500"
            opacity={0.25}
            borderRadius="full"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            top="40%"
            right="-60px"
            width="200px"
            height="200px"
            bg="brand.400"
            opacity={0.2}
            borderRadius="full"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="20%"
            left="-40px"
            width="150px"
            height="150px"
            bg="brand.500"
            opacity={0.15}
            borderRadius="full"
            pointerEvents="none"
          />

          <Box maxW="md" position="relative" zIndex={1}>
            <HStack gap={3} mb={8}>
              <Image
                src="/KarsiloLogo.png"
                alt="Karsilo"
                width={40}
                height={40}
              />
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Karsilo
              </Text>
            </HStack>

            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color="white"
              mb={6}
              lineHeight="1.3"
            >
              Join thousands of founders who trust Karsilo
            </Heading>

            <VStack align="stretch" gap={4}>
              {[
                "Connect unlimited Stripe accounts",
                "Real-time revenue dashboard",
                "Automated weekly reports",
                "Bank-level security",
                "Cancel anytime, no questions asked",
              ].map((benefit, index) => (
                <HStack key={index} gap={3}>
                  <Box
                    p={1}
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    color="white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </Box>
                  <Text fontSize="md" color="white">
                    {benefit}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Box mt={12} p={6} bg="whiteAlpha.100" borderRadius="xl">
              <Text fontSize="md" color="white" fontStyle="italic" mb={4}>
                "Karsilo saved me hours every week. I finally know exactly how
                much I'm making across all my products."
              </Text>
              <Text fontSize="sm" color="brand.200">
                — Sarah Chen, Founder of 3 SaaS products
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
