/**
 * All checks are done in UTC to avoid timezone bugs.
 */

export function isStartOfMonth(date = new Date()): boolean {
    return (
        date.getUTCDate() === 1 &&
        date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0
    );
}

export function isStartOfQuarter(date = new Date()): boolean {
    const month = date.getUTCMonth(); // 0-based
    const isQuarterMonth = month === 0 || month === 3 || month === 6 || month === 9;

    return (
        isQuarterMonth &&
        date.getUTCDate() === 1 &&
        date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0
    );
}

export function isStartOfYear(date = new Date()): boolean {
    return (
        date.getUTCMonth() === 0 &&
        date.getUTCDate() === 1 &&
        date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0
    );
}