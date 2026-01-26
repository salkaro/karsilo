"use client";

import { useCharges } from "@/hooks/useCharges";
import { useConnections } from "@/hooks/useConnections";
import { useOrganisation } from "@/hooks/useOrganisation";
import { ChartRevenue } from "./chart-revenue";
import { PaymentsTable } from "./payments-table";
import { formatDateRange } from "@/utils/formatters";
import { useMemo, useState } from "react";
import { FilterLongType } from "@/constants/filters";
import { ICharge } from "@repo/models";

// Chakra UI v3 components from your monorepo package
import {
    Tabs,
    TabsList,
    TabsTrigger,
    Box,
    VStack,
    HStack,
    Select,
    Portal,
    createListCollection,
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
    const [selectedCurrency, setSelectedCurrency] = useState<string>("");
    const [selectedEntityId, setSelectedEntityId] = useState<string>("");

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

    // Get unique currencies from charges
    const availableCurrencies = useMemo(() => {
        const currencies = new Set<string>();
        allCharges.forEach((c) => {
            if (c.currency) currencies.add(c.currency.toUpperCase());
        });
        return Array.from(currencies).sort();
    }, [allCharges]);

    // Get unique entities from charges
    const availableEntities = useMemo(() => {
        const entityIds = new Set<string>();
        allCharges.forEach((c) => {
            if (c.entityId) entityIds.add(c.entityId);
        });
        return (entities || []).filter((e) => entityIds.has(e.id));
    }, [allCharges, entities]);

    // Filter charges based on selected filters
    const filteredCharges = useMemo(() => {
        return allCharges.filter((c) => {
            if (selectedCurrency && c.currency?.toUpperCase() !== selectedCurrency) {
                return false;
            }
            if (selectedEntityId && c.entityId !== selectedEntityId) {
                return false;
            }
            return true;
        });
    }, [allCharges, selectedCurrency, selectedEntityId]);

    // Filter chargesByConnection for the chart
    const filteredChargesByConnection = useMemo(() => {
        if (!chargesByConnection) return null;
        const filtered: Record<string, ICharge[]> = {};
        Object.entries(chargesByConnection).forEach(([connectionId, charges]) => {
            const filteredChargesForConnection = charges.filter((c) => {
                if (selectedCurrency && c.currency?.toUpperCase() !== selectedCurrency) {
                    return false;
                }
                if (selectedEntityId && c.entityId !== selectedEntityId) {
                    return false;
                }
                return true;
            });
            // Only include connections that have matching charges
            if (filteredChargesForConnection.length > 0) {
                filtered[connectionId] = filteredChargesForConnection;
            }
        });
        return filtered;
    }, [chargesByConnection, selectedCurrency, selectedEntityId]);

    // Create collections for select dropdowns
    const currencyCollection = useMemo(() => createListCollection({
        items: [
            { label: "All Currencies", value: "" },
            ...availableCurrencies.map((c) => ({ label: c, value: c })),
        ],
    }), [availableCurrencies]);

    const entityCollection = useMemo(() => createListCollection({
        items: [
            { label: "All Entities", value: "" },
            ...availableEntities.map((e) => ({ label: e.name, value: e.id })),
        ],
    }), [availableEntities]);


    return (
        <VStack p={{ md: 6 }} gap={8} align="stretch">
            <Box>
                <HStack justify="space-between" wrap="wrap" gap={4} mb={6}>
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

                    <HStack gap={2}>
                        {availableCurrencies.length > 1 && (
                            <Select.Root
                                collection={currencyCollection}
                                size="sm"
                                width="150px"
                                value={selectedCurrency ? [selectedCurrency] : []}
                                onValueChange={(details) => setSelectedCurrency(details.value[0] || "")}
                            >
                                <Select.HiddenSelect />
                                <Select.Trigger borderRadius="md">
                                    <Select.ValueText placeholder="All Curriences" />
                                </Select.Trigger>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {currencyCollection.items.map((item) => (
                                                <Select.Item key={item.value} item={item}>
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        )}
                        {availableEntities.length > 1 && (
                            <Select.Root
                                collection={entityCollection}
                                size="sm"
                                width="180px"
                                value={selectedEntityId ? [selectedEntityId] : []}
                                onValueChange={(details) => setSelectedEntityId(details.value[0] || "")}
                            >
                                <Select.HiddenSelect />
                                <Select.Trigger borderRadius="md">
                                    <Select.ValueText placeholder="All Entities" />
                                </Select.Trigger>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {entityCollection.items.map((item) => (
                                                <Select.Item key={item.value} item={item}>
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        )}
                    </HStack>
                </HStack>

                <ChartRevenue
                    organisation={organisation}
                    entities={entities}
                    chargesByConnection={filteredChargesByConnection}
                    connections={connections}
                    loading={loadingCharges}
                    filter={activeFilter}
                />
            </Box>

            <PaymentsTable
                charges={filteredCharges}
                entities={entities}
                currency={organisation?.currency || "GBP"}
                onRefresh={refetchCharges}
                loading={loadingCharges}
            />
        </VStack>
    );
}