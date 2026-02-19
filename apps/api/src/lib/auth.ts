import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@repo/firebase";
import { tokensSubCol, organisationsCol, apiAccess } from "@repo/constants";
import { IOrganisation } from "@repo/models";

export interface AuthResult {
    orgId: string;
    accessLevel: number;
    apiKey: string;
}

export async function validateApiKey(
    request: NextRequest
): Promise<AuthResult | NextResponse> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Missing or invalid Authorization header" },
            { status: 401 }
        );
    }

    const apiKey = authHeader.slice(7);

    if (apiKey.length !== 66) {
        return NextResponse.json(
            { error: "Invalid API key format" },
            { status: 401 }
        );
    }

    // Extract access level from last 2 characters
    const accessLevelCode = apiKey.slice(64);
    const accessLevel = parseInt(accessLevelCode, 10);

    // Look up the token via collection group query
    const snapshot = await firestoreAdmin
        .collectionGroup(tokensSubCol)
        .where("id", "==", apiKey)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return NextResponse.json(
            { error: "Invalid API key" },
            { status: 401 }
        );
    }

    // Extract orgId from the document path: organisations/{orgId}/tokens/{tokenId}
    const tokenDoc = snapshot.docs[0];
    const pathSegments = tokenDoc.ref.path.split("/");
    const orgId = pathSegments[1];

    // Check organisation subscription has API access
    const orgDoc = await firestoreAdmin
        .collection(organisationsCol)
        .doc(orgId)
        .get();

    if (!orgDoc.exists) {
        return NextResponse.json(
            { error: "Organisation not found" },
            { status: 401 }
        );
    }

    const org = orgDoc.data() as IOrganisation;
    const subscription = org.subscription || "free";

    if (!apiAccess[subscription as keyof typeof apiAccess]) {
        return NextResponse.json(
            { error: "Your plan does not include API access. Please upgrade to Growth or Pro." },
            { status: 403 }
        );
    }

    return { orgId, accessLevel, apiKey };
}