"use client";

import { Box, Input } from "@repo/ui/index";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function BlogSearch({
  value,
  onChange,
  placeholder = "Search articles...",
}: BlogSearchProps) {
  return (
    <Box maxW="md" width="full" position="relative">
      <Box
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        color="gray.400"
        zIndex={2}
      >
        <SearchIcon />
      </Box>
      <Input
        placeholder={placeholder}
        size="lg"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        pl={12}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
        }}
      />
    </Box>
  );
}
