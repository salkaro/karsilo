"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
} from "@repo/ui/index";
import { FadeIn } from "../dom/scroll-animations";
import { BlogCard } from "./BlogCard";
import { BlogSearch } from "./BlogSearch";
import { CategoryFilter } from "./CategoryFilter";
import { Pagination } from "./Pagination";
import type { BlogCategory, BlogPostMeta } from "../../lib/blog-types";

const POSTS_PER_PAGE = 6;

interface BlogListingClientProps {
  initialPosts: BlogPostMeta[];
  categories: { category: BlogCategory; count: number }[];
}

export function BlogListingClient({
  initialPosts,
  categories,
}: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // Filter by category
    if (activeCategory) {
      posts = posts.filter((post) => post.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [initialPosts, activeCategory, searchQuery]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: BlogCategory | null) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
        top="-80px"
        right="-120px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="40%"
        left="-150px"
        width="400px"
        height="400px"
        bg="gray.200"
        opacity={0.25}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="10%"
        width="180px"
        height="180px"
        bg="gray.300"
        opacity={0.15}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Hero Section */}
        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Blog
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              Insights & Updates
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mb={8}>
              Stay up to date with the latest product updates, tutorials, and
              company news from the Karsilo team.
            </Text>

            {/* Search */}
            <BlogSearch
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search articles..."
            />
          </Flex>
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={0.1}>
          <Box mb={10}>
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </Box>
        </FadeIn>

        {/* Results Count */}
        {(searchQuery || activeCategory) && (
          <FadeIn>
            <Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
              {filteredPosts.length === 0
                ? "No articles found. Try a different search or category."
                : `Showing ${filteredPosts.length} article${filteredPosts.length === 1 ? "" : "s"}`}
            </Text>
          </FadeIn>
        )}

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <FadeIn delay={0.2}>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
              mb={12}
            >
              {paginatedPosts.map((post, index) => (
                <FadeIn key={post.slug} delay={0.1 + 0.05 * index} direction="up">
                  <BlogCard post={post} />
                </FadeIn>
              ))}
            </Grid>
          </FadeIn>
        ) : (
          <FadeIn>
            <Box textAlign="center" py={12}>
              <Box color="gray.300" mb={4}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ margin: "0 auto" }}
                >
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                </svg>
              </Box>
              <Text fontSize="lg" color="gray.600" mb={2}>
                No articles found
              </Text>
              <Text fontSize="sm" color="gray.500">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "Check back soon for new content!"}
              </Text>
            </Box>
          </FadeIn>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <FadeIn delay={0.3}>
            <Box mt={8}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Box>
          </FadeIn>
        )}
      </Container>
    </Box>
  );
}
