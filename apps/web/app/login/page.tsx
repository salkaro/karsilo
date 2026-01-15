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

export default function LoginPage() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Flex minH="calc(100vh - 64px)" justify="center" align="center" p={6}>
        <Box maxW="md" width="full">
          <VStack align="stretch" gap={8}>
            <Flex direction="column" align="center" gap={4}>
              <Link href="/">
                <HStack gap={2}>
                  <Image
                    src="/KarsiloLogo.png"
                    alt="Karsilo"
                    width={40}
                    height={40}
                  />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Karsilo
                  </Text>
                </HStack>
              </Link>
              <Box textAlign="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb={2}
                >
                  Welcome back
                </Heading>
                <Text fontSize="md" color="gray.600">
                  Sign in to access your dashboard
                </Text>
              </Box>
            </Flex>

            <Box
              p={{ base: 6, md: 8 }}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack as="form" gap={4}>
                <Box width="full">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Email
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
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Password
                    </Text>
                    <Link href="/forgot-password">
                      <Text fontSize="sm" color="brand.600" fontWeight="medium">
                        Forgot password?
                      </Text>
                    </Link>
                  </Flex>
                  <Input
                    type="password"
                    placeholder="Enter your password"
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

                <Button
                  type="submit"
                  width="full"
                  size="lg"
                  bg="brand.600"
                  color="white"
                  _hover={{ bg: "brand.700" }}
                  mt={2}
                >
                  Sign In
                </Button>
              </VStack>

              <Box position="relative" textAlign="center" my={6}>
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
                  bg="white"
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
                _hover={{ bg: "gray.50" }}
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
            </Box>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              Don't have an account?{" "}
              <Link href="/sign-up">
                <Text as="span" color="brand.600" fontWeight="medium">
                  Sign up for free
                </Text>
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
