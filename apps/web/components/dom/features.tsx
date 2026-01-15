"use client";

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

interface FeatureCardProps {
  title: string;
  description: string;
  isLarge?: boolean;
  accentColor?: string;
  graphic?: React.ReactNode;
}

function FeatureCard({
  title,
  description,
  isLarge,
  accentColor = "brand",
  graphic,
}: FeatureCardProps) {
  return (
    <Box
      position="relative"
      p={{ base: 6, md: 8 }}
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      _hover={{
        borderColor: `${accentColor}.200`,
        boxShadow: "xl",
        transform: "translateY(-4px)",
      }}
      transition="all 0.3s"
      height="full"
    >
      {/* Decorative gradient corner */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="150px"
        h="150px"
        bgGradient={`radial(${accentColor}.100, transparent 70%)`}
        opacity={0.6}
      />

      <Flex
        direction="row"
        h="full"
        position="relative"
        zIndex={1}
        justify="space-between"
        align="flex-start"
        gap={4}
      >
        <Flex direction="column" flex={1}>
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: isLarge ? "xl" : "lg" }}
            fontWeight="semibold"
            color="gray.900"
            mb={2}
          >
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.600" lineHeight="1.7" flex={1}>
            {description}
          </Text>

          {/* Bottom accent line */}
          <Box
            mt={4}
            h="3px"
            w="40px"
            borderRadius="full"
            bg={`${accentColor}.400`}
          />
        </Flex>

        {/* Graphic - positioned on right side, aligned with title */}
        {graphic && (
          <Box
            display={{ base: "none", md: "flex" }}
            alignItems="flex-start"
            justifyContent="center"
            flexShrink={0}
          >
            {graphic}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

// Unified dashboard graphic - stacked account cards
function DashboardGraphic() {
  return (
    <Box position="relative" w="130px" h="80px">
      {/* Stacked account cards */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="80px"
        h="45px"
        bg="brand.100"
        borderRadius="lg"
        border="2px solid"
        borderColor="brand.200"
        transform="rotate(-6deg)"
      />
      <Box
        position="absolute"
        top="6px"
        left="20px"
        w="80px"
        h="45px"
        bg="brand.200"
        borderRadius="lg"
        border="2px solid"
        borderColor="brand.300"
        transform="rotate(-3deg)"
      />
      <Box
        position="absolute"
        top="12px"
        left="40px"
        w="80px"
        h="45px"
        bg="brand.400"
        borderRadius="lg"
        border="2px solid"
        borderColor="brand.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" color="white" fontWeight="bold">
          $24.5K
        </Text>
      </Box>
    </Box>
  );
}

// Analytics chart graphic for Real-time Analytics card
function AnalyticsGraphic() {
  return (
    <Box position="relative" w="160px" h="80px">
      {/* Background bars */}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="65px"
        gap={1}
        alignItems="flex-end"
        px={1}
      >
        <Box flex={1} h="45%" bg="brand.100" borderRadius="sm" />
        <Box flex={1} h="65%" bg="brand.200" borderRadius="sm" />
        <Box flex={1} h="50%" bg="brand.100" borderRadius="sm" />
        <Box flex={1} h="80%" bg="brand.300" borderRadius="sm" />
        <Box flex={1} h="60%" bg="brand.200" borderRadius="sm" />
        <Box flex={1} h="90%" bg="brand.400" borderRadius="sm" />
        <Box flex={1} h="75%" bg="brand.300" borderRadius="sm" />
      </Flex>
      {/* Overlay line chart */}
      <Box position="absolute" top={0} left={0} right={0} height="65px">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 65"
          preserveAspectRatio="none"
        >
          <path
            d="M8 50 Q30 35, 50 40 T80 28 T115 20 T152 10"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="152" cy="10" r="4" fill="#7c3aed" />
        </svg>
      </Box>
      {/* Stats badge */}
      <Box
        position="absolute"
        top={0}
        right={0}
        bg="white"
        px={2}
        py={0.5}
        borderRadius="md"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <Text fontSize="xs" color="green.500" fontWeight="bold">
          +23%
        </Text>
      </Box>
    </Box>
  );
}

// Team avatars graphic for Team Collaboration card
function TeamGraphic() {
  return (
    <Box
      w="70px"
      h="70px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex position="relative">
        {/* Stacked avatars */}
        <Box
          w={10}
          h={10}
          borderRadius="full"
          bg="brand.500"
          border="2px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={3}
        >
          <Text fontSize="xs" color="white" fontWeight="bold">
            JD
          </Text>
        </Box>
        <Box
          w={10}
          h={10}
          borderRadius="full"
          bg="brand.400"
          border="2px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          ml={-3}
          zIndex={2}
        >
          <Text fontSize="xs" color="white" fontWeight="bold">
            SK
          </Text>
        </Box>
        <Box
          w={10}
          h={10}
          borderRadius="full"
          bg="brand.300"
          border="2px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          ml={-3}
          zIndex={1}
        >
          <Text fontSize="xs" color="white" fontWeight="bold">
            MR
          </Text>
        </Box>
        <Box
          w={10}
          h={10}
          borderRadius="full"
          bg="gray.200"
          border="2px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          ml={-3}
          zIndex={0}
        >
          <Text fontSize="xs" color="gray.600" fontWeight="bold">
            +5
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

// Security shield graphic
function SecurityGraphic() {
  return (
    <Box position="relative" w="70px" h="70px">
      <svg width="100%" height="100%" viewBox="0 0 70 70">
        {/* Shield shape */}
        <path
          d="M35 5 L60 13 L60 38 Q60 58, 35 65 Q10 58, 10 38 L10 13 Z"
          fill="#f5f3ff"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        {/* Checkmark */}
        <path
          d="M24 36 L31 44 L46 28"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

// Instant setup graphic - lightning bolt
function SetupGraphic() {
  return (
    <Box position="relative" w="70px" h="70px">
      <svg width="100%" height="100%" viewBox="0 0 70 70">
        {/* Lightning bolt */}
        <path
          d="M38 8 L22 35 L32 35 L28 62 L48 30 L36 30 Z"
          fill="#f5f3ff"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

export function Features() {
  const features: FeatureCardProps[] = [
    {
      title: "Unified Dashboard",
      description:
        "Connect unlimited Stripe accounts and view all your revenue data in one clean, intuitive dashboard. No more tab switching.",
      isLarge: true,
      graphic: <DashboardGraphic />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Track MRR, ARR, churn, and growth metrics across all accounts with live updates. Understand your true financial picture.",
      isLarge: true,
      graphic: <AnalyticsGraphic />,
    },
    {
      title: "Bank-grade Security",
      description:
        "Read-only Stripe access with SOC 2 compliant infrastructure. Your data is encrypted at rest and in transit.",
      graphic: <SecurityGraphic />,
    },
    {
      title: "Instant Setup",
      description:
        "Connect your Stripe accounts in under 2 minutes with our secure OAuth flow. No engineering required.",
      graphic: <SetupGraphic />,
    },
    {
      title: "Team Collaboration",
      description:
        "Invite your co-founders, finance team, or investors with role-based access controls and custom permissions.",
      graphic: <TeamGraphic />,
    },
  ];

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="white"
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
        opacity={0.3}
        backgroundImage="radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />

      {/* Scattered solid grey circles - same style as hero */}
      <Box
        position="absolute"
        top="-10%"
        left="-8%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="gray.200"
        opacity={0.6}
      />
      <Box
        position="absolute"
        top="5%"
        right="-12%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="gray.200"
        opacity={0.5}
      />
      <Box
        position="absolute"
        bottom="-15%"
        left="10%"
        w="350px"
        h="350px"
        borderRadius="full"
        bg="gray.200"
        opacity={0.5}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="gray.200"
        opacity={0.4}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Section header */}
        <FadeIn direction="up">
          <Box textAlign="center" mb={16}>
            <Flex justify="center" mb={4}>
              <Box
                px={4}
                py={1.5}
                bg="brand.50"
                borderRadius="full"
                border="1px solid"
                borderColor="brand.100"
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.600"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Features
                </Text>
              </Box>
            </Flex>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
              lineHeight={{ base: "1.3", md: "1.4" }}
            >
              Everything you need to manage
              <Box as="span" display="block" mt={{ base: 1, md: 0 }}>
                <Text as="span" color="brand.600">
                  multiple Stripe accounts
                </Text>
              </Box>
            </Heading>
            <Text
              fontSize="lg"
              color="gray.600"
              maxW="2xl"
              mx="auto"
              lineHeight="1.7"
            >
              Stop juggling multiple Stripe dashboards. Get a complete view of
              your business finances in one place.
            </Text>
          </Box>
        </FadeIn>

        {/* Bento grid layout */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          templateRows={{
            base: "auto",
            lg: "auto auto",
          }}
          gap={6}
        >
          {/* Large cards - top row */}
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            rowSpan={{ base: 1, lg: 1 }}
            h="full"
          >
            <FadeIn delay={0.1} direction="up" height="full">
              <FeatureCard {...features[0]!} />
            </FadeIn>
          </GridItem>
          <GridItem
            colSpan={{ base: 1, lg: 2 }}
            rowSpan={{ base: 1, lg: 1 }}
            h="full"
          >
            <FadeIn delay={0.2} direction="up" height="full">
              <FeatureCard {...features[1]!} />
            </FadeIn>
          </GridItem>

          {/* Smaller cards - bottom row */}
          {features.slice(2).map((feature, index) => (
            <GridItem key={feature.title}>
              <FadeIn delay={0.3 + index * 0.1} direction="up">
                <FeatureCard {...feature} />
              </FadeIn>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
