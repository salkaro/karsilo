export function formatCurrency(amount: number, currency?: string) {
    if (!isFinite(amount)) return "0";

    const abs = Math.abs(amount);

    const formatCompact = (value: number, suffix: string) =>
        `${value.toFixed(value >= 10 ? 0 : 1)}${suffix}`;

    let compactValue: string | null = null;

    if (abs >= 1_000_000_000_000) {
        compactValue = formatCompact(amount / 1_000_000_000_000, "T");
    } else if (abs >= 1_000_000_000) {
        compactValue = formatCompact(amount / 1_000_000_000, "B");
    } else if (abs >= 1_000_000) {
        compactValue = formatCompact(amount / 1_000_000, "M");
    } else if (abs >= 1_000) {
        compactValue = formatCompact(amount / 1_000, "K");
    }

    // No currency → just compacted number
    if (!currency) {
        return compactValue ?? amount.toFixed(2);
    }

    // Small numbers → normal currency formatting
    if (!compactValue) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }

    // Large numbers → currency symbol + compacted value
    const symbol = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .formatToParts(0)
        .find(p => p.type === "currency")?.value || "";

    return `${symbol}${compactValue}`;
}

export function formatYAxis(value: number) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`
    }
    return `${value}`
}

export function formatDateRange(filter: string) {
    const now = new Date();
    const nowUnix = Math.floor(now.getTime() / 1000);

    switch (filter) {
        case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return { from: Math.floor(monthAgo.getTime() / 1000), to: nowUnix };
        }
        case 'quarter': {
            const quarterAgo = new Date(now);
            quarterAgo.setMonth(quarterAgo.getMonth() - 3);
            return { from: Math.floor(quarterAgo.getTime() / 1000), to: nowUnix };
        }
        case 'year': {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return { from: Math.floor(yearAgo.getTime() / 1000), to: nowUnix };
        }
        default:
            return {};
    }
}

export function formatDateByTimeAgo(timestamp?: number | null) {
    if (!timestamp) return 'N/A';

    // If timestamp is in seconds (10 digits or less), convert to ms
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;

    return new Date(ts).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}