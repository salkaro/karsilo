"use client";

import { Box, Heading, Grid } from "@repo/ui/index";
import { BlogCard } from "./BlogCard";
import type { BlogPostMeta } from "../../lib/blog-types";

interface RelatedPostsProps {
  posts: BlogPostMeta[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <Box mt={16} pt={12} borderTop="1px solid" borderColor="gray.200">
      <Heading
        as="h2"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
        color="gray.900"
        mb={8}
      >
        Related Articles
      </Heading>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </Grid>
    </Box>
  );
}
