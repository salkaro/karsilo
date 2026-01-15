"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  Grid,
  GridItem,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "./scroll-animations";

// Tilt card component - tilted by default, straightens on hover
function TiltCard({
  children,
  isHovered,
  onHoverChange,
}: {
  children: React.ReactNode;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  return (
    <Box
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      style={{
        transform: isHovered
          ? "perspective(1000px) rotateX(0deg) rotateY(0deg)"
          : "perspective(1000px) rotateX(2deg) rotateY(-3deg)",
        transition: "transform 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Box>
  );
}

// Animated gradient background SVG
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
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="50%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        <circle cx="20%" cy="30%" r="300" fill="url(#grad2)" />
        <circle cx="80%" cy="70%" r="400" fill="url(#grad2)" />
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

// Floating stats badge with tilt effect
function StatBadge({
  value,
  label,
  position,
  isLarge = false,
  isHovered = false,
  tiltDirection = "left",
}: {
  value: string;
  label: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  isLarge?: boolean;
  isHovered?: boolean;
  tiltDirection?: "left" | "right";
}) {
  const getTiltTransform = () => {
    if (isHovered) {
      return tiltDirection === "left"
        ? "perspective(500px) rotateX(-3deg) rotateY(8deg) translateY(-4px)"
        : "perspective(500px) rotateX(3deg) rotateY(-8deg) translateY(-4px)";
    }
    return "perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <Box
      position="absolute"
      bg="white"
      borderRadius={isLarge ? "2xl" : "xl"}
      px={isLarge ? 6 : 4}
      py={isLarge ? 4 : 3}
      boxShadow={isHovered ? "2xl" : "xl"}
      border="1px solid"
      borderColor="brand.100"
      {...position}
      display={{ base: "none", lg: "block" }}
      zIndex={10}
      style={{
        transform: getTiltTransform(),
        transition: "transform 0.4s ease-out, box-shadow 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "inherit",
        bg: "brand.50",
        opacity: 0.5,
        zIndex: -1,
      }}
    >
      <Text
        fontSize={isLarge ? "3xl" : "2xl"}
        fontWeight="bold"
        color="brand.600"
      >
        {value}
      </Text>
      <Text
        fontSize={isLarge ? "sm" : "xs"}
        color="gray.500"
        fontWeight="medium"
      >
        {label}
      </Text>
    </Box>
  );
}

export function LandingHero() {
  const [isDashboardHovered, setIsDashboardHovered] = useState(false);

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      py={{ base: 16, md: 24 }}
    >
      <GradientBackground />

      <Container maxW="container.xl" position="relative" zIndex={1} pt={20}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
        >
          {/* Left content */}
          <GridItem>
            <Flex direction="column" gap={6}>
              {/* Badge */}
              <FadeIn delay={0}>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={4}
                  py={2}
                  bg="brand.100"
                  borderRadius="full"
                  width="fit-content"
                >
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="brand.500"
                    animation="pulse 2s infinite"
                  />
                  <Text fontSize="sm" fontWeight="medium" color="brand.700">
                    Multi-Stripe Account Management
                  </Text>
                </Box>
              </FadeIn>

              {/* Heading */}
              <FadeIn delay={0.1}>
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  lineHeight="1.1"
                  color="gray.900"
                >
                  Your Single Source of{" "}
                  <Text as="span" color="brand.600">
                    Truth for Stripe.
                  </Text>
                </Heading>
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.2}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.600"
                  lineHeight="1.7"
                  maxW="xl"
                >
                  Aggregate all your Stripe accounts into one powerful
                  dashboard. Finally know exactly how much money you're making
                  across every product, every entity, every account.
                </Text>
              </FadeIn>

              {/* CTA Buttons */}
              <FadeIn delay={0.3}>
                <HStack gap={4} flexWrap="wrap" pt={4}>
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      px={8}
                      py={6}
                      fontSize="md"
                      fontWeight="semibold"
                      bg="brand.600"
                      color="white"
                      borderRadius="lg"
                      _hover={{
                        bg: "brand.700",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                      boxShadow="md"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      px={8}
                      py={6}
                      fontSize="md"
                      fontWeight="semibold"
                      variant="outline"
                      borderColor="gray.300"
                      color="gray.700"
                      borderRadius="lg"
                      _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                      transition="all 0.2s"
                    >
                      <HStack gap={2}>
                        <PlayIcon />
                        <Text>Watch Demo</Text>
                      </HStack>
                    </Button>
                  </Link>
                </HStack>
              </FadeIn>

              {/* Trust indicators */}
              <FadeIn delay={0.4}>
                <HStack gap={6} pt={6}>
                  <HStack gap={2}>
                    <CheckIcon />
                    <Text fontSize="sm" color="gray.600">
                      No credit card required
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <CheckIcon />
                    <Text fontSize="sm" color="gray.600">
                      14-day free trial
                    </Text>
                  </HStack>
                </HStack>
              </FadeIn>
            </Flex>
          </GridItem>

          {/* Right content - Dashboard preview */}
          <GridItem position="relative">
            <FadeIn delay={0.2} direction="right">
              <Box position="relative">
                {/* Floating stats */}
                <StatBadge
                  value="$847K"
                  label="Total MRR"
                  position={{ top: "-30px", left: "-50px" }}
                  isLarge
                  isHovered={isDashboardHovered}
                  tiltDirection="left"
                />
                <StatBadge
                  value="12"
                  label="Connected Accounts"
                  position={{ bottom: "80px", right: "-40px" }}
                  isHovered={isDashboardHovered}
                  tiltDirection="right"
                />

                {/* Main dashboard mockup */}
                <TiltCard
                  isHovered={isDashboardHovered}
                  onHoverChange={setIsDashboardHovered}
                >
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    {/* Browser chrome */}
                    <HStack
                      px={4}
                      py={3}
                      bg="gray.50"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      gap={2}
                    >
                      <Box w={3} h={3} borderRadius="full" bg="red.400" />
                      <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
                      <Box w={3} h={3} borderRadius="full" bg="green.400" />
                      <Box
                        flex={1}
                        mx={4}
                        px={4}
                        py={1}
                        bg="white"
                        borderRadius="md"
                        fontSize="xs"
                        color="gray.500"
                      >
                        app.karsilo.com/dashboard
                      </Box>
                    </HStack>

                    {/* Dashboard content */}
                    <Box p={{ base: 3, sm: 4, md: 6 }}>
                      {/* Stats row */}
                      <Grid
                        templateColumns={{
                          base: "repeat(2, 1fr)",
                          sm: "repeat(4, 1fr)",
                        }}
                        gap={{ base: 2, sm: 3, md: 4 }}
                        mb={{ base: 3, md: 6 }}
                      >
                        {[
                          {
                            label: "Revenue",
                            value: "$12,455",
                            change: "+23%",
                          },
                          { label: "Customers", value: "1,468", change: "+6%" },
                          {
                            label: "Subscriptions",
                            value: "847",
                            change: "+12%",
                          },
                          { label: "Payments", value: "22,209", change: "+8%" },
                        ].map((stat) => (
                          <Box
                            key={stat.label}
                            p={{ base: 2, sm: 3, md: 4 }}
                            bg="brand.50"
                            borderRadius="lg"
                          >
                            <Text
                              fontSize={{ base: "2xs", sm: "xs" }}
                              color="gray.500"
                              mb={1}
                            >
                              {stat.label}
                            </Text>
                            <HStack justify="space-between">
                              <Text
                                fontSize={{ base: "sm", sm: "md", md: "lg" }}
                                fontWeight="bold"
                                color="gray.900"
                              >
                                {stat.value}
                              </Text>
                              <Text
                                fontSize={{ base: "2xs", sm: "xs" }}
                                color="green.500"
                                fontWeight="medium"
                              >
                                {stat.change}
                              </Text>
                            </HStack>
                          </Box>
                        ))}
                      </Grid>

                      {/* Chart placeholder */}
                      <Box
                        bg="gray.900"
                        borderRadius="xl"
                        p={{ base: 3, sm: 4, md: 6 }}
                        position="relative"
                        overflow="hidden"
                      >
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color="gray.400"
                          mb={{ base: 2, md: 4 }}
                        >
                          Revenue Over Time
                        </Text>
                        <Box px={2}>
                          <ChartSVG />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TiltCard>
              </Box>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}

// Icons
function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <Box color="brand.500">
      <svg
        width="16"
        height="16"
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

function ChartSVG() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  const dataPoints = [
    { x: 0, y: 120, value: "$8.2K", month: "Jan" },
    { x: 50, y: 100, value: "$9.4K", month: "Feb" },
    { x: 100, y: 110, value: "$8.8K", month: "Mar" },
    { x: 150, y: 70, value: "$11.2K", month: "Apr" },
    { x: 200, y: 80, value: "$10.5K", month: "May" },
    { x: 250, y: 50, value: "$12.8K", month: "Jun" },
    { x: 300, y: 60, value: "$12.1K", month: "Jul" },
    { x: 350, y: 30, value: "$14.2K", month: "Aug" },
    { x: 400, y: 20, value: "$15.1K", month: "Sep" },
  ];

  // Generate straight line path from points
  const getLinePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
      .join(" ");
  };

  // Generate path up to a fractional progress (0 to dataPoints.length - 1)
  const getProgressPath = (progress: number) => {
    if (progress <= 0) return "";
    const fullPoints = Math.floor(progress);
    const fraction = progress - fullPoints;

    // Get all full points
    const points = dataPoints.slice(0, fullPoints + 1);
    if (points.length === 0) return "";

    let path = getLinePath(points);

    // Add interpolated point if there's a fraction and we're not at the last point
    if (fraction > 0 && fullPoints < dataPoints.length - 1) {
      const p1 = dataPoints[fullPoints]!;
      const p2 = dataPoints[fullPoints + 1]!;
      const interpX = p1.x + (p2.x - p1.x) * fraction;
      const interpY = p1.y + (p2.y - p1.y) * fraction;
      path += ` L${interpX} ${interpY}`;
    }

    return path;
  };

  // Get the end point for the current progress
  const getProgressEndPoint = (progress: number) => {
    if (progress <= 0) return dataPoints[0]!;
    const fullPoints = Math.floor(progress);
    const fraction = progress - fullPoints;

    if (fraction > 0 && fullPoints < dataPoints.length - 1) {
      const p1 = dataPoints[fullPoints]!;
      const p2 = dataPoints[fullPoints + 1]!;
      return {
        x: p1.x + (p2.x - p1.x) * fraction,
        y: p1.y + (p2.y - p1.y) * fraction,
      };
    }
    return dataPoints[Math.min(fullPoints, dataPoints.length - 1)]!;
  };

  // Pre-compute the full paths
  const linePath = getLinePath(dataPoints);
  const areaPath = linePath + " L400 150 L0 150 Z";

  // Smooth withdraw animation when mouse leaves
  useEffect(() => {
    if (hoveredIndex === null && animatedProgress > 0) {
      const startProgress = animatedProgress;
      const startTime = performance.now();
      const duration = startProgress * 40; // 40ms per point for smooth animation

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - t, 3);
        const newProgress = startProgress * (1 - easeOut);

        if (newProgress > 0.01) {
          setAnimatedProgress(newProgress);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedProgress(0);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate the actual rendered chart area accounting for preserveAspectRatio
    // viewBox is "-20 0 440 150" so width is 440, height is 150
    const viewBoxRatio = 440 / 150;
    const svgRatio = rect.width / rect.height;

    let chartWidth: number;
    let chartHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (svgRatio > viewBoxRatio) {
      // SVG is wider than viewBox ratio - letterboxing on sides
      chartHeight = rect.height;
      chartWidth = chartHeight * viewBoxRatio;
      offsetX = (rect.width - chartWidth) / 2;
      offsetY = 0;
    } else {
      // SVG is taller than viewBox ratio - letterboxing on top/bottom
      chartWidth = rect.width;
      chartHeight = chartWidth / viewBoxRatio;
      offsetX = 0;
      offsetY = (rect.height - chartHeight) / 2;
    }

    // Convert mouse position to viewBox coordinates
    // viewBox starts at -20, so we map to -20 to 420 range
    const relativeX = mouseX - offsetX;
    const normalizedX = (relativeX / chartWidth) * 440 - 20;

    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(400, normalizedX));

    // Find closest point
    let closestIndex = 0;
    let closestDist = Math.abs(clampedX - dataPoints[0]!.x);
    for (let i = 1; i < dataPoints.length; i++) {
      const dist = Math.abs(clampedX - dataPoints[i]!.x);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    setHoveredIndex(closestIndex);
    setAnimatedProgress(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Generate path for highlighted area using the animated position
  const getHighlightPath = () => {
    if (animatedProgress <= 0) return "";
    const pathLine = getProgressPath(animatedProgress);
    if (!pathLine) return "";
    const endPoint = getProgressEndPoint(animatedProgress);
    return `${pathLine} L${endPoint.x} 150 L0 150 Z`;
  };

  // Helper to safely get hovered point
  const getHoveredPoint = () => {
    if (hoveredIndex === null) return null;
    return dataPoints[hoveredIndex] ?? null;
  };

  // Calculate tooltip position to prevent clipping
  const getTooltipPosition = () => {
    const point = getHoveredPoint();
    if (!point) return { x: 0, y: 0, showBelow: false };

    // If point is too close to top, show tooltip below the point
    const showBelow = point.y < 50;
    const yOffset = showBelow ? 55 : -45;

    // Clamp x position to prevent horizontal clipping
    let xPos = point.x;
    if (xPos < 40) xPos = 40;
    if (xPos > 360) xPos = 360;

    return { x: xPos, y: point.y + yOffset, showBelow };
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox="-20 0 440 150"
      preserveAspectRatio="xMidYMid meet"
      style={{ cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="chartGradHighlight"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={i * 37.5}
          x2="400"
          y2={i * 37.5}
          stroke="#374151"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />
      ))}

      {/* Base area fill */}
      <path
        d={areaPath}
        fill="url(#chartGrad)"
        style={{ transition: "opacity 0.3s ease" }}
        opacity={hoveredIndex !== null || animatedProgress > 0 ? 0.3 : 1}
      />

      {/* Highlighted area fill with smooth transition */}
      <path
        d={getHighlightPath() || "M0 150 L0 150 Z"}
        fill="url(#chartGradHighlight)"
        style={{
          transition: "opacity 0.2s ease",
          opacity: hoveredIndex !== null || animatedProgress > 0 ? 1 : 0,
        }}
      />

      {/* Main line */}
      <path
        d={linePath}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        style={{ transition: "opacity 0.2s ease" }}
        opacity={hoveredIndex !== null || animatedProgress > 0 ? 0.4 : 1}
      />

      {/* Highlighted line segment */}
      {(hoveredIndex !== null || animatedProgress > 0) && (
        <path
          d={getProgressPath(animatedProgress)}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          filter="url(#glow)"
        />
      )}

      {/* Vertical indicator line */}
      {hoveredIndex !== null && getHoveredPoint() && (
        <line
          x1={getHoveredPoint()!.x}
          y1={0}
          x2={getHoveredPoint()!.x}
          y2={150}
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.6}
          style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      )}

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <g key={i}>
          <circle
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 8 : 4}
            fill="#8b5cf6"
            stroke="white"
            strokeWidth={hoveredIndex === i ? 3 : 2}
            style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            filter={hoveredIndex === i ? "url(#glow)" : undefined}
          />
        </g>
      ))}

      {/* Tooltip - positioned to avoid clipping */}
      {hoveredIndex !== null &&
        getHoveredPoint() &&
        (() => {
          const tooltipPos = getTooltipPosition();
          return (
            <g
              style={{
                transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}
            >
              <rect
                x={-35}
                y={tooltipPos.showBelow ? 0 : 0}
                width={70}
                height={38}
                rx={6}
                fill="#1f2937"
                stroke="#374151"
                strokeWidth={1}
              />
              {/* Arrow pointing up or down based on position */}
              <polygon
                points={
                  tooltipPos.showBelow ? "-6,0 6,0 0,-7" : "-6,38 6,38 0,45"
                }
                fill="#1f2937"
              />
              <text
                x={0}
                y={16}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {getHoveredPoint()!.value}
              </text>
              <text
                x={0}
                y={30}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
              >
                {getHoveredPoint()!.month}
              </text>
            </g>
          );
        })()}
    </svg>
  );
}
