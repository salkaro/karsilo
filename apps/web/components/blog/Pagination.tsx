"use client";

import { HStack, Button, Text } from "@repo/ui/index";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <HStack gap={2} justify="center">
      {/* Previous Button */}
      <Button
        size="sm"
        variant="outline"
        borderColor="gray.200"
        color="gray.600"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        _hover={{ bg: "gray.50", borderColor: "gray.300" }}
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
      >
        <ChevronLeftIcon />
        <Text ml={1}>Previous</Text>
      </Button>

      {/* Page Numbers */}
      <HStack gap={1} display={{ base: "none", md: "flex" }}>
        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <Text key={`ellipsis-${index}`} px={2} color="gray.400">
              {page}
            </Text>
          ) : (
            <Button
              key={page}
              size="sm"
              minW="40px"
              bg={currentPage === page ? "brand.600" : "white"}
              color={currentPage === page ? "white" : "gray.700"}
              border="1px solid"
              borderColor={currentPage === page ? "brand.600" : "gray.200"}
              _hover={{
                bg: currentPage === page ? "brand.700" : "gray.50",
                borderColor: currentPage === page ? "brand.700" : "gray.300",
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
      </HStack>

      {/* Mobile Page Indicator */}
      <Text
        display={{ base: "block", md: "none" }}
        fontSize="sm"
        color="gray.600"
      >
        Page {currentPage} of {totalPages}
      </Text>

      {/* Next Button */}
      <Button
        size="sm"
        variant="outline"
        borderColor="gray.200"
        color="gray.600"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        _hover={{ bg: "gray.50", borderColor: "gray.300" }}
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
      >
        <Text mr={1}>Next</Text>
        <ChevronRightIcon />
      </Button>
    </HStack>
  );
}
