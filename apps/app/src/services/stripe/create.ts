"use server";

import { root, isProduction } from '@repo/constants';
import Stripe from 'stripe';


export async function createBillingPortalUrl({ customerId }: { customerId: string }) {
    const stripeAPIKey = isProduction ? process.env.STRIPE_API_KEY as string : process.env.TEST_STRIPE_API_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const billingPortal = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${root}`
        })

        return billingPortal["url"]
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};



export async function createStripeCustomer({ email }: { email: string }) {
    const stripeAPIKey = isProduction ? process.env.STRIPE_API_KEY as string : process.env.TEST_STRIPE_API_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        let customer;

        // If customerId was not provided or customer was not found, check by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
            return customer.id;
        } else {
            // Create a new customer since one doesn't exist with the provided email
            customer = await stripe.customers.create({
                email: email
            });
            return customer.id;
        }
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};


export async function createCustomerSession({ customerId }: { customerId: string }) {
    const stripeAPIKey = isProduction ? process.env.STRIPE_API_KEY as string: process.env.TEST_STRIPE_API_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const session = await stripe.customerSessions.create({
            customer: customerId,
            components: { pricing_table: { enabled: true } },
        })

        return session.client_secret;
    } catch (error) {
        console.error('Error creating customer session:', error);
        throw error;
    }
}

import { retrieveConnection } from "@/services/connections/retrieve";

export type ReportType =
    | "balance_change_from_activity.itemized.1"
    | "balance_change_from_activity.itemized.2"
    | "balance_change_from_activity.itemized.3"
    | "balance_change_from_activity.summary.1"
    | "balance.summary.1"
    | "payout_reconciliation.itemized.1"
    | "payout_reconciliation.itemized.2"
    | "payout_reconciliation.itemized.3"
    | "payout_reconciliation.itemized.4"
    | "payout_reconciliation.itemized.5"
    | "payout_reconciliation.summary.1"
    | "payouts.itemized.1"
    | "payouts.itemized.2"
    | "payouts.itemized.3"
    | "payouts.summary.1"
    | "ending_balance_reconciliation.itemized.4"
    | "connected_account_balance_change_from_activity.itemized.2"
    | "connected_account_balance_change_from_activity.summary.1"
    | "connected_account_payout_reconciliation.itemized.5"
    | "connected_account_payout_reconciliation.summary.1"
    | "connected_account_ending_balance_reconciliation.itemized.4";

// Plain object representation of a Stripe report run for serialization
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

export async function createStripeReport({
    organisationId,
    connectionId,
    reportType,
    intervalStart,
    intervalEnd,
}: {
    organisationId: string;
    connectionId: string;
    reportType: ReportType;
    intervalStart: number; // Unix timestamp
    intervalEnd: number;   // Unix timestamp
}): Promise<{ report: PlainReportRun | null; error: string | null }> {
    try {
        const connection = await retrieveConnection({
            organisationId: organisationId,
            connectionId: connectionId,
        });

        if (!connection || !connection.accessToken) {
            return {
                report: null,
                error: "No Stripe connection found",
            };
        }

        const stripe = new Stripe(connection.accessToken);

        const report = await stripe.reporting.reportRuns.create({
            report_type: reportType,
            parameters: {
                interval_start: intervalStart,
                interval_end: intervalEnd,
            },
        });

        return {
            report: serializeReportRun(report),
            error: null,
        };
    } catch (error) {
        console.error("Error creating Stripe report:", error);

        // Extract user-friendly error message from Stripe errors
        let errorMessage = "Failed to create report";

        if (error instanceof Stripe.errors.StripeError) {
            const stripeError = error as Stripe.errors.StripeInvalidRequestError;

            // Check for data availability errors (interval_start too early)
            if (stripeError.param === "parameters.interval_start" && stripeError.message) {
                // Extract the available start date from the error message
                const dateMatch = stripeError.message.match(/available starting at (\d{4}-\d{2}-\d{2})/);
                if (dateMatch) {
                    const availableDate = dateMatch[1];
                    errorMessage = `Data for this report type is only available from ${availableDate}. Please select a more recent date range.`;
                } else {
                    errorMessage = "The selected date range is too early. Please select a more recent start date.";
                }
            } else if (stripeError.message) {
                errorMessage = stripeError.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            report: null,
            error: errorMessage,
        };
    }
}