/**
 * Firebase functions for retrieving organisation data
 */

import { firestoreAdmin } from "../lib/firebase.js";
import { organisationsCol, getConnectionsPath } from "@repo/constants";
import type { IOrganisation, IConnection, SubscriptionType } from "@repo/models";

export interface OrganisationWithConnections {
    organisation: IOrganisation;
    connections: IConnection[];
}

/**
 * Retrieves all organisations from Firestore
 */
export async function retrieveAllOrganisations(): Promise<IOrganisation[]> {
    const snapshot = await firestoreAdmin.collection(organisationsCol).get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as IOrganisation));
}

/**
 * Retrieves organisations that have a paid subscription (not free)
 */
export async function retrievePaidOrganisations(): Promise<IOrganisation[]> {
    const paidPlans: SubscriptionType[] = ["growth", "essential", "pro"];

    const snapshot = await firestoreAdmin
        .collection(organisationsCol)
        .where("subscription", "in", paidPlans)
        .get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as IOrganisation));
}

/**
 * Retrieves organisations filtered by subscription type
 */
export async function retrieveOrganisationsByPlan(
    plans: SubscriptionType[]
): Promise<IOrganisation[]> {
    const snapshot = await firestoreAdmin
        .collection(organisationsCol)
        .where("subscription", "in", plans)
        .get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as IOrganisation));
}

/**
 * Retrieves all Stripe connections for an organisation
 */
export async function retrieveStripeConnections(
    organisationId: string
): Promise<IConnection[]> {
    const connectionsPath = getConnectionsPath(organisationId);

    const snapshot = await firestoreAdmin
        .collection(connectionsPath)
        .where("type", "==", "stripe")
        .where("status", "==", "connected")
        .get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as IConnection));
}

/**
 * Retrieves organisations with their Stripe connections
 * Only returns organisations that have at least one active Stripe connection
 */
export async function retrieveOrganisationsWithStripeConnections(
    plans?: SubscriptionType[]
): Promise<OrganisationWithConnections[]> {
    const organisations = plans
        ? await retrieveOrganisationsByPlan(plans)
        : await retrieveAllOrganisations();

    const results: OrganisationWithConnections[] = [];

    for (const organisation of organisations) {
        const connections = await retrieveStripeConnections(organisation.id);

        if (connections.length > 0) {
            results.push({ organisation, connections });
        }
    }

    return results;
}
