import Stripe from "stripe";
import { isProduction } from "@repo/constants";

export { Stripe };

export function getStripeClient(accessToken?: string): Stripe {
    if (accessToken) {
        return new Stripe(accessToken);
    }

    const stripeAPIKey = isProduction
        ? process.env.STRIPE_API_KEY
        : process.env.TEST_STRIPE_API_KEY;

    if (!stripeAPIKey) {
        throw new Error("Stripe API key not found");
    }

    return new Stripe(stripeAPIKey);
}

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
