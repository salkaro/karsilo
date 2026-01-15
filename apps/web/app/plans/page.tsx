"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  HStack,
  VStack,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  isCustom?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "Perfect for solo founders with a few Stripe accounts.",
    features: [
      "Up to 3 Stripe accounts",
      "Basic analytics dashboard",
      "Weekly email reports",
      "30-day data history",
      "Email support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    monthlyPrice: 79,
    yearlyPrice: 63,
    description: "For growing businesses managing multiple products.",
    features: [
      "Up to 10 Stripe accounts",
      "Advanced analytics & insights",
      "Real-time notifications",
      "1-year data history",
      "Priority support",
      "Custom reports",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For large organizations with complex requirements.",
    features: [
      "Unlimited Stripe accounts",
      "White-label dashboard",
      "Dedicated account manager",
      "Unlimited data history",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
      "SSO & advanced security",
    ],
    cta: "Contact Sales",
    isCustom: true,
  },
];

function CheckIcon() {
  return (
    <Box color="brand.500" flexShrink={0}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Box>
  );
}

function BillingToggle({
  isYearly,
  onToggle,
}: {
  isYearly: boolean;
  onToggle: () => void;
}) {
  return (
    <Flex align="center" justify="center" gap={4} mb={12}>
      <Text
        fontSize="md"
        fontWeight={!isYearly ? "semibold" : "normal"}
        color={!isYearly ? "gray.900" : "gray.500"}
        transition="all 0.2s"
      >
        Monthly
      </Text>
      <Box
        as="button"
        onClick={onToggle}
        position="relative"
        width="56px"
        height="28px"
        bg={isYearly ? "brand.600" : "gray.300"}
        borderRadius="full"
        cursor="pointer"
        transition="background 0.3s ease"
        _hover={{ bg: isYearly ? "brand.700" : "gray.400" }}
      >
        <Box
          position="absolute"
          top="2px"
          left={isYearly ? "30px" : "2px"}
          width="24px"
          height="24px"
          bg="white"
          borderRadius="full"
          boxShadow="md"
          transition="left 0.3s ease"
        />
      </Box>
      <HStack gap={2}>
        <Text
          fontSize="md"
          fontWeight={isYearly ? "semibold" : "normal"}
          color={isYearly ? "gray.900" : "gray.500"}
          transition="all 0.2s"
        >
          Yearly
        </Text>
        <Box
          px={2}
          py={0.5}
          bg="green.100"
          color="green.700"
          fontSize="xs"
          fontWeight="semibold"
          borderRadius="full"
        >
          Save 20%
        </Box>
      </HStack>
    </Flex>
  );
}

// Animated price component with rolling numbers
function AnimatedPrice({
  price,
  isYearly,
}: {
  price: number;
  isYearly: boolean;
}) {
  const [displayPrice, setDisplayPrice] = useState(price);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const currentDisplayRef = useRef(price);

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start from current displayed value, not the target
    const startPrice = currentDisplayRef.current;
    const endPrice = price;

    // If already at target, no animation needed
    if (Math.round(startPrice) === endPrice) {
      setDisplayPrice(endPrice);
      currentDisplayRef.current = endPrice;
      setIsAnimating(false);
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentPrice = startPrice + (endPrice - startPrice) * easeOut;

      setDisplayPrice(Math.round(currentPrice));
      currentDisplayRef.current = currentPrice;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayPrice(endPrice);
        currentDisplayRef.current = endPrice;
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [price]);

  return (
    <Box
      as="span"
      display="inline-block"
      style={{
        transform: isAnimating ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease",
      }}
    >
      ${displayPrice}
    </Box>
  );
}

