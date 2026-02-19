const MINUTE_LIMIT = 60;
const HOUR_LIMIT = 1000;
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const requestLog = new Map<string, number[]>();

export interface RateLimitResult {
    allowed: boolean;
    retryAfter?: number;
    limit: number;
    remaining: number;
    reset: number;
}

export function checkRateLimit(key: string): RateLimitResult {
    const now = Date.now();
    const timestamps = requestLog.get(key) || [];

    // Prune timestamps older than 1 hour
    const pruned = timestamps.filter((t) => now - t < HOUR_MS);

    // Check hour limit
    if (pruned.length >= HOUR_LIMIT) {
        const oldest = pruned[0];
        const retryAfter = Math.ceil((oldest + HOUR_MS - now) / 1000);
        requestLog.set(key, pruned);
        return {
            allowed: false,
            retryAfter,
            limit: HOUR_LIMIT,
            remaining: 0,
            reset: Math.ceil((oldest + HOUR_MS) / 1000),
        };
    }

    // Check minute limit
    const recentMinute = pruned.filter((t) => now - t < MINUTE_MS);
    if (recentMinute.length >= MINUTE_LIMIT) {
        const oldest = recentMinute[0];
        const retryAfter = Math.ceil((oldest + MINUTE_MS - now) / 1000);
        requestLog.set(key, pruned);
        return {
            allowed: false,
            retryAfter,
            limit: MINUTE_LIMIT,
            remaining: 0,
            reset: Math.ceil((oldest + MINUTE_MS) / 1000),
        };
    }

    // Allow the request
    pruned.push(now);
    requestLog.set(key, pruned);

    return {
        allowed: true,
        limit: MINUTE_LIMIT,
        remaining: MINUTE_LIMIT - recentMinute.length - 1,
        reset: Math.ceil((now + MINUTE_MS) / 1000),
    };
}