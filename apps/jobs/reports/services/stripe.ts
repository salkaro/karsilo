/**
 * Stripe functions for generating reports
 */

import { getStripeClient, type ReportType } from "../lib/stripe.js";
import type { IConnection } from "@repo/models";

export interface ReportResult {
    connectionId: string;
    reportRunId: string;
    reportType: ReportType;
    status: string;
    error?: string;
}

export interface CreateReportParams {
    connection: IConnection;
    reportType: ReportType;
    intervalStart: number; // Unix timestamp in seconds
    intervalEnd: number;   // Unix timestamp in seconds
}

/**
 * Creates a Stripe report run for a specific connection
 */
async function createReportRun({
    connection,
    reportType,
    intervalStart,
    intervalEnd,
}: CreateReportParams): Promise<ReportResult> {
    try {
        if (!connection.accessToken) {
            return {
                connectionId: connection.id,
                reportRunId: "",
                reportType,
                status: "error",
                error: "No access token available for connection",
            };
        }

        const stripe = getStripeClient(connection.accessToken);

        const reportRun = await stripe.reporting.reportRuns.create({
            report_type: reportType,
            parameters: {
                interval_start: intervalStart,
                interval_end: intervalEnd,
            },
        });

        return {
            connectionId: connection.id,
            reportRunId: reportRun.id,
            reportType,
            status: reportRun.status,
        };
    } catch (error) {
        return {
            connectionId: connection.id,
            reportRunId: "",
            reportType,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Gets the date range for the previous week (Monday to Sunday)
 */
function getWeeklyDateRange(date = new Date()): { start: number; end: number } {
    const utcDate = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ));

    // Get previous Monday (start of last week)
    const dayOfWeek = utcDate.getUTCDay();
    const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const lastMonday = new Date(utcDate);
    lastMonday.setUTCDate(utcDate.getUTCDate() - daysToLastMonday - 7);
    lastMonday.setUTCHours(0, 0, 0, 0);

    // Get previous Sunday (end of last week)
    const lastSunday = new Date(lastMonday);
    lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
    lastSunday.setUTCHours(23, 59, 59, 999);

    return {
        start: Math.floor(lastMonday.getTime() / 1000),
        end: Math.floor(lastSunday.getTime() / 1000),
    };
}

/**
 * Gets the date range for the previous month
 */
function getMonthlyDateRange(date = new Date()): { start: number; end: number } {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    // Previous month start
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const start = new Date(Date.UTC(prevYear, prevMonth, 1, 0, 0, 0, 0));

    // Previous month end (last day)
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    return {
        start: Math.floor(start.getTime() / 1000),
        end: Math.floor(end.getTime() / 1000),
    };
}

/**
 * Gets the date range for the previous quarter
 */
function getQuarterlyDateRange(date = new Date()): { start: number; end: number } {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    // Determine current quarter (0-3)
    const currentQuarter = Math.floor(month / 3);

    // Previous quarter
    const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
    const prevYear = currentQuarter === 0 ? year - 1 : year;

    // Quarter start months: Q0=Jan(0), Q1=Apr(3), Q2=Jul(6), Q3=Oct(9)
    const quarterStartMonth = prevQuarter * 3;
    const quarterEndMonth = quarterStartMonth + 2;

    const start = new Date(Date.UTC(prevYear, quarterStartMonth, 1, 0, 0, 0, 0));

    // Last day of the quarter
    const end = new Date(Date.UTC(prevYear, quarterEndMonth + 1, 0, 23, 59, 59, 999));

    return {
        start: Math.floor(start.getTime() / 1000),
        end: Math.floor(end.getTime() / 1000),
    };
}

/**
 * Gets the date range for the previous year
 */
function getYearlyDateRange(date = new Date()): { start: number; end: number } {
    const prevYear = date.getUTCFullYear() - 1;

    const start = new Date(Date.UTC(prevYear, 0, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(prevYear, 11, 31, 23, 59, 59, 999));

    return {
        start: Math.floor(start.getTime() / 1000),
        end: Math.floor(end.getTime() / 1000),
    };
}

/**
 * Default report types for each period
 */
const DEFAULT_REPORT_TYPES: ReportType[] = [
    "balance_change_from_activity.summary.1",
    "payout_reconciliation.summary.1",
];

/**
 * Creates weekly reports for a connection
 */
export async function createWeeklyReport(
    connection: IConnection,
    reportTypes: ReportType[] = DEFAULT_REPORT_TYPES
): Promise<ReportResult[]> {
    const { start, end } = getWeeklyDateRange();
    const results: ReportResult[] = [];

    for (const reportType of reportTypes) {
        const result = await createReportRun({
            connection,
            reportType,
            intervalStart: start,
            intervalEnd: end,
        });
        results.push(result);
    }

    return results;
}

/**
 * Creates monthly reports for a connection
 */
export async function createMonthlyReport(
    connection: IConnection,
    reportTypes: ReportType[] = DEFAULT_REPORT_TYPES
): Promise<ReportResult[]> {
    const { start, end } = getMonthlyDateRange();
    const results: ReportResult[] = [];

    for (const reportType of reportTypes) {
        const result = await createReportRun({
            connection,
            reportType,
            intervalStart: start,
            intervalEnd: end,
        });
        results.push(result);
    }

    return results;
}

/**
 * Creates quarterly reports for a connection
 */
export async function createQuarterlyReport(
    connection: IConnection,
    reportTypes: ReportType[] = DEFAULT_REPORT_TYPES
): Promise<ReportResult[]> {
    const { start, end } = getQuarterlyDateRange();
    const results: ReportResult[] = [];

    for (const reportType of reportTypes) {
        const result = await createReportRun({
            connection,
            reportType,
            intervalStart: start,
            intervalEnd: end,
        });
        results.push(result);
    }

    return results;
}

/**
 * Creates yearly reports for a connection
 */
export async function createYearlyReport(
    connection: IConnection,
    reportTypes: ReportType[] = DEFAULT_REPORT_TYPES
): Promise<ReportResult[]> {
    const { start, end } = getYearlyDateRange();
    const results: ReportResult[] = [];

    for (const reportType of reportTypes) {
        const result = await createReportRun({
            connection,
            reportType,
            intervalStart: start,
            intervalEnd: end,
        });
        results.push(result);
    }

    return results;
}

// Export date range functions for testing
export {
    getWeeklyDateRange,
    getMonthlyDateRange,
    getQuarterlyDateRange,
    getYearlyDateRange,
};
