"use client";

import { useMemo, useState } from "react";
import { VStack, Box, Text, Skeleton, Tabs, TabsList, TabsTrigger, Separator } from "@repo/ui";
import { useOrganisation } from "@/hooks/useOrganisation";
import { useConnections } from "@/hooks/useConnections";
import { useEntities } from "@/hooks/useEntities";
import { useRefunds, IRefund } from "@/hooks/useRefunds";
import { RefundsTable } from "./refunds-table";
import { formatDateRange } from "@/utils/formatters";

type FilterTab = "all" | "week" | "month" | "year";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
];

const RefundsSkeleton = () => (
    <VStack gap={4} align="stretch">
        <Skeleton height="40px" width="300px" borderRadius="md" />
        <Skeleton height="60px" width="100%" borderRadius="lg" />
        <Skeleton height="400px" width="100%" borderRadius="lg" />
    </VStack>
);

const Page = () => {
    const { organisation } = useOrganisation();
    const { connections } = useConnections(organisation?.id ?? null);
    const { entities } = useEntities(organisation?.id ?? null);

    const [activeFilter, setActiveFilter] = useState<FilterTab>("month");

    const dateRange = useMemo(
        () => formatDateRange(activeFilter),
        [activeFilter]
    );

    const { refundsByConnection, loading, refetch } = useRefunds(
        activeFilter === "all"
            ? organisation?.id ?? null
            : { organisationId: organisation?.id ?? null, ...dateRange }
    );

    const connectionEntityMap = useMemo(() => {
        if (!connections) return {};
        return connections.reduce(
            (acc, conn) => {
                if (conn.entityId) {
                    acc[conn.id] = conn.entityId;
                }
                return acc;
            },
            {} as Record<string, string>
        );
    }, [connections]);

    const allRefunds = useMemo(() => {
        if (!refundsByConnection) return [];

        const refunds: (IRefund & { connectionId: string })[] = [];
        Object.entries(refundsByConnection).forEach(([connectionId, connectionRefunds]) => {
            connectionRefunds.forEach((refund) => {
                refunds.push({ ...refund, connectionId });
            });
        });

        return refunds;
    }, [refundsByConnection]);

    const stripeConnections = useMemo(() => {
        if (!connections) return [];
        return connections.filter(
            (c) => c.type === "stripe" && c.status === "connected"
        );
    }, [connections]);

    const hasStripeConnections = stripeConnections.length > 0;

    // Only show full skeleton on initial load when we have no data yet
    // Once we have data, just pass loading to the table for inline spinner
    const isInitialLoad = loading && refundsByConnection === null;

    if (isInitialLoad) {
        return (
            <VStack gap={6} align="stretch">
                <RefundsSkeleton />
            </VStack>
        );
    }

    if (!hasStripeConnections) {
        return (
            <VStack gap={6} align="stretch">
                <Box
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="center"
                >
                    <VStack gap={4}>
                        <Text color="gray.500" fontSize="lg">
                            No Stripe accounts connected
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Connect a Stripe account to view refunds
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        );
    }

    return (
        <VStack gap={6} align="stretch">
            {/* Filter Tabs */}
            <Box>
                <Tabs.Root
                    value={activeFilter}
                    onValueChange={(details) => setActiveFilter(details.value as FilterTab)}
                >
                    <TabsList
                        display="inline-flex"
                        gap={1}
                    >
                        {FILTER_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                px={4}
                                py={1}
                                borderRadius="md"
                                fontWeight="medium"
                                color="gray.700"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs.Root>
            </Box>

            <Separator borderWidth="1px" />

            {/* Refunds Table */}
            <RefundsTable
                refunds={allRefunds}
                entities={entities}
                connectionEntityMap={connectionEntityMap}
                currency={organisation?.currency || "GBP"}
                onRefresh={refetch}
                loading={loading}
            />
        </VStack>
    );
}

export default Page
