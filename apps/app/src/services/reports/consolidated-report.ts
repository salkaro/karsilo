"use server";

import Stripe from "stripe";
import { IConsolidateReport, IPaymentsBreakdown, ICustomerBreakdown, IRefundsBreakdown, IProductsBreakdown } from "@repo/models";
import { retrieveAllConnections, retrieveConnection } from "@/services/connections/retrieve";
import { retrieveEntities } from "@/services/firebase/entities/retrieve";
import { firestoreAdmin } from "@repo/firebase";
import { getConsolidatedReportsPath } from "@repo/constants";

const LIMIT = 100;

async function fetchAllCharges(
    organisationId: string,
    connectionId: string,
    from: number,
    to: number
): Promise<Stripe.Charge[]> {
    const connection = await retrieveConnection({ organisationId, connectionId });
    if (!connection?.accessToken) return [];

    const stripe = new Stripe(connection.accessToken);
    const allCharges: Stripe.Charge[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const charges = await stripe.charges.list({
            limit: LIMIT,
            starting_after: startingAfter,
            created: { gte: from, lte: to },
            expand: ['data.customer', 'data.invoice'],
        });

        allCharges.push(...charges.data);
        hasMore = charges.data.length === LIMIT;
        if (charges.data.length > 0) {
            startingAfter = charges.data[charges.data.length - 1].id;
        }
    }

    return allCharges;
}

async function fetchAllCustomers(
    organisationId: string,
    connectionId: string
): Promise<Stripe.Customer[]> {
    const connection = await retrieveConnection({ organisationId, connectionId });
    if (!connection?.accessToken) return [];

    const stripe = new Stripe(connection.accessToken);
    const allCustomers: Stripe.Customer[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const customers = await stripe.customers.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        allCustomers.push(...customers.data);
        hasMore = customers.data.length === LIMIT;
        if (customers.data.length > 0) {
            startingAfter = customers.data[customers.data.length - 1].id;
        }
    }

    return allCustomers;
}

async function fetchAllRefunds(
    organisationId: string,
    connectionId: string,
    from: number,
    to: number
): Promise<Stripe.Refund[]> {
    const connection = await retrieveConnection({ organisationId, connectionId });
    if (!connection?.accessToken) return [];

    const stripe = new Stripe(connection.accessToken);
    const allRefunds: Stripe.Refund[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const refunds = await stripe.refunds.list({
            limit: LIMIT,
            starting_after: startingAfter,
            created: { gte: from, lte: to },
        });

        allRefunds.push(...refunds.data);
        hasMore = refunds.data.length === LIMIT;
        if (refunds.data.length > 0) {
            startingAfter = refunds.data[refunds.data.length - 1].id;
        }
    }

    return allRefunds;
}

async function fetchAllProducts(
    organisationId: string,
    connectionId: string
): Promise<Stripe.Product[]> {
    const connection = await retrieveConnection({ organisationId, connectionId });
    if (!connection?.accessToken) return [];

    const stripe = new Stripe(connection.accessToken);
    const allProducts: Stripe.Product[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const products = await stripe.products.list({
            limit: LIMIT,
            starting_after: startingAfter,
            expand: ['data.default_price'],
        });

        allProducts.push(...products.data);
        hasMore = products.data.length === LIMIT;
        if (products.data.length > 0) {
            startingAfter = products.data[products.data.length - 1].id;
        }
    }

    return allProducts;
}

