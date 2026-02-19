import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, AuthResult } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getStripeConnections } from "@/lib/connections";

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

    try {
        const connections = await getStripeConnections(orgId);

        const accounts = connections.map((c) => ({
            id: c.id,
            entityId: c.entityId,
            status: c.status,
            stripeAccountId: c.stripeAccountId,
            connectedAt: c.connectedAt,
        }));

        return NextResponse.json({ data: accounts });
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return NextResponse.json(
            { error: "Failed to fetch accounts" },
            { status: 500 }
        );
    }
}