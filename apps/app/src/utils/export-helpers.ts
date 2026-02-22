import { IConsolidateReport } from "@repo/models";
import { ExportOptions } from "@/types/export";

function escapeCSVField(value: string | number, delimiter: string): string {
    const str = String(value);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function formatDate(timestamp: number): string {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    return new Date(ts).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

function formatDateForFilename(timestamp: number): string {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateCSV(report: IConsolidateReport, options?: ExportOptions['csv']): string {
    const delimiter = options?.delimiter ?? ',';
    const includeHeaders = options?.includeHeaders ?? true;
    const rows: string[] = [];

    const row = (...fields: (string | number)[]) =>
        fields.map(f => escapeCSVField(f, delimiter)).join(delimiter);

    // Payments - Recurring
    if (includeHeaders) {
        rows.push(row('Section', 'Entity', 'Country', 'Currency', 'Amount', 'Fees'));
    }
    for (const r of report.paymentsBreakdown.recurring) {
        rows.push(row('Recurring Payments', r.entityName, r.country, r.currency || 'USD', r.amount.toFixed(2), r.fees.toFixed(2)));
    }
    for (const r of report.paymentsBreakdown.oneTime) {
        rows.push(row('One-Time Payments', r.entityName, r.country, r.currency || 'USD', r.amount.toFixed(2), r.fees.toFixed(2)));
    }

    // Empty separator row
    rows.push('');

    // Customers
    if (includeHeaders) {
        rows.push(row('Section', 'Entity', 'Country', 'Total', 'Active', 'Deleted'));
    }
    for (const c of report.customerBreakdown.total) {
        rows.push(row('Total Customers', c.entityName, c.country, c.count, c.active, c.deleted));
    }

    rows.push('');

    if (includeHeaders) {
        rows.push(row('Section', 'Entity', 'Country', 'Count'));
    }
    for (const c of report.customerBreakdown.new) {
        rows.push(row('New Customers', c.entityName, c.country, c.count));
    }

    // Refunds
    rows.push('');
    if (includeHeaders) {
        rows.push(row('Section', 'Entity', 'Country', 'Currency', 'Count', 'Amount'));
    }
    for (const r of report.refundsBreakdown.gained) {
        rows.push(row('Refunds', r.entityName, r.country, r.currency || 'USD', r.count, r.amount.toFixed(2)));
    }

    // Products
    rows.push('');
    if (includeHeaders) {
        rows.push(row('Section', 'Product', 'Entity', 'Country', 'Currency', 'Revenue', 'Customers'));
    }
    for (const p of report.productsBreakdown.gained) {
        rows.push(row('Products', p.productName, p.entityName, p.country, p.currency || 'USD', p.revenue.toFixed(2), p.customers));
    }

    return rows.join('\n');
}

export function generateQuickBooksIIF(report: IConsolidateReport, options?: ExportOptions['iif']): string {
    const includeRecurring = options?.includeRecurring ?? true;
    const includeOneTime = options?.includeOneTime ?? true;
    const lines: string[] = [];

    // IIF Header
    lines.push('!TRNS\tTRNSTYPE\tDATE\tACCNT\tAMOUNT\tMEMO');
    lines.push('!SPL\tTRNSTYPE\tDATE\tACCNT\tAMOUNT\tMEMO');
    lines.push('!ENDTRNS');

    const fromDate = formatDate(report.from);
    const toDate = formatDate(report.to);
    const period = `${fromDate} - ${toDate}`;

    if (includeRecurring) {
        for (const r of report.paymentsBreakdown.recurring) {
            const netAmount = r.amount - r.fees;
            const currency = r.currency || 'USD';
            lines.push(`TRNS\tDEPOSIT\t${fromDate}\tBanking\t${netAmount.toFixed(2)}\tRecurring Payment - ${r.entityName} (${r.country}, ${currency}) ${period}`);
            lines.push(`SPL\tDEPOSIT\t${fromDate}\tRevenue\t${(-r.amount).toFixed(2)}\tRecurring Revenue - ${r.entityName} (${currency})`);
            if (r.fees > 0) {
                lines.push(`SPL\tDEPOSIT\t${fromDate}\tProcessing Fees\t${r.fees.toFixed(2)}\tFees - ${r.entityName}`);
            }
            lines.push('ENDTRNS');
        }
    }

    if (includeOneTime) {
        for (const r of report.paymentsBreakdown.oneTime) {
            const netAmount = r.amount - r.fees;
            const currency = r.currency || 'USD';
            lines.push(`TRNS\tDEPOSIT\t${fromDate}\tBanking\t${netAmount.toFixed(2)}\tOne-Time Payment - ${r.entityName} (${r.country}, ${currency}) ${period}`);
            lines.push(`SPL\tDEPOSIT\t${fromDate}\tRevenue\t${(-r.amount).toFixed(2)}\tOne-Time Revenue - ${r.entityName} (${currency})`);
            if (r.fees > 0) {
                lines.push(`SPL\tDEPOSIT\t${fromDate}\tProcessing Fees\t${r.fees.toFixed(2)}\tFees - ${r.entityName}`);
            }
            lines.push('ENDTRNS');
        }
    }

    return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function formatReportFilename(report: IConsolidateReport, format: string): string {
    const from = formatDateForFilename(report.from);
    const to = formatDateForFilename(report.to);
    return `consolidated-report-${from}-to-${to}.${format}`;
}
