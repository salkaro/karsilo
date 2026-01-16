"use client";

import { Box, Heading, Text, HStack } from "@repo/ui/index";
import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "../../lib/blog-types";
import { formatDate } from "../../lib/blog-types";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-4px)",
          borderColor: "brand.200",
        }}
        height="full"
        cursor="pointer"
      >
        {/* Featured Image */}
        <Box position="relative" height="200px" overflow="hidden">
          <Image
            src={post.image}
            alt={`Cover image for ${post.title}`}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Category Badge */}
          <Box
            position="absolute"
            top={4}
            left={4}
            px={3}
            py={1}
            bg="white"
            borderRadius="full"
            boxShadow="sm"
          >
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="brand.600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {post.category}
            </Text>
          </Box>
        </Box>

        {/* Content */}
        <Box p={{ base: 5, md: 6 }}>
          <Heading
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            color="gray.900"
            mb={2}
            lineHeight="1.4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </Heading>

          <Text
            fontSize="sm"
            color="gray.600"
            mb={4}
            lineHeight="1.6"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </Text>

          {/* Meta Info */}
          <HStack gap={4} flexWrap="wrap">
            {/* Author */}
            <HStack gap={2}>
              <Box
                position="relative"
                width="24px"
                height="24px"
                borderRadius="full"
                overflow="hidden"
                bg="gray.200"
              >
                <Image
                  src={post.author.avatar}
                  alt={`Avatar of ${post.author.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium">
                {post.author.name}
              </Text>
            </HStack>

            {/* Date & Reading Time */}
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.500">
                {formatDate(post.date)}
              </Text>
              <Text fontSize="xs" color="gray.400">
                •
              </Text>
              <Text fontSize="xs" color="gray.500">
                {post.readingTime} min read
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Link>
  );
}
