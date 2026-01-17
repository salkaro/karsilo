"use client";

import React, { useState, useEffect, useRef } from "react";
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
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
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
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

// Rolling number animation component
function RollingNumber({
  value,
  prefix = "",
  fontSize = "3xl",
  color = "white",
}: {
  value: number;
  prefix?: string;
  fontSize?: string;
  color?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) return;

    const startValue = prevValueRef.current;
    const endValue = value;
    const diff = endValue - startValue;
    const duration = 400;
    const steps = 20;
    let step = 0;

    setIsAnimating(true);

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + diff * eased));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
        setTimeout(() => setIsAnimating(false), 100);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Text
      fontSize={fontSize}
      fontWeight="bold"
      color={color}
      style={{
        transition: "text-shadow 0.3s ease",
        textShadow: isAnimating ? "0 0 15px rgba(139, 92, 246, 0.5)" : "none",
      }}
    >
      {prefix}
      {displayValue.toLocaleString()}
    </Text>
  );
}

// Full-width dashboard with bars on left and notifications on right
function FullWidthDashboard({ activeSolution }: { activeSolution: Solution }) {
  const [notifications, setNotifications] = useState([
    { id: 1, product: "Product A", amount: 49, time: "Just now" },
    { id: 2, product: "Product B", amount: 129, time: "2s ago" },
    { id: 3, product: "Product C", amount: 79, time: "5s ago" },
  ]);

  const [accounts, setAccounts] = useState([
    { name: "Product A", revenue: 12400, growth: 23 },
    { name: "Product B", revenue: 8200, growth: 12 },
    { name: "Product C", revenue: 15600, growth: 45 },
    { name: "Product D", revenue: 6800, growth: -5 },
    { name: "Product E", revenue: 9400, growth: 18 },
  ]);

  const [dailySales, setDailySales] = useState(47);
  const [dailyRevenue, setDailyRevenue] = useState(4280);

  const total = accounts.reduce((sum, acc) => sum + acc.revenue, 0);

  // Animate notifications and update bars
  useEffect(() => {
    const products = [
      "Product A",
      "Product B",
      "Product C",
      "Product D",
      "Product E",
    ];
    const amounts = [29, 49, 79, 99, 129, 199, 249];

    const interval = setInterval(() => {
      const productName =
        products[Math.floor(Math.random() * products.length)]!;
      const amount = amounts[Math.floor(Math.random() * amounts.length)]!;

      const newNotification = {
        id: Date.now(),
        product: productName,
        amount: amount,
        time: "Just now",
      };

      setNotifications((prev) => {
        const updated = prev.map((n, i) => ({
          ...n,
          time: i === 0 ? "2s ago" : i === 1 ? "5s ago" : "8s ago",
        }));
        return [newNotification, ...updated.slice(0, 4)];
      });

      // Update the corresponding account's revenue
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.name === productName
            ? { ...acc, revenue: acc.revenue + amount }
            : acc
        )
      );

      // Update daily stats
      setDailySales((prev) => prev + 1);
      setDailyRevenue((prev) => prev + amount);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

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
        width="300px"
        height="300px"
        bg="brand.500"
        opacity={0.05}
        borderRadius="full"
        transform="translate(50%, -50%)"
        aria-hidden="true"
      />
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="200px"
        height="200px"
        bg="brand.500"
        opacity={0.03}
        borderRadius="full"
        transform="translate(-50%, 50%)"
        aria-hidden="true"
      />

      <Grid
        templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}
        gap={{ base: 6, lg: 8 }}
        position="relative"
        zIndex={1}
      >
        {/* Left side - Revenue bars */}
        <Box>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={5}>
            <Box>
              <Text fontSize="sm" color="gray.400" mb={1}>
                Total Revenue
              </Text>
              <RollingNumber value={total} prefix="$" fontSize="3xl" />
            </Box>
            <Box
              px={3}
              py={1}
              borderRadius="full"
              style={{
                background: "linear-gradient(to right, #7c3aed, #a78bfa)",
              }}
            >
              <Text fontSize="sm" fontWeight="semibold" color="white">
                +28% this month
              </Text>
            </Box>
          </Flex>

          {/* Account bars */}
          <VStack align="stretch" gap={3}>
            {accounts.map((account) => {
              const percentage = (account.revenue / total) * 100;

              return (
                <Box key={account.name}>
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
                        color={account.growth >= 0 ? "brand.400" : "red.400"}
                      >
                        {account.growth >= 0 ? "+" : ""}
                        {account.growth}%
                      </Text>
                    </HStack>
                  </Flex>
                  <Box
                    position="relative"
                    height="8px"
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
                        background:
                          "linear-gradient(to right, #7c3aed, #8b5cf6)",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
            mt={5}
            pt={5}
            borderTop="1px solid"
            borderColor="gray.800"
          >
            {activeSolution.stats.map((stat, index) => (
              <Box key={index} textAlign="center">
                <Text fontSize="xl" fontWeight="bold" color="brand.400">
                  {stat.value}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Right side - Live notifications */}
        <Box>
          <Flex align="center" gap={2} mb={4}>
            <Box
              width="8px"
              height="8px"
              borderRadius="full"
              bg="brand.400"
              style={{
                animation: "pulse 2s infinite",
                boxShadow: "0 0 8px rgba(139, 92, 246, 0.6)",
              }}
              aria-hidden="true"
            />
            <Text fontSize="sm" fontWeight="medium" color="gray.400">
              Live Sales Feed
            </Text>
          </Flex>

          <style>
            {`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateX(20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}
          </style>

          <VStack align="stretch" gap={3}>
            {notifications.map((notification, index) => (
              <Box
                key={notification.id}
                bg="gray.800"
                borderRadius="lg"
                p={3}
                border="1px solid"
                borderColor={index === 0 ? "brand.500" : "gray.700"}
                style={{
                  animation: index === 0 ? "slideIn 0.3s ease-out" : "none",
                  opacity: 1 - index * 0.15,
                }}
              >
                <Flex justify="space-between" align="center">
                  <HStack gap={3}>
                    <Box
                      width="10px"
                      height="10px"
                      borderRadius="full"
                      bg={index === 0 ? "brand.400" : "brand.600"}
                      aria-hidden="true"
                    />
                    <Box>
                      <Text fontSize="sm" color="white" fontWeight="medium">
                        {notification.product}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {notification.time}
                      </Text>
                    </Box>
                  </HStack>
                  <Text fontSize="md" fontWeight="bold" color="brand.400">
                    +${notification.amount}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>

          {/* Summary */}
          <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.800">
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="gray.400">
                Last 24 hours
              </Text>
              <HStack gap={4}>
                <Box textAlign="right">
                  <RollingNumber
                    value={dailySales}
                    fontSize="lg"
                    color="white"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Sales
                  </Text>
                </Box>
                <Box textAlign="right">
                  <RollingNumber
                    value={dailyRevenue}
                    prefix="$"
                    fontSize="lg"
                    color="brand.400"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Revenue
                  </Text>
                </Box>
              </HStack>
            </Flex>
          </Box>
        </Box>
      </Grid>
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
      aria-hidden="true"
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

// Compact solution card
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
      p={4}
      bg={isActive ? "white" : "gray.50"}
      borderRadius="xl"
      border="2px solid"
      borderColor={
        isActive ? "brand.500" : isHovered ? "brand.200" : "gray.100"
      }
      boxShadow={isActive ? "lg" : isHovered ? "md" : "sm"}
      transition="all 0.3s ease"
      style={{
        transform: isHovered
          ? "perspective(1000px) rotateX(-2deg) rotateY(2deg) translateY(-2px)"
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      }}
      role="button"
      aria-pressed={isActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {isActive && (
        <Box
          position="absolute"
          top={-1}
          right={4}
          px={2}
          py={0.5}
          bg="brand.500"
          borderRadius="0 0 6px 6px"
        >
          <Text fontSize="2xs" fontWeight="semibold" color="white">
            Selected
          </Text>
        </Box>
      )}

      <Flex gap={3} align="center">
        <Box
          p={2}
          bg={isActive ? "brand.50" : "gray.100"}
          borderRadius="lg"
          color={isActive ? "brand.600" : "gray.500"}
          transition="all 0.3s ease"
        >
          {solution.icon}
        </Box>
        <Box flex={1}>
          <Text fontSize="md" fontWeight="bold" color="gray.900">
            {solution.title}
          </Text>
          <Text fontSize="xs" color="gray.500">
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
      aria-hidden="true"
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

export default function SolutionsClient() {
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
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg="brand.500"
                aria-hidden="true"
              />
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

        {/* Main content grid - Cards and Details side by side */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1.3fr" }}
          gap={{ base: 6, lg: 8 }}
          alignItems="stretch"
          mb={{ base: 12, md: 16 }}
        >
          {/* Left - Solution cards */}
          <FadeIn direction="left" delay={0.1}>
            <VStack align="stretch" gap={3} height="full">
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
          </FadeIn>

          {/* Right - Solution details */}
          <FadeIn direction="right" delay={0.2}>
            <Box
              position="relative"
              bg="white"
              borderRadius="2xl"
              p={{ base: 5, md: 6 }}
              boxShadow="xl"
              overflow="hidden"
              height="full"
              display="flex"
              flexDirection="column"
            >
              <ConnectionLines />

              <Box position="relative" zIndex={1} flex={1}>
                <HStack gap={3} mb={4}>
                  <Box p={3} bg="brand.50" borderRadius="xl" color="brand.600">
                    {activeSolution.icon}
                  </Box>
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="gray.900">
                      {activeSolution.title}
                    </Text>
                    <Text fontSize="sm" color="brand.600">
                      {activeSolution.subtitle}
                    </Text>
                  </Box>
                </HStack>

                <Text fontSize="sm" color="gray.600" lineHeight="1.7" mb={5}>
                  {activeSolution.description}
                </Text>

                <VStack align="stretch" gap={2} mb={5}>
                  {activeSolution.features.map((feature, index) => (
                    <HStack key={index} gap={2}>
                      <Box
                        p={0.5}
                        bg="brand.100"
                        borderRadius="full"
                        color="brand.600"
                        aria-hidden="true"
                      >
                        <svg
                          width="12"
                          height="12"
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
          </FadeIn>
        </Grid>

        {/* Full-width dashboard mockup */}
        <FadeIn delay={0.3} direction="up">
          <FullWidthDashboard activeSolution={activeSolution} />
        </FadeIn>

        {/* Bottom CTA */}
        <FadeIn delay={0.4}>
          <Box
            mt={{ base: 12, md: 16 }}
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
              aria-hidden="true"
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
              aria-hidden="true"
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
                      aria-hidden="true"
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
