"use client";

import { useState, useEffect, useCallback } from "react";

import { getSessionStorage, setSessionStorage } from "@/utils/storage-handlers";
import { retrieveStripeReports } from "@/services/stripe/retrieve";
import { createStripeReport, ReportType, PlainReportRun } from "@/services/stripe/create";
import { retrieveAllConnections } from "@/services/connections/retrieve";
import { reportsCookieKey } from "@/constants/cookies";

export interface IReport {
    id: string;
    reportType: string;
    status: "pending" | "succeeded" | "failed";
    createdAt: string;
    resultUrl?: string;
    error?: string;
}

interface UseReportsReturn {
    reportsByConnection: Record<string, IReport[]> | null;
    loading: boolean;
    loadingMore: boolean;
    creating: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    createReport: (params: {
        connectionId: string;
        reportType: ReportType;
        intervalStart: number;
        intervalEnd: number;
    }) => Promise<{ success: boolean; error?: string }>;
    hasMore: Record<string, boolean>;
}

interface UseReportsParams {
    organisationId: string | null;
}

export function useReports(params: UseReportsParams | string | null): UseReportsReturn {
    const organisationId = typeof params === 'string' || params === null ? params : params.organisationId;
    const [reportsByConnection, setReportsByConnection] = useState<Record<string, IReport[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

    const transformReport = (report: PlainReportRun): IReport => ({
        id: report.id,
        reportType: report.report_type,
        status: report.status === "succeeded" ? "succeeded" :
            report.status === "failed" ? "failed" : "pending",
        createdAt: new Date(report.created * 1000).toISOString(),
        resultUrl: report.result?.url || undefined,
        error: report.error || undefined,
    });

    const fetchReports = useCallback(
        async ({ reload = false } = {}) => {
            if (!organisationId) {
                setReportsByConnection(null);
                setError("No organisation ID provided");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const storageKey = `${organisationId}_${reportsCookieKey}`;

                if (!reload) {
                    const cached = getSessionStorage(storageKey);
                    if (cached) {
                        setReportsByConnection(JSON.parse(cached));
                        setLoading(false);
                        return;
                    }
                }

                const connections = await retrieveAllConnections({ organisationId });
                const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

                if (stripeConnections.length === 0) {
                    setReportsByConnection({});
                    setLoading(false);
                    return;
                }

                const reportsDict: Record<string, IReport[]> = {};
                const hasMoreDict: Record<string, boolean> = {};

                await Promise.all(
                    stripeConnections.map(async (connection) => {
                        const { reports: fetched, hasMore: more, error: err } = await retrieveStripeReports({
                            organisationId,
                            connectionId: connection.id,
                        });

                        if (!err && fetched) {
                            hasMoreDict[connection.id] = more;
                            reportsDict[connection.id] = fetched.map(transformReport);
                        }
                    })
                );

                setReportsByConnection(reportsDict);
                setHasMore(hasMoreDict);
                setSessionStorage(storageKey, JSON.stringify(reportsDict));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch reports");
                setReportsByConnection(null);
            } finally {
                setLoading(false);
            }
        },
        [organisationId]
    );

    const loadMore = useCallback(async () => {
        if (!organisationId || !reportsByConnection) return;

        setLoadingMore(true);
        setError(null);

        try {
            const connections = await retrieveAllConnections({ organisationId });
            const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

            const updatedReportsDict = { ...reportsByConnection };
            const updatedHasMoreDict = { ...hasMore };

            await Promise.all(
                stripeConnections.map(async (connection) => {
                    if (!hasMore[connection.id]) return;

                    const existingReports = reportsByConnection[connection.id] || [];
                    if (existingReports.length === 0) return;

                    const lastReportId = existingReports[existingReports.length - 1].id;
                    const { reports: fetched, hasMore: more, error: err } = await retrieveStripeReports({
                        organisationId,
                        connectionId: connection.id,
                        startingAfter: lastReportId,
                    });

                    if (!err && fetched) {
                        updatedReportsDict[connection.id] = [...existingReports, ...fetched.map(transformReport)];
                        updatedHasMoreDict[connection.id] = more;
                    }
                })
            );

            setReportsByConnection(updatedReportsDict);
            setHasMore(updatedHasMoreDict);

            const storageKey = `${organisationId}_${reportsCookieKey}`;
            setSessionStorage(storageKey, JSON.stringify(updatedReportsDict));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more reports");
        } finally {
            setLoadingMore(false);
        }
    }, [organisationId, reportsByConnection, hasMore]);

    const createReport = useCallback(async ({
        connectionId,
        reportType,
        intervalStart,
        intervalEnd,
    }: {
        connectionId: string;
        reportType: ReportType;
        intervalStart: number;
        intervalEnd: number;
    }): Promise<{ success: boolean; error?: string }> => {
        if (!organisationId) {
            return { success: false, error: "No organisation ID provided" };
        }

        setCreating(true);

        try {
            const { report, error: createError } = await createStripeReport({
                organisationId,
                connectionId,
                reportType,
                intervalStart,
                intervalEnd,
            });

            if (createError || !report) {
                return { success: false, error: createError || "Failed to create report" };
            }

            // Add the new report to the state
            const newReport = transformReport(report);
            setReportsByConnection(prev => {
                if (!prev) return { [connectionId]: [newReport] };
                const existing = prev[connectionId] || [];
                return {
                    ...prev,
                    [connectionId]: [newReport, ...existing],
                };
            });

            // Update cache
            const storageKey = `${organisationId}_${reportsCookieKey}`;
            setReportsByConnection(current => {
                if (current) {
                    setSessionStorage(storageKey, JSON.stringify(current));
                }
                return current;
            });

            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create report";
            return { success: false, error: errorMessage };
        } finally {
            setCreating(false);
        }
    }, [organisationId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
        const hasMoreData = Object.values(hasMore).some(value => value === true);
        if (hasMoreData && !loading && !loadingMore) {
            loadMore();
        }
    }, [hasMore, loading, loadingMore, loadMore]);

    const refetch = useCallback(async () => {
        await fetchReports({ reload: true });
    }, [fetchReports]);

    return {
        reportsByConnection,
        loading,
        loadingMore,
        creating,
        error,
        refetch,
        loadMore,
        createReport,
        hasMore
    };
}
