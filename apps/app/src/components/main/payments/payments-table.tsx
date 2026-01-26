"use client";

import { useMemo } from "react";
import { HStack, Text, Badge, Avatar } from "@repo/ui";
import { ICharge, IEntity } from "@repo/models";
import { DataTable, Column, SummaryCard, SummaryCardDropdownItem } from "@/components/ui/table";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";
import { ReceiptText, TrendingUp } from "lucide-react";

interface PaymentsTableProps {
    charges: ICharge[];
    entities: IEntity[] | null;
    currency: string;
    onRefresh?: () => void;
    loading?: boolean;
}

export const PaymentsTable = ({
    charges,
    entities,
    currency,
    onRefresh,
    loading,
}: PaymentsTableProps) => {
    const sortedCharges = useMemo(() => {
        return [...charges].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [charges]);

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "successful":
                return "green";
            case "pending":
                return "yellow";
            case "failed":
                return "red";
            case "refunded":
                return "gray";
            default:
                return "gray";
        }
    };

    // Get tag badge color
    const getTagColor = (type: string) => {
        switch (type) {
            case "recurring":
                return "blue";
            case "one-time":
                return "purple";
            default:
                return "gray";
        }
    };

    // Calculate totals
    const summaryCards: SummaryCard[] = useMemo(() => {
        const successfulCharges = charges.filter((c) => c.status === "successful");
        const normalizedCurrency = currency.toUpperCase();

        // Group revenue by currency
        const revenueByCurrency: Record<string, number> = {};
        successfulCharges.forEach((c) => {
            const curr = c.currency?.toUpperCase() || normalizedCurrency;
            revenueByCurrency[curr] = (revenueByCurrency[curr] || 0) + c.amount;
        });

        // Group transactions by currency
        const transactionsByCurrency: Record<string, number> = {};
        charges.forEach((c) => {
            const curr = c.currency?.toUpperCase() || normalizedCurrency;
            transactionsByCurrency[curr] = (transactionsByCurrency[curr] || 0) + 1;
        });

        const revenueCurrencies = Object.keys(revenueByCurrency);
        const transactionCurrencies = Object.keys(transactionsByCurrency);

        // Default displayed value uses the passed-in currency, fallback to first available
        const displayedRevenueAmount = revenueByCurrency[normalizedCurrency] ?? revenueByCurrency[revenueCurrencies[0]] ?? 0;
        const displayedRevenueCurrency = revenueByCurrency[normalizedCurrency] !== undefined
            ? normalizedCurrency
            : revenueCurrencies[0] || normalizedCurrency;

        // Build dropdown items for multiple currencies (revenue)
        const revenueDropdownItems: SummaryCardDropdownItem[] = revenueCurrencies.length > 1
            ? revenueCurrencies.map((curr) => ({
                label: curr,
                value: formatCurrency({ amount: revenueByCurrency[curr], currency: curr }),
            }))
            : [];

        // Build dropdown items for multiple currencies (transactions)
        const transactionsDropdownItems: SummaryCardDropdownItem[] = transactionCurrencies.length > 1
            ? transactionCurrencies.map((curr) => ({
                label: curr,
                value: transactionsByCurrency[curr],
            }))
            : [];

        return [
            {
                icon: <TrendingUp size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Revenue",
                value: formatCurrency({ amount: displayedRevenueAmount, currency: displayedRevenueCurrency }),
                dropdownItems: revenueDropdownItems,
            },
            {
                icon: <ReceiptText size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Transactions",
                value: charges.length,
                dropdownItems: transactionsDropdownItems,
            },
        ];
    }, [charges, currency]);

    // Define columns
    const columns: Column<ICharge>[] = useMemo(() => [
        {
            key: "entity",
            header: "Entity",
            render: (charge: ICharge) => {
                const entity = entities?.find((e) => e.id === charge.entityId);
                return (
                    <HStack gap={2}>
                        <Avatar.Root size="sm">
                            <Avatar.Image
                                src={entity?.images?.logo?.primary || entity?.images?.profile?.square}
                            />
                            <Avatar.Fallback>
                                {entity?.name?.charAt(0) || "?"}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <Text fontSize="sm" fontWeight="medium">
                            {entity?.name || "Unknown"}
                        </Text>
                    </HStack>
                );
            },
        },
        {
            key: "tag",
            header: "Tag",
            render: (charge: ICharge) => (
                <Badge
                    size="sm"
                    colorPalette={getTagColor(charge.type)}
                    variant="subtle"
                >
                    {charge.type === "one-time" ? "One-time" : charge.type === "recurring" ? "Recurring" : "Unknown"}
                </Badge>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (charge: ICharge) => (
                <Text fontSize="sm" color="gray.600">
                    {formatDateByTimeAgo(new Date(charge.createdAt).getTime())}
                </Text>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (charge: ICharge) => (
                <Badge
                    size="sm"
                    colorPalette={getStatusColor(charge.status)}
                    variant="subtle"
                >
                    {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                </Badge>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            align: "right",
            render: (charge: ICharge) => (
                <Text fontSize="sm" fontWeight="medium">
                    {formatCurrency({ amount: charge.amount, currency: charge.currency })}
                </Text>
            ),
        },
    ], [entities]);

    // Search filter
    const searchFilter = (charge: ICharge, query: string) => {
        const entity = entities?.find((e) => e.id === charge.entityId);
        const entityName = entity?.name?.toLowerCase() || "";
        const q = query.toLowerCase();
        return (
            entityName.includes(q) ||
            charge.amount.toString().includes(q) ||
            charge.email?.toLowerCase().includes(q) ||
            charge.description?.toLowerCase().includes(q) ||
            charge.type?.toLowerCase().includes(q) ||
            new Date(charge.createdAt).toDateString().toLowerCase().includes(q) ||
            charge.status?.toLowerCase().includes(q)
        );
    };

    return (
        <DataTable
            data={sortedCharges}
            columns={columns}
            getRowKey={(charge: ICharge) => charge.id}
            searchPlaceholder="Search by customer, amount, or description..."
            searchFilter={searchFilter}
            summaryCards={summaryCards}
            onRefresh={onRefresh}
            loading={loading}
            emptyMessage="No transactions found"
        />
    );
};
