"use client";

import Stripe from "stripe";
import { useState, useEffect, useCallback } from "react";

import { getSessionStorage, setSessionStorage } from "@/utils/storage-handlers";
import { retrieveStripeProducts, retrieveStripePrices, retrieveStripeInvoices } from "@/services/stripe/retrieve";
import { retrieveAllConnections } from "@/services/connections/retrieve";
import { productsCookieKey } from "@/constants/cookies";
import { IEntity } from "@repo/models";

export interface PriceStats {
    priceId: string;
    unitAmount: number | null;
    currency: string;
    interval: string | null; // null for one-time, 'month', 'year', etc. for recurring
    revenue: number; // Total revenue in dollars
    customerCount: number; // Unique customers who purchased this price
    customerIds: string[]; // List of unique customer IDs
}

export interface SalesDataPoint {
    date: string; // YYYY-MM-DD
    revenue: number;
    salesCount: number;
    currency: string;
}

export interface ProductWithStats {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    images: string[];
    metadata: Record<string, string>;
    defaultPriceId: string | null;
    createdAt: string;
    prices: PriceStats[];
    entity?: {
        id: string;
        name: string;
        image?: string;
    };
    currency: string; // Primary currency from default/first price
    totalRevenue: number; // Sum of all price revenues
    totalCustomers: number; // Unique customers across all prices
    salesHistory: SalesDataPoint[]; // Daily revenue and sales count, sorted by date ascending
}

