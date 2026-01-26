"use server";

import Stripe from "stripe";
import { retrieveConnectionByType, retrieveConnection } from "@/services/connections/retrieve";
import { ICustomer } from "@repo/models";
import { PlainReportRun } from "./create";

const LIMIT = 100;

export async function retrieveStripeCustomers({
    organisationId,
    startingAfter,
}: {
    organisationId: string;
    startingAfter?: string;
}): Promise<{ customers: ICustomer[] | null; hasMore: boolean; error: string | null }> {
    try {
        // Get the Stripe connection for this organization
        const connection = await retrieveConnectionByType({
            organisationId: organisationId,
            type: "stripe",
        });

        if (!connection || !connection.accessToken) {
            return {
                customers: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        // Initialize Stripe with the connected account's access token
        const stripe = new Stripe(connection.accessToken);

        // Retrieve customers from the connected Stripe account
        const customers = await stripe.customers.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        // Map Stripe customers to ICustomer format
        const mappedCustomers: ICustomer[] = customers.data.map((customer) => ({
            id: customer.id,
            name: customer.name || undefined,
            email: customer.email || undefined,
            phone: customer.phone || undefined,
            status: customer.deleted ? "deleted" : "active",
            country: customer.address?.country,
            currency: customer.currency || undefined,
            createdAt: customer.created,
        }));

        return {
            customers: mappedCustomers,
            hasMore: customers.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe customers:", error);
        return {
            customers: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve customers",
        };
    }
}

export async function retrieveStripePayments({
    organisationId,
    connectionId,
    startingAfter,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
}): Promise<{ payments: Stripe.Charge[] | null; hasMore: boolean; error: string | null }> {
    try {
        // Get the specific Stripe connection by connectionId
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                payments: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        // Initialize Stripe with the connected account's access token
        const stripe = new Stripe(connection.accessToken);

        // Retrieve charges (payments) from the connected Stripe account
        const charges = await stripe.charges.list({
            limit: LIMIT,
            expand: ['data.customer', 'data.invoice'],
            starting_after: startingAfter,
        });

        return {
            payments: charges.data,
            hasMore: charges.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe payments:", error);
        return {
            payments: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve payments",
        };
    }
}

export async function retrieveStripeSubscriptions({
    organisationId,
    startingAfter,
}: {
    organisationId: string;
    startingAfter?: string;
}): Promise<{ subscriptions: Stripe.Subscription[] | null; hasMore: boolean; error: string | null }> {
    try {
        // Get the Stripe connection for this organization
        const connection = await retrieveConnectionByType({
            organisationId: organisationId,
            type: "stripe",
        });

        if (!connection || !connection.accessToken) {
            return {
                subscriptions: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        // Initialize Stripe with the connected account's access token
        const stripe = new Stripe(connection.accessToken);

        // Retrieve subscriptions
        const subscriptions = await stripe.subscriptions.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        return {
            subscriptions: subscriptions.data,
            hasMore: subscriptions.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe subscriptions:", error);
        return {
            subscriptions: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve subscriptions",
        };
    }
}

export async function retrieveStripeInvoices({
    organisationId,
    connectionId,
    startingAfter,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
}): Promise<{ invoices: Stripe.Invoice[] | null; hasMore: boolean; error: string | null }> {
    try {
        // Get the Stripe connection for this organization
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                invoices: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        // Initialize Stripe with the connected account's access token
        const stripe = new Stripe(connection.accessToken);

        // Retrieve invoices
        const invoices = await stripe.invoices.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        return {
            invoices: invoices.data,
            hasMore: invoices.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe invoices:", error);
        return {
            invoices: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve invoices",
        };
    }
}

export async function retrieveStripeBalanceTransactions({
    organisationId,
    connectionId,
    startingAfter,
    created,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
    created?: { gte?: number; lte?: number };
}): Promise<{ balanceTransactions: Stripe.BalanceTransaction[] | null; hasMore: boolean; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                balanceTransactions: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const balanceTransactions = await stripe.balanceTransactions.list({
            limit: LIMIT,
            starting_after: startingAfter,
            created: created,
        });

        return {
            balanceTransactions: balanceTransactions.data,
            hasMore: balanceTransactions.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe balance transactions:", error);
        return {
            balanceTransactions: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve balance transactions",
        };
    }
}

export interface PlainBalance {
    available: Array<{ amount: number; currency: string; }>;
    pending: Array<{ amount: number; currency: string; }>;
}

function serializeBalance(balance: Stripe.Balance): PlainBalance {
    return {
        available: balance.available.map(b => ({
            amount: b.amount,
            currency: b.currency,
        })),
        pending: balance.pending.map(b => ({
            amount: b.amount,
            currency: b.currency,
        })),
    };
}

export async function retrieveStripeBalance({
    organisationId,
    connectionId,
}: {
    organisationId: string;
    connectionId: string;
}): Promise<{ balance: PlainBalance | null; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                balance: null,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);
        const balance = await stripe.balance.retrieve();

        return {
            balance: serializeBalance(balance),
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe balance:", error);
        return {
            balance: null,
            error: error instanceof Error ? error.message : "Failed to retrieve balance",
        };
    }
}

function serializeReportRun(report: Stripe.Reporting.ReportRun): PlainReportRun {
    return {
        id: report.id,
        object: report.object,
        created: report.created,
        error: report.error ?? null,
        livemode: report.livemode,
        parameters: {
            interval_start: report.parameters?.interval_start,
            interval_end: report.parameters?.interval_end,
            columns: report.parameters?.columns,
            connected_account: report.parameters?.connected_account,
            currency: report.parameters?.currency,
            reporting_category: report.parameters?.reporting_category,
            timezone: report.parameters?.timezone,
        },
        report_type: report.report_type,
        result: report.result ? {
            id: report.result.id,
            url: report.result.url ?? null,
        } : null,
        status: report.status,
        succeeded_at: report.succeeded_at ?? null,
    };
}

export async function retrieveStripeReports({
    organisationId,
    connectionId,
    startingAfter,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
}): Promise<{ reports: PlainReportRun[] | null; hasMore: boolean; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                reports: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const reports = await stripe.reporting.reportRuns.list({
            limit: LIMIT,
            starting_after: startingAfter,
        });

        return {
            reports: reports.data.map(serializeReportRun),
            hasMore: reports.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe reports:", error);
        return {
            reports: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve reports",
        };
    }
}

export async function retrieveStripeProducts({
    organisationId,
    connectionId,
    startingAfter,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
}): Promise<{ products: Stripe.Product[] | null; hasMore: boolean; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                products: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const products = await stripe.products.list({
            limit: LIMIT,
            starting_after: startingAfter,
            expand: ['data.default_price'],
        });

        return {
            products: products.data,
            hasMore: products.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe products:", error);
        return {
            products: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve products",
        };
    }
}

export async function retrieveStripePrices({
    organisationId,
    connectionId,
    productId,
    startingAfter,
}: {
    organisationId: string;
    connectionId: string;
    productId?: string;
    startingAfter?: string;
}): Promise<{ prices: Stripe.Price[] | null; hasMore: boolean; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                prices: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const prices = await stripe.prices.list({
            limit: LIMIT,
            starting_after: startingAfter,
            product: productId,
            expand: ['data.product'],
        });

        return {
            prices: prices.data,
            hasMore: prices.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe prices:", error);
        return {
            prices: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve prices",
        };
    }
}

export async function retrieveStripeRefunds({
    organisationId,
    connectionId,
    startingAfter,
    created,
}: {
    organisationId: string;
    connectionId: string;
    startingAfter?: string;
    created?: { gte?: number; lte?: number };
}): Promise<{ refunds: Stripe.Refund[] | null; hasMore: boolean; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                refunds: null,
                hasMore: false,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const refunds = await stripe.refunds.list({
            limit: LIMIT,
            starting_after: startingAfter,
            created: created,
            expand: ['data.charge', 'data.payment_intent'],
        });

        return {
            refunds: refunds.data,
            hasMore: refunds.data.length === LIMIT,
            error: null,
        };
    } catch (error) {
        console.error("Error retrieving Stripe refunds:", error);
        return {
            refunds: null,
            hasMore: false,
            error: error instanceof Error ? error.message : "Failed to retrieve refunds",
        };
    }
}

