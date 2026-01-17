"use client";

import { HStack, Box, Text } from "@repo/ui/index";
import Image from "next/image";
import type { BlogAuthor } from "../../lib/blog-types";

interface AuthorCardProps {
  author: BlogAuthor;
  date: string;
  readingTime: number;
}

export function AuthorCard({ author, date, readingTime }: AuthorCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <HStack gap={3}>
      {/* Author Avatar */}
      <Box
        position="relative"
        width="44px"
        height="44px"
        borderRadius="full"
        overflow="hidden"
        bg="gray.200"
        flexShrink={0}
      >
        <Image
          src={author.avatar}
          alt={author.name}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>

      {/* Author Info */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" color="gray.900">
          {author.name}
        </Text>
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.500">
            {formattedDate}
          </Text>
          <Text fontSize="sm" color="gray.400">
            •
          </Text>
          <Text fontSize="sm" color="gray.500">
            {readingTime} min read
          </Text>
        </HStack>
      </Box>
    </HStack>
  );
}
