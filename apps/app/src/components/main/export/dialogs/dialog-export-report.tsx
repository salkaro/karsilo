"use client";

import { useMemo, useState } from "react";
import {
    Text,
    VStack,
    HStack,
    Badge,
    Separator,
    Tabs,
    Button,
} from "@repo/ui";
import CustomDialog from "@/components/ui/dialog";
import { IConsolidateReport } from "@repo/models";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";
import { ExportOptions } from "@/types/export";
import {
    generateCSV,
    generateQuickBooksIIF,
    downloadFile,
    formatReportFilename,
} from "@/utils/export-helpers";
import ExportPreview from "../export-preview";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    report: IConsolidateReport | null;
}

const ExportReportDialog: React.FC<Props> = ({ open, onClose, report }) => {
    const [format, setFormat] = useState<'csv' | 'iif'>('csv');

    const options: ExportOptions = useMemo(() => ({
        format,
        csv: {
            includeHeaders: true,
            delimiter: ',' as const,
        },
        iif: {
            includeRecurring: true,
            includeOneTime: true,
        },
    }), [format]);

    const summary = useMemo(() => {
        if (!report) return null;
        const recurringTotal = report.paymentsBreakdown.recurring.reduce((sum, r) => sum + r.amount, 0);
        const oneTimeTotal = report.paymentsBreakdown.oneTime.reduce((sum, r) => sum + r.amount, 0);
        const customerTotal = report.customerBreakdown.total.reduce((sum, r) => sum + r.count, 0);
        const refundAmount = report.refundsBreakdown.gained.reduce((sum, r) => sum + r.amount, 0);
        return {
            totalRevenue: recurringTotal + oneTimeTotal,
            customerTotal,
            refundAmount,
        };
    }, [report]);

    const dateRange = useMemo(() => {
        if (!report) return "";
        return `${formatDateByTimeAgo(report.from)} - ${formatDateByTimeAgo(report.to)}`;
    }, [report]);

    const handleExport = () => {
        if (!report) return;

        try {
            let content: string;
            let mimeType: string;
            let ext: string;

            if (format === 'csv') {
                content = generateCSV(report, options.csv);
                mimeType = 'text/csv;charset=utf-8;';
                ext = 'csv';
            } else {
                content = generateQuickBooksIIF(report, options.iif);
                mimeType = 'application/x-iif;charset=utf-8;';
                ext = 'iif';
            }

            const filename = formatReportFilename(report, ext);
            downloadFile(content, filename, mimeType);
            toast.success(`Report exported as ${ext.toUpperCase()}`);
        } catch {
            toast.error("Failed to export report. Please try again.");
        }
    };

    if (!report) return null;

    return (
        <CustomDialog
            open={open}
            onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
            title="Export Report"
            description={`Period: ${dateRange}`}
            hideFooter
            maxW="2xl"
        >
            <VStack gap={4} align="stretch" py={2}>
                {/* Summary */}
                <HStack gap={3} flexWrap="wrap">
                    <Badge colorPalette="blue" variant="subtle" size="lg" px={3} py={1}>
                        Revenue: {formatCurrency({ amount: summary?.totalRevenue ?? 0, currency: "USD" })}
                    </Badge>
                    <Badge colorPalette="green" variant="subtle" size="lg" px={3} py={1}>
                        Customers: {summary?.customerTotal ?? 0}
                    </Badge>
                    <Badge colorPalette="red" variant="subtle" size="lg" px={3} py={1}>
                        Refunds: {formatCurrency({ amount: summary?.refundAmount ?? 0, currency: "USD" })}
                    </Badge>
                </HStack>

                <Separator />

                {/* Format Selection */}
                <Tabs.Root
                    defaultValue="csv"
                    variant="line"
                    onValueChange={(details) => setFormat(details.value as 'csv' | 'iif')}
                >
                    <Tabs.List>
                        <Tabs.Trigger value="csv">CSV</Tabs.Trigger>
                        <Tabs.Trigger value="iif">QuickBooks IIF</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="csv">
                        <VStack gap={3} align="stretch">
                            <Text fontSize="sm" color="gray.500">
                                Comma-separated values file with all report sections. Compatible with Excel, Google Sheets, and other spreadsheet applications.
                            </Text>
                            <ExportPreview report={report} format="csv" options={options} />
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="iif">
                        <VStack gap={3} align="stretch">
                            <Text fontSize="sm" color="gray.500">
                                Intuit Interchange Format for importing transactions into QuickBooks Desktop. Includes payment transactions with fee breakdowns.
                            </Text>
                            <ExportPreview report={report} format="iif" options={options} />
                        </VStack>
                    </Tabs.Content>
                </Tabs.Root>

                <Separator />

                {/* Export Button */}
                <HStack justify="flex-end" gap={2}>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleExport}>
                        <Download size={16} />
                        Export {format.toUpperCase()}
                    </Button>
                </HStack>
            </VStack>
        </CustomDialog>
    );
};

export default ExportReportDialog;
