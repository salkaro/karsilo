"use client";

import { Box, Skeleton, HStack, VStack, Flex, Text, Icon, Chart, useChart, Recharts } from "@repo/ui";
import { ICharge, IConnection, IOrganisation, IEntity } from "@repo/models";
import { useMemo, useState } from "react";
import { Balloon } from "lucide-react";
import { colors } from "@/constants/colors";

type FilterTab = "all" | "week" | "month" | "year";
type ChartMode = "revenue" | "payments" | "volume" | "earnings";

interface ChartRevenueProps {
    organisation: IOrganisation | null;
    chargesByConnection: Record<string, ICharge[]> | null;
    connections: IConnection[] | null;
    entities: IEntity[] | null;
    loading?: boolean;
    filter: FilterTab;
    mode: ChartMode;
}

const ChartSkeleton = () => (
    <Box
        bg="#0b0b1a"
        p={6}
        borderRadius="xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
        shadow="2xl"
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

const TOTAL_COLOR = "white";

export const ChartRevenue = ({
    organisation,
    chargesByConnection,
    connections,
    entities,
    loading,
    filter,
    mode,
}: ChartRevenueProps) => {
    const groupByDays = filter === "week" || filter === "month";

    // Extract all unique currencies from charges
    const availableCurrencies = useMemo(() => {
        if (!chargesByConnection) return [] as string[];
        const currencies = new Set<string>();
        Object.values(chargesByConnection).forEach((charges) => {
            charges.forEach((charge) => {
                if (charge.currency) currencies.add(charge.currency.toUpperCase());
            });
        });
        const sorted = Array.from(currencies).sort();
        return sorted.length > 0 ? sorted : [organisation?.currency || "USD"];
    }, [chargesByConnection, organisation?.currency]);

    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const currency = selectedCurrency || availableCurrencies[0] || organisation?.currency || "USD";

    const { chartData, seriesConfig, hasMultipleSeries } = useMemo(() => {
        if (!chargesByConnection || !connections) {
            return { chartData: [], seriesConfig: [], hasMultipleSeries: false };
        }

        // Get connection IDs that have charges
        const connectionIds = Object.keys(chargesByConnection);
        if (connectionIds.length === 0) {
            return { chartData: [], seriesConfig: [], hasMultipleSeries: false };
        }

        // Build series config with entity names
        const series = connectionIds.map((connectionId, index) => {
            const connection = connections.find((c) => c.id === connectionId);
            const entity = entities?.find((e) => e.id === connection?.entityId);
            const name = entity?.name || connection?.stripeAccountId?.slice(0, 8) || `Connection ${index + 1}`;
            return {
                name: connectionId,
                label: name,
                color: colors[index % colors.length],
            };
        });

        // Aggregate revenue by period for each connection (filtered by currency)
        const revenueByPeriod: Record<string, Record<string, number>> = {};

        connectionIds.forEach((connectionId) => {
            const charges = chargesByConnection[connectionId] || [];
            charges.forEach((charge) => {
                if (charge.status !== "successful") return;
                if (charge.currency?.toUpperCase() !== currency) return;

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
                revenueByPeriod[periodKey][connectionId] += (mode === "revenue" || mode === "earnings") ? charge.amount : 1;
            });
        });

        // Sort periods and create chart data with cumulative revenue
        const sortedPeriods = Object.keys(revenueByPeriod).sort();

        // Track cumulative totals for each connection
        const cumulativeTotals: Record<string, number> = {};
        connectionIds.forEach((connectionId) => {
            cumulativeTotals[connectionId] = 0;
        });

        const multiSeries = connectionIds.length > 1;

        const data = sortedPeriods.map((periodKey) => {
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

            // Build a flat object with period label + one key per connection
            const point: Record<string, string | number> = { period: periodLabel };

            let totalForPeriod = 0;
            connectionIds.forEach((connectionId) => {
                const periodValue = revenueByPeriod[periodKey]?.[connectionId] || 0;
                if (mode === "volume" || mode === "earnings") {
                    point[connectionId] = periodValue;
                    totalForPeriod += periodValue;
                } else {
                    cumulativeTotals[connectionId] += periodValue;
                    point[connectionId] = cumulativeTotals[connectionId];
                    totalForPeriod += cumulativeTotals[connectionId];
                }
            });

            if (multiSeries) {
                point._total = totalForPeriod;
            }

            return point;
        });

        // Handle single data point: pad with previous and next period at 0
        if (data.length === 1) {
            const singlePoint = data[0];
            const periodKey = sortedPeriods[0];

            const zeroPoint: Record<string, string | number> = { period: "" };
            connectionIds.forEach((id) => { zeroPoint[id] = 0; });
            if (multiSeries) zeroPoint._total = 0;

            if (groupByDays) {
                const [year, month, day] = periodKey.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const prev = new Date(date);
                prev.setDate(prev.getDate() - 1);
                const next = new Date(date);
                next.setDate(next.getDate() + 1);

                const prevLabel = prev.toLocaleString("default", { month: "short", day: "numeric" });
                const nextLabel = next.toLocaleString("default", { month: "short", day: "numeric" });

                return {
                    chartData: [
                        { ...zeroPoint, period: prevLabel },
                        { ...singlePoint },
                        { ...zeroPoint, period: nextLabel },
                    ],
                    seriesConfig: series,
                    hasMultipleSeries: multiSeries,
                };
            } else {
                const [year, month] = periodKey.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1);
                const prev = new Date(date);
                prev.setMonth(prev.getMonth() - 1);
                const next = new Date(date);
                next.setMonth(next.getMonth() + 1);

                const fmt = (d: Date) => d.toLocaleString("default", { month: "short", year: "2-digit" });

                return {
                    chartData: [
                        { ...zeroPoint, period: fmt(prev) },
                        { ...singlePoint },
                        { ...zeroPoint, period: fmt(next) },
                    ],
                    seriesConfig: series,
                    hasMultipleSeries: multiSeries,
                };
            }
        }

        return { chartData: data, seriesConfig: series, hasMultipleSeries: multiSeries };
    }, [chargesByConnection, connections, entities, groupByDays, mode, currency]);

    const chartSeries = useMemo(() => {
        const s = seriesConfig.map((item) => ({ name: item.name as never, color: item.color }));
        if (hasMultipleSeries) {
            s.push({ name: "_total" as never, color: TOTAL_COLOR });
        }
        return s;
    }, [seriesConfig, hasMultipleSeries]);

    const chart = useChart({
        data: chartData,
        series: chartSeries,
    });

    if (loading) {
        return <ChartSkeleton />;
    }

    if (!chargesByConnection || !connections || chartData.length === 0) {
        return (
            <Box
                bg="#0b0b1a"
                p={6}
                borderRadius="xl"
                border="1px solid rgba(255, 255, 255, 0.2)"
                shadow="2xl"
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
                    No {mode === "revenue" ? "revenue" : "payment"} data available
                </Text>

                <Text fontSize="sm" color="gray.500" textAlign="center" maxW="280px">
                    {mode === "revenue" ? "Revenue" : "Payment"} data will appear here once transactions are processed
                </Text>
            </Box>
        );
    }

    return (
        <Box
            bg="#0b0b1a"
            p={6}
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.2)"
        >
            <Box height={{ base: "280px", xl: "400px", "2xl": "500px" }}>
                <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Chart.Root chart={chart}>
                        <Recharts.AreaChart data={chart.data}>
                            {/* Gradient definitions for each series */}
                            <defs>
                                {seriesConfig.map((s) => (
                                    <linearGradient key={s.name} id={`gradient-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={chart.color(s.color)} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={chart.color(s.color)} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>

                            {/* Grid */}
                            <Recharts.CartesianGrid
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            {/* X Axis */}
                            <Recharts.XAxis
                                dataKey="period"
                                tick={{ fill: chart.color("text.muted") }}
                                axisLine={false}
                                tickLine={false}
                            />

                            {/* Y Axis */}
                            <Recharts.YAxis
                                tickFormatter={(mode === "revenue" || mode === "earnings") ? chart.formatNumber({ notation: "compact" }) : undefined}
                                tick={{ fill: chart.color("text.muted") }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={mode === "revenue" || mode === "earnings"}
                            />

                            {/* Tooltip */}
                            <Recharts.Tooltip
                                contentStyle={{
                                    backgroundColor: chart.color("bg.surface"),
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: chart.color("white") }}
                                formatter={(value, name) => {
                                    if (typeof value !== "number") return "";
                                    const formatted = (mode === "revenue" || mode === "earnings")
                                        ? chart.formatNumber({ style: "currency", currency })(value)
                                        : value.toLocaleString();
                                    if (name === "_total") {
                                        return [formatted, "Total"];
                                    }
                                    const label = seriesConfig.find((s) => s.name === name)?.label || name;
                                    return [formatted, label];
                                }}
                            />

                            {/* Area series for each connection */}
                            {seriesConfig.map((s) => (
                                <Recharts.Area
                                    key={s.name}
                                    type="monotone"
                                    dataKey={chart.key(s.name as never)}
                                    stroke={chart.color(s.color)}
                                    fill={`url(#gradient-${s.name})`}
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: chart.color(s.color) }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}

                            {/* Total line when multiple series */}
                            {hasMultipleSeries && (
                                <Recharts.Area
                                    type="monotone"
                                    dataKey={chart.key("_total" as never)}
                                    stroke={chart.color(TOTAL_COLOR)}
                                    fill="none"
                                    strokeWidth={2}
                                    strokeDasharray="6 3"
                                    dot={false}
                                    activeDot={{ r: 5, fill: chart.color(TOTAL_COLOR) }}
                                />
                            )}
                        </Recharts.AreaChart>
                    </Chart.Root>
                </Recharts.ResponsiveContainer>
            </Box>

            {/* Currency selector */}
            {availableCurrencies.length > 1 && (
                <HStack justify="center" gap={2} mt={4}>
                    {availableCurrencies.map((cur) => (
                        <Box
                            key={cur}
                            as="button"
                            px={3}
                            py={1}
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight="semibold"
                            cursor="pointer"
                            transition="all 0.15s"
                            bg={currency === cur ? "purple.900" : "transparent"}
                            color={currency === cur ? "white" : "gray.400"}
                            border="1px solid"
                            borderColor={currency === cur ? "purple.500" : "rgba(255, 255, 255, 0.15)"}
                            _hover={{
                                borderColor: currency === cur ? "purple.400" : "rgba(255, 255, 255, 0.3)",
                            }}
                            onClick={() => setSelectedCurrency(cur)}
                        >
                            {cur}
                        </Box>
                    ))}
                </HStack>
            )}
        </Box>
    );
};
