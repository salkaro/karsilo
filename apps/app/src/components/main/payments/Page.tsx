"use client";

import { useCharges } from "@/hooks/useCharges";
import { useConnections } from "@/hooks/useConnections";
import { useOrganisation } from "@/hooks/useOrganisation";
import { ChartRevenue } from "./chart-revenue";
import { PaymentsTable } from "./payments-table";
import { formatDateRange } from "@/utils/formatters";
import { useMemo, useState } from "react";
import { FilterLongType } from "@/constants/filters";
import { ICharge } from "@/models/charge";

// Chakra UI v3 components from your monorepo package
import {
    Tabs,
    TabsList,
    TabsTrigger,
    Box,
    VStack,
} from "@repo/ui";
import { useEntities } from "@/hooks/useEntities";

type FilterTab = "all" | "week" | "month" | "year";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
];

export default function RevenuePage() {
    const { organisation } = useOrganisation();
    const { entities } = useEntities(organisation?.id ?? null)
    const { connections } = useConnections(organisation?.id ?? null);

    const [activeFilter, setActiveFilter] = useState<FilterTab>("month");

    const dateRange = useMemo(
        () => formatDateRange(activeFilter as FilterLongType),
        [activeFilter]
    );

    const { chargesByConnection, loading: loadingCharges, refetch: refetchCharges } = useCharges(
        activeFilter === "all"
            ? organisation?.id ?? null
            : { organisationId: organisation?.id ?? null, ...dateRange }
    );

    // Flatten all charges from all connections into a single array
    const allCharges: ICharge[] = useMemo(() => {
        if (!chargesByConnection) return [];
        return Object.values(chargesByConnection).flat();
    }, [chargesByConnection]);

    return (
        <VStack p={{ base: 4, md: 6 }} gap={8} align="stretch">
            <Box>
                <Tabs.Root
                    value={activeFilter}
                    onValueChange={(details) => setActiveFilter(details.value as FilterTab)}
                >
                    <TabsList
                        mb={6}
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

                <ChartRevenue
                    organisation={organisation}
                    entities={entities}
                    chargesByConnection={chargesByConnection}
                    connections={connections}
                    loading={loadingCharges}
                    filter={activeFilter}
                />
            </Box>

            <PaymentsTable
                charges={allCharges}
                entities={entities}
                currency={organisation?.currency || "GBP"}
                onRefresh={refetchCharges}
                loading={loadingCharges}
            />
        </VStack>
    );
}