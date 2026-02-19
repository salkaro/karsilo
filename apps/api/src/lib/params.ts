import { NextRequest } from "next/server";

export interface CommonParams {
    accountId?: string;
    startingAfter?: string;
    from?: number;
    to?: number;
    limit?: number;
}

export function parseCommonParams(request: NextRequest): CommonParams {
    const { searchParams } = new URL(request.url);

    const accountId = searchParams.get("accountId") || undefined;
    const startingAfter = searchParams.get("starting_after") || undefined;

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const limitStr = searchParams.get("limit");

    const from = fromStr ? parseInt(fromStr, 10) : undefined;
    const to = toStr ? parseInt(toStr, 10) : undefined;
    const limit = limitStr ? Math.min(parseInt(limitStr, 10), 100) : undefined;

    return {
        accountId,
        startingAfter,
        from: from && !isNaN(from) ? from : undefined,
        to: to && !isNaN(to) ? to : undefined,
        limit: limit && !isNaN(limit) ? limit : undefined,
    };
}