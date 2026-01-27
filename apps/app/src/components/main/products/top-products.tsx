"use client";

import { useMemo, useState } from "react";
import { Box, Card, Stat, HStack, Text, useChart, Recharts, SimpleGrid } from "@repo/ui";
import { ProductWithStats, SalesDataPoint } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/formatters";

interface TopProductsProps {
    products: ProductWithStats[];
    maxItems?: number;
}

export const TopProducts = ({ products, maxItems = 4 }: TopProductsProps) => {
    const topProducts = useMemo(() => {
        return products
            .filter((p) => p.totalRevenue > 0)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, maxItems);
    }, [products, maxItems]);

    if (topProducts.length === 0) {
        return null;
    }

    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            {topProducts.map((product) => (
                <TopProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </SimpleGrid>
    );
};

interface TopProductCardProps {
    product: ProductWithStats;
}

const TopProductCard = ({ product }: TopProductCardProps) => {
    const [hoveredPoint, setHoveredPoint] = useState<SalesDataPoint | null>(null);

    const displayPoint = hoveredPoint ?? product.salesHistory[product.salesHistory.length - 1] ?? null;

    return (
        <Card.Root
            overflow="hidden"
            w="100%"
        >
            <Card.Body>
                <Stat.Root>
                    <Stat.Label>{product.name}</Stat.Label>
                    <Stat.ValueText>
                        {displayPoint
                            ? formatCurrency({ amount: displayPoint.revenue, currency: displayPoint.currency })
                            : formatCurrency({ amount: product.totalRevenue, currency: product.currency })}
                    </Stat.ValueText>
                    {displayPoint && (
                        <HStack gap={3}>
                            <Text fontSize="xs" color="gray.500">
                                {formatDisplayDate(displayPoint.date)}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {displayPoint.salesCount} sale{displayPoint.salesCount !== 1 ? "s" : ""}
                            </Text>
                        </HStack>
                    )}
                </Stat.Root>
            </Card.Body>
            {product.salesHistory.length > 0 && (
                <ProductSparkLine
                    salesHistory={product.salesHistory}
                    onHover={setHoveredPoint}
                />
            )}
        </Card.Root>
    );
};

interface ProductSparkLineProps {
    salesHistory: SalesDataPoint[];
    onHover?: (point: SalesDataPoint | null) => void;
}

export const ProductSparkLine = ({ salesHistory, onHover }: ProductSparkLineProps) => {
    const chartData = useMemo(() => {
        if (salesHistory.length === 1) {
            return [
                { value: 0 },
                { value: salesHistory[0].revenue },
            ];
        }
        return salesHistory.map((point) => ({
            value: point.revenue,
        }));
    }, [salesHistory]);

    const chart = useChart({
        data: chartData,
        series: [{ color: "purple.400" }],
    });

    return (
        <Box height="60px">
            <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.AreaChart
                    data={chart.data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    onMouseMove={(state) => {
                        if (onHover && state?.activeTooltipIndex != null) {
                            const idx = state.activeTooltipIndex as number;
                            // When padded, index 0 is the fake zero point
                            const realIdx = salesHistory.length === 1 ? 0 : idx;
                            if (salesHistory[realIdx]) {
                                onHover(salesHistory[realIdx]);
                            }
                        }
                    }}
                    onMouseLeave={() => onHover?.(null)}
                >
                    <defs>
                        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chart.color("purple.400")} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={chart.color("purple.400")} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Recharts.Area
                        type="monotone"
                        dataKey="value"
                        stroke={chart.color("purple.400")}
                        fill="url(#sparkGradient)"
                        strokeWidth={2}
                        isAnimationActive={false}
                        dot={false}
                    />
                </Recharts.AreaChart>
            </Recharts.ResponsiveContainer>
        </Box>
    );
};

function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}
