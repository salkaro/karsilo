"use client";

import Stripe from "stripe";
import { useState, useEffect, useCallback } from "react";

import { getSessionStorage, setSessionStorage } from "@/utils/storage-handlers";
import { retrieveStripeBalanceTransactions, retrieveStripeBalance } from "@/services/stripe/retrieve";
import { retrieveAllConnections } from "@/services/connections/retrieve";
import { balanceTransactionsCookieKey } from "@/constants/cookies";

export interface IBalanceTransaction {
    id: string;
    type: string;
    amount: number;
    currency: string;
    net: number;
    fee: number;
    status: "available" | "pending";
    description: string | null;
    createdAt: string;
    availableOn: string;
    source: string | null;
}

export interface IBalance {
    available: Array<{
        amount: number;
        currency: string;
    }>;
    pending: Array<{
        amount: number;
        currency: string;
    }>;
}

interface UseBalanceTransactionsReturn {
    transactionsByConnection: Record<string, IBalanceTransaction[]> | null;
    balanceByConnection: Record<string, IBalance> | null;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: Record<string, boolean>;
}

interface UseBalanceTransactionsParams {
    organisationId: string | null;
    from?: number; // Unix timestamp in seconds
    to?: number;   // Unix timestamp in seconds
}

export function useBalanceTransactions(params: UseBalanceTransactionsParams | string | null): UseBalanceTransactionsReturn {
    const organisationId = typeof params === 'string' || params === null ? params : params.organisationId;
    const from = typeof params === 'object' && params !== null ? params.from : undefined;
    const to = typeof params === 'object' && params !== null ? params.to : undefined;

    const [transactionsByConnection, setTransactionsByConnection] = useState<Record<string, IBalanceTransaction[]> | null>(null);
    const [balanceByConnection, setBalanceByConnection] = useState<Record<string, IBalance> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

    const transformTransaction = (txn: Stripe.BalanceTransaction): IBalanceTransaction => ({
        id: txn.id,
        type: txn.type,
        amount: txn.amount / 100,
        currency: txn.currency.toUpperCase(),
        net: txn.net / 100,
        fee: txn.fee / 100,
        status: txn.status === "available" ? "available" : "pending",
        description: txn.description,
        createdAt: new Date(txn.created * 1000).toISOString(),
        availableOn: new Date(txn.available_on * 1000).toISOString(),
        source: typeof txn.source === 'string' ? txn.source : txn.source?.id || null,
    });

    const transformBalance = (balance: Stripe.Balance): IBalance => ({
        available: balance.available.map(b => ({
            amount: b.amount / 100,
            currency: b.currency.toUpperCase(),
        })),
        pending: balance.pending.map(b => ({
            amount: b.amount / 100,
            currency: b.currency.toUpperCase(),
        })),
    });

    const fetchTransactions = useCallback(
        async ({ reload = false } = {}) => {
            if (!organisationId) {
                setTransactionsByConnection(null);
                setBalanceByConnection(null);
                setError("No organisation ID provided");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const dateRangeSuffix = from !== undefined || to !== undefined
                    ? `_${from !== undefined ? new Date(from * 1000).toISOString().split('T')[0] : 'start'}_${to !== undefined ? new Date(to * 1000).toISOString().split('T')[0] : 'end'}`
                    : '';
                const storageKey = `${organisationId}_${balanceTransactionsCookieKey}${dateRangeSuffix}`;

                if (!reload) {
                    const cached = getSessionStorage(storageKey);
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        setTransactionsByConnection(parsed.transactions);
                        setBalanceByConnection(parsed.balances);
                        setLoading(false);
                        return;
                    }
                }

                const connections = await retrieveAllConnections({ organisationId });
                const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

                if (stripeConnections.length === 0) {
                    setTransactionsByConnection({});
                    setBalanceByConnection({});
                    setLoading(false);
                    return;
                }

                const transactionsDict: Record<string, IBalanceTransaction[]> = {};
                const balancesDict: Record<string, IBalance> = {};
                const hasMoreDict: Record<string, boolean> = {};

                // Build created filter for Stripe API
                const createdFilter: { gte?: number; lte?: number } | undefined =
                    from !== undefined || to !== undefined
                        ? { gte: from, lte: to }
                        : undefined;

                await Promise.all(
                    stripeConnections.map(async (connection) => {
                        // Fetch balance transactions
                        const { balanceTransactions: fetched, hasMore: more, error: txnErr } = await retrieveStripeBalanceTransactions({
                            organisationId,
                            connectionId: connection.id,
                            created: createdFilter,
                        });

                        if (!txnErr && fetched) {
                            hasMoreDict[connection.id] = more;
                            transactionsDict[connection.id] = fetched.map(transformTransaction);
                        }

                        // Fetch current balance
                        const { balance, error: balErr } = await retrieveStripeBalance({
                            organisationId,
                            connectionId: connection.id,
                        });

                        if (!balErr && balance) {
                            balancesDict[connection.id] = transformBalance(balance);
                        }
                    })
                );

                setTransactionsByConnection(transactionsDict);
                setBalanceByConnection(balancesDict);
                setHasMore(hasMoreDict);
                setSessionStorage(storageKey, JSON.stringify({
                    transactions: transactionsDict,
                    balances: balancesDict,
                }));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch balance transactions");
                setTransactionsByConnection(null);
                setBalanceByConnection(null);
            } finally {
                setLoading(false);
            }
        },
        [organisationId, from, to]
    );

    const loadMore = useCallback(async () => {
        if (!organisationId || !transactionsByConnection) return;

        setLoadingMore(true);
        setError(null);

        try {
            const connections = await retrieveAllConnections({ organisationId });
            const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

            const updatedTransactionsDict = { ...transactionsByConnection };
            const updatedHasMoreDict = { ...hasMore };

            const createdFilter: { gte?: number; lte?: number } | undefined =
                from !== undefined || to !== undefined
                    ? { gte: from, lte: to }
                    : undefined;

            await Promise.all(
                stripeConnections.map(async (connection) => {
                    if (!hasMore[connection.id]) return;

                    const existingTxns = transactionsByConnection[connection.id] || [];
                    if (existingTxns.length === 0) return;

                    const lastTxnId = existingTxns[existingTxns.length - 1].id;
                    const { balanceTransactions: fetched, hasMore: more, error: err } = await retrieveStripeBalanceTransactions({
                        organisationId,
                        connectionId: connection.id,
                        startingAfter: lastTxnId,
                        created: createdFilter,
                    });

                    if (!err && fetched) {
                        updatedTransactionsDict[connection.id] = [...existingTxns, ...fetched.map(transformTransaction)];
                        updatedHasMoreDict[connection.id] = more;
                    }
                })
            );

            setTransactionsByConnection(updatedTransactionsDict);
            setHasMore(updatedHasMoreDict);

            const dateRangeSuffix = from !== undefined || to !== undefined
                ? `_${from !== undefined ? new Date(from * 1000).toISOString().split('T')[0] : 'start'}_${to !== undefined ? new Date(to * 1000).toISOString().split('T')[0] : 'end'}`
                : '';
            const storageKey = `${organisationId}_${balanceTransactionsCookieKey}${dateRangeSuffix}`;
            setSessionStorage(storageKey, JSON.stringify({
                transactions: updatedTransactionsDict,
                balances: balanceByConnection,
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more transactions");
        } finally {
            setLoadingMore(false);
        }
    }, [organisationId, transactionsByConnection, balanceByConnection, hasMore, from, to]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        const hasMoreData = Object.values(hasMore).some(value => value === true);
        if (hasMoreData && !loading && !loadingMore) {
            loadMore();
        }
    }, [hasMore, loading, loadingMore, loadMore]);

    const refetch = useCallback(async () => {
        await fetchTransactions({ reload: true });
    }, [fetchTransactions]);

    return {
        transactionsByConnection,
        balanceByConnection,
        loading,
        loadingMore,
        error,
        refetch,
        loadMore,
        hasMore
    };
}
