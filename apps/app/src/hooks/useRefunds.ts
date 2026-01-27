"use client";

import Stripe from "stripe";
import { useState, useEffect, useCallback } from "react";

import { getSessionStorage, setSessionStorage } from "@/utils/storage-handlers";
import { retrieveStripeRefunds } from "@/services/stripe/retrieve";
import { retrieveAllConnections } from "@/services/connections/retrieve";
import { refundsCookieKey } from "@/constants/cookies";

export interface IRefund {
    id: string;
    amount: number;
    currency: string;
    status: "pending" | "succeeded" | "failed" | "canceled";
    reason: string | null;
    chargeId: string | null;
    paymentIntentId: string | null;
    createdAt: string;
    receiptNumber: string | null;
    description: string | null;
    metadata: Record<string, string>;
}

interface UseRefundsReturn {
    refundsByConnection: Record<string, IRefund[]> | null;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: Record<string, boolean>;
}

interface UseRefundsParams {
    organisationId: string | null;
    from?: number;
    to?: number;
}

export function useRefunds(params: UseRefundsParams | string | null): UseRefundsReturn {
    const organisationId = typeof params === 'string' || params === null ? params : params.organisationId;
    const from = typeof params === 'object' && params !== null ? params.from : undefined;
    const to = typeof params === 'object' && params !== null ? params.to : undefined;

    const [refundsByConnection, setRefundsByConnection] = useState<Record<string, IRefund[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

    const transformRefund = (refund: Stripe.Refund): IRefund => ({
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        status: refund.status as IRefund["status"],
        reason: refund.reason,
        chargeId: typeof refund.charge === 'string' ? refund.charge : refund.charge?.id || null,
        paymentIntentId: typeof refund.payment_intent === 'string'
            ? refund.payment_intent
            : refund.payment_intent?.id || null,
        createdAt: new Date(refund.created * 1000).toISOString(),
        receiptNumber: refund.receipt_number,
        description: refund.description ?? null,
        metadata: refund.metadata || {},
    });

    const fetchRefunds = useCallback(
        async ({ reload = false } = {}) => {
            if (!organisationId) {
                setRefundsByConnection(null);
                setError("No organisation ID provided");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const dateRangeSuffix = from !== undefined || to !== undefined
                    ? `_${from !== undefined ? new Date(from * 1000).toISOString().split('T')[0] : 'start'}_${to !== undefined ? new Date(to * 1000).toISOString().split('T')[0] : 'end'}`
                    : '';
                const storageKey = `${organisationId}_${refundsCookieKey}${dateRangeSuffix}`;

                if (!reload) {
                    const cached = getSessionStorage(storageKey);
                    if (cached) {
                        setRefundsByConnection(JSON.parse(cached));
                        setLoading(false);
                        return;
                    }
                }

                const connections = await retrieveAllConnections({ organisationId });
                const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

                if (stripeConnections.length === 0) {
                    setRefundsByConnection({});
                    setLoading(false);
                    return;
                }

                const refundsDict: Record<string, IRefund[]> = {};
                const hasMoreDict: Record<string, boolean> = {};

                const createdFilter: { gte?: number; lte?: number } | undefined =
                    from !== undefined || to !== undefined
                        ? { gte: from, lte: to }
                        : undefined;

                await Promise.all(
                    stripeConnections.map(async (connection) => {
                        const { refunds: fetched, hasMore: more, error: err } = await retrieveStripeRefunds({
                            organisationId,
                            connectionId: connection.id,
                            created: createdFilter,
                        });

                        if (!err && fetched) {
                            hasMoreDict[connection.id] = more;
                            refundsDict[connection.id] = fetched.map(transformRefund);
                        }
                    })
                );

                setRefundsByConnection(refundsDict);
                setHasMore(hasMoreDict);
                setSessionStorage(storageKey, JSON.stringify(refundsDict));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch refunds");
                setRefundsByConnection(null);
            } finally {
                setLoading(false);
            }
        },
        [organisationId, from, to]
    );

    const loadMore = useCallback(async () => {
        if (!organisationId || !refundsByConnection) return;

        setLoadingMore(true);
        setError(null);

        try {
            const connections = await retrieveAllConnections({ organisationId });
            const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

            const updatedRefundsDict = { ...refundsByConnection };
            const updatedHasMoreDict = { ...hasMore };

            const createdFilter: { gte?: number; lte?: number } | undefined =
                from !== undefined || to !== undefined
                    ? { gte: from, lte: to }
                    : undefined;

            await Promise.all(
                stripeConnections.map(async (connection) => {
                    if (!hasMore[connection.id]) return;

                    const existingRefunds = refundsByConnection[connection.id] || [];
                    if (existingRefunds.length === 0) return;

                    const lastRefundId = existingRefunds[existingRefunds.length - 1].id;
                    const { refunds: fetched, hasMore: more, error: err } = await retrieveStripeRefunds({
                        organisationId,
                        connectionId: connection.id,
                        startingAfter: lastRefundId,
                        created: createdFilter,
                    });

                    if (!err && fetched) {
                        updatedRefundsDict[connection.id] = [...existingRefunds, ...fetched.map(transformRefund)];
                        updatedHasMoreDict[connection.id] = more;
                    }
                })
            );

            setRefundsByConnection(updatedRefundsDict);
            setHasMore(updatedHasMoreDict);

            const dateRangeSuffix = from !== undefined || to !== undefined
                ? `_${from !== undefined ? new Date(from * 1000).toISOString().split('T')[0] : 'start'}_${to !== undefined ? new Date(to * 1000).toISOString().split('T')[0] : 'end'}`
                : '';
            const storageKey = `${organisationId}_${refundsCookieKey}${dateRangeSuffix}`;
            setSessionStorage(storageKey, JSON.stringify(updatedRefundsDict));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more refunds");
        } finally {
            setLoadingMore(false);
        }
    }, [organisationId, refundsByConnection, hasMore, from, to]);

    useEffect(() => {
        fetchRefunds();
    }, [fetchRefunds]);

    useEffect(() => {
        const hasMoreData = Object.values(hasMore).some(value => value === true);
        if (hasMoreData && !loading && !loadingMore) {
            loadMore();
        }
    }, [hasMore, loading, loadingMore, loadMore]);

    const refetch = useCallback(async () => {
        await fetchRefunds({ reload: true });
    }, [fetchRefunds]);

    return {
        refundsByConnection,
        loading,
        loadingMore,
        error,
        refetch,
        loadMore,
        hasMore
    };
}
