import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const entityId = searchParams.get("entityId");

        const stripeClientId = process.env.STRIPE_CLIENT_ID;
        const redirectUri = process.env.STRIPE_OAUTH_REDIRECT_URI;

        if (!stripeClientId || !redirectUri) {
            return NextResponse.json(
                { error: "Stripe OAuth is not configured" },
                { status: 500 }
            );
        }

        // Generate state parameter for CSRF protection (includes entityId if provided)
        const state = Buffer.from(
            JSON.stringify({
                userId: session.user.id,
                timestamp: Date.now(),
                entityId: entityId || null,
            })
        ).toString("base64");

        // Build Stripe OAuth URL
        const stripeAuthUrl = new URL("https://connect.stripe.com/oauth/authorize");
        stripeAuthUrl.searchParams.set("response_type", "code");
        stripeAuthUrl.searchParams.set("client_id", stripeClientId);
        stripeAuthUrl.searchParams.set("scope", "read_write");
        stripeAuthUrl.searchParams.set("redirect_uri", redirectUri);
        stripeAuthUrl.searchParams.set("state", state);

        return NextResponse.redirect(stripeAuthUrl.toString());
    } catch (error) {
        console.error("Error initiating Stripe OAuth:", error);
        return NextResponse.json(
            { error: "Failed to initiate OAuth flow" },
            { status: 500 }
        );
    }
}
