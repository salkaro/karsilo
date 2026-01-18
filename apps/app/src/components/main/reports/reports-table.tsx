"use client";

import { useMemo } from "react";
import { HStack, Text, Badge, Avatar, Link } from "@repo/ui";
import { IEntity } from "@repo/models";
import { DataTable, Column, SummaryCard } from "@/components/ui/table";
import { formatDateByTimeAgo } from "@/utils/formatters";
import { FileText, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { IReport } from "@/hooks/useReports";

interface ReportsTableProps {
    reports: (IReport & { connectionId: string })[];
    entities: IEntity[] | null;
    connectionEntityMap: Record<string, string>;
    onRefresh?: () => void;
    loading?: boolean;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
    "balance_change_from_activity.itemized.1": "Balance Activity (Itemized)",
    "balance_change_from_activity.itemized.2": "Balance Activity (Itemized v2)",
    "balance_change_from_activity.itemized.3": "Balance Activity (Itemized v3)",
    "balance_change_from_activity.summary.1": "Balance Activity (Summary)",
    "balance.summary.1": "Balance Summary",
    "payout_reconciliation.itemized.1": "Payout Reconciliation (Itemized)",
    "payout_reconciliation.itemized.2": "Payout Reconciliation (Itemized v2)",
    "payout_reconciliation.itemized.3": "Payout Reconciliation (Itemized v3)",
    "payout_reconciliation.itemized.4": "Payout Reconciliation (Itemized v4)",
    "payout_reconciliation.itemized.5": "Payout Reconciliation (Itemized v5)",
    "payout_reconciliation.summary.1": "Payout Reconciliation (Summary)",
    "payouts.itemized.1": "Payouts (Itemized)",
    "payouts.itemized.2": "Payouts (Itemized v2)",
    "payouts.itemized.3": "Payouts (Itemized v3)",
    "payouts.summary.1": "Payouts (Summary)",
    "ending_balance_reconciliation.itemized.4": "Ending Balance Reconciliation",
};

export const ReportsTable = ({
    reports,
    entities,
    connectionEntityMap,
    onRefresh,
    loading,
}: ReportsTableProps) => {
    const sortedReports = useMemo(() => {
        return [...reports].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [reports]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "succeeded":
                return "green";
            case "pending":
                return "yellow";
            case "failed":
                return "red";
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
            default:
                return Clock;
        }
    };

    const summaryCards: SummaryCard[] = useMemo(() => {
        const succeeded = reports.filter((r) => r.status === "succeeded").length;
        const pending = reports.filter((r) => r.status === "pending").length;
        const failed = reports.filter((r) => r.status === "failed").length;

        return [
            {
                icon: <FileText size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Total Reports",
                value: reports.length,
            },
            {
                icon: <CheckCircle size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Succeeded",
                value: succeeded,
            },
            {
                icon: <Clock size={20} />,
                iconColor: "yellow.500",
                iconBg: "yellow.500/10",
                label: "Pending",
                value: pending,
            },
            {
                icon: <XCircle size={20} />,
                iconColor: "red.500",
                iconBg: "red.500/10",
                label: "Failed",
                value: failed,
            },
        ];
    }, [reports]);

    const columns: Column<IReport & { connectionId: string }>[] = useMemo(
        () => [
            {
                key: "entity",
                header: "Entity",
                render: (report: IReport & { connectionId: string }) => {
                    const entityId = report.connectionId
                        ? connectionEntityMap[report.connectionId]
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
                key: "reportType",
                header: "Report Type",
                render: (report: IReport) => (
                    <Text fontSize="sm" color="gray.700">
                        {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
                    </Text>
                ),
            },
            {
                key: "date",
                header: "Created",
                render: (report: IReport) => (
                    <Text fontSize="sm" color="gray.600">
                        {formatDateByTimeAgo(new Date(report.createdAt).getTime())}
                    </Text>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (report: IReport) => {
                    const StatusIcon = getStatusIcon(report.status);
                    return (
                        <HStack gap={1.5}>
                            <StatusIcon size={14} />
                            <Badge
                                size="sm"
                                colorPalette={getStatusColor(report.status)}
                                variant="subtle"
                            >
                                {report.status.charAt(0).toUpperCase() +
                                    report.status.slice(1)}
                            </Badge>
                        </HStack>
                    );
                },
            },
            {
                key: "download",
                header: "Download",
                align: "right",
                render: (report: IReport) => {
                    if (report.status !== "succeeded" || !report.resultUrl) {
                        return (
                            <Text fontSize="sm" color="gray.400">
                                -
                            </Text>
                        );
                    }
                    return (
                        <Link
                            href={report.resultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="blue.500"
                            _hover={{ color: "blue.600" }}
                        >
                            <HStack gap={1}>
                                <Download size={14} />
                                <Text fontSize="sm">Download</Text>
                            </HStack>
                        </Link>
                    );
                },
            },
        ],
        [entities, connectionEntityMap]
    );

    const searchFilter = (
        report: IReport & { connectionId: string },
        query: string
    ) => {
        const entityId = report.connectionId
            ? connectionEntityMap[report.connectionId]
            : null;
        const entity = entityId
            ? entities?.find((e) => e.id === entityId)
            : null;
        const entityName = entity?.name?.toLowerCase() || "";
        const q = query.toLowerCase();
        const reportTypeLabel =
            REPORT_TYPE_LABELS[report.reportType]?.toLowerCase() ||
            report.reportType.toLowerCase();

        return (
            entityName.includes(q) ||
            reportTypeLabel.includes(q) ||
            report.status.includes(q)
        );
    };

    return (
        <DataTable
            data={sortedReports}
            columns={columns}
            getRowKey={(report: IReport) => report.id}
            searchPlaceholder="Search by entity, report type, or status..."
            searchFilter={searchFilter}
            summaryCards={summaryCards}
            onRefresh={onRefresh}
            loading={loading}
            emptyMessage="No reports found"
        />
    );
};
