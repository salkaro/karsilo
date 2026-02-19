"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
} from "@repo/ui/index";
import { FadeIn } from "../../components/dom/scroll-animations";
import { API_BASE_URL } from "../../components/constants/links";

type ServiceStatus = "loading" | "operational" | "degraded" | "down";

interface StatusState {
  status: ServiceStatus;
  latency: number;
  lastChecked: Date | null;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { color: string; label: string; bg: string }
> = {
  loading: { color: "gray.400", label: "Checking...", bg: "gray.100" },
  operational: {
    color: "green.500",
    label: "All Systems Operational",
    bg: "green.50",
  },
  degraded: {
    color: "yellow.500",
    label: "Degraded Performance",
    bg: "yellow.50",
  },
  down: { color: "red.500", label: "Service Disruption", bg: "red.50" },
};

export default function StatusPage() {
  const [state, setState] = useState<StatusState>({
    status: "loading",
    latency: 0,
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        cache: "no-store",
      });
      const elapsed = Math.round(performance.now() - start);

      if (res.ok) {
        setState({
          status: elapsed > 2000 ? "degraded" : "operational",
          latency: elapsed,
          lastChecked: new Date(),
        });
      } else {
        setState({
          status: "down",
          latency: elapsed,
          lastChecked: new Date(),
        });
      }
    } catch {
      setState({
        status: "down",
        latency: 0,
        lastChecked: new Date(),
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const config = STATUS_CONFIG[state.status];

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
        top="-100px"
        right="-80px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-100px"
        width="300px"
        height="300px"
        bg="gray.200"
        opacity={0.25}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.md" position="relative" zIndex={1}>
        <FadeIn>
          <Box mb={4}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="brand.600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              System Status
            </Text>
          </Box>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.900"
            mb={4}
          >
            Status
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={10}>
            Real-time status of Karsilo services.
          </Text>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* Main status indicator */}
          <Box
            p={{ base: 6, md: 8 }}
            bg={config.bg}
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            mb={6}
          >
            <Flex align="center" gap={4}>
              <Box
                width="16px"
                height="16px"
                borderRadius="full"
                bg={config.color}
                flexShrink={0}
              />
              <Box>
                <Text fontSize="xl" fontWeight="semibold" color="gray.900">
                  {config.label}
                </Text>
                {state.lastChecked && (
                  <Text fontSize="sm" color="gray.500">
                    Last checked: {state.lastChecked.toLocaleTimeString()}
                    {state.latency > 0 && ` · ${state.latency}ms`}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>

          {/* Services table */}
          <Box
            p={{ base: 6, md: 8 }}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Text
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              mb={4}
            >
              Services
            </Text>
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between" py={3} borderBottom="1px solid" borderColor="gray.100">
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  Karsilo API
                </Text>
                <HStack gap={2}>
                  <Box
                    width="8px"
                    height="8px"
                    borderRadius="full"
                    bg={config.color}
                  />
                  <Text fontSize="sm" color="gray.600">
                    {state.status === "loading"
                      ? "Checking"
                      : state.status === "operational"
                        ? "Operational"
                        : state.status === "degraded"
                          ? "Degraded"
                          : "Down"}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
