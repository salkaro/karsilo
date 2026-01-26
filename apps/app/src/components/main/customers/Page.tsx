"use client";

import { Column, DataTable, SummaryCard } from '@/components/ui/table';
import { useCustomers } from '@/hooks/useCustomers'
import { useOrganisation } from '@/hooks/useOrganisation'
import { ICustomer } from '@repo/models';
import { formatDateByTimeAgo } from '@/utils/formatters';
import { Avatar, Badge, Box, HStack, Text, VStack } from '@repo/ui';
import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { WorldMap, CountryData } from '@/components/ui/world-map';

const Page = () => {
    const { organisation, loading: loadingOrganisation } = useOrganisation();
    const { customers, refetch: refetchCustomers, loading: loadingCustomers } = useCustomers(organisation?.id as string);

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "green";
            case "failed":
                return "red";
            case "refunded":
                return "gray";
            default:
                return "gray";
        }
    };

    // Define columns
    const columns: Column<ICustomer>[] = useMemo(() => [
        {
            key: "customer",
            header: "Customer",
            render: (customer: ICustomer) => {
                return (
                    <HStack gap={2}>
                        <Avatar.Root size="sm">
                            <Avatar.Fallback>
                                {customer?.name?.charAt(0) || customer?.email?.charAt(0)}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <Text fontSize="sm" fontWeight="medium">
                            {customer?.name || "Unknown"}
                        </Text>
                    </HStack>
                );
            },
        },
        {
            key: "tag",
            header: "Tag",
            render: (customer: ICustomer) => (
                <Text fontSize="sm" color="gray.600">
                    {customer.email}
                </Text>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (customer: ICustomer) => (
                <Badge
                    size="sm"
                    colorPalette={getStatusColor(customer.status as string)}
                    variant="subtle"
                >
                    {customer.status && (customer.status.charAt(0).toUpperCase() + customer.status.slice(1))}
                </Badge>
            ),
        },
        {
            key: "country",
            header: "Country",
            render: (customer: ICustomer) => (
                <Text fontSize="sm" color="gray.600">
                    {customer.country ?? "Unknown"}
                </Text>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (customer: ICustomer) => (
                <Text fontSize="sm" color="gray.600">
                    {formatDateByTimeAgo(customer.createdAt)}
                </Text>
            ),
        },
    ], []);

    async function onRefresh() {
        await refetchCustomers();
    }

    // Search filter
    const searchFilter = (customer: ICustomer, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            (customer.name?.toLowerCase().includes(q) ?? false) ||
            (customer.email?.toLowerCase().includes(q) ?? false) ||
            (customer.email?.toLowerCase().includes(q) ?? false) ||
            (customer.currency?.toLowerCase().includes(q) ?? false)
        );
    };

    // Calculate totals
    const summaryCards: SummaryCard[] = useMemo(() => {
        const numCustomers = customers?.length ?? 0;
        return [
            {
                icon: <Users size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "",
                value: numCustomers
            },
        ];
    }, [customers]);

    // Aggregate customers by country for the map
    const countryData: CountryData[] = useMemo(() => {
        if (!customers) return [];
        const countryCount: Record<string, number> = {};
        customers.forEach((customer) => {
            if (customer.country) {
                const code = customer.country.toUpperCase();
                countryCount[code] = (countryCount[code] || 0) + 1;
            }
        });
        return Object.entries(countryCount).map(([countryCode, value]) => ({
            countryCode,
            value,
            label: `${value}`,
        }));
    }, [customers]);



    return (
        <VStack p={{ md: 6 }} gap={8} align="stretch">
            <Box>
                {countryData.length > 0 && (
                    <WorldMap
                        data={countryData}
                        height={350}
                        loading={loadingOrganisation || loadingCustomers}
                        showLegend={false}
                    />
                )}
            </Box>
            <DataTable
                data={customers ?? []}
                columns={columns}
                getRowKey={(customer: ICustomer) => customer.id}
                searchPlaceholder="Search by customer, amount, or description..."
                searchFilter={searchFilter}
                summaryCards={summaryCards}
                onRefresh={onRefresh}
                loading={loadingOrganisation || loadingCustomers}
                emptyMessage="No customers found"
            />
        </VStack>
    )
}

export default Page
