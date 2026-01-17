"use client";

import { HStack, Button } from "@repo/ui/index";
import type { BlogCategory } from "../../lib/blog-types";

interface CategoryFilterProps {
  activeCategory: BlogCategory | null;
  onCategoryChange: (category: BlogCategory | null) => void;
  categories: { category: BlogCategory; count: number }[];
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <HStack gap={2} flexWrap="wrap" justify="center">
      {/* All Posts */}
      <Button
        size="sm"
        borderRadius="full"
        bg={activeCategory === null ? "brand.600" : "white"}
        color={activeCategory === null ? "white" : "gray.700"}
        border="1px solid"
        borderColor={activeCategory === null ? "brand.600" : "gray.200"}
        _hover={{
          bg: activeCategory === null ? "brand.700" : "gray.50",
          borderColor: activeCategory === null ? "brand.700" : "gray.300",
        }}
        onClick={() => onCategoryChange(null)}
        transition="all 0.2s"
      >
        All ({totalCount})
      </Button>

      {/* Category Buttons */}
      {categories.map(({ category, count }) => (
        <Button
          key={category}
          size="sm"
          borderRadius="full"
          bg={activeCategory === category ? "brand.600" : "white"}
          color={activeCategory === category ? "white" : "gray.700"}
          border="1px solid"
          borderColor={activeCategory === category ? "brand.600" : "gray.200"}
          _hover={{
            bg: activeCategory === category ? "brand.700" : "gray.50",
            borderColor: activeCategory === category ? "brand.700" : "gray.300",
          }}
          onClick={() => onCategoryChange(category)}
          transition="all 0.2s"
        >
          {category} ({count})
        </Button>
      ))}
    </HStack>
  );
}