interface UseProductsReturn {
    productsByConnection: Record<string, ProductWithStats[]> | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface UseProductsParams {
    organisationId: string | null;
    entities: IEntity[] | null;
    from?: number; // Unix timestamp in seconds
    to?: number;   // Unix timestamp in seconds
}

export function useProducts(params: UseProductsParams): UseProductsReturn {
    const { organisationId, entities, from, to } = params;

    const [productsByConnection, setProductsByConnection] = useState<Record<string, ProductWithStats[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(
        async ({ reload = false } = {}) => {
            if (!organisationId) {
                setProductsByConnection(null);
                setError("No organisation ID provided");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const dateRangeSuffix = from !== undefined || to !== undefined
                    ? `_${from !== undefined ? new Date(from * 1000).toISOString().split('T')[0] : 'start'}_${to !== undefined ? new Date(to * 1000).toISOString().split('T')[0] : 'end'}`
                    : '';
                const cookieKey = `${organisationId}_${productsCookieKey}${dateRangeSuffix}`;

                if (!reload) {
                    const cached = getSessionStorage(cookieKey);
                    if (cached) {
                        setProductsByConnection(JSON.parse(cached));
                        setLoading(false);
                        return;
                    }
                }

                const connections = await retrieveAllConnections({ organisationId });
                const stripeConnections = connections.filter(conn => conn.type === 'stripe' && conn.status === 'connected');

                // Build entity lookup map from passed entities
                const entityMap = new Map<string, { id: string, name: string, image?: string }>();
                if (entities) {
                    for (const entity of entities) {
                        entityMap.set(entity.id, {
                            id: entity.id,
                            name: entity.name,
                            image: entity.images?.logo.primary
                        });
                    }
                }

                if (stripeConnections.length === 0) {
                    setProductsByConnection({});
                    setLoading(false);
                    return;
                }

                const productsDict: Record<string, ProductWithStats[]> = {};

                await Promise.all(
                    stripeConnections.map(async (connection) => {
                        const entityDetails = connection.entityId ? entityMap.get(connection.entityId) : undefined;
                        // Fetch products, prices, and invoices in parallel for each connection
                        const [productsResult, pricesResult, invoicesResult] = await Promise.all([
                            fetchAllProducts(organisationId, connection.id),
                            fetchAllPrices(organisationId, connection.id),
                            fetchAllInvoices(organisationId, connection.id, from, to),
                        ]);

                        if (productsResult.error || pricesResult.error || invoicesResult.error) {
                            console.error("Error fetching data:", productsResult.error, pricesResult.error, invoicesResult.error);
                            return;
                        }

                        const products = productsResult.products || [];
                        const prices = pricesResult.prices || [];
                        const invoices = invoicesResult.invoices || [];

                        // Build price lookup map
                        const priceMap = new Map<string, Stripe.Price>();
                        for (const price of prices) {
                            priceMap.set(price.id, price);
                        }

                        // Calculate revenue and customers per price from invoices
                        const priceStatsMap = new Map<string, { revenue: number; customerIds: Set<string> }>();

                        // Track daily sales per product: productId -> dateKey -> { revenue, salesCount }
                        const productSalesMap = new Map<string, Map<string, { revenue: number; salesCount: number }>>();

                        for (const invoice of invoices) {
                            if (invoice.status !== 'paid') continue;

                            const customerId = typeof invoice.customer === 'string'
                                ? invoice.customer
                                : invoice.customer?.id;

                            if (!customerId) continue;

                            const invoiceDate = new Date(invoice.created * 1000);
                            const dateKey = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')}`;

                            // Process line items
                            for (const lineItem of invoice.lines?.data || []) {
                                const pricingDetails = lineItem.pricing?.price_details;
                                const priceId = typeof pricingDetails?.price === 'string'
                                    ? pricingDetails?.price
                                    : pricingDetails?.price?.id;

                                if (!priceId) continue;

                                const existing = priceStatsMap.get(priceId) || { revenue: 0, customerIds: new Set() };
                                const lineAmount = (lineItem.amount || 0) / 100;
                                existing.revenue += lineAmount;
                                existing.customerIds.add(customerId);
                                priceStatsMap.set(priceId, existing);

                                // Aggregate daily sales per product via price -> product mapping
                                const price = priceMap.get(priceId);
                                if (price) {
                                    const productId = typeof price.product === 'string' ? price.product : price.product?.id;
                                    if (productId) {
                                        if (!productSalesMap.has(productId)) {
                                            productSalesMap.set(productId, new Map());
                                        }
                                        const dailyMap = productSalesMap.get(productId)!;
                                        const dayStats = dailyMap.get(dateKey) || { revenue: 0, salesCount: 0 };
                                        dayStats.revenue += lineAmount;
                                        dayStats.salesCount += 1;
                                        dailyMap.set(dateKey, dayStats);
                                    }
                                }
                            }
                        }

                        // Build products with stats
                        const productsWithStats: ProductWithStats[] = products.map(product => {
                            // Find all prices for this product
                            const productPrices = prices.filter(p => {
                                const productRef = typeof p.product === 'string' ? p.product : p.product?.id;
                                return productRef === product.id;
                            });

                            const priceStats: PriceStats[] = productPrices.map(price => {
                                const stats = priceStatsMap.get(price.id) || { revenue: 0, customerIds: new Set() };
                                return {
                                    priceId: price.id,
                                    unitAmount: price.unit_amount,
                                    currency: price.currency.toUpperCase(),
                                    interval: price.recurring?.interval || null,
                                    revenue: stats.revenue,
                                    customerCount: stats.customerIds.size,
                                    customerIds: Array.from(stats.customerIds),
                                };
                            });

                            // Calculate totals
                            const allCustomerIds = new Set<string>();
                            let totalRevenue = 0;
                            for (const ps of priceStats) {
                                totalRevenue += ps.revenue;
                                for (const cid of ps.customerIds) {
                                    allCustomerIds.add(cid);
                                }
                            }

                            // Get currency from default price or first price
                            const defaultPriceId = typeof product.default_price === 'string'
                                ? product.default_price
                                : product.default_price?.id || null;
                            const defaultPrice = defaultPriceId ? priceStats.find(p => p.priceId === defaultPriceId) : null;
                            const currency = defaultPrice?.currency || priceStats[0]?.currency || "USD";

                            // Build sorted sales history for this product
                            const dailyMap = productSalesMap.get(product.id);
                            const salesHistory: SalesDataPoint[] = dailyMap
                                ? Array.from(dailyMap.entries())
                                    .map(([date, stats]) => ({ date, revenue: stats.revenue, salesCount: stats.salesCount, currency }))
                                    .sort((a, b) => a.date.localeCompare(b.date))
                                : [];

                            return {
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                active: product.active,
                                images: product.images,
                                metadata: product.metadata as Record<string, string>,
                                defaultPriceId,
                                createdAt: new Date(product.created * 1000).toISOString(),
                                prices: priceStats,
                                entity: entityDetails,
                                currency,
                                totalRevenue,
                                totalCustomers: allCustomerIds.size,
                                salesHistory,
                            };
                        });

                        productsDict[connection.id] = productsWithStats;
                    })
                );

                setProductsByConnection(productsDict);
                setSessionStorage(cookieKey, JSON.stringify(productsDict));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch products");
                setProductsByConnection(null);
            } finally {
                setLoading(false);
            }
        },
        [organisationId, entities, from, to]
    );


    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const refetch = useCallback(async () => {
        await fetchProducts({ reload: true });
    }, [fetchProducts]);

    return { productsByConnection, loading, error, refetch };
}

// Helper functions to fetch all paginated data

async function fetchAllProducts(
    organisationId: string,
    connectionId: string
): Promise<{ products: Stripe.Product[] | null; error: string | null }> {
    const allProducts: Stripe.Product[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const result = await retrieveStripeProducts({
            organisationId,
            connectionId,
            startingAfter,
        });

        if (result.error) {
            return { products: null, error: result.error };
        }

        if (result.products) {
            allProducts.push(...result.products);
            if (result.products.length > 0) {
                startingAfter = result.products[result.products.length - 1].id;
            }
        }

        hasMore = result.hasMore;
    }

    return { products: allProducts, error: null };
}

async function fetchAllPrices(
    organisationId: string,
    connectionId: string
): Promise<{ prices: Stripe.Price[] | null; error: string | null }> {
    const allPrices: Stripe.Price[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const result = await retrieveStripePrices({
            organisationId,
            connectionId,
            startingAfter,
        });

        if (result.error) {
            return { prices: null, error: result.error };
        }

        if (result.prices) {
            allPrices.push(...result.prices);
            if (result.prices.length > 0) {
                startingAfter = result.prices[result.prices.length - 1].id;
            }
        }

        hasMore = result.hasMore;
    }

    return { prices: allPrices, error: null };
}

async function fetchAllInvoices(
    organisationId: string,
    connectionId: string,
    from?: number,
    to?: number
): Promise<{ invoices: Stripe.Invoice[] | null; error: string | null }> {
    const allInvoices: Stripe.Invoice[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const result = await retrieveStripeInvoices({
            organisationId,
            connectionId,
            startingAfter,
        });

        if (result.error) {
            return { invoices: null, error: result.error };
        }

        if (result.invoices) {
            // Filter by date range if provided
            let filtered = result.invoices;
            if (from !== undefined || to !== undefined) {
                filtered = result.invoices.filter(invoice => {
                    const invoiceTime = invoice.created;
                    if (from !== undefined && invoiceTime < from) return false;
                    if (to !== undefined && invoiceTime > to) return false;
                    return true;
                });
            }
            allInvoices.push(...filtered);

            if (result.invoices.length > 0) {
                startingAfter = result.invoices[result.invoices.length - 1].id;
            }
        }

        hasMore = result.hasMore;
    }

    return { invoices: allInvoices, error: null };
}
