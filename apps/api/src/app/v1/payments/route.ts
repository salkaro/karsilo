import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, AuthResult } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getStripeConnections, getStripeConnection } from "@/lib/connections";
import { fetchPayments } from "@/lib/stripe";
import { parseCommonParams } from "@/lib/params";

export async function GET(request: NextRequest) {
    const authResult = await validateApiKey(request);
    if (authResult instanceof NextResponse) return authResult;
    const { orgId, apiKey } = authResult as AuthResult;

    const rateLimit = checkRateLimit(apiKey);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Rate limit exceeded", retryAfter: rateLimit.retryAfter },
            {
                status: 429,
                headers: {
                    "Retry-After": String(rateLimit.retryAfter),
                    "X-RateLimit-Limit": String(rateLimit.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(rateLimit.reset),
                },
            }
        );
    }

    const { accountId, startingAfter } = parseCommonParams(request);

    try {
        if (accountId) {
            const connection = await getStripeConnection(orgId, accountId);
            if (!connection || !connection.accessToken) {
                return NextResponse.json(
                    { error: "Connection not found" },
                    { status: 404 }
                );
            }

            const result = await fetchPayments(connection.accessToken, startingAfter);
            return NextResponse.json({
                data: { [connection.id]: result.data },
                hasMore: { [connection.id]: result.hasMore },
                meta: {
                    connections: [{ id: connection.id, stripeAccountId: connection.stripeAccountId, entityId: connection.entityId }],
                },
            });
        }

        const connections = await getStripeConnections(orgId);
        const data: Record<string, unknown[]> = {};
        const hasMore: Record<string, boolean> = {};
        const meta = connections.map((c) => ({ id: c.id, stripeAccountId: c.stripeAccountId, entityId: c.entityId }));

        await Promise.all(
            connections.map(async (connection) => {
                if (!connection.accessToken) return;
                const result = await fetchPayments(connection.accessToken, startingAfter);
                data[connection.id] = result.data;
                hasMore[connection.id] = result.hasMore;
            })
        );

        return NextResponse.json({ data, hasMore, meta: { connections: meta } });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { error: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}