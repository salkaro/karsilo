"use client";

import { useMemo, useState } from "react";
import { VStack, HStack, Button, Box, Text, Skeleton, Separator } from "@repo/ui";
import { Plus } from "lucide-react";
import { useOrganisation } from "@/hooks/useOrganisation";
import { useConnections } from "@/hooks/useConnections";
import { useEntities } from "@/hooks/useEntities";
import { useReports, IReport } from "@/hooks/useReports";
import { ReportsTable } from "./reports-table";
import CreateReportDialog from "./dialogs/dialog-create-report";

const ReportsSkeleton = () => (
    <VStack gap={4} align="stretch">
        <HStack justify="space-between">
            <Skeleton height="40px" width="200px" borderRadius="md" />
            <Skeleton height="40px" width="140px" borderRadius="md" />
        </HStack>
        <Skeleton height="60px" width="100%" borderRadius="lg" />
        <Skeleton height="400px" width="100%" borderRadius="lg" />
    </VStack>
);

export default function ReportsPage() {
    const { organisation } = useOrganisation();
    const { connections } = useConnections(organisation?.id ?? null);
    const { entities } = useEntities(organisation?.id ?? null);
    const {
        reportsByConnection,
        loading,
        refetch,
        createReport,
        creating,
    } = useReports(organisation?.id ?? null);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

    const allReports = useMemo(() => {
        if (!reportsByConnection) return [];

        const reports: (IReport & { connectionId: string })[] = [];
        Object.entries(reportsByConnection).forEach(([connectionId, connectionReports]) => {
            connectionReports.forEach((report) => {
                reports.push({ ...report, connectionId });
            });
        });

        return reports;
    }, [reportsByConnection]);

    const stripeConnections = useMemo(() => {
        if (!connections) return [];
        return connections.filter(
            (c) => c.type === "stripe" && c.status === "connected"
        );
    }, [connections]);

    const hasStripeConnections = stripeConnections.length > 0;

    const isInitialLoad = loading && reportsByConnection === null;

    if (isInitialLoad) {
        return (
            <VStack gap={6} align="stretch">
                <ReportsSkeleton />
            </VStack>
        );
    }

    if (!hasStripeConnections) {
        return (
            <VStack p={{ md: 6 }} gap={6} align="stretch">
                <Box
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    p={8}
                    textAlign="center"
                >
                    <VStack gap={4}>
                        <Text color="gray.500" fontSize="lg">
                            No Stripe accounts connected
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Connect a Stripe account to generate financial reports
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        );
    }

    return (
        <VStack gap={6} align="stretch">
            {/* Header */}
            <HStack justify="flex-end" align="center">
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    disabled={creating}
                    size="sm"
                >
                    <Plus size={16} />
                    Create Report
                </Button>
            </HStack>

            <Separator borderWidth="1px" />

            {/* Reports Table */}
            <ReportsTable
                reports={allReports}
                entities={entities}
                connectionEntityMap={connectionEntityMap}
                onRefresh={refetch}
                loading={loading}
            />

            {/* Create Report Dialog */}
            <CreateReportDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                connections={connections || []}
                entities={entities}
                createReport={createReport}
            />
        </VStack>
    );
}