async function fetchAllInvoices(
    organisationId: string,
    connectionId: string,
    from: number,
    to: number
): Promise<Stripe.Invoice[]> {
    const connection = await retrieveConnection({ organisationId, connectionId });
    if (!connection?.accessToken) return [];

    const stripe = new Stripe(connection.accessToken);
    const allInvoices: Stripe.Invoice[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;

    while (hasMore) {
        const invoices = await stripe.invoices.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        const filtered = invoices.data.filter(inv => inv.created >= from && inv.created <= to);
        allInvoices.push(...filtered);

        hasMore = invoices.data.length === LIMIT;
        if (invoices.data.length > 0) {
            startingAfter = invoices.data[invoices.data.length - 1].id;
        }
    }

    return allInvoices;
}

function extractChargeType(receiptUrl: string | null): "recurring" | "one-time" | "unknown" {
    if (!receiptUrl) return "unknown";
    try {
        const url = new URL(receiptUrl);
        if (url.pathname.startsWith('/receipts/invoices/')) return "recurring";
        if (url.pathname.startsWith('/receipts/payment/')) return "one-time";
        return "unknown";
    } catch {
        return "unknown";
    }
}

export async function generateConsolidatedReport({
    organisationId,
    from,
    to,
}: {
    organisationId: string;
    from: number;
    to: number;
}): Promise<{ report: IConsolidateReport | null; error: string | null }> {
    try {
        const [connections, entitiesResult] = await Promise.all([
            retrieveAllConnections({ organisationId }),
            retrieveEntities({ organisationId }),
        ]);

        const stripeConnections = connections.filter(c => c.type === 'stripe' && c.status === 'connected');
        const entities = entitiesResult.entities || [];

        const entityMap = new Map<string, string>();
        for (const entity of entities) {
            entityMap.set(entity.id, entity.name);
        }

        const connEntityMap = new Map<string, { entityId: string; entityName: string }>();
        for (const conn of stripeConnections) {
            if (conn.entityId) {
                connEntityMap.set(conn.id, {
                    entityId: conn.entityId,
                    entityName: entityMap.get(conn.entityId) || "Unknown",
                });
            }
        }

        // Fetch all data in parallel across connections
        const [chargesResults, customersResults, refundsResults, productsResults, invoicesResults] = await Promise.all([
            Promise.all(stripeConnections.map(c => fetchAllCharges(organisationId, c.id, from, to).then(charges => ({ connectionId: c.id, charges })))),
            Promise.all(stripeConnections.map(c => fetchAllCustomers(organisationId, c.id).then(customers => ({ connectionId: c.id, customers })))),
            Promise.all(stripeConnections.map(c => fetchAllRefunds(organisationId, c.id, from, to).then(refunds => ({ connectionId: c.id, refunds })))),
            Promise.all(stripeConnections.map(c => fetchAllProducts(organisationId, c.id).then(products => ({ connectionId: c.id, products })))),
            Promise.all(stripeConnections.map(c => fetchAllInvoices(organisationId, c.id, from, to).then(invoices => ({ connectionId: c.id, invoices })))),
        ]);

        // === Payments Breakdown ===
        const recurringMap = new Map<string, { country: string; currency: string; amount: number; fees: number; entityId: string; entityName: string }>();
        const oneTimeMap = new Map<string, { country: string; currency: string; amount: number; fees: number; entityId: string; entityName: string }>();

        for (const { connectionId, charges } of chargesResults) {
            const entityInfo = connEntityMap.get(connectionId) || { entityId: connectionId, entityName: "Unknown" };

            for (const charge of charges) {
                if (charge.status !== "succeeded") continue;

                const country = charge.payment_method_details?.card?.country || "Unknown";
                const currency = charge.currency.toUpperCase();
                const amount = charge.amount / 100;
                const fees = charge.application_fee_amount ? charge.application_fee_amount / 100 : 0;
                const type = extractChargeType(charge.receipt_url);
                const key = `${entityInfo.entityId}_${country}_${currency}`;

                const targetMap = type === "recurring" ? recurringMap : oneTimeMap;
                const existing = targetMap.get(key) || { country, currency, amount: 0, fees: 0, entityId: entityInfo.entityId, entityName: entityInfo.entityName };
                existing.amount += amount;
                existing.fees += fees;
                targetMap.set(key, existing);
            }
        }

        const paymentsBreakdown: IPaymentsBreakdown = {
            recurring: Array.from(recurringMap.values()),
            oneTime: Array.from(oneTimeMap.values()),
        };

        // === Customer Breakdown ===
        const totalCustomerMap = new Map<string, { country: string; count: number; active: number; deleted: number; entityId: string; entityName: string }>();
        const newCustomerMap = new Map<string, { country: string; count: number; entityId: string; entityName: string }>();

        for (const { connectionId, customers } of customersResults) {
            const entityInfo = connEntityMap.get(connectionId) || { entityId: connectionId, entityName: "Unknown" };

            for (const customer of customers) {
                const country = customer.address?.country || "Unknown";
                const isDeleted = !!customer.deleted;
                const key = `${entityInfo.entityId}_${country}`;

                const totalExisting = totalCustomerMap.get(key) || { country, count: 0, active: 0, deleted: 0, entityId: entityInfo.entityId, entityName: entityInfo.entityName };
                totalExisting.count += 1;
                if (isDeleted) {
                    totalExisting.deleted += 1;
                } else {
                    totalExisting.active += 1;
                }
                totalCustomerMap.set(key, totalExisting);

                if (customer.created >= from && customer.created <= to) {
                    const newExisting = newCustomerMap.get(key) || { country, count: 0, entityId: entityInfo.entityId, entityName: entityInfo.entityName };
                    newExisting.count += 1;
                    newCustomerMap.set(key, newExisting);
                }
            }
        }

        const customerBreakdown: ICustomerBreakdown = {
            total: Array.from(totalCustomerMap.values()),
            new: Array.from(newCustomerMap.values()),
        };

        // === Refunds Breakdown ===
        const refundsMap = new Map<string, { country: string; currency: string; count: number; amount: number; entityId: string; entityName: string }>();

        for (const { connectionId, refunds } of refundsResults) {
            const entityInfo = connEntityMap.get(connectionId) || { entityId: connectionId, entityName: "Unknown" };

            for (const refund of refunds) {
                const charge = typeof refund.charge === 'object' && refund.charge !== null ? refund.charge as Stripe.Charge : null;
                const country = charge?.payment_method_details?.card?.country || "Unknown";
                const currency = refund.currency.toUpperCase();
                const key = `${entityInfo.entityId}_${country}_${currency}`;

                const existing = refundsMap.get(key) || { country, currency, count: 0, amount: 0, entityId: entityInfo.entityId, entityName: entityInfo.entityName };
                existing.count += 1;
                existing.amount += refund.amount / 100;
                refundsMap.set(key, existing);
            }
        }

        const refundsBreakdown: IRefundsBreakdown = {
            gained: Array.from(refundsMap.values()),
        };

        // === Products Breakdown ===
        const productStatsMap = new Map<string, { productId: string; productName: string; country: string; currency: string; revenue: number; customers: number; entityId: string; entityName: string }>();

        for (const { connectionId, invoices } of invoicesResults) {
            const entityInfo = connEntityMap.get(connectionId) || { entityId: connectionId, entityName: "Unknown" };
            const productsForConn = productsResults.find(p => p.connectionId === connectionId)?.products || [];
            const productNameMap = new Map<string, string>();
            for (const product of productsForConn) {
                productNameMap.set(product.id, product.name);
            }

            const productCustomerSets = new Map<string, Set<string>>();

            for (const invoice of invoices) {
                if (invoice.status !== 'paid') continue;
                const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

                for (const lineItem of invoice.lines?.data || []) {
                    const pricingDetails = lineItem.pricing?.price_details;
                    const price = typeof pricingDetails?.price === 'object' ? pricingDetails?.price : null;
                    const productId = price ? (typeof price.product === 'string' ? price.product : (price.product as Stripe.Product)?.id) : null;

                    if (!productId) continue;

                    const lineAmount = (lineItem.amount || 0) / 100;
                    const currency = (lineItem.currency || invoice.currency || "usd").toUpperCase();
                    const country = "Unknown";
                    const key = `${productId}_${entityInfo.entityId}_${country}_${currency}`;

                    const existing = productStatsMap.get(key) || {
                        productId,
                        productName: productNameMap.get(productId) || "Unknown Product",
                        country,
                        currency,
                        revenue: 0,
                        customers: 0,
                        entityId: entityInfo.entityId,
                        entityName: entityInfo.entityName,
                    };
                    existing.revenue += lineAmount;
                    productStatsMap.set(key, existing);

                    if (customerId) {
                        if (!productCustomerSets.has(key)) {
                            productCustomerSets.set(key, new Set());
                        }
                        productCustomerSets.get(key)!.add(customerId);
                    }
                }
            }

            for (const [key, customerSet] of productCustomerSets) {
                const existing = productStatsMap.get(key);
                if (existing) {
                    existing.customers = customerSet.size;
                }
            }
        }

        const productsBreakdown: IProductsBreakdown = {
            gained: Array.from(productStatsMap.values()),
        };

        const reportId = `cr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const report: IConsolidateReport = {
            id: reportId,
            paymentsBreakdown,
            customerBreakdown,
            refundsBreakdown,
            productsBreakdown,
            createdAt: Date.now(),
            from,
            to,
            status: "completed",
        };

        return { report, error: null };
    } catch (error) {
        console.error("Error generating consolidated report:", error);
        return {
            report: null,
            error: error instanceof Error ? error.message : "Failed to generate consolidated report",
        };
    }
}

export async function saveConsolidatedReport({
    organisationId,
    report,
}: {
    organisationId: string;
    report: IConsolidateReport;
}): Promise<{ success: boolean; error: string | null }> {
    try {
        const reportsPath = getConsolidatedReportsPath(organisationId);
        await firestoreAdmin
            .collection(reportsPath)
            .doc(report.id)
            .set(report);

        return { success: true, error: null };
    } catch (error) {
        console.error("Error saving consolidated report:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save consolidated report",
        };
    }
}

export async function deleteConsolidatedReport({
    organisationId,
    reportId,
}: {
    organisationId: string;
    reportId: string;
}): Promise<{ success: boolean; error: string | null }> {
    try {
        const reportsPath = getConsolidatedReportsPath(organisationId);
        await firestoreAdmin
            .collection(reportsPath)
            .doc(reportId)
            .delete();

        return { success: true, error: null };
    } catch (error) {
        console.error("Error deleting consolidated report:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete consolidated report",
        };
    }
}

export async function retrieveConsolidatedReports({
    organisationId,
}: {
    organisationId: string;
}): Promise<{ reports: IConsolidateReport[] | null; error: string | null }> {
    try {
        const reportsPath = getConsolidatedReportsPath(organisationId);
        const snapshot = await firestoreAdmin
            .collection(reportsPath)
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            return { reports: [], error: null };
        }

        const reports = snapshot.docs.map((doc) => doc.data() as IConsolidateReport);
        return { reports, error: null };
    } catch (error) {
        console.error("Error retrieving consolidated reports:", error);
        return {
            reports: null,
            error: error instanceof Error ? error.message : "Failed to retrieve consolidated reports",
        };
    }
}
