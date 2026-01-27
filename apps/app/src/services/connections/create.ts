"use server";

// Local Imports
import { encrypt } from "@/lib/encryption";
import { firestoreAdmin } from "@repo/firebase";
import { getConnectionsPath } from "@repo/constants";
import { IConnection, ConnectionType } from "@repo/models";

export async function createConnection({
    organisationId,
    type,
    accessToken,
    refreshToken,
    stripeAccountId,
    googleEmail,
    expiresAt,
    entityId,
}: {
    organisationId: string;
    type: ConnectionType;
    accessToken: string;
    refreshToken?: string;
    stripeCustomerId?: string;
    stripeAccountId?: string;
    googleEmail?: string;
    expiresAt?: number;
    entityId?: string;
}): Promise<IConnection | null> {
    try {
        // Use subcollection path: organisations/{organisationId}/connections
        const connectionsPath = getConnectionsPath(organisationId);
        const connectionRef = firestoreAdmin.collection(connectionsPath).doc();
        const now = Date.now();

        const connection: IConnection = {
            id: connectionRef.id,
            organisationId,
            type,
            status: "connected",
            accessToken: encrypt(accessToken),
            ...(refreshToken && { refreshToken: encrypt(refreshToken) }),
            ...(stripeAccountId && { stripeAccountId }),
            ...(googleEmail && { googleEmail }),
            ...(entityId && { entityId }),
            connectedAt: now,
            lastSyncedAt: now,
            ...(expiresAt && { expiresAt }),
        };

        await connectionRef.set(connection);
        return connection;
    } catch (error) {
        console.error("Error creating connection:", error);
        return null;
    }
}
