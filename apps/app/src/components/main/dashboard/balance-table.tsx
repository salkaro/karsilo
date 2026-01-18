"use client";

import { useMemo } from "react";
import { Box, HStack, Text, Badge, Avatar, Skeleton, VStack } from "@repo/ui";
import { DataTable, Column, SummaryCard } from "@/components/ui/table";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";
import { Wallet, TrendingUp, Clock, ArrowUpRight, ReceiptText } from "lucide-react";
import { useBalanceTransactions, IBalanceTransaction } from "@/hooks/useBalanceTransactions";
import { useConnections } from "@/hooks/useConnections";
import { useEntities } from "@/hooks/useEntities";

interface BalanceTableProps {
    organisationId: string | null;
    currency?: string;
}

const BalanceSkeleton = () => (
    <VStack gap={4} align="stretch">
        <Skeleton height="60px" width="100%" borderRadius="lg" />
        <Skeleton height="300px" width="100%" borderRadius="lg" />
    </VStack>
);

export const BalanceTable = ({ organisationId, currency = "GBP" }: BalanceTableProps) => {
    const { transactionsByConnection, balanceByConnection, loading, refetch } =
        useBalanceTransactions(organisationId);
    const { connections } = useConnections(organisationId);
    const { entities } = useEntities(organisationId);

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

    const allTransactions = useMemo(() => {
        if (!transactionsByConnection) return [];

        const txns: (IBalanceTransaction & { connectionId: string })[] = [];
        Object.entries(transactionsByConnection).forEach(([connectionId, transactions]) => {
            transactions.forEach((txn) => {
                txns.push({ ...txn, connectionId });
            });
        });

        return txns;
    }, [transactionsByConnection]);

    const sortedTransactions = useMemo(() => {
        return [...allTransactions].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [allTransactions]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "green";
            case "pending":
                return "yellow";
            default:
                return "gray";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "charge":
                return "green";
            case "payment":
                return "blue";
            case "refund":
                return "red";
            case "payout":
                return "purple";
            case "transfer":
                return "cyan";
            case "adjustment":
                return "orange";
            default:
                return "gray";
        }
    };

    const totalFees = useMemo(() => {
        return allTransactions.reduce((sum, txn) => sum + txn.fee, 0);
    }, [allTransactions]);

    const summaryCards: SummaryCard[] = useMemo(() => {
        if (!balanceByConnection) return [];

        let totalAvailable = 0;
        let totalPending = 0;

        Object.values(balanceByConnection).forEach((balance) => {
            const avail = balance.available.find((b) => b.currency === currency)?.amount || 0;
            const pend = balance.pending.find((b) => b.currency === currency)?.amount || 0;
            totalAvailable += avail;
            totalPending += pend;
        });

        return [
            {
                icon: <Wallet size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "Total Balance",
                value: formatCurrency({ amount: totalAvailable + totalPending, currency }),
            },
            {
                icon: <ArrowUpRight size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Available",
                value: formatCurrency({ amount: totalAvailable, currency }),
            },
            {
                icon: <Clock size={20} />,
                iconColor: "yellow.500",
                iconBg: "yellow.500/10",
                label: "Pending",
                value: formatCurrency({ amount: totalPending, currency }),
            },
            {
                icon: <ReceiptText size={20} />,
                iconColor: "red.500",
                iconBg: "red.500/10",
                label: "Total Fees",
                value: formatCurrency({ amount: totalFees, currency }),
            },
            {
                icon: <TrendingUp size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Transactions",
                value: allTransactions.length,
            },
        ];
    }, [balanceByConnection, allTransactions.length, currency, totalFees]);

    const columns: Column<IBalanceTransaction & { connectionId: string }>[] = useMemo(
        () => [
            {
                key: "entity",
                header: "Entity",
                render: (txn: IBalanceTransaction & { connectionId: string }) => {
                    const entityId = txn.connectionId ? connectionEntityMap[txn.connectionId] : null;
                    const entity = entityId ? entities?.find((e) => e.id === entityId) : null;
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
                key: "type",
                header: "Type",
                render: (txn: IBalanceTransaction) => (
                    <Badge size="sm" colorPalette={getTypeColor(txn.type)} variant="subtle">
                        {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </Badge>
                ),
            },
            {
                key: "description",
                header: "Description",
                render: (txn: IBalanceTransaction) => (
                    <Text fontSize="sm" color="gray.600" maxW="200px" truncate>
                        {txn.description || "-"}
                    </Text>
                ),
            },
            {
                key: "date",
                header: "Date",
                render: (txn: IBalanceTransaction) => (
                    <Text fontSize="sm" color="gray.600">
                        {formatDateByTimeAgo(new Date(txn.createdAt).getTime())}
                    </Text>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (txn: IBalanceTransaction) => (
                    <Badge size="sm" colorPalette={getStatusColor(txn.status)} variant="subtle">
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </Badge>
                ),
            },
            {
                key: "fee",
                header: "Fee",
                align: "right",
                render: (txn: IBalanceTransaction) => (
                    <Text fontSize="sm" color="gray.500">
                        {txn.fee > 0 ? formatCurrency({ amount: txn.fee, currency: txn.currency }) : "-"}
                    </Text>
                ),
            },
            {
                key: "net",
                header: "Net",
                align: "right",
                render: (txn: IBalanceTransaction) => (
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={txn.net >= 0 ? "green.600" : "red.600"}
                    >
                        {txn.net >= 0 ? "+" : ""}
                        {formatCurrency({ amount: txn.net, currency: txn.currency })}
                    </Text>
                ),
            },
        ],
        [entities, connectionEntityMap]
    );

    const searchFilter = (txn: IBalanceTransaction & { connectionId: string }, query: string) => {
        const entityId = txn.connectionId ? connectionEntityMap[txn.connectionId] : null;
        const entity = entityId ? entities?.find((e) => e.id === entityId) : null;
        const entityName = entity?.name?.toLowerCase() || "";
        const q = query.toLowerCase();
        return (
            entityName.includes(q) ||
            txn.type.toLowerCase().includes(q) ||
            txn.description?.toLowerCase().includes(q) ||
            txn.amount.toString().includes(q)
        );
    };

    if (loading) {
        return <BalanceSkeleton />;
    }

    if (!transactionsByConnection || Object.keys(transactionsByConnection).length === 0) {
        return (
            <Box
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                p={8}
                textAlign="center"
            >
                <Text color="gray.500">No balance data available</Text>
            </Box>
        );
    }

    return (
        <DataTable
            data={sortedTransactions}
            columns={columns}
            getRowKey={(txn: IBalanceTransaction) => txn.id}
            searchPlaceholder="Search by entity, type, or description..."
            searchFilter={searchFilter}
            summaryCards={summaryCards}
            onRefresh={refetch}
            loading={loading}
            emptyMessage="No balance transactions found"
        />
    );
};

export default BalanceTable;
