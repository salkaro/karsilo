/**
 * Stripe Report Generation Cron Job
 *
 * Flow:
 * 1. Cron job runs weekly (every Monday at 00:00 UTC)
 * 2. Retrieve all organisations with Stripe connections
 * 3. For each organisation, based on subscription plan:
 *    - Starter plans (growth): Weekly reports only
 *    - Growth plans (essential, pro): Weekly + Monthly/Quarterly/Yearly (when applicable)
 * 4. Generate reports via Stripe Reporting API
 */

export const runtime = "nodejs";

import type { SubscriptionType, IConnection } from "@repo/models";
import { isStartOfMonth, isStartOfQuarter, isStartOfYear } from "../lib/date-ranges.js";
import { retrieveOrganisationsWithStripeConnections, type OrganisationWithConnections } from "../services/firebase.js";
import {
    createWeeklyReport,
    createMonthlyReport,
    createQuarterlyReport,
    createYearlyReport,
    type ReportResult,
} from "../services/stripe.js";

/**
 * Plan tiers for report generation
 * - Starter: starter plan - weekly reports only
 * - Growth: growth, pro plans - weekly + monthly/quarterly/yearly
 */
const STARTER_PLANS: SubscriptionType[] = ["starter"];
const GROWTH_PLANS: SubscriptionType[] = ["growth", "pro"];
const ALL_PAID_PLANS: SubscriptionType[] = [...STARTER_PLANS, ...GROWTH_PLANS];

interface ReportJobResult {
    organisationId: string;
    organisationName: string | null | undefined;
    connectionId: string;
    reports: ReportResult[];
}

interface JobSummary {
    success: boolean;
    timestamp: string;
    reportsGenerated: {
        weekly: number;
        monthly: number;
        quarterly: number;
        yearly: number;
    };
    results: ReportJobResult[];
    errors: string[];
}

/**
 * Determines which reports to generate based on subscription plan and date
 */
function getReportsToGenerate(
    subscription: SubscriptionType | null | undefined,
    date = new Date()
): {
    weekly: boolean;
    monthly: boolean;
    quarterly: boolean;
    yearly: boolean;
} {
    const plan = subscription || "free";

    // Free plans don't get reports
    if (plan === "free") {
        return { weekly: false, monthly: false, quarterly: false, yearly: false };
    }

    // Starter plans (growth) only get weekly reports
    if (STARTER_PLANS.includes(plan)) {
        return { weekly: true, monthly: false, quarterly: false, yearly: false };
    }

    // Growth plans (essential, pro) get all applicable reports
    if (GROWTH_PLANS.includes(plan)) {
        return {
            weekly: true,
            monthly: isStartOfMonth(date),
            quarterly: isStartOfQuarter(date),
            yearly: isStartOfYear(date),
        };
    }

    return { weekly: false, monthly: false, quarterly: false, yearly: false };
}

/**
 * Processes a single connection and generates applicable reports
 */
async function processConnection(
    org: OrganisationWithConnections,
    connection: IConnection,
    reportsToGenerate: ReturnType<typeof getReportsToGenerate>
): Promise<ReportJobResult> {
    const result: ReportJobResult = {
        organisationId: org.organisation.id,
        organisationName: org.organisation.name,
        connectionId: connection.id,
        reports: [],
    };

    // Generate weekly reports
    if (reportsToGenerate.weekly) {
        const weeklyResults = await createWeeklyReport(connection);
        result.reports.push(...weeklyResults);
    }

    // Generate monthly reports
    if (reportsToGenerate.monthly) {
        const monthlyResults = await createMonthlyReport(connection);
        result.reports.push(...monthlyResults);
    }

    // Generate quarterly reports
    if (reportsToGenerate.quarterly) {
        const quarterlyResults = await createQuarterlyReport(connection);
        result.reports.push(...quarterlyResults);
    }

    // Generate yearly reports
    if (reportsToGenerate.yearly) {
        const yearlyResults = await createYearlyReport(connection);
        result.reports.push(...yearlyResults);
    }

    return result;
}

/**
 * Main handler for the cron job
 */
export async function GET(request: Request): Promise<Response> {
    const startTime = Date.now();
    const date = new Date();

    const summary: JobSummary = {
        success: true,
        timestamp: date.toISOString(),
        reportsGenerated: {
            weekly: 0,
            monthly: 0,
            quarterly: 0,
            yearly: 0,
        },
        results: [],
        errors: [],
    };

    try {
        // Verify cron secret (optional security measure)
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Retrieve all paid organisations with Stripe connections
        const organisationsWithConnections = await retrieveOrganisationsWithStripeConnections(ALL_PAID_PLANS);

        console.log(`Found ${organisationsWithConnections.length} organisations with Stripe connections`);

        // Process each organisation
        for (const org of organisationsWithConnections) {
            const reportsToGenerate = getReportsToGenerate(org.organisation.subscription, date);

            // Skip if no reports to generate
            if (!reportsToGenerate.weekly && !reportsToGenerate.monthly &&
                !reportsToGenerate.quarterly && !reportsToGenerate.yearly) {
                continue;
            }

            // Process each connection for this organisation
            for (const connection of org.connections) {
                try {
                    const result = await processConnection(org, connection, reportsToGenerate);
                    summary.results.push(result);

                    // Count successful reports
                    for (const report of result.reports) {
                        if (report.status !== "error") {
                            if (reportsToGenerate.weekly) summary.reportsGenerated.weekly++;
                            if (reportsToGenerate.monthly) summary.reportsGenerated.monthly++;
                            if (reportsToGenerate.quarterly) summary.reportsGenerated.quarterly++;
                            if (reportsToGenerate.yearly) summary.reportsGenerated.yearly++;
                        } else if (report.error) {
                            summary.errors.push(
                                `Connection ${connection.id}: ${report.error}`
                            );
                        }
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Unknown error";
                    summary.errors.push(`Connection ${connection.id}: ${errorMessage}`);
                    summary.success = false;
                }
            }
        }

        const duration = Date.now() - startTime;
        console.log(`Report generation completed in ${duration}ms`);
        console.log(`Generated: ${JSON.stringify(summary.reportsGenerated)}`);

        if (summary.errors.length > 0) {
            console.error(`Errors: ${summary.errors.join(", ")}`);
            summary.success = false;
        }

        return new Response(JSON.stringify(summary), {
            status: summary.success ? 200 : 207, // 207 Multi-Status for partial success
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Report generation failed: ${errorMessage}`);

        summary.success = false;
        summary.errors.push(errorMessage);

        return new Response(JSON.stringify(summary), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
