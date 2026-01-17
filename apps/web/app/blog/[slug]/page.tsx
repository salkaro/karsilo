import { notFound } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button,
} from "@repo/ui/index";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "../../../lib/blog";
import { AuthorCard, ShareButtons, RelatedPosts } from "../../../components/blog";
import "./blog-content.css";

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Karsilo Blog`,
    description: post.excerpt,
  };
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.category, 3);
  const postUrl = `https://karsilo.com/blog/${slug}`;

  return (
    <Box
      as="article"
      py={{ base: 16, md: 24 }}
      bg="white"
      minH="100vh"
      position="relative"
    >
      <Container maxW="container.md" position="relative" zIndex={1}>
        {/* Back Link */}
        <Box mb={8}>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button
              variant="ghost"
              size="sm"
              color="gray.600"
              _hover={{ color: "gray.900", bg: "gray.100" }}
            >
              <ArrowLeftIcon />
              <Text ml={2}>Back to Blog</Text>
            </Button>
          </Link>
        </Box>

        {/* Article Header */}
        <Box mb={8}>
          {/* Category Badge */}
          <Box
            display="inline-block"
            px={3}
            py={1}
            bg="brand.50"
            borderRadius="full"
            mb={4}
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

          {/* Title */}
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            color="gray.900"
            lineHeight="1.2"
            mb={6}
          >
            {post.title}
          </Heading>

          {/* Excerpt */}
          <Text fontSize="xl" color="gray.600" lineHeight="1.7" mb={6}>
            {post.excerpt}
          </Text>

          {/* Author & Meta */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            gap={4}
          >
            <AuthorCard
              author={post.author}
              date={post.date}
              readingTime={post.readingTime}
            />
            <ShareButtons url={postUrl} title={post.title} />
          </Flex>
        </Box>

        {/* Featured Image */}
        <Box
          position="relative"
          height={{ base: "250px", md: "400px" }}
          borderRadius="2xl"
          overflow="hidden"
          mb={10}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>

        {/* Article Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Buttons (bottom) */}
        <Box
          mt={12}
          pt={8}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="center">
            <ShareButtons url={postUrl} title={post.title} />
          </Flex>
        </Box>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </Container>
    </Box>
  );
}
