"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, GridItem, Text } from "@repo/ui/index";
import { FadeIn } from "./scroll-animations";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function AnimatedStatItem({
  value,
  label,
  suffix = "",
  prefix = "",
  decimals = 0,
}: StatItemProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeOut * value;

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, value]);

  const formattedCount =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

  return (
    <Box ref={ref} textAlign="center">
      <Text
        fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
        fontWeight="bold"
        color="white"
        lineHeight="1"
        mb={2}
      >
        {prefix}
        {formattedCount}
        {suffix && (
          <Text as="span" fontSize="3xl" color="brand.300">
            {suffix}
          </Text>
        )}
      </Text>
      <Text fontSize="md" color="brand.200" fontWeight="medium">
        {label}
      </Text>
    </Box>
  );
}

export function StatsSection() {
  const stats: StatItemProps[] = [
    { value: 950, prefix: "$", suffix: "M+", label: "Revenue Tracked" },
    { value: 500, suffix: "+", label: "SaaS Companies" },
    { value: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
    { value: 2, suffix: "min", label: "Average Setup Time" },
  ];

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.900"
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={{ base: 8, md: 12 }}
        >
          {stats.map((stat, index) => (
            <GridItem key={stat.label}>
              <FadeIn delay={index * 0.1} direction="up">
                <AnimatedStatItem {...stat} />
              </FadeIn>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
