import { notFound } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
} from "@repo/ui/index";
import Link from "next/link";
import { FadeIn } from "../../../../components/dom/scroll-animations";
import { helpArticles, getAllArticleParams } from "../../../../lib/help-articles";

export async function generateStaticParams() {
  return getAllArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; article: string }>;
}) {
  const { category: rawCategory, article: rawArticle } = await params;
  const category = decodeURIComponent(rawCategory);
  const articleSlug = decodeURIComponent(rawArticle);
  const articleData = helpArticles[category]?.[articleSlug];

  if (!articleData) {
    return { title: "Article Not Found | Karsilo Help" };
  }

  return {
    title: `${articleData.title} | Karsilo Help`,
    description: articleData.description,
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

function ChevronRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ category: string; article: string }>;
}) {
  const { category: rawCategory, article: rawArticle } = await params;
  const category = decodeURIComponent(rawCategory);
  const articleSlug = decodeURIComponent(rawArticle);
  const articleData = helpArticles[category]?.[articleSlug];

  if (!articleData) {
    notFound();
  }

  const relatedArticles = articleData.relatedArticles.slice(0, 3);

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
        left="-120px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="20%"
        right="-150px"
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
        left="5%"
        width="180px"
        height="180px"
        bg="gray.300"
        opacity={0.15}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="20%"
        width="250px"
        height="250px"
        bg="gray.200"
        opacity={0.2}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.md" position="relative" zIndex={1}>
        {/* Back link */}
        <FadeIn>
          <Box mb={6}>
            <Link href="/resources" style={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: "gray.900", bg: "gray.100" }}
              >
                <ArrowLeftIcon />
                <Text ml={2}>Back to Resources</Text>
              </Button>
            </Link>
          </Box>
        </FadeIn>

        {/* Breadcrumb */}
        <FadeIn>
          <HStack gap={2} mb={6} flexWrap="wrap">
            <Link href="/resources" style={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                color="gray.500"
                _hover={{ color: "brand.600" }}
                transition="color 0.2s"
              >
                Resources
              </Text>
            </Link>
            <Box color="gray.400">
              <ChevronRightIcon />
            </Box>
            <Text fontSize="sm" color="gray.500">
              {articleData.category}
            </Text>
            <Box color="gray.400">
              <ChevronRightIcon />
            </Box>
            <Text fontSize="sm" color="gray.900" fontWeight="medium">
              {articleData.title}
            </Text>
          </HStack>
        </FadeIn>

        {/* Article header */}
        <FadeIn>
          <Box mb={8}>
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
                {articleData.category}
              </Text>
            </Box>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              lineHeight="1.2"
              mb={4}
            >
              {articleData.title}
            </Heading>

            <Text fontSize="lg" color="gray.600" lineHeight="1.7">
              {articleData.description}
            </Text>
          </Box>
        </FadeIn>

        {/* Article body */}
        <FadeIn delay={0.1}>
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            p={{ base: 6, md: 10 }}
            mb={10}
          >
            <VStack align="stretch" gap={8}>
              {articleData.sections.map((section, index) => (
                <Box key={index}>
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="semibold"
                    color="gray.900"
                    mb={3}
                  >
                    {section.heading}
                  </Heading>
                  <Text
                    fontSize="md"
                    color="gray.600"
                    lineHeight="1.8"
                  >
                    {section.body}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </FadeIn>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <FadeIn delay={0.2}>
            <Box mb={10}>
              <Heading
                as="h3"
                fontSize="lg"
                fontWeight="semibold"
                color="gray.900"
                mb={4}
              >
                Related Articles
              </Heading>
              <VStack align="stretch" gap={0}>
                {relatedArticles.map((related, index) => (
                  <Link
                    key={index}
                    href={related.href}
                    style={{ textDecoration: "none" }}
                  >
                    <HStack
                      gap={3}
                      py={3}
                      px={4}
                      mx={-4}
                      borderRadius="lg"
                      transition="all 0.2s"
                      _hover={{ bg: "white", boxShadow: "sm" }}
                      justify="space-between"
                    >
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        fontWeight="medium"
                        _hover={{ color: "brand.600" }}
                        transition="color 0.2s"
                      >
                        {related.title}
                      </Text>
                      <Box color="gray.400" flexShrink={0}>
                        <ChevronRightIcon />
                      </Box>
                    </HStack>
                  </Link>
                ))}
              </VStack>
            </Box>
          </FadeIn>
        )}

        {/* Still need help CTA */}
        <FadeIn delay={0.3}>
          <Box
            p={{ base: 8, md: 12 }}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative circles */}
            <Box
              position="absolute"
              top={0}
              right={0}
              width="250px"
              height="250px"
              bg="gray.100"
              opacity={0.5}
              borderRadius="full"
              transform="translate(30%, -30%)"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              width="180px"
              height="180px"
              bg="gray.100"
              opacity={0.3}
              borderRadius="full"
              transform="translate(-30%, 30%)"
            />
            <Box
              position="absolute"
              top="60%"
              right="15%"
              width="80px"
              height="80px"
              bg="gray.200"
              opacity={0.3}
              borderRadius="full"
            />

            <Box position="relative" zIndex={1}>
              <Heading
                as="h2"
                fontSize="2xl"
                fontWeight="bold"
                color="gray.900"
                mb={4}
              >
                Still need help?
              </Heading>
              <Text fontSize="md" color="gray.600" mb={6} maxW="lg" mx="auto">
                Our support team is available Monday through Friday, 9am to 6pm
                EST. We typically respond within 24 hours.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href="/contact">
                  <Button
                    size="lg"
                    bg="gray.900"
                    color="white"
                    _hover={{ bg: "gray.800", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Contact Support
                  </Button>
                </Link>
                <Link href="mailto:support@karsilo.com">
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400", bg: "gray.50" }}
                  >
                    Email Us
                  </Button>
                </Link>
              </Flex>
            </Box>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
