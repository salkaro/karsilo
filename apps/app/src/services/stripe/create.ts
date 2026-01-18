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
}): Promise<{ report: Stripe.Reporting.ReportRun | null; error: string | null }> {
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
            report,
            error: null,
        };
    } catch (error) {
        console.error("Error creating Stripe report:", error);
        return {
            report: null,
            error: error instanceof Error ? error.message : "Failed to create report",
        };
    }
}