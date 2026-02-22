"use client";

import { useMemo, useState } from "react";
import { HStack, Text, Badge, Avatar, Link, Button } from "@repo/ui";
import { IEntity, IConsolidateReport } from "@repo/models";
import { DataTable, Column, SummaryCard } from "@/components/ui/table";
import { formatDateByTimeAgo } from "@/utils/formatters";
import { FileText, CheckCircle, Clock, XCircle, Download, Eye, Layers, Trash2 } from "lucide-react";
import { IReport } from "@/hooks/useReports";
import ConsolidatedReportDetailsDialog from "./dialogs/dialog-consolidated-report-details";
import ExportReportDialog from "../export/dialogs/dialog-export-report";
import CustomDialog from "@/components/ui/dialog";

interface ReportsTableProps {
    reports: (IReport & { connectionId: string })[];
    consolidatedReports: IConsolidateReport[] | null;
    entities: IEntity[] | null;
    connectionEntityMap: Record<string, string>;
    onRefresh?: () => void;
    loading?: boolean;
    onDeleteReport?: (params: {
        reportId: string;
        reportSource: "stripe" | "consolidated";
        connectionId?: string;
    }) => Promise<{ success: boolean; error?: string }>;
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
    "consolidated": "Consolidated Report",
};

export const ReportsTable = ({
    reports,
    consolidatedReports,
    entities,
    connectionEntityMap,
    onRefresh,
    loading,
    onDeleteReport,
}: ReportsTableProps) => {
    const [selectedConsolidatedReport, setSelectedConsolidatedReport] = useState<IConsolidateReport | null>(null);
    const [exportReport, setExportReport] = useState<IConsolidateReport | null>(null);
    const [deletingReport, setDeletingReport] = useState<(IReport & { connectionId: string }) | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deletingReport || !onDeleteReport) return;

        setDeleting(true);
        await onDeleteReport({
            reportId: deletingReport.id,
            reportSource: deletingReport.reportSource as "stripe" | "consolidated",
            connectionId: deletingReport.connectionId || undefined,
        });
        setDeleting(false);
        setDeletingReport(null);
    };

    // Merge stripe reports and consolidated reports into a unified list
    const allReports = useMemo(() => {
        const stripeReports: (IReport & { connectionId: string })[] = reports.map(r => ({
            ...r,
            reportSource: "stripe" as const,
        }));

        const consolidatedAsReports: (IReport & { connectionId: string })[] = (consolidatedReports || []).map(cr => ({
            id: cr.id,
            reportType: "consolidated",
            status: cr.status === "completed" ? "succeeded" as const : "failed" as const,
            createdAt: new Date(cr.createdAt).toISOString(),
            reportSource: "consolidated" as const,
            connectionId: "",
        }));

        return [...stripeReports, ...consolidatedAsReports];
    }, [reports, consolidatedReports]);

    const sortedReports = useMemo(() => {
        return [...allReports].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [allReports]);

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
        const succeeded = allReports.filter((r) => r.status === "succeeded").length;
        const pending = allReports.filter((r) => r.status === "pending").length;
        const failed = allReports.filter((r) => r.status === "failed").length;
        const consolidated = (consolidatedReports || []).length;

        return [
            {
                icon: <FileText size={20} />,
                iconColor: "blue.500",
                iconBg: "blue.500/10",
                label: "Total Reports",
                value: allReports.length,
            },
            {
                icon: <CheckCircle size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "Succeeded",
                value: succeeded,
            },
            {
                icon: <Layers size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "Consolidated",
                value: consolidated,
            },
            {
                icon: <XCircle size={20} />,
                iconColor: "red.500",
                iconBg: "red.500/10",
                label: "Failed",
                value: failed + pending,
            },
        ];
    }, [allReports, consolidatedReports]);

    const columns: Column<IReport & { connectionId: string }>[] = useMemo(
        () => [
            {
                key: "entity",
                header: "Entity",
                render: (report: IReport & { connectionId: string }) => {
                    if (report.reportSource === "consolidated") {
                        return (
                            <HStack gap={2}>
                                <Avatar.Root size="sm">
                                    <Avatar.Fallback>
                                        <Layers size={14} />
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <Text fontSize="sm" fontWeight="medium">
                                    All Entities
                                </Text>
                            </HStack>
                        );
                    }

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
                header: "Actions",
                align: "right",
                render: (report: IReport & { connectionId: string }) => {
                    if (report.reportSource === "consolidated") {
                        const consolidatedReport = consolidatedReports?.find(cr => cr.id === report.id);
                        return (
                            <HStack gap={1} justify="flex-end">
                                {consolidatedReport && (
                                    <>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => setSelectedConsolidatedReport(consolidatedReport)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => setExportReport(consolidatedReport)}
                                        >
                                            <Download size={16} />
                                        </Button>
                                    </>
                                )}
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorPalette="red"
                                    onClick={() => setDeletingReport(report)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </HStack>
                        );
                    }

                    return (
                        <HStack gap={1} justify="flex-end">
                            {report.status === "succeeded" && report.resultUrl && (
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    asChild
                                >
                                    <Link
                                        href={report.resultUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download size={16} />
                                    </Link>
                                </Button>
                            )}
                            <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => setDeletingReport(report)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </HStack>
                    );
                },
            },
        ],
        [entities, connectionEntityMap, consolidatedReports]
    );

    const searchFilter = (
        report: IReport & { connectionId: string },
        query: string
    ) => {
        const q = query.toLowerCase();

        if (report.reportSource === "consolidated") {
            return "consolidated".includes(q) || "all entities".includes(q);
        }

        const entityId = report.connectionId
            ? connectionEntityMap[report.connectionId]
            : null;
        const entity = entityId
            ? entities?.find((e) => e.id === entityId)
            : null;
        const entityName = entity?.name?.toLowerCase() || "";
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
        <>
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
            <ConsolidatedReportDetailsDialog
                open={!!selectedConsolidatedReport}
                onClose={() => setSelectedConsolidatedReport(null)}
                report={selectedConsolidatedReport}
            />
            <ExportReportDialog
                open={!!exportReport}
                onClose={() => setExportReport(null)}
                report={exportReport}
            />
            <CustomDialog
                open={!!deletingReport}
                onOpenChange={(open) => {
                    if (!open) setDeletingReport(null);
                }}
                title="Delete Report"
                confirmText="Delete"
                onConfirm={handleDelete}
                isLoading={deleting}
            >
                <Text>
                    Are you sure you want to delete this report? This action cannot be undone.
                </Text>
            </CustomDialog>
        </>
    );
};
