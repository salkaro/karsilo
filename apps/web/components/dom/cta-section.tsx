"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  Flex,
} from "@repo/ui/index";
import Link from "next/link";

export function CTASection() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="brand.600"
      position="relative"
      overflow="hidden"
    >
      {/* Background decorations */}
      <Box
        position="absolute"
        top={-100}
        right={-100}
        w={400}
        h={400}
        borderRadius="full"
        bg="brand.500"
        opacity={0.3}
      />
      <Box
        position="absolute"
        bottom={-150}
        left={-150}
        w={500}
        h={500}
        borderRadius="full"
        bg="brand.700"
        opacity={0.3}
      />

      <Container maxW="container.lg" position="relative" zIndex={1}>
        <Flex direction="column" align="center" textAlign="center" gap={8}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            color="white"
            lineHeight="1.2"
          >
            Ready to see your complete
            <br />
            revenue picture?
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="brand.100"
            maxW="2xl"
            lineHeight="1.7"
          >
            Join hundreds of SaaS founders who finally know exactly how much
            they're making across all their Stripe accounts.
          </Text>

          <HStack gap={4} flexWrap="wrap" justify="center" pt={4}>
            <Link href="/sign-up">
              <Button
                size="lg"
                px={10}
                py={6}
                fontSize="lg"
                fontWeight="semibold"
                bg="white"
                color="brand.600"
                borderRadius="lg"
                _hover={{
                  bg: "gray.100",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
                boxShadow="lg"
              >
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                px={10}
                py={6}
                fontSize="lg"
                fontWeight="semibold"
                variant="outline"
                borderColor="white"
                color="white"
                borderRadius="lg"
                borderWidth="2px"
                _hover={{
                  bg: "whiteAlpha.200",
                }}
                transition="all 0.2s"
              >
                Talk to Sales
              </Button>
            </Link>
          </HStack>

          <Text fontSize="sm" color="brand.200" pt={2}>
            No credit card required. 14-day free trial.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
