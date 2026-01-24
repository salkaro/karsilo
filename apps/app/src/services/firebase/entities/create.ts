"use server";

// Local Imports
import { IEntity, IOrganisation } from "@repo/models";
import { firestoreAdmin } from "@repo/firebase";
import { getEntitiesPath, organisationsCol, entityLimits } from "@repo/constants";
import { FieldValue } from "firebase-admin/firestore";

export async function createEntity({
    organisationId,
    name,
    description,
    logoPrimary,
}: {
    organisationId: string;
    name: string;
    description?: string;
    logoPrimary?: string;
}): Promise<{ entity?: IEntity; error?: string }> {
    try {
        // Fetch organisation to check entity limits
        const orgRef = firestoreAdmin.collection(organisationsCol).doc(organisationId);
        const orgSnap = await orgRef.get();
        if (!orgSnap.exists) {
            return { error: "Organisation not found" };
        }
        const organisation = orgSnap.data() as IOrganisation;

        // Check entity limit
        const subscriptionTier = organisation?.subscription ?? "free";
        const entityLimit = entityLimits[subscriptionTier as keyof typeof entityLimits];
        const currentEntities = organisation?.entities ?? 0;
        if (entityLimit >= 0 && currentEntities >= entityLimit) {
            return { error: `Entity limit of ${entityLimit} reached. Upgrade your plan to create more entities.` };
        }

        // Use subcollection path: organisations/{organisationId}/entities
        const entitiesPath = getEntitiesPath(organisationId);
        const entityRef = firestoreAdmin.collection(entitiesPath).doc();
        const now = Date.now();

        const entity: IEntity = {
            id: entityRef.id,
            name,
            createdAt: now,
            ...(description && { description }),
            ...(logoPrimary && {
                images: {
                    logo: {
                        primary: logoPrimary,
                    },
                },
            }),
        };

        await entityRef.set(entity);

        // Increment entities count on organisation
        await orgRef.update({
            entities: FieldValue.increment(1),
        });

        return { entity };
    } catch (error) {
        console.error("Error creating entity:", error);
        return { error: error instanceof Error ? error.message : "Failed to create entity" };
    }
}

// Legacy alias for backwards compatibility
export const createProduct = createEntity;
