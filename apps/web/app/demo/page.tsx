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
  Grid,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";

function PlayIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="white" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export default function DemoPage() {
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
        top="-80px"
        left="-100px"
        width="300px"
        height="300px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="-80px"
        width="350px"
        height="350px"
        bg="gray.200"
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
        bg="gray.300"
        opacity={0.15}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Product Demo
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              See Karsilo in action
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Watch how Karsilo unifies all your Stripe accounts into one
              powerful dashboard.
            </Text>
          </Flex>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Box
            position="relative"
            maxW="4xl"
            mx="auto"
            mb={16}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            bg="gray.900"
            aspectRatio="16/9"
          >
            {/* Video placeholder */}
            <Flex
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              align="center"
              justify="center"
              bg="linear-gradient(135deg, #1f2937 0%, #111827 100%)"
              cursor="pointer"
              _hover={{ "& > div": { transform: "scale(1.1)" } }}
            >
              <Box
                p={6}
                bg="brand.600"
                borderRadius="full"
                transition="transform 0.3s ease"
                boxShadow="0 0 60px rgba(124, 58, 237, 0.5)"
              >
                <PlayIcon />
              </Box>
            </Flex>

            {/* Decorative elements */}
            <Box
              position="absolute"
              top={4}
              left={4}
              right={4}
              display="flex"
              gap={2}
            >
              <Box w={3} h={3} borderRadius="full" bg="red.400" opacity={0.8} />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="yellow.400"
                opacity={0.8}
              />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="green.400"
                opacity={0.8}
              />
            </Box>
          </Box>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            mb={16}
          >
            {[
              {
                time: "0:00",
                title: "Connecting Stripe Accounts",
                description:
                  "See how easy it is to connect multiple Stripe accounts with just a few clicks.",
              },
              {
                time: "2:30",
                title: "Dashboard Overview",
                description:
                  "Explore the unified dashboard showing all your revenue streams in one place.",
              },
              {
                time: "5:00",
                title: "Reports & Insights",
                description:
                  "Learn how to generate custom reports and set up automated email summaries.",
              },
            ].map((chapter, index) => (
              <Box
                key={index}
                p={6}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ boxShadow: "md", borderColor: "brand.200" }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.600"
                  mb={2}
                >
                  {chapter.time}
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color="gray.900"
                  mb={2}
                >
                  {chapter.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {chapter.description}
                </Text>
              </Box>
            ))}
          </Grid>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Box
            p={{ base: 8, md: 12 }}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={8}
              alignItems="center"
            >
              <Box>
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb={4}
                >
                  Ready to try it yourself?
                </Heading>
                <Text fontSize="md" color="gray.600" mb={6}>
                  Start your free 14-day trial and connect your first Stripe
                  account in under 2 minutes.
                </Text>
                <HStack gap={4} flexWrap="wrap">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      bg="brand.600"
                      color="white"
                      _hover={{ bg: "brand.700" }}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" borderColor="gray.300">
                      Schedule a Call
                    </Button>
                  </Link>
                </HStack>
              </Box>
              <VStack align="stretch" gap={3}>
                {[
                  "No credit card required",
                  "Connect unlimited accounts",
                  "Full feature access",
                  "Cancel anytime",
                ].map((item, index) => (
                  <HStack key={index} gap={3}>
                    <Box color="brand.500">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Box>
                    <Text fontSize="md" color="gray.700">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Grid>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
