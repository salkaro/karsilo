"use client";

import { useMemo } from "react";
import { HStack, VStack, Text, Badge, Avatar } from "@repo/ui";
import { IOrganisation } from "@repo/models";
import { DataTable, Column, SummaryCard } from "@/components/ui/table";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";
import { TrendingUp, Users, Package, Tag } from "lucide-react";
import { ProductWithStats, PriceStats } from "@/hooks/useProducts";

interface ProductsTableProps {
    products: ProductWithStats[];
    organisation: IOrganisation | null;
    onRefresh?: () => void;
    loading?: boolean;
}

export const ProductsTable = ({
    products,
    organisation,
    onRefresh,
    loading,
}: ProductsTableProps) => {
    const primaryCurrency = organisation?.currency || "USD";
    // Sort by revenue descending
    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [products]);

    // Get status badge color
    const getStatusColor = (active: boolean) => {
        return active ? "green" : "gray";
    };

    // Get interval display text
    const getIntervalDisplay = (interval: string | null) => {
        if (!interval) return "One-time";
        switch (interval) {
            case "day":
                return "Daily";
            case "week":
                return "Weekly";
            case "month":
                return "Monthly";
            case "year":
                return "Yearly";
            default:
                return interval.charAt(0).toUpperCase() + interval.slice(1);
        }
    };

    // Format price display
    const formatPriceDisplay = (price: PriceStats) => {
        const amount = price.unitAmount ? price.unitAmount / 100 : 0;
        const formatted = formatCurrency({ amount, currency: price.currency });
        if (price.interval) {
            return `${formatted}/${price.interval}`;
        }
        return formatted;
    };

    // Calculate totals for summary cards
    const summaryCards: SummaryCard[] = useMemo(() => {
        const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);

        // Calculate unique customers across all products
        const allCustomerIds = new Set<string>();
        products.forEach(p => {
            p.prices.forEach(price => {
                price.customerIds.forEach(id => allCustomerIds.add(id));
            });
        });

        const activeProducts = products.filter(p => p.active).length;
        const totalPrices = products.reduce((sum, p) => sum + p.prices.length, 0);

        // Group revenue by currency
        const revenueByCurrency: Record<string, number> = {};
        products.forEach(p => {
            p.prices.forEach(price => {
                const curr = price.currency.toUpperCase();
                revenueByCurrency[curr] = (revenueByCurrency[curr] || 0) + price.revenue;
            });
        });

        const currencies = Object.keys(revenueByCurrency);
        const primaryRevenue = revenueByCurrency[primaryCurrency] || totalRevenue;

        const revenueDropdownItems = currencies.length > 1
            ? currencies.map(curr => ({
                label: curr,
                value: formatCurrency({ amount: revenueByCurrency[curr], currency: curr }),
            }))
            : [];

        return [
            {
                icon: <TrendingUp size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Total Revenue",
                value: formatCurrency({ amount: primaryRevenue, currency: primaryCurrency }),
                dropdownItems: revenueDropdownItems,
            },
            {
                icon: <Users size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "Unique Customers",
                value: allCustomerIds.size,
            },
            {
                icon: <Package size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Active Products",
                value: `${activeProducts} / ${products.length}`,
            },
            {
                icon: <Tag size={20} />,
                iconColor: "orange.500",
                iconBg: "orange.500/10",
                label: "Total Prices",
                value: totalPrices,
            },
        ];
    }, [products, primaryCurrency]);

    // Define columns
    const columns: Column<ProductWithStats>[] = useMemo(() => [
        {
            key: "entity",
            header: "Entity",
            render: (product: ProductWithStats) => (
                <HStack gap={3} minW={32}>
                    <Avatar.Root size="sm">
                        <Avatar.Image src={product.entity?.image} />
                        <Avatar.Fallback>
                            {product.entity?.name?.charAt(0) || "?"}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <VStack gap={0} align="start">
                        <Text fontSize="sm" fontWeight="medium">
                            {product.entity?.name}
                        </Text>
                    </VStack>
                </HStack>
            )
        },
        {
            key: "product",
            header: "Product",
            render: (product: ProductWithStats) => (
                <HStack gap={3}>
                    <Avatar.Root size="sm">
                        <Avatar.Image src={product.images[0]} />
                        <Avatar.Fallback>
                            {product.name?.charAt(0) || "?"}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <VStack gap={0} align="start">
                        <Text fontSize="sm" fontWeight="medium">
                            {product.name}
                        </Text>
                    </VStack>
                </HStack>
            )
        },
        {
            key: "status",
            header: "Status",
            render: (product: ProductWithStats) => (
                <Badge
                    size="sm"
                    colorPalette={getStatusColor(product.active)}
                    variant="subtle"
                >
                    {product.active ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "prices",
            header: "Prices",
            render: (product: ProductWithStats) => (
                <VStack gap={1} align="start">
                    {product.prices.length === 0 ? (
                        <Text fontSize="sm" color="gray.400">No prices</Text>
                    ) : product.prices.length <= 2 ? (
                        product.prices.map((price) => (
                            <HStack key={price.priceId} gap={2}>
                                <Text fontSize="sm">
                                    {formatPriceDisplay(price)}
                                </Text>
                                <Badge size="xs" colorPalette={price.interval ? "blue" : "purple"} variant="subtle">
                                    {getIntervalDisplay(price.interval)}
                                </Badge>
                            </HStack>
                        ))
                    ) : (
                        <HStack gap={2}>
                            <Text fontSize="sm">
                                {formatPriceDisplay(product.prices[0])}
                            </Text>
                            <Badge size="xs" colorPalette="gray" variant="subtle">
                                +{product.prices.length - 1} more
                            </Badge>
                        </HStack>
                    )}
                </VStack>
            ),
        },
        {
            key: "customers",
            header: "Customers",
            align: "right",
            render: (product: ProductWithStats) => (
                <Text fontSize="sm" fontWeight="medium">
                    {product.totalCustomers}
                </Text>
            ),
        },
        {
            key: "revenue",
            header: "Revenue",
            align: "right",
            render: (product: ProductWithStats) => {
                // Get primary currency from first price or default
                const primaryCurrency = product.prices[0]?.currency || "USD";
                return (
                    <Text fontSize="sm" fontWeight="medium" color="green.600">
                        {formatCurrency({ amount: product.totalRevenue, currency: primaryCurrency })}
                    </Text>
                );
            },
        },
        {
            key: "created",
            header: "Created",
            align: "right",
            render: (product: ProductWithStats) => (
                <Text fontSize="sm" color="gray.600">
                    {formatDateByTimeAgo(new Date(product.createdAt).getTime())}
                </Text>
            ),
        },
    ], []);

    // Search filter
    const searchFilter = (product: ProductWithStats, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            (product.name?.toLowerCase().includes(q) ?? false) ||
            (product.description?.toLowerCase().includes(q) ?? false) ||
            (product.entity?.name?.toLowerCase().includes(q) ?? false) ||
            (product.totalCustomers?.toString().toLowerCase().includes(q) ?? false) ||
            (product.totalRevenue?.toString().toLowerCase().includes(q) ?? false) ||
            (new Date(product.createdAt).toDateString().toLowerCase().includes(q) ?? false) ||
            product.id.toLowerCase().includes(q)
        );
    };

    return (
        <DataTable
            data={sortedProducts}
            columns={columns}
            getRowKey={(product: ProductWithStats) => product.id}
            searchPlaceholder="Search by product name or description..."
            searchFilter={searchFilter}
            summaryCards={summaryCards}
            onRefresh={onRefresh}
            loading={loading}
            emptyMessage="No products found"
        />
    );
};
