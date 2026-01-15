"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  VStack,
  HStack,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../components/dom/scroll-animations";

interface Solution {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { value: string; label: string }[];
  color: string;
  icon: React.ReactNode;
}

const solutions: Solution[] = [
  {
    id: "founders",
    title: "For Solo Founders",
    subtitle: "Multiple Side Projects",
    description:
      "Running multiple side projects? Get a unified view of all your revenue streams without switching between Stripe dashboards. Track what's growing and what needs attention.",
    features: [
      "Aggregate revenue from all projects",
      "Track which products are growing",
      "Simple, no-code setup",
      "Weekly digest emails",
    ],
    stats: [
      { value: "5+", label: "Projects" },
      { value: "$50K+", label: "MRR" },
      { value: "2min", label: "Setup" },
    ],
    color: "brand",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 40v-3a12 12 0 0 1 24 0v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "agencies",
    title: "For Agencies",
    subtitle: "Client Payment Management",
    description:
      "Managing payments for multiple clients? Keep client finances separate while viewing your total agency revenue. Generate white-label reports in seconds.",
    features: [
      "Client-by-client breakdown",
      "White-label reporting",
      "Team member access controls",
      "Automated client reports",
    ],
    stats: [
      { value: "20+", label: "Clients" },
      { value: "$200K+", label: "Managed" },
      { value: "5", label: "Team Size" },
    ],
    color: "purple",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="26" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="36" cy="26" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 15v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 21l-9 5M24 21l9 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 40v-2a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2M31 40v-2a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "holding",
    title: "For Holding Companies",
    subtitle: "Portfolio Visibility",
    description:
      "Own multiple businesses with separate Stripe accounts? Get portfolio-level visibility into all your companies. Compare performance and spot trends across entities.",
    features: [
      "Portfolio-wide analytics",
      "Company comparison views",
      "Consolidated reporting",
      "Investment tracking",
    ],
    stats: [
      { value: "10+", label: "Companies" },
      { value: "$1M+", label: "Revenue" },
      { value: "360", label: "Visibility" },
    ],
    color: "violet",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect
          x="6"
          y="6"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="6"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="6"
          y="26"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="26"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.2" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "marketplaces",
    title: "For Marketplaces",
    subtitle: "Platform & Seller Insights",
    description:
      "Running a marketplace with connected accounts? Monitor your platform fees and seller payouts in one place. Get fraud alerts and reconciliation tools.",
    features: [
      "Platform fee tracking",
      "Seller performance metrics",
      "Payout reconciliation",
      "Fraud detection alerts",
    ],
    stats: [
      { value: "100+", label: "Sellers" },
      { value: "$500K+", label: "GMV" },
      { value: "24/7", label: "Monitoring" },
    ],
    color: "indigo",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M8 16h32v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V16z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 16V12a8 8 0 0 1 16 0v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="28" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 32v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// Interactive dashboard visualization
function DashboardVisualization({
  activeSolution,
}: {
  activeSolution: Solution;
}) {
  const [hoveredAccount, setHoveredAccount] = useState<number | null>(null);
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  const accounts = [
    { name: "Product A", revenue: 12400, growth: 23 },
    { name: "Product B", revenue: 8200, growth: 12 },
    { name: "Product C", revenue: 15600, growth: 45 },
    { name: "Product D", revenue: 6800, growth: -5 },
    { name: "Product E", revenue: 9400, growth: 18 },
  ];

  const total = accounts.reduce((sum, acc) => sum + acc.revenue, 0);

  // Animate bars on mount
  useState(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(accounts.map((acc) => (acc.revenue / total) * 100));
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Box
      position="relative"
      bg="gray.900"
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top={0}
        right={0}
        width="200px"
        height="200px"
        bg="brand.500"
        opacity={0.05}
        borderRadius="full"
        transform="translate(50%, -50%)"
      />
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="150px"
        height="150px"
        bg="brand.500"
        opacity={0.03}
        borderRadius="full"
        transform="translate(-50%, 50%)"
      />

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>
            Total Revenue
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="white">
            ${total.toLocaleString()}
          </Text>
        </Box>
        <Box
          px={3}
          py={1}
          borderRadius="full"
          style={{ background: "linear-gradient(to right, #22c55e, #4ade80)" }}
        >
          <Text fontSize="sm" fontWeight="semibold" color="white">
            +28% this month
          </Text>
        </Box>
      </Flex>

      {/* Account bars */}
      <VStack align="stretch" gap={3}>
        {accounts.map((account, index) => {
          const percentage = (account.revenue / total) * 100;
          const isHovered = hoveredAccount === index;

          return (
            <Box
              key={account.name}
              onMouseEnter={() => setHoveredAccount(index)}
              onMouseLeave={() => setHoveredAccount(null)}
              cursor="pointer"
              style={{
                transition: "all 0.2s ease",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
              }}
            >
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.300">
                  {account.name}
                </Text>
                <HStack gap={3}>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    ${account.revenue.toLocaleString()}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={account.growth >= 0 ? "green.400" : "red.400"}
                  >
                    {account.growth >= 0 ? "+" : ""}
                    {account.growth}%
                  </Text>
                </HStack>
              </Flex>
              <Box
                position="relative"
                height="10px"
                bg="gray.800"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  borderRadius="full"
                  style={{
                    width: `${percentage}%`,
                    background: isHovered
                      ? "linear-gradient(to right, #a78bfa, #8b5cf6)"
                      : "linear-gradient(to right, #7c3aed, #8b5cf6)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered
                      ? "0 0 20px rgba(139, 92, 246, 0.6)"
                      : "none",
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </VStack>

      {/* Bottom stats */}
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={4}
        mt={6}
        pt={6}
        borderTop="1px solid"
        borderColor="gray.800"
      >
        {activeSolution.stats.map((stat, index) => (
          <Box key={index} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="brand.400">
              {stat.value}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {stat.label}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

// Animated graphic showing sales flowing into a central collection
function FloatingGraphic() {
  const [total, setTotal] = useState(15700);

  // Animate the total up and down
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 200) - 50;
      setTotal((prev) => Math.max(14000, Math.min(17000, prev + change)));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const formatTotal = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <Box
      display={{ base: "none", lg: "block" }}
      position="relative"
      mt={6}
      height="280px"
    >
      <style>
        {`
          @keyframes sale1 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(140px, 80px) scale(0.5); opacity: 0; }
          }
          @keyframes sale2 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(90px, -20px) scale(0.5); opacity: 0; }
          }
          @keyframes sale3 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(-100px, 60px) scale(0.5); opacity: 0; }
          }
          @keyframes sale4 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(-80px, -40px) scale(0.5); opacity: 0; }
          }
          @keyframes sale5 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(60px, 100px) scale(0.5); opacity: 0; }
          }
          @keyframes sale6 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(-120px, -10px) scale(0.5); opacity: 0; }
          }
          @keyframes centerPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.02); }
          }
          @keyframes ringPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
          }
        `}
      </style>

      {/* Outer ring */}
      <Box
        position="absolute"
        left="50%"
        top="50%"
        width="200px"
        height="200px"
        borderRadius="full"
        border="2px dashed"
        borderColor="brand.200"
        style={{ animation: "ringPulse 3s ease-in-out infinite" }}
      />

      {/* Sale 1 - Top left - Product A */}
      <Box
        position="absolute"
        left="20px"
        top="30px"
        style={{ animation: "sale1 3s ease-in-out infinite" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product A
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$49
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Sale 2 - Bottom left - Product B */}
      <Box
        position="absolute"
        left="40px"
        bottom="40px"
        style={{ animation: "sale2 3.5s ease-in-out infinite 0.5s" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product B
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$129
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Sale 3 - Top right - Product C */}
      <Box
        position="absolute"
        right="30px"
        top="20px"
        style={{ animation: "sale3 2.8s ease-in-out infinite 1s" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product C
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$79
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Sale 4 - Bottom right - Product D */}
      <Box
        position="absolute"
        right="20px"
        bottom="60px"
        style={{ animation: "sale4 3.2s ease-in-out infinite 1.5s" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product D
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$199
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Sale 5 - Left middle - Product E */}
      <Box
        position="absolute"
        left="10px"
        top="50%"
        style={{ animation: "sale5 2.5s ease-in-out infinite 2s" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product E
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$29
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Sale 6 - Right middle-top - Product F */}
      <Box
        position="absolute"
        right="10px"
        top="35%"
        style={{ animation: "sale6 3.8s ease-in-out infinite 2.5s" }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          px={2}
          py={1.5}
          boxShadow="md"
          border="1px solid"
          borderColor="green.200"
        >
          <VStack gap={0} align="start">
            <Text fontSize="2xs" color="gray.400" lineHeight="1">
              Product F
            </Text>
            <HStack gap={1.5}>
              <Box
                width="6px"
                height="6px"
                borderRadius="full"
                bg="green.400"
              />
              <Text fontSize="xs" fontWeight="semibold" color="green.600">
                +$99
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Central collection pot */}
      <Box
        position="absolute"
        left="50%"
        top="50%"
        style={{ animation: "centerPulse 2s ease-in-out infinite" }}
      >
        <Box
          bg="brand.600"
          borderRadius="full"
          width="90px"
          height="90px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 10px 40px rgba(139, 92, 246, 0.4)"
        >
          <Text
            fontSize="xs"
            color="whiteAlpha.800"
            fontWeight="medium"
            mb={-0.5}
          >
            Total
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="white"
            style={{ transition: "all 0.3s ease" }}
          >
            {formatTotal(total)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

// Floating connection lines animation
function ConnectionLines() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      pointerEvents="none"
      opacity={0.3}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,150 Q100,50 200,150 T400,150"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,100 Q100,200 200,100 T400,100"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 3"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="18"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,200 Q100,100 200,200 T400,200"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 2"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </Box>
  );
}

// Solution card with 3D tilt effect
function SolutionCard({
  solution,
  isActive,
  onClick,
}: {
  solution: Solution;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="pointer"
      position="relative"
      p={{ base: 5, md: 6 }}
      bg={isActive ? "white" : "gray.50"}
      borderRadius="2xl"
      border="2px solid"
      borderColor={
        isActive ? "brand.500" : isHovered ? "brand.200" : "gray.100"
      }
      boxShadow={isActive ? "xl" : isHovered ? "lg" : "sm"}
      transition="all 0.3s ease"
      style={{
        transform: isHovered
          ? "perspective(1000px) rotateX(-2deg) rotateY(2deg) translateY(-4px)"
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      }}
    >
      {isActive && (
        <Box
          position="absolute"
          top={-1}
          right={4}
          px={3}
          py={1}
          bg="brand.500"
          borderRadius="0 0 8px 8px"
        >
          <Text fontSize="xs" fontWeight="semibold" color="white">
            Selected
          </Text>
        </Box>
      )}

      <Flex gap={4} align="flex-start">
        <Box
          p={3}
          bg={isActive ? "brand.50" : "gray.100"}
          borderRadius="xl"
          color={isActive ? "brand.600" : "gray.500"}
          transition="all 0.3s ease"
        >
          {solution.icon}
        </Box>
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
            {solution.title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {solution.subtitle}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

// Gradient background
function GradientBackground() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={0}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="50%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
          <linearGradient id="bgGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrad1)" />
        <circle cx="20%" cy="30%" r="300" fill="url(#bgGrad2)" />
        <circle cx="80%" cy="70%" r="400" fill="url(#bgGrad2)" />
        <circle cx="60%" cy="10%" r="250" fill="url(#bgGrad2)" />
      </svg>
      {/* Decorative grid lines */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.4}
        backgroundImage="linear-gradient(to right, #d0d5dd 1px, transparent 1px), linear-gradient(to bottom, #d0d5dd 1px, transparent 1px)"
        backgroundSize="80px 80px"
      />
    </Box>
  );
}

export default function SolutionsPage() {
  const [activeSolution, setActiveSolution] = useState<Solution>(solutions[0]!);

  return (
    <Box as="section" position="relative" minH="100vh" overflow="hidden">
      <GradientBackground />

      <Container
        maxW="container.xl"
        position="relative"
        zIndex={1}
        py={{ base: 16, md: 24 }}
      >
        {/* Header */}
        <FadeIn>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            mb={{ base: 12, md: 16 }}
          >
            <Box
              display="inline-flex"
              alignItems="center"
              gap={2}
              px={4}
              py={2}
              bg="brand.100"
              borderRadius="full"
              mb={4}
            >
              <Box w={2} h={2} borderRadius="full" bg="brand.500" />
              <Text fontSize="sm" fontWeight="medium" color="brand.700">
                Built for Every Use Case
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
              lineHeight="1.2"
            >
              One Dashboard,{" "}
              <Text as="span" color="brand.600">
                Endless Possibilities
              </Text>
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Whether you're a solo founder or managing a portfolio of
              companies, Karsilo adapts to how you work.
            </Text>
          </Flex>
        </FadeIn>

        {/* Main content grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1.2fr" }}
          gap={{ base: 8, lg: 12 }}
          alignItems="start"
        >
          {/* Left - Solution cards */}
          <FadeIn direction="left" delay={0.1}>
            <Box>
              <VStack align="stretch" gap={4}>
                {solutions.map((solution, index) => (
                  <FadeIn
                    key={solution.id}
                    delay={0.1 + index * 0.05}
                    direction="left"
                  >
                    <SolutionCard
                      solution={solution}
                      isActive={activeSolution.id === solution.id}
                      onClick={() => setActiveSolution(solution)}
                    />
                  </FadeIn>
                ))}
              </VStack>
              <FadeIn delay={0.4} direction="up">
                <FloatingGraphic />
              </FadeIn>
            </Box>
          </FadeIn>

          {/* Right - Details and visualization */}
          <FadeIn direction="right" delay={0.2}>
            <Box position="sticky" top="100px">
              {/* Solution details */}
              <Box
                position="relative"
                bg="white"
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
                boxShadow="xl"
                mb={6}
                overflow="hidden"
              >
                <ConnectionLines />

                <Box position="relative" zIndex={1}>
                  <HStack gap={4} mb={4}>
                    <Box
                      p={4}
                      bg="brand.50"
                      borderRadius="xl"
                      color="brand.600"
                    >
                      {activeSolution.icon}
                    </Box>
                    <Box>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                        {activeSolution.title}
                      </Text>
                      <Text fontSize="md" color="brand.600">
                        {activeSolution.subtitle}
                      </Text>
                    </Box>
                  </HStack>

                  <Text fontSize="md" color="gray.600" lineHeight="1.8" mb={6}>
                    {activeSolution.description}
                  </Text>

                  <VStack align="stretch" gap={3} mb={6}>
                    {activeSolution.features.map((feature, index) => (
                      <HStack key={index} gap={3}>
                        <Box
                          p={1}
                          bg="brand.100"
                          borderRadius="full"
                          color="brand.600"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Text fontSize="sm" color="gray.700">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      width="full"
                      bg="brand.600"
                      color="white"
                      _hover={{
                        bg: "brand.700",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </Box>
              </Box>

              {/* Dashboard visualization */}
              <FadeIn delay={0.3} direction="up">
                <DashboardVisualization activeSolution={activeSolution} />
              </FadeIn>
            </Box>
          </FadeIn>
        </Grid>

        {/* Bottom CTA */}
        <FadeIn delay={0.5}>
          <Box
            mt={{ base: 16, md: 24 }}
            p={{ base: 8, md: 12 }}
            bg="gray.900"
            borderRadius="2xl"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top={0}
              right={0}
              width="300px"
              height="300px"
              bg="brand.500"
              opacity={0.1}
              borderRadius="full"
              transform="translate(30%, -30%)"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              width="200px"
              height="200px"
              bg="brand.500"
              opacity={0.05}
              borderRadius="full"
              transform="translate(-30%, 30%)"
            />

            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={8}
              alignItems="center"
              position="relative"
              zIndex={1}
            >
              <Box>
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="white"
                  mb={4}
                >
                  Not sure which solution fits?
                </Heading>
                <Text fontSize="lg" color="gray.400" mb={6}>
                  Our team can help you find the perfect setup for your specific
                  situation. Schedule a free consultation call.
                </Text>
                <HStack gap={4} flexWrap="wrap">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      bg="white"
                      color="gray.900"
                      _hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      Talk to Us
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.400", bg: "whiteAlpha.100" }}
                    >
                      Watch Demo
                    </Button>
                  </Link>
                </HStack>
              </Box>
              <VStack align="stretch" gap={4}>
                {[
                  { icon: "clock", text: "Free 30-minute consultation" },
                  { icon: "users", text: "Personalized onboarding" },
                  { icon: "shield", text: "Migration assistance included" },
                ].map((item, index) => (
                  <HStack key={index} gap={3}>
                    <Box
                      p={2}
                      bg="brand.500"
                      borderRadius="lg"
                      color="white"
                      opacity={0.9}
                    >
                      {item.icon === "clock" && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      )}
                      {item.icon === "users" && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                      {item.icon === "shield" && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                    </Box>
                    <Text fontSize="md" color="gray.300">
                      {item.text}
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
