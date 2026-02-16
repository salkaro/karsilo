"use client";

import { useMemo } from "react";
import { HStack, Text, Badge, Avatar } from "@repo/ui";
import { IEntity } from "@repo/models";
import { DataTable, Column, SummaryCard, SummaryCardDropdownItem } from "@/components/ui/table";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";
import { RotateCcw, CheckCircle, Clock, XCircle, Ban } from "lucide-react";
import { IRefund } from "@/hooks/useRefunds";

interface RefundsTableProps {
    refunds: (IRefund & { connectionId: string })[];
    entities: IEntity[] | null;
    connectionEntityMap: Record<string, string>;
    currency?: string;
    onRefresh?: () => void;
    loading?: boolean;
}

const REFUND_REASON_LABELS: Record<string, string> = {
    duplicate: "Duplicate",
    fraudulent: "Fraudulent",
    requested_by_customer: "Customer Request",
    expired_uncaptured_charge: "Expired Charge",
};

export const RefundsTable = ({
    refunds,
    entities,
    connectionEntityMap,
    currency = "GBP",
    onRefresh,
    loading,
}: RefundsTableProps) => {
    const sortedRefunds = useMemo(() => {
        return [...refunds].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [refunds]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "succeeded":
                return "green";
            case "pending":
                return "yellow";
            case "failed":
                return "red";
            case "canceled":
                return "gray";
            default:
                return "gray";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "succeeded":
                return CheckCircle;
            case "pending":
                return Clock;
            case "failed":
                return XCircle;
            case "canceled":
                return Ban;
            default:
                return Clock;
        }
    };

    const summaryCards: SummaryCard[] = useMemo(() => {
        const succeeded = refunds.filter((r) => r.status === "succeeded");
        const pending = refunds.filter((r) => r.status === "pending");
        const normalizedCurrency = currency.toUpperCase();

        // Group refunded amount by currency (only succeeded refunds)
        const refundedByCurrency: Record<string, number> = {};
        succeeded.forEach((r) => {
            const curr = r.currency?.toUpperCase() || normalizedCurrency;
            refundedByCurrency[curr] = (refundedByCurrency[curr] || 0) + r.amount;
        });

        // Group total refunds count by currency
        const refundsByCurrency: Record<string, number> = {};
        refunds.forEach((r) => {
            const curr = r.currency?.toUpperCase() || normalizedCurrency;
            refundsByCurrency[curr] = (refundsByCurrency[curr] || 0) + 1;
        });

        const refundedCurrencies = Object.keys(refundedByCurrency);
        const refundCountCurrencies = Object.keys(refundsByCurrency);

        // Default displayed value uses the passed-in currency, fallback to first available
        const displayedRefundedAmount = refundedByCurrency[normalizedCurrency] ?? refundedByCurrency[refundedCurrencies[0]] ?? 0;
        const displayedRefundedCurrency = refundedByCurrency[normalizedCurrency] !== undefined
            ? normalizedCurrency
            : refundedCurrencies[0] || normalizedCurrency;

        // Build dropdown items for multiple currencies (refunded amount)
        const refundedDropdownItems: SummaryCardDropdownItem[] = refundedCurrencies.length > 1
            ? refundedCurrencies.map((curr) => ({
                label: curr,
                value: formatCurrency({ amount: refundedByCurrency[curr], currency: curr }),
            }))
            : [];

        // Build dropdown items for multiple currencies (refund count)
        const refundCountDropdownItems: SummaryCardDropdownItem[] = refundCountCurrencies.length > 1
            ? refundCountCurrencies.map((curr) => ({
                label: curr,
                value: refundsByCurrency[curr],
            }))
            : [];

        return [
            {
                icon: <RotateCcw size={20} />,
                iconColor: "orange.500",
                iconBg: "orange.500/10",
                label: "Total Refunded",
                value: formatCurrency({ amount: displayedRefundedAmount, currency: displayedRefundedCurrency }),
                dropdownItems: refundedDropdownItems,
            },
            {
                icon: <CheckCircle size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Succeeded",
                value: succeeded.length,
            },
            {
                icon: <Clock size={20} />,
                iconColor: "yellow.500",
                iconBg: "yellow.500/10",
                label: "Pending",
                value: pending.length,
            },
            {
                icon: <RotateCcw size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Total Refunds",
                value: refunds.length,
                dropdownItems: refundCountDropdownItems,
            },
        ];
    }, [refunds, currency]);

    const columns: Column<IRefund & { connectionId: string }>[] = useMemo(
        () => [
            {
                key: "entity",
                header: "Entity",
                render: (refund: IRefund & { connectionId: string }) => {
                    const entityId = refund.connectionId
                        ? connectionEntityMap[refund.connectionId]
                        : null;
                    const entity = entityId
                        ? entities?.find((e) => e.id === entityId)
                        : null;
                    return (
                        <HStack gap={2}>
                            <Avatar.Root size="sm">
                                <Avatar.Image
                                    src={
                                        entity?.images?.logo?.primary ||
                                        entity?.images?.profile?.square
                                    }
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
                key: "reason",
                header: "Reason",
                render: (refund: IRefund) => (
                    <Text fontSize="sm" color="gray.700">
                        {refund.reason
                            ? REFUND_REASON_LABELS[refund.reason] || refund.reason
                            : "-"}
                    </Text>
                ),
            },
            {
                key: "date",
                header: "Date",
                render: (refund: IRefund) => (
                    <Text fontSize="sm" color="gray.600">
                        {formatDateByTimeAgo(new Date(refund.createdAt).getTime())}
                    </Text>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (refund: IRefund) => {
                    const StatusIcon = getStatusIcon(refund.status);
                    return (
                        <HStack gap={1.5}>
                            <StatusIcon size={14} />
                            <Badge
                                size="sm"
                                colorPalette={getStatusColor(refund.status)}
                                variant="subtle"
                            >
                                {refund.status.charAt(0).toUpperCase() +
                                    refund.status.slice(1)}
                            </Badge>
                        </HStack>
                    );
                },
            },
            {
                key: "amount",
                header: "Amount",
                align: "right",
                render: (refund: IRefund) => (
                    <Text fontSize="sm" fontWeight="medium" color="orange.600">
                        -{formatCurrency({ amount: refund.amount, currency: refund.currency })}
                    </Text>
                ),
            },
        ],
        [entities, connectionEntityMap]
    );

    const searchFilter = (
        refund: IRefund & { connectionId: string },
        query: string
    ) => {
        const entityId = refund.connectionId
            ? connectionEntityMap[refund.connectionId]
            : null;
        const entity = entityId
            ? entities?.find((e) => e.id === entityId)
            : null;
        const entityName = entity?.name?.toLowerCase() || "";
        const q = query.toLowerCase();
        const reasonLabel = refund.reason
            ? REFUND_REASON_LABELS[refund.reason]?.toLowerCase() || refund.reason.toLowerCase()
            : "";

        return (
            entityName.includes(q) ||
            reasonLabel.includes(q) ||
            refund.status.includes(q) ||
            refund.amount.toString().includes(q)
        );
    };

    return (
        <DataTable
            data={sortedRefunds}
            columns={columns}
            getRowKey={(refund: IRefund) => refund.id}
            searchPlaceholder="Search by entity, reason, or amount..."
            searchFilter={searchFilter}
            summaryCards={summaryCards}
            onRefresh={onRefresh}
            loading={loading}
            emptyMessage="No refunds found"
        />
    );
};