function PricingCard({
  tier,
  isYearly,
}: {
  tier: PricingTier;
  isYearly: boolean;
}) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const yearlyTotal = tier.yearlyPrice * 12;
  const yearlySavings = (tier.monthlyPrice - tier.yearlyPrice) * 12;

  return (
    <Box
      position="relative"
      p={{ base: 6, md: 8 }}
      bg="white"
      borderRadius="2xl"
      boxShadow={tier.popular ? "xl" : "sm"}
      border="2px solid"
      borderColor={tier.popular ? "brand.500" : "gray.100"}
      transition="all 0.3s ease"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      height="full"
    >
      {tier.popular && (
        <Box
          position="absolute"
          top={-3}
          left="50%"
          transform="translateX(-50%)"
          px={4}
          py={1}
          bg="brand.600"
          color="white"
          fontSize="sm"
          fontWeight="semibold"
          borderRadius="full"
        >
          Most Popular
        </Box>
      )}

      <VStack align="stretch" gap={6} height="full">
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900" mb={2}>
            {tier.name}
          </Text>
          <HStack align="baseline" gap={1}>
            {tier.isCustom ? (
              <Text fontSize="4xl" fontWeight="bold" color="gray.900">
                Custom
              </Text>
            ) : (
              <>
                <Text fontSize="4xl" fontWeight="bold" color="gray.900">
                  <AnimatedPrice price={price} isYearly={isYearly} />
                </Text>
                <Box position="relative" height="20px" overflow="hidden">
                  {/* Monthly text */}
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    position="absolute"
                    left={0}
                    style={{
                      transform: isYearly
                        ? "translateY(-100%)"
                        : "translateY(0)",
                      opacity: isYearly ? 0 : 1,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    /month
                  </Text>
                  {/* Yearly text */}
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    position="absolute"
                    left={0}
                    style={{
                      transform: isYearly
                        ? "translateY(0)"
                        : "translateY(100%)",
                      opacity: isYearly ? 1 : 0,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    /mo, billed yearly
                  </Text>
                </Box>
              </>
            )}
          </HStack>

          {/* Savings info with slide animation */}
          <Box
            height={isYearly && !tier.isCustom ? "20px" : "0px"}
            overflow="hidden"
            transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Text
              fontSize="xs"
              color="green.600"
              mt={1}
              style={{
                transform: isYearly ? "translateY(0)" : "translateY(-10px)",
                opacity: isYearly ? 1 : 0,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: isYearly ? "0.1s" : "0s",
              }}
            >
              ${yearlyTotal}/year (save ${yearlySavings})
            </Text>
          </Box>

          <Text fontSize="sm" color="gray.600" mt={2}>
            {tier.description}
          </Text>
        </Box>

        <VStack align="stretch" gap={3} flex={1}>
          {tier.features.map((feature, index) => (
            <HStack key={index} gap={3} align="flex-start">
              <CheckIcon />
              <Text fontSize="sm" color="gray.700">
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Link href={tier.isCustom ? "/contact" : "/sign-up"}>
          <Button
            width="full"
            size="lg"
            bg={tier.popular ? "brand.600" : "white"}
            color={tier.popular ? "white" : "gray.900"}
            border="2px solid"
            borderColor={tier.popular ? "brand.600" : "gray.200"}
            _hover={{
              bg: tier.popular ? "brand.700" : "gray.50",
              borderColor: tier.popular ? "brand.700" : "gray.300",
            }}
          >
            {tier.cta}
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default function PlansPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="gray.50" minH="100vh">
      <Container maxW="container.xl">
        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={8}>
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Pricing
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              Simple, transparent pricing
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Choose the plan that fits your business. All plans include a
              14-day free trial with no credit card required.
            </Text>
          </Flex>
        </FadeIn>

        <FadeIn delay={0.1}>
          <BillingToggle
            isYearly={isYearly}
            onToggle={() => setIsYearly(!isYearly)}
          />
        </FadeIn>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          maxW="5xl"
          mx="auto"
        >
          {pricingTiers.map((tier, index) => (
            <FadeIn key={tier.name} delay={0.15 + 0.1 * index} direction="up">
              <PricingCard tier={tier} isYearly={isYearly} />
            </FadeIn>
          ))}
        </Grid>

        <FadeIn delay={0.5}>
          <Box mt={16} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              All prices in USD. Cancel anytime.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Need help choosing?{" "}
              <Link href="/contact">
                <Text as="span" color="brand.600" fontWeight="medium">
                  Talk to our team
                </Text>
              </Link>
            </Text>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
