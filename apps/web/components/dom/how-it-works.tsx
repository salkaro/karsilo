"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
} from "@repo/ui/index";
import { FadeIn } from "./scroll-animations";

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepCardProps extends StepProps {
  isActive: boolean;
}

function StepCard({
  number,
  title,
  description,
  icon,
  isActive,
}: StepCardProps) {
  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="2xl"
      p={8}
      border="1px solid"
      borderColor={isActive ? "brand.300" : "gray.200"}
      boxShadow={isActive ? "xl" : "sm"}
      transform={isActive ? "translateY(-8px)" : "translateY(0)"}
      transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: "brand.300",
        boxShadow: "lg",
        transform: "translateY(-4px)",
      }}
    >
      {/* Step number badge */}
      <Box
        position="absolute"
        top={-4}
        left={8}
        w={8}
        h={8}
        borderRadius="full"
        bg={isActive ? "brand.500" : "brand.600"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={isActive ? "lg" : "md"}
        transform={isActive ? "scale(1.1)" : "scale(1)"}
        transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Text fontSize="sm" fontWeight="bold" color="white">
          {number}
        </Text>
      </Box>

      {/* Icon */}
      <Box
        w={14}
        h={14}
        borderRadius="xl"
        bg={isActive ? "brand.100" : "brand.50"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={5}
        mt={2}
        color="brand.600"
        transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {icon}
      </Box>

      <Heading
        as="h3"
        fontSize="xl"
        fontWeight="semibold"
        color="gray.900"
        mb={3}
      >
        {title}
      </Heading>
      <Text fontSize="md" color="gray.600" lineHeight="1.7">
        {description}
      </Text>
    </Box>
  );
}

// Decorative arrow for desktop
function StepArrow({ isActive }: { isActive: boolean }) {
  return (
    <Box
      display={{ base: "none", lg: "flex" }}
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="50%"
      right={-8}
      transform={`translateY(-50%) ${isActive ? "scale(1.2)" : "scale(1)"}`}
      zIndex={2}
      transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="20"
          fill={isActive ? "#ede9fe" : "#f5f3ff"}
          style={{ transition: "fill 0.5s ease" }}
        />
        <path
          d="M16 20H24M24 20L21 17M24 20L21 23"
          stroke={isActive ? "#7c3aed" : "#8b5cf6"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.5s ease" }}
        />
      </svg>
    </Box>
  );
}

// Icons
function ConnectIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps: StepProps[] = [
    {
      number: 1,
      icon: <ConnectIcon />,
      title: "Connect Your Accounts",
      description:
        "Securely link all your Stripe accounts using our OAuth integration. Read-only access keeps your data safe.",
    },
    {
      number: 2,
      icon: <SyncIcon />,
      title: "Automatic Sync",
      description:
        "Your revenue data syncs in real-time across all connected accounts. No manual imports or exports needed.",
    },
    {
      number: 3,
      icon: <AnalyzeIcon />,
      title: "Analyze & Grow",
      description:
        "View unified metrics, track performance, and make data-driven decisions with complete financial clarity.",
    },
  ];

  // Start animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cycle through steps when visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  return (
    <Box
      ref={sectionRef}
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="10%"
        left="-5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="brand.100"
        opacity={0.4}
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="brand.200"
        opacity={0.3}
        filter="blur(100px)"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Section header */}
        <FadeIn direction="up">
          <Box textAlign="center" mb={16}>
            <Flex justify="center" mb={4}>
              <Box
                px={4}
                py={1.5}
                bg="brand.100"
                borderRadius="full"
                border="1px solid"
                borderColor="brand.200"
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  How It Works
                </Text>
              </Box>
            </Flex>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              Get started in{" "}
              <Text as="span" color="brand.600">
                three simple steps
              </Text>
            </Heading>
            <Text
              fontSize="lg"
              color="gray.600"
              maxW="2xl"
              mx="auto"
              lineHeight="1.7"
            >
              No complex setup required. Connect your accounts and start seeing
              your complete revenue picture in minutes.
            </Text>
          </Box>
        </FadeIn>

        {/* Steps with connecting arrows */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
          gap={{ base: 12, lg: 16 }}
          position="relative"
        >
          {steps.map((step, index) => (
            <GridItem key={step.number} position="relative">
              <FadeIn delay={index * 0.15} direction="up">
                <StepCard {...step} isActive={activeStep === index} />
                {index < steps.length - 1 && (
                  <StepArrow isActive={activeStep === index} />
                )}
              </FadeIn>
            </GridItem>
          ))}
        </Grid>

        {/* Progress indicator dots */}
        <Flex justify="center" mt={10} gap={2}>
          {steps.map((_, index) => (
            <Box
              key={index}
              w={activeStep === index ? 6 : 2}
              h={2}
              borderRadius="full"
              bg={activeStep === index ? "brand.500" : "brand.200"}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          ))}
        </Flex>

        {/* Bottom decorative line */}
        <Box
          display={{ base: "none", lg: "block" }}
          position="absolute"
          top="60%"
          left="15%"
          right="15%"
          height="2px"
          zIndex={0}
        >
          <Box
            w="full"
            h="full"
            bgGradient="linear(to-r, transparent, brand.200, brand.300, brand.200, transparent)"
            borderRadius="full"
          />
        </Box>
      </Container>
    </Box>
  );
}
