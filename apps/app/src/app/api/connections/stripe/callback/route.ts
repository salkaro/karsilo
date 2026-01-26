// External Imports
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Local Imports
import { root, isProduction } from "@repo/constants";
import { retrieveUserAdmin } from "@/services/firebase/admin-retrieve";
import { IStripeOAuthToken } from "@repo/models";
import { createConnection } from "@/services/connections/create";
import { updateEntity } from "@/services/firebase/entities/update";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Handle OAuth errors
        if (error) {
            console.error("Stripe OAuth error:", error, errorDescription);
            return NextResponse.redirect(
                new URL(
                    `/connections?error=${encodeURIComponent(errorDescription || error)}`,
                    request.url
                )
            );
        }

        if (!code || !state) {
            return NextResponse.redirect(
                new URL("/connections?error=Invalid OAuth response", request.url)
            );
        }

        // Verify state parameter
        let stateData: { userId: string; timestamp: number; entityId?: string | null };
        try {
            stateData = JSON.parse(Buffer.from(state, "base64").toString());
        } catch {
            return NextResponse.redirect(
                new URL("/connections?error=Invalid state parameter", request.url)
            );
        }

        // Check if state is not too old (5 minutes max)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - stateData.timestamp > fiveMinutes) {
            return NextResponse.redirect(
                new URL("/connections?error=OAuth session expired", request.url)
            );
        }

        const stripeAPIKey = isProduction ? process.env.STRIPE_API_KEY as string : process.env.TEST_STRIPE_OAUTH_API_KEY as string;

        if (!stripeAPIKey) {
            throw new Error("STRIPE_API_KEY is not configured");
        }

        const stripe = new Stripe(stripeAPIKey);

        // Exchange authorization code for access token
        const response = await stripe.oauth.token({
            grant_type: "authorization_code",
            code,
        });

        const tokenData = response as unknown as IStripeOAuthToken;

        // Retrieve the user to get their organisation ID
        const user = await retrieveUserAdmin({ uid: stateData.userId });

        if (!user || !user.organisation?.id) {
            return NextResponse.redirect(
                new URL("/connections?error=User or organisation not found", request.url)
            );
        }

        // Store the connection in Firebase
        const connection = await createConnection({
            organisationId: user.organisation.id,
            type: "stripe",
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            stripeAccountId: tokenData.stripe_user_id,
            entityId: stateData.entityId || undefined,
        });

        // If entityId was provided, attach the connection to the entity
        if (stateData.entityId && connection?.id) {
            await updateEntity({
                organisationId: user.organisation.id,
                entityId: stateData.entityId,
                connections: {
                    stripeConnectionId: connection.id,
                },
            });
        }

        // Redirect back to connections page with success message
        return NextResponse.redirect(
            new URL(`${root}/entities?success=Stripe connected successfully`, request.url)
        );
    } catch (error) {
        console.error("Error in Stripe OAuth callback:", error);
        return NextResponse.redirect(
            new URL(
                `${root}/connections?error=${encodeURIComponent("Failed to connect Stripe account")}`,
                request.url
            )
        );
    }
}
