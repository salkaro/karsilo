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

    const paymentsSummary = useMemo(() => {
        if (!report) return { recurringTotal: 0, oneTimeTotal: 0, totalFees: 0 };
        const recurringTotal = report.paymentsBreakdown.recurring.reduce((sum, r) => sum + r.amount, 0);
        const oneTimeTotal = report.paymentsBreakdown.oneTime.reduce((sum, r) => sum + r.amount, 0);
        const totalFees = [
            ...report.paymentsBreakdown.recurring,
            ...report.paymentsBreakdown.oneTime,
        ].reduce((sum, r) => sum + r.fees, 0);
        return { recurringTotal, oneTimeTotal, totalFees };
    }, [report]);

    const customerSummary = useMemo(() => {
        if (!report) return { total: 0, active: 0, deleted: 0, new: 0 };
        const total = report.customerBreakdown.total.reduce((sum, r) => sum + r.count, 0);
        const active = report.customerBreakdown.total.reduce((sum, r) => sum + r.active, 0);
        const deleted = report.customerBreakdown.total.reduce((sum, r) => sum + r.deleted, 0);
        const newCount = report.customerBreakdown.new.reduce((sum, r) => sum + r.count, 0);
        return { total, active, deleted, new: newCount };
    }, [report]);

    const refundsSummary = useMemo(() => {
        if (!report) return { count: 0, amount: 0 };
        const count = report.refundsBreakdown.gained.reduce((sum, r) => sum + r.count, 0);
        const amount = report.refundsBreakdown.gained.reduce((sum, r) => sum + r.amount, 0);
        return { count, amount };
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
                    <Badge colorPalette="blue" variant="subtle" size="lg" px={3} py={1}>
                        Revenue: {formatCurrency({ amount: paymentsSummary.recurringTotal + paymentsSummary.oneTimeTotal, currency: "USD" })}
                    </Badge>
                    <Badge colorPalette="green" variant="subtle" size="lg" px={3} py={1}>
                        Customers: {customerSummary.total}
                    </Badge>
                    <Badge colorPalette="red" variant="subtle" size="lg" px={3} py={1}>
                        Refunds: {formatCurrency({ amount: refundsSummary.amount, currency: "USD" })}
                    </Badge>
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
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: "USD" })}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.fees, currency: "USD" })}</Table.Cell>
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
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: "USD" })}</Table.Cell>
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.fees, currency: "USD" })}</Table.Cell>
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
                                    Refunds ({refundsSummary.count})
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
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.amount, currency: "USD" })}</Table.Cell>
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
                                                    <Table.Cell textAlign="right">{formatCurrency({ amount: row.revenue, currency: "USD" })}</Table.Cell>
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
