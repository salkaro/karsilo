"use client";

import { useMemo, useState } from "react";
import {
    Text,
    VStack,
    HStack,
    Badge,
    Box,
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

function CurrencyBadge({ label, colorPalette, byCurrency }: { label: string; colorPalette: string; byCurrency: Record<string, number> }) {
    const entries = Object.entries(byCurrency);
    const [firstCurrency, firstAmount] = entries[0] ?? ["USD", 0];
    const hasMultiple = entries.length > 1;

    return (
        <Box position="relative" className="group">
            <Badge
                colorPalette={colorPalette}
                variant="subtle"
                size="lg"
                px={3}
                py={1}
                cursor={hasMultiple ? "pointer" : "default"}
            >
                {label}: {formatCurrency({ amount: firstAmount, currency: firstCurrency })}
            </Badge>
            {hasMultiple && (
                <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    mt={1}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="md"
                    zIndex={10}
                    minW="150px"
                    opacity={0}
                    visibility="hidden"
                    transition="opacity 0.2s, visibility 0.2s"
                    _groupHover={{ opacity: 1, visibility: "visible" }}
                >
                    <VStack gap={0} align="stretch" py={1}>
                        {entries.map(([currency, amount]) => (
                            <HStack key={currency} px={3} py={2} justify="space-between" _hover={{ bg: "gray.50" }}>
                                <Text fontSize="sm" color="gray.600">{currency}</Text>
                                <Text fontSize="sm" fontWeight="medium">{formatCurrency({ amount, currency })}</Text>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

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
        const revenueByCurrency: Record<string, number> = {};
        for (const r of [...report.paymentsBreakdown.recurring, ...report.paymentsBreakdown.oneTime]) {
            const currency = r.currency || "USD";
            revenueByCurrency[currency] = (revenueByCurrency[currency] || 0) + r.amount;
        }
        const refundsByCurrency: Record<string, number> = {};
        for (const r of report.refundsBreakdown.gained) {
            const currency = r.currency || "USD";
            refundsByCurrency[currency] = (refundsByCurrency[currency] || 0) + r.amount;
        }
        const customerTotal = report.customerBreakdown.total.reduce((sum, r) => sum + r.count, 0);
        return {
            revenueByCurrency,
            refundsByCurrency,
            customerTotal,
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
                    <CurrencyBadge
                        label="Revenue"
                        colorPalette="blue"
                        byCurrency={summary?.revenueByCurrency ?? {}}
                    />
                    <Badge colorPalette="green" variant="subtle" size="lg" px={3} py={1}>
                        Customers: {summary?.customerTotal ?? 0}
                    </Badge>
                    <CurrencyBadge
                        label="Refunds"
                        colorPalette="red"
                        byCurrency={summary?.refundsByCurrency ?? {}}
                    />
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
