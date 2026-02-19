import { getStripeClient, Stripe } from "@repo/stripe";
import { ICustomer } from "@repo/models";

const LIMIT = 100;

// PlainReportRun type for serialized report data
export interface PlainReportRun {
    id: string;
    object: string;
    created: number;
    error: string | null;
    livemode: boolean;
    parameters: {
        interval_start?: number;
        interval_end?: number;
        columns?: string[];
        connected_account?: string;
        currency?: string;
        reporting_category?: string;
        timezone?: string;
    };
    report_type: string;
    result: {
        id: string;
        url: string | null;
    } | null;
    status: string;
    succeeded_at: number | null;
}

// PlainBalance type for serialized balance data
export interface PlainBalance {
    available: Array<{ amount: number; currency: string }>;
    pending: Array<{ amount: number; currency: string }>;
}

export async function fetchCustomers(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: ICustomer[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const customers = await stripe.customers.list({
        limit: LIMIT,
        starting_after: startingAfter,
    });

    const data: ICustomer[] = customers.data.map((customer) => ({
        id: customer.id,
        name: customer.name || undefined,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        status: customer.deleted ? "deleted" : "active",
        country: customer.address?.country,
        currency: customer.currency || undefined,
        createdAt: customer.created,
    }));

    return { data, hasMore: customers.data.length === LIMIT };
}

export async function fetchPayments(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: Stripe.Charge[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const charges = await stripe.charges.list({
        limit: LIMIT,
        expand: ["data.customer", "data.invoice"],
        starting_after: startingAfter,
    });

    return { data: charges.data, hasMore: charges.data.length === LIMIT };
}

export async function fetchProducts(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: Stripe.Product[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const products = await stripe.products.list({
        limit: LIMIT,
        starting_after: startingAfter,
        expand: ["data.default_price"],
    });

    return { data: products.data, hasMore: products.data.length === LIMIT };
}

export async function fetchPrices(
    accessToken: string,
    startingAfter?: string,
    productId?: string
): Promise<{ data: Stripe.Price[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const prices = await stripe.prices.list({
        limit: LIMIT,
        starting_after: startingAfter,
        product: productId,
        expand: ["data.product"],
    });

    return { data: prices.data, hasMore: prices.data.length === LIMIT };
}

export async function fetchRefunds(
    accessToken: string,
    startingAfter?: string,
    created?: { gte?: number; lte?: number }
): Promise<{ data: Stripe.Refund[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const refunds = await stripe.refunds.list({
        limit: LIMIT,
        starting_after: startingAfter,
        created,
        expand: ["data.charge", "data.payment_intent"],
    });

    return { data: refunds.data, hasMore: refunds.data.length === LIMIT };
}

export async function fetchBalanceTransactions(
    accessToken: string,
    startingAfter?: string,
    created?: { gte?: number; lte?: number }
): Promise<{ data: Stripe.BalanceTransaction[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const transactions = await stripe.balanceTransactions.list({
        limit: LIMIT,
        starting_after: startingAfter,
        created,
    });

    return { data: transactions.data, hasMore: transactions.data.length === LIMIT };
}

export async function fetchBalance(
    accessToken: string
): Promise<PlainBalance> {
    const stripe = getStripeClient(accessToken);
    const balance = await stripe.balance.retrieve();

    return {
        available: balance.available.map((b) => ({
            amount: b.amount,
            currency: b.currency,
        })),
        pending: balance.pending.map((b) => ({
            amount: b.amount,
            currency: b.currency,
        })),
    };
}

export async function fetchSubscriptions(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: Stripe.Subscription[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const subscriptions = await stripe.subscriptions.list({
        limit: LIMIT,
        starting_after: startingAfter,
    });

    return { data: subscriptions.data, hasMore: subscriptions.data.length === LIMIT };
}

export async function fetchInvoices(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: Stripe.Invoice[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const invoices = await stripe.invoices.list({
        limit: LIMIT,
        starting_after: startingAfter,
    });

    return { data: invoices.data, hasMore: invoices.data.length === LIMIT };
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
        result: report.result
            ? {
                  id: report.result.id,
                  url: report.result.url ?? null,
              }
            : null,
        status: report.status,
        succeeded_at: report.succeeded_at ?? null,
    };
}

export async function fetchReports(
    accessToken: string,
    startingAfter?: string
): Promise<{ data: PlainReportRun[]; hasMore: boolean }> {
    const stripe = getStripeClient(accessToken);
    const reports = await stripe.reporting.reportRuns.list({
        limit: LIMIT,
        starting_after: startingAfter,
    });

    return {
        data: reports.data.map(serializeReportRun),
        hasMore: reports.data.length === LIMIT,
    };
}