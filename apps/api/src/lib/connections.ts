import { decrypt } from "@/lib/encryption";
import { firestoreAdmin } from "@repo/firebase";
import { getConnectionsPath } from "@repo/constants";
import { IConnection } from "@repo/models";

export async function getStripeConnections(orgId: string): Promise<IConnection[]> {
    const connectionsPath = getConnectionsPath(orgId);
    const snapshot = await firestoreAdmin
        .collection(connectionsPath)
        .where("type", "==", "stripe")
        .where("status", "==", "connected")
        .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map((doc) => {
        const connection = doc.data() as IConnection;
        if (connection.accessToken) {
            connection.accessToken = decrypt(connection.accessToken);
        }
        if (connection.refreshToken) {
            connection.refreshToken = decrypt(connection.refreshToken);
        }
        return connection;
    });
}

export async function getStripeConnection(
    orgId: string,
    connectionId: string
): Promise<IConnection | null> {
    const connectionsPath = getConnectionsPath(orgId);
    const docRef = firestoreAdmin.collection(connectionsPath).doc(connectionId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
        return null;
    }

    const connection = snapshot.data() as IConnection;

    if (connection.type !== "stripe" || connection.status !== "connected") {
        return null;
    }

    if (connection.accessToken) {
        connection.accessToken = decrypt(connection.accessToken);
    }
    if (connection.refreshToken) {
        connection.refreshToken = decrypt(connection.refreshToken);
    }

    return connection;
}