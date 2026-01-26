"use client";

import { useMemo, useState } from "react";
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
    Separator,
    Stack,
} from "@repo/ui";
import { useOrganisation } from "@/hooks/useOrganisation";
import { useEntities } from "@/hooks/useEntities";
import { useProducts, ProductWithStats } from "@/hooks/useProducts";
import { ProductsTable } from "./products-table";
import { formatDateRange } from "@/utils/formatters";
import { FilterLongType } from "@/constants/filters";
import { ProductBarList } from "./bar-list";
import { TopProducts } from "./top-products";

type FilterTab = "all" | "week" | "month" | "year";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
];


export default function ProductsPage() {
    const { organisation } = useOrganisation();
    const { entities } = useEntities(organisation?.id ?? null);

    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("active");

    const dateRange = useMemo(
        () => formatDateRange(activeFilter as FilterLongType),
        [activeFilter]
    );

    const { productsByConnection, loading, refetch } = useProducts({
        organisationId: organisation?.id ?? null,
        entities,
        ...(activeFilter !== "all" ? dateRange : {}),
    });

    // Flatten all products from all connections
    const allProducts: ProductWithStats[] = useMemo(() => {
        if (!productsByConnection) return [];
        return Object.values(productsByConnection).flat();
    }, [productsByConnection]);

    // Filter products by status
    const filteredProducts = useMemo(() => {
        if (!selectedStatus) return allProducts;
        const isActive = selectedStatus === "active";
        return allProducts.filter(p => p.active === isActive);
    }, [allProducts, selectedStatus]);

    // Status filter collection
    const statusCollection = useMemo(() => createListCollection({
        items: [
            { label: "All Status", value: "" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
    }), []);

    return (
        <VStack align="stretch" spaceY={4} marginTop={4} h="100%">
            <Box>
                <HStack justify="space-between" wrap="wrap" gap={4}>
                    <Tabs.Root
                        value={activeFilter}
                        onValueChange={(details) => setActiveFilter(details.value as FilterTab)}
                    >
                        <TabsList display="inline-flex" gap={1}>
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
                        <Select.Root
                            collection={statusCollection}
                            size="sm"
                            width="150px"
                            value={selectedStatus ? [selectedStatus] : []}
                            onValueChange={(details) => setSelectedStatus(details.value[0] || "")}
                        >
                            <Select.HiddenSelect />
                            <Select.Trigger borderRadius="md">
                                <Select.ValueText placeholder="All Status" />
                            </Select.Trigger>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {statusCollection.items.map((item) => (
                                            <Select.Item key={item.value} item={item}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </HStack>
                </HStack>
            </Box>

            <Stack
                w="100%"
                gap={4}
                direction={{ base: "column", lg: "row" }}
            >
                <Box flex="1" minW={0}>
                    <TopProducts products={filteredProducts} />
                </Box>
                <Box flex="1" minW={0}>
                    <ProductBarList products={filteredProducts} />
                </Box>
            </Stack>


            <Separator borderWidth="1px" />


            <ProductsTable
                products={filteredProducts}
                organisation={organisation}
                onRefresh={refetch}
                loading={loading}
            />
        </VStack>
    );
}
