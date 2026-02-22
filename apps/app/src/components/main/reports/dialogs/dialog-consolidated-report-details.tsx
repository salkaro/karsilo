"use client";

import { useMemo } from "react";
import {
    Text,
    VStack,
    HStack,
    Badge,
    Box,
    Separator,
    Table,
    Tabs,
} from "@repo/ui";
import CustomDialog from "@/components/ui/dialog";
import { IConsolidateReport } from "@repo/models";
import { formatCurrency, formatDateByTimeAgo } from "@/utils/formatters";

interface Props {
    open: boolean;
    onClose: () => void;
    report: IConsolidateReport | null;
}

function sumByCurrency(items: { currency?: string; amount: number }[]): Record<string, number> {
    const result: Record<string, number> = {};
    for (const item of items) {
        const currency = item.currency || "USD";
        result[currency] = (result[currency] || 0) + item.amount;
    }
    return result;
}

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

const ConsolidatedReportDetailsDialog: React.FC<Props> = ({
    open,
    onClose,
    report,
}) => {
    const dateRange = useMemo(() => {
        if (!report) return "";
        const from = formatDateByTimeAgo(report.from);
        const to = formatDateByTimeAgo(report.to);
        return `${from} - ${to}`;
    }, [report]);

    const revenueByCurrency = useMemo(() => {
        if (!report) return {};
        const allPayments = [...report.paymentsBreakdown.recurring, ...report.paymentsBreakdown.oneTime];
        return sumByCurrency(allPayments);
    }, [report]);

    const customerSummary = useMemo(() => {
        if (!report) return { total: 0, active: 0, deleted: 0, new: 0 };
        const total = report.customerBreakdown.total.reduce((sum, r) => sum + r.count, 0);
        const active = report.customerBreakdown.total.reduce((sum, r) => sum + r.active, 0);
        const deleted = report.customerBreakdown.total.reduce((sum, r) => sum + r.deleted, 0);
        const newCount = report.customerBreakdown.new.reduce((sum, r) => sum + r.count, 0);
        return { total, active, deleted, new: newCount };
    }, [report]);

    const refundsByCurrency = useMemo(() => {
        if (!report) return {};
        return sumByCurrency(report.refundsBreakdown.gained);
    }, [report]);

    const refundsCount = useMemo(() => {
        if (!report) return 0;
        return report.refundsBreakdown.gained.reduce((sum, r) => sum + r.count, 0);
    }, [report]);

    if (!report) return null;

    return (
        <CustomDialog
            open={open}
            onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
            title="Consolidated Report"
            description={`Report period: ${dateRange}`}
            hideFooter
            maxW="3xl"
        >
            <VStack gap={4} align="stretch" py={2}>
                {/* Summary Badges */}
                <HStack gap={3} flexWrap="wrap">
                    <CurrencyBadge
                        label="Revenue"
                        colorPalette="blue"
                        byCurrency={revenueByCurrency}
                    />
                    <Badge colorPalette="green" variant="subtle" size="lg" px={3} py={1}>
                        Customers: {customerSummary.total}
                    </Badge>
                    <CurrencyBadge
                        label="Refunds"
                        colorPalette="red"
                        byCurrency={refundsByCurrency}
                    />
                </HStack>

                <Separator />

                {/* Tabs for Sections */}
                <Tabs.Root defaultValue="payments" variant="line">
                    <Tabs.List>
                        <Tabs.Trigger value="payments">Payments</Tabs.Trigger>
                        <Tabs.Trigger value="customers">Customers</Tabs.Trigger>
                        <Tabs.Trigger value="refunds">Refunds</Tabs.Trigger>
                        <Tabs.Trigger value="products">Products</Tabs.Trigger>
                    </Tabs.List>

                    {/* Payments Tab */}
                    <Tabs.Content value="payments">
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>Recurring Payments</Text>
                                {report.paymentsBreakdown.recurring.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No recurring payments in this period</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader>Country</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Fees</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.paymentsBreakdown.recurring.map((row, i) => (
                                                <Table.Row key={`recurring-${i}`}>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell>{row.country}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: row.currency || "USD" })}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.fees, currency: row.currency || "USD" })}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>

                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>One-Time Payments</Text>
                                {report.paymentsBreakdown.oneTime.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No one-time payments in this period</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader>Country</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Fees</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.paymentsBreakdown.oneTime.map((row, i) => (
                                                <Table.Row key={`onetime-${i}`}>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell>{row.country}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: row.currency || "USD" })}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.fees, currency: row.currency || "USD" })}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>
                        </VStack>
                    </Tabs.Content>

                    {/* Customers Tab */}
                    <Tabs.Content value="customers">
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>
                                    All Customers ({customerSummary.total} total — {customerSummary.active} active, {customerSummary.deleted} deleted)
                                </Text>
                                {report.customerBreakdown.total.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No customer data available</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader>Country</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Active</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Deleted</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.customerBreakdown.total.map((row, i) => (
                                                <Table.Row key={`total-${i}`}>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell>{row.country}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.count}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.active}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.deleted}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>

                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>
                                    New Customers ({customerSummary.new})
                                </Text>
                                {report.customerBreakdown.new.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No new customers in this period</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader>Country</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Count</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.customerBreakdown.new.map((row, i) => (
                                                <Table.Row key={`new-${i}`}>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell>{row.country}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.count}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>
                        </VStack>
                    </Tabs.Content>

                    {/* Refunds Tab */}
                    <Tabs.Content value="refunds">
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>
                                    Refunds ({refundsCount})
                                </Text>
                                {report.refundsBreakdown.gained.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No refunds in this period</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader>Country</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Count</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.refundsBreakdown.gained.map((row, i) => (
                                                <Table.Row key={`refund-${i}`}>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell>{row.country}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.count}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: row.currency || "USD" })}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>
                        </VStack>
                    </Tabs.Content>

                    {/* Products Tab */}
                    <Tabs.Content value="products">
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" mb={2}>Products Revenue</Text>
                                {report.productsBreakdown.gained.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">No product data in this period</Text>
                                ) : (
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Product</Table.ColumnHeader>
                                                <Table.ColumnHeader>Entity</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Revenue</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="right">Customers</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {report.productsBreakdown.gained.map((row, i) => (
                                                <Table.Row key={`product-${i}`}>
                                                    <Table.Cell>{row.productName}</Table.Cell>
                                                    <Table.Cell>{row.entityName}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.revenue, currency: row.currency || "USD" })}</Table.Cell>
                                                    <Table.Cell textAlign="right">{row.customers}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Box>
                        </VStack>
                    </Tabs.Content>
                </Tabs.Root>

                {/* Created timestamp */}
                <Text fontSize="xs" color="gray.400" textAlign="right">
                    Created: {formatDateByTimeAgo(report.createdAt)}
                </Text>
            </VStack>
        </CustomDialog>
    );
};

export default ConsolidatedReportDetailsDialog;
