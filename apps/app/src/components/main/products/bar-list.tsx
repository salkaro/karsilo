"use client";

import { useMemo } from "react";
import { Box, HStack, Text } from "@repo/ui";
import { ProductWithStats } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/formatters";

interface ProductBarListProps {
    products: ProductWithStats[];
    maxItems?: number;
}

export const ProductBarList = ({
    products,
    maxItems = 10,
}: ProductBarListProps) => {
    const sortedProducts = useMemo(() => {
        return products
            .filter(p => p.totalRevenue > 0)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, maxItems);
    }, [products, maxItems]);

    if (sortedProducts.length === 0) {
        return null;
    }

    const maxRevenue = sortedProducts[0].totalRevenue;

    return (
        <Box w="100%">
            <HStack justify="space-between" mb={2} px={1}>
                <Text fontSize="xs" fontWeight="medium" color="gray.600">Product</Text>
                <Text fontSize="xs" fontWeight="medium" color="gray.600">Revenue</Text>
            </HStack>
            {sortedProducts.map((product) => (
                <HStack key={product.id} justify="space-between" py={1}>
                    <Box flex="1" mr={4}>
                        <Box position="relative">
                            <Box
                                position="absolute"
                                left={0}
                                top={0}
                                bottom={0}
                                width={`${(product.totalRevenue / maxRevenue) * 100}%`}
                                bg="purple.100"
                                borderRadius="md"
                            />
                            <Text position="relative" px={2} py={2} fontSize="sm" fontWeight="medium">
                                {product.name}
                            </Text>
                        </Box>
                    </Box>
                    <Text fontSize="sm" fontWeight="semibold">
                        {formatCurrency({ amount: product.totalRevenue, currency: product.currency })}
                    </Text>
                </HStack>
            ))}
        </Box>
    );
};