"use client";

import { Box, Container, Text, HStack } from "@repo/ui/index";
import Image from "next/image";
import { FadeIn } from "./scroll-animations";

export function TrustedBy() {
  return (
    <Box
      as="section"
      py={16}
      bg="white"
      borderY="1px solid"
      borderColor="gray.100"
    >
      <Container maxW="container.xl">
        <FadeIn direction="up">
          <Text
            textAlign="center"
            fontSize="sm"
            fontWeight="medium"
            color="gray.500"
            mb={8}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Trusted by 500+ founders and companies
          </Text>

          <HStack
            justify="center"
            gap={{ base: 8, md: 16 }}
            flexWrap="wrap"
            overflow="hidden"
          >
            <Box
              opacity={0.7}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s"
              position="relative"
              height={{ base: "32px", md: "40px" }}
              width={{ base: "120px", md: "150px" }}
            >
              <Image
                src="/flippifyLogoLongBlack.png"
                alt="Flippify"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Box
              opacity={0.7}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s"
              position="relative"
              height={{ base: "32px", md: "40px" }}
              width={{ base: "140px", md: "180px" }}
            >
              <Image
                src="/SalkaroLongBlackTransparent.png"
                alt="Salkaro"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </HStack>
        </FadeIn>
      </Container>
    </Box>
  );
}
