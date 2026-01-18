"use client";

import { Box, Skeleton, HStack, VStack, Flex, Text, Icon } from "@repo/ui";
import { ICharge, IConnection, IOrganisation, IEntity } from "@repo/models";
import { useMemo } from "react";
import { Balloon } from "lucide-react";
import { SVGChart } from "@/components/ui/chart";
import { SVGChartDataPoint, SVGChartSeries } from "@/components/ui/chart/models";

type FilterTab = "all" | "week" | "month" | "year";

interface ChartRevenueProps {
    organisation: IOrganisation | null;
    chargesByConnection: Record<string, ICharge[]> | null;
    connections: IConnection[] | null;
    entities: IEntity[] | null;
    loading?: boolean;
    filter: FilterTab;
}

// Color palette for different connections
const CONNECTION_COLORS = [
    "#8b5cf6", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // orange
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#eab308", // yellow
    "#ef4444", // red
];

const ChartSkeleton = () => (
    <Box
        bg="#111827"
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        shadow="sm"
        height={{ base: "280px", xl: "400px", "2xl": "500px" }}
    >
        <VStack height="100%" gap={4}>
            <HStack width="100%" height="100%" gap={4} align="stretch">
                <VStack justify="space-between" py={4}>
                    <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="35px" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="30px" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="35px" bg="gray.800" color="gray.700" />
                </VStack>
                <Box flex={1} position="relative">
                    <Skeleton height="100%" width="100%" bg="gray.800" color="gray.700" />
                </Box>
            </HStack>
            <HStack width="100%" justify="space-around" pl="50px">
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
                <Skeleton height="12px" width="40px" bg="gray.800" color="gray.700" />
            </HStack>
            <HStack justify="center" gap={6}>
                <HStack gap={2}>
                    <Skeleton height="12px" width="12px" borderRadius="full" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="60px" bg="gray.800" color="gray.700" />
                </HStack>
                <HStack gap={2}>
                    <Skeleton height="12px" width="12px" borderRadius="full" bg="gray.800" color="gray.700" />
                    <Skeleton height="12px" width="50px" bg="gray.800" color="gray.700" />
                </HStack>
            </HStack>
        </VStack>
    </Box>
);

export const ChartRevenue = ({
    organisation,
    chargesByConnection,
    connections,
    entities,
    loading,
    filter,
}: ChartRevenueProps) => {
    const groupByDays = filter === "week" || filter === "month";
    const currency = organisation?.currency || "USD";

    const { chartData, seriesConfig } = useMemo(() => {
        if (!chargesByConnection || !connections) {
            return { chartData: [], seriesConfig: [] };
        }

        // Get connection IDs that have charges
        const connectionIds = Object.keys(chargesByConnection);
        if (connectionIds.length === 0) {
            return { chartData: [], seriesConfig: [] };
        }

        // Build series config with entity names
        const series: SVGChartSeries[] = connectionIds.map((connectionId, index) => {
            const connection = connections.find((c) => c.id === connectionId);
            const entity = entities?.find((e) => e.id === connection?.entityId);
            const name = entity?.name || connection?.stripeAccountId?.slice(0, 8) || `Connection ${index + 1}`;
            return {
                id: connectionId,
                name,
                color: CONNECTION_COLORS[index % CONNECTION_COLORS.length],
            };
        });

        // Aggregate revenue by period for each connection
        const revenueByPeriod: Record<string, Record<string, number>> = {};

        connectionIds.forEach((connectionId) => {
            const charges = chargesByConnection[connectionId] || [];
            charges.forEach((charge) => {
                if (charge.status !== "successful") return;

                const date = new Date(charge.createdAt);
                let periodKey: string;

                if (groupByDays) {
                    periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                } else {
                    periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                }

                if (!revenueByPeriod[periodKey]) {
                    revenueByPeriod[periodKey] = {};
                }
                if (!revenueByPeriod[periodKey][connectionId]) {
                    revenueByPeriod[periodKey][connectionId] = 0;
                }
                revenueByPeriod[periodKey][connectionId] += charge.amount;
            });
        });

        // Sort periods and create chart data with cumulative revenue
        const sortedPeriods = Object.keys(revenueByPeriod).sort();

        // Track cumulative totals for each connection
        const cumulativeTotals: Record<string, number> = {};
        connectionIds.forEach((connectionId) => {
            cumulativeTotals[connectionId] = 0;
        });

        const data: SVGChartDataPoint[] = sortedPeriods.map((periodKey) => {
            let periodLabel: string;

            if (groupByDays) {
                const [year, month, day] = periodKey.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                periodLabel = date.toLocaleString("default", {
                    month: "short",
                    day: "numeric",
                });
            } else {
                const [year, month] = periodKey.split("-");
                periodLabel = new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", {
                    month: "short",
                    year: "2-digit",
                });
            }

            // Create values array with cumulative totals
            const values = connectionIds.map((connectionId) => {
                // Add this period's revenue to the cumulative total
                cumulativeTotals[connectionId] += revenueByPeriod[periodKey]?.[connectionId] || 0;
                const value = cumulativeTotals[connectionId];
                const displayValue = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency,
                    notation: "compact",
                    maximumFractionDigits: 1,
                }).format(value);
                return { value, displayValue };
            });

            return {
                label: periodLabel,
                values,
            };
        });

        // Handle single data point: duplicate to create a visible line
        if (data.length === 1) {
            const singlePoint = data[0];
            return {
                chartData: [
                    { ...singlePoint, label: "" },
                    { ...singlePoint },
                    { ...singlePoint, label: "" },
                ],
                seriesConfig: series,
            };
        }

        return { chartData: data, seriesConfig: series };
    }, [chargesByConnection, connections, entities, groupByDays, currency]);

    if (loading) {
        return <ChartSkeleton />;
    }

    if (!chargesByConnection || !connections || chartData.length === 0) {
        return (
            <Box
                bg="#111827"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
                height={{ base: "280px", xl: "400px", "2xl": "500px" }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                color="gray.500"
            >
                <Flex
                    w="80px"
                    h="80px"
                    bg="purple.500/10"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    animation="balloonFloat 4s ease-in-out infinite"
                >
                    <Icon as={Balloon} boxSize={10} color="purple.500" strokeWidth={1.8} />
                </Flex>

                <Text fontSize="lg" fontWeight="medium" color="gray.400">
                    No revenue data available
                </Text>

                <Text fontSize="sm" color="gray.500" textAlign="center" maxW="280px">
                    Revenue will appear here once transactions are processed
                </Text>
            </Box>
        );
    }

    return (
        <Box
            borderRadius={30}
            border="3px solid"
            borderColor="gray.200"
            shadow="sm"
            height={{ base: "280px", xl: "400px", "2xl": "500px" }}
            position="relative"
        >
            <SVGChart
                data={chartData}
                series={seriesConfig}
                backgroundColor="#111827"
                showGrid={true}
                gridLines={4}
                animated={true}
                currency={currency}
                showXAxis={true}
                showYAxis={true}
            />
        </Box>
    );
};
