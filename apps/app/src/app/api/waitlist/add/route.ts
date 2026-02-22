import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@repo/firebase";
import { createWaitlistEntry } from "@/services/firebase/admin-create";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apiKey, firstName, lastName, email, stripeAccounts, revenue, employees, country } = body;

        if (!apiKey || !firstName || !lastName || !email || !stripeAccounts || !revenue || !employees) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find organisation by API key
        const tokenSnapshot = await firestoreAdmin
            .collectionGroup("tokens")
            .where("id", "==", apiKey)
            .limit(1)
            .get();

        if (tokenSnapshot.empty) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 400 });
        }

        // Extract organisation ID from document path: organisations/{orgId}/tokens/{tokenId}
        const tokenDoc = tokenSnapshot.docs[0];
        const pathSegments = tokenDoc.ref.path.split("/");
        const organisationId = pathSegments[1];

        // Verify organisation subscription
        const orgDoc = await firestoreAdmin.collection("organisations").doc(organisationId).get();
        const orgData = orgDoc.data();

        if (!orgData || orgData.subscription !== "pro") {
            return NextResponse.json(
                { error: "Organisation must be on Pro plan or above" },
                { status: 403 }
            );
        }

        const result = await createWaitlistEntry({
            firstName,
            lastName,
            email,
            stripeAccounts,
            revenue,
            employees,
            country,
            organisationId,
        });

        if (result.error) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in waitlist API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
