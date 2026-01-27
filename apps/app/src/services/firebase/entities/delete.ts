"use server";

// Local Imports
import { firestoreAdmin } from "@repo/firebase";
import { getEntitiesPath, getConnectionsPath, organisationsCol } from "@repo/constants";
import { FieldValue } from "firebase-admin/firestore";

export async function deleteEntity({
    organisationId,
    entityId,
}: {
    organisationId: string;
    entityId: string;
}): Promise<{ success?: boolean; error?: string }> {
    try {
        // Use subcollection path: organisations/{organisationId}/entities
        const entitiesPath = getEntitiesPath(organisationId);
        const entityRef = firestoreAdmin.collection(entitiesPath).doc(entityId);

        await entityRef.delete();

        // Delete any connections linked to this entity
        const connectionsPath = getConnectionsPath(organisationId);
        const connectionsSnap = await firestoreAdmin
            .collection(connectionsPath)
            .where("entityId", "==", entityId)
            .get();

        const batch = firestoreAdmin.batch();
        connectionsSnap.docs.forEach((doc) => batch.delete(doc.ref));

        // Decrement entities count on organisation
        const orgRef = firestoreAdmin.collection(organisationsCol).doc(organisationId);
        batch.update(orgRef, { entities: FieldValue.increment(-1) });

        await batch.commit();

        return { success: true };
    } catch (error) {
        console.error("Error deleting entity:", error);
        return { error: error instanceof Error ? error.message : "Failed to delete entity" };
    }
}

// Legacy alias for backwards compatibility
export const deleteProduct = deleteEntity;
