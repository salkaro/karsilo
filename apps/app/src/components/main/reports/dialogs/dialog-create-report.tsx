"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
    Grid,
    Input,
    NativeSelect,
    Text,
    VStack,
} from "@repo/ui";
import CustomDialog from "@/components/ui/dialog";
import { ReportType } from "@/services/stripe/create";
import { IConnection, IEntity } from "@repo/models";

interface Props {
    open: boolean;
    onClose: () => void;
    connections: IConnection[];
    entities: IEntity[] | null;
    createReport: (params: {
        connectionId: string;
        reportType: ReportType;
        intervalStart: number;
        intervalEnd: number;
    }) => Promise<{ success: boolean; error?: string }>;
}

const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
    { value: "balance_change_from_activity.summary.1", label: "Balance Activity (Summary)" },
    { value: "balance_change_from_activity.itemized.3", label: "Balance Activity (Itemized)" },
    { value: "balance.summary.1", label: "Balance Summary" },
    { value: "payout_reconciliation.summary.1", label: "Payout Reconciliation (Summary)" },
    { value: "payout_reconciliation.itemized.5", label: "Payout Reconciliation (Itemized)" },
    { value: "payouts.summary.1", label: "Payouts (Summary)" },
    { value: "payouts.itemized.3", label: "Payouts (Itemized)" },
    { value: "ending_balance_reconciliation.itemized.4", label: "Ending Balance Reconciliation" },
];

const PERIOD_OPTIONS = [
    { value: "last_week", label: "Last Week" },
    { value: "last_month", label: "Last Month" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "last_year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
];

function getDateRange(period: string): { start: number; end: number } {
    const now = new Date();
    const utcNow = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23, 59, 59, 999
    ));

    switch (period) {
        case "last_week": {
            const dayOfWeek = utcNow.getUTCDay();
            const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const lastMonday = new Date(utcNow);
            lastMonday.setUTCDate(utcNow.getUTCDate() - daysToLastMonday - 7);
            lastMonday.setUTCHours(0, 0, 0, 0);
            const lastSunday = new Date(lastMonday);
            lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
            lastSunday.setUTCHours(23, 59, 59, 999);
            return {
                start: Math.floor(lastMonday.getTime() / 1000),
                end: Math.floor(lastSunday.getTime() / 1000),
            };
        }
        case "last_month": {
            const year = utcNow.getUTCFullYear();
            const month = utcNow.getUTCMonth();
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const start = new Date(Date.UTC(prevYear, prevMonth, 1, 0, 0, 0, 0));
            const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
            return {
                start: Math.floor(start.getTime() / 1000),
                end: Math.floor(end.getTime() / 1000),
            };
        }
        case "last_quarter": {
            const year = utcNow.getUTCFullYear();
            const month = utcNow.getUTCMonth();
            const currentQuarter = Math.floor(month / 3);
            const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
            const prevYear = currentQuarter === 0 ? year - 1 : year;
            const quarterStartMonth = prevQuarter * 3;
            const quarterEndMonth = quarterStartMonth + 2;
            const start = new Date(Date.UTC(prevYear, quarterStartMonth, 1, 0, 0, 0, 0));
            const end = new Date(Date.UTC(prevYear, quarterEndMonth + 1, 0, 23, 59, 59, 999));
            return {
                start: Math.floor(start.getTime() / 1000),
                end: Math.floor(end.getTime() / 1000),
            };
        }
        case "last_year": {
            const prevYear = utcNow.getUTCFullYear() - 1;
            const start = new Date(Date.UTC(prevYear, 0, 1, 0, 0, 0, 0));
            const end = new Date(Date.UTC(prevYear, 11, 31, 23, 59, 59, 999));
            return {
                start: Math.floor(start.getTime() / 1000),
                end: Math.floor(end.getTime() / 1000),
            };
        }
        default:
            return { start: 0, end: 0 };
    }
}

function parseInputDate(dateString: string, isEnd = false): number {
    const date = new Date(dateString + "T00:00:00Z");
    if (isEnd) {
        date.setUTCHours(23, 59, 59, 999);
    }
    return Math.floor(date.getTime() / 1000);
}

const CreateReportDialog: React.FC<Props> = ({
    open,
    onClose,
    connections,
    entities,
    createReport,
}) => {
    const [connectionId, setConnectionId] = useState("");
    const [reportType, setReportType] = useState<ReportType>("balance_change_from_activity.summary.1");
    const [period, setPeriod] = useState("last_month");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stripeConnections = useMemo(() => {
        return connections.filter(
            (c) => c.type === "stripe" && c.status === "connected"
        );
    }, [connections]);

    const connectionOptions = useMemo(() => {
        return stripeConnections.map((conn) => {
            const entity = entities?.find((e) => e.id === conn.entityId);
            return {
                id: conn.id,
                label: entity?.name || conn.stripeAccountId || conn.id,
            };
        });
    }, [stripeConnections, entities]);

    async function handleSubmit() {
        if (!connectionId) {
            toast.error("Please select an account");
            return;
        }

        let intervalStart: number;
        let intervalEnd: number;

        if (period === "custom") {
            if (!customStart || !customEnd) {
                toast.error("Please select both start and end dates");
                return;
            }
            intervalStart = parseInputDate(customStart);
            intervalEnd = parseInputDate(customEnd, true);

            if (intervalStart >= intervalEnd) {
                toast.error("Start date must be before end date");
                return;
            }
        } else {
            const range = getDateRange(period);
            intervalStart = range.start;
            intervalEnd = range.end;
        }

        try {
            setIsSubmitting(true);
            const { success, error } = await createReport({
                connectionId,
                reportType,
                intervalStart,
                intervalEnd,
            });

            if (!success) {
                toast.error("Failed to create report", { description: error });
                return;
            }

            toast.success("Report created", {
                description: "Your report is being generated. This may take a few minutes.",
            });
            handleClose();
        } catch {
            toast.error("Failed to create report", {
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleClose() {
        setConnectionId("");
        setReportType("balance_change_from_activity.summary.1");
        setPeriod("last_month");
        setCustomStart("");
        setCustomEnd("");
        onClose();
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            handleClose();
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Create Report"
            description="Generate a new financial report from Stripe"
            confirmText="Create Report"
            onConfirm={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
        >
            <VStack gap={4} align="stretch" py={4}>
                {/* Account Selection */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Account
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={connectionId}
                            onChange={(e) => setConnectionId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {connectionOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Grid>

                {/* Report Type */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Report Type
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                        >
                            {REPORT_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Grid>

                {/* Period */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Period
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            {PERIOD_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Grid>

                {/* Custom Date Range */}
                {period === "custom" && (
                    <>
                        <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                            <Text fontSize="sm" textAlign="right">
                                Start Date
                            </Text>
                            <Input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                            />
                        </Grid>
                        <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                            <Text fontSize="sm" textAlign="right">
                                End Date
                            </Text>
                            <Input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                            />
                        </Grid>
                    </>
                )}
            </VStack>
        </CustomDialog>
    );
};

export default CreateReportDialog;
