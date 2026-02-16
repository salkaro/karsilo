"use client";

import { useState, useMemo, useEffect } from "react";
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
import { IConnection, IEntity, IOrganisation } from "@repo/models";
import { historyLimit } from "@repo/constants";

type ReportCategory = "stripe" | "consolidated";

interface Props {
    open: boolean;
    onClose: () => void;
    organisation: IOrganisation | null;
    connections: IConnection[];
    entities: IEntity[] | null;
    createReport: (params: {
        connectionId: string;
        reportType: ReportType;
        intervalStart: number;
        intervalEnd: number;
    }) => Promise<{ success: boolean; error?: string }>;
    createConsolidatedReport: (params: {
        intervalStart: number;
        intervalEnd: number;
    }) => Promise<{ success: boolean; error?: string }>;
}

const REPORT_CATEGORY_OPTIONS: { value: ReportCategory; label: string }[] = [
    { value: "stripe", label: "Stripe Report (Single Account)" },
    { value: "consolidated", label: "Consolidated Report (All Accounts)" },
];

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

type SubscriptionTier = keyof typeof historyLimit;

function getEarliestAllowedDate(subscription: SubscriptionTier): Date | null {
    const limit = historyLimit[subscription];
    if (limit === null) return null; // pro: unlimited

    const now = new Date();
    switch (limit) {
        case "month":
            return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()));
        case "year":
            return new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()));
        case "3year":
            return new Date(Date.UTC(now.getUTCFullYear() - 3, now.getUTCMonth(), now.getUTCDate()));
        default:
            return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()));
    }
}

function formatDateForInput(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

const CreateReportDialog: React.FC<Props> = ({
    open,
    onClose,
    organisation,
    connections,
    entities,
    createReport,
    createConsolidatedReport,
}) => {
    const [reportCategory, setReportCategory] = useState<ReportCategory>("stripe");
    const [connectionId, setConnectionId] = useState("");
    const [reportType, setReportType] = useState<ReportType>("balance_change_from_activity.summary.1");
    const [period, setPeriod] = useState("last_month");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isConsolidated = reportCategory === "consolidated";

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

    // Determine the earliest allowed date based on subscription and connection data
    const selectedConnection = useMemo(() => {
        return stripeConnections.find((c) => c.id === connectionId);
    }, [stripeConnections, connectionId]);

    const earliestAllowedDate = useMemo(() => {
        const subscription = (organisation?.subscription as SubscriptionTier) ?? "free";
        const subscriptionEarliest = getEarliestAllowedDate(subscription);

        // For consolidated reports, don't factor in connection date
        if (isConsolidated) return subscriptionEarliest;

        const connectedAt = selectedConnection?.connectedAt
            ? new Date(selectedConnection.connectedAt * 1000)
            : null;

        if (!subscriptionEarliest && !connectedAt) return null;
        if (!subscriptionEarliest) return connectedAt;
        if (!connectedAt) return subscriptionEarliest;

        // Use whichever is more recent (more restrictive)
        return subscriptionEarliest > connectedAt ? subscriptionEarliest : connectedAt;
    }, [organisation?.subscription, selectedConnection?.connectedAt, isConsolidated]);

    // Determine which period options are available
    const periodOptions = useMemo(() => {
        if (!earliestAllowedDate) return PERIOD_OPTIONS;

        const earliestTimestamp = Math.floor(earliestAllowedDate.getTime() / 1000);

        return PERIOD_OPTIONS.map((opt) => {
            if (opt.value === "custom") return { ...opt, disabled: false };

            const range = getDateRange(opt.value);
            const disabled = range.start < earliestTimestamp;
            return { ...opt, disabled };
        });
    }, [earliestAllowedDate]);

    // Min date string for custom date inputs
    const minDateStr = useMemo(() => {
        if (!earliestAllowedDate) return undefined;
        return formatDateForInput(earliestAllowedDate);
    }, [earliestAllowedDate]);

    // Reset period if the selected one becomes disabled
    useEffect(() => {
        const current = periodOptions.find((o) => o.value === period);
        if (current && "disabled" in current && current.disabled) {
            const firstAvailable = periodOptions.find((o) => !("disabled" in o) || !o.disabled);
            if (firstAvailable) setPeriod(firstAvailable.value);
        }
    }, [periodOptions, period]);

    async function handleSubmit() {
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

            if (earliestAllowedDate) {
                const earliestTimestamp = Math.floor(earliestAllowedDate.getTime() / 1000);
                if (intervalStart < earliestTimestamp) {
                    toast.error("Start date is outside your available range", {
                        description: `Your plan allows data from ${formatDateForInput(earliestAllowedDate)} onwards.`,
                    });
                    return;
                }
            }
        } else {
            const range = getDateRange(period);
            intervalStart = range.start;
            intervalEnd = range.end;
        }

        if (isConsolidated) {
            try {
                setIsSubmitting(true);
                const { success, error } = await createConsolidatedReport({
                    intervalStart,
                    intervalEnd,
                });

                if (!success) {
                    toast.error("Failed to create consolidated report", { description: error });
                    return;
                }

                toast.success("Consolidated report created", {
                    description: "Your consolidated report has been generated successfully.",
                });
                handleClose();
            } catch {
                toast.error("Failed to create consolidated report", {
                    description: "An unexpected error occurred. Please try again.",
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            if (!connectionId) {
                toast.error("Please select an account");
                return;
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
    }

    function handleClose() {
        setReportCategory("stripe");
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
            description={isConsolidated
                ? "Generate a consolidated report across all Stripe accounts"
                : "Generate a new financial report from Stripe"
            }
            confirmText={isConsolidated ? "Generate Report" : "Create Report"}
            onConfirm={handleSubmit}
            isLoading={isSubmitting}
            loadingText={isConsolidated ? "Generating..." : "Creating..."}
        >
            <VStack gap={4} align="stretch" py={4}>
                {/* Report Category */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Report Category
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={reportCategory}
                            onChange={(e) => setReportCategory(e.target.value as ReportCategory)}
                        >
                            {REPORT_CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Grid>

                {/* Account Selection - only for Stripe reports */}
                {!isConsolidated && (
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
                )}

                {/* Report Type - only for Stripe reports */}
                {!isConsolidated && (
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
                )}

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
                            {periodOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={"disabled" in opt && !!opt.disabled}>
                                    {opt.label}{"disabled" in opt && opt.disabled ? " (unavailable)" : ""}
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
                                min={minDateStr}
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
                                min={minDateStr}
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
