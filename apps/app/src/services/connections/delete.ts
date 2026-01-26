"use server";

// Local Imports
import { firestoreAdmin, admin } from "@repo/firebase";
import { ConnectionType, IConnection } from "@repo/models";
import { getConnectionsPath, getEntitiesPath } from "@repo/constants";

export async function deleteConnection({
    organisationId,
    type,
    connectionId
}: {
    organisationId: string;
    type: ConnectionType;
        connectionId: string;
}): Promise<boolean> {
    try {
        // Use subcollection path: organisations/{organisationId}/connections
        const connectionsPath = getConnectionsPath(organisationId);
        const snapshot = await firestoreAdmin
            .collection(connectionsPath)
            .where("id", "==", connectionId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return false;
        }

        const connectionDoc = snapshot.docs[0];
        const connection = connectionDoc.data() as IConnection;

        // If connection is attached to an entity, remove the connection reference from the entity
        if (connection.entityId) {
            const connectionFieldKey = `${type}ConnectionId`;
            const path = getEntitiesPath(organisationId);
            const entityRef = firestoreAdmin
                .collection(path)
                .doc(connection.entityId);

            await entityRef.update({
                [`connections.${connectionFieldKey}`]: admin.firestore.FieldValue.delete()
            });
        }

        // Delete the connection document
        await connectionDoc.ref.delete();
        return true;
    } catch (error) {
        console.error("Error deleting connection:", error);
        return false;
    }
}
