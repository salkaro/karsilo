// Root Collections
export const usersCol = "users";
export const organisationsCol = "organisations";

// Subcollections (under organisations/{organisationId}/)
export const connectionsSubCol = "connections";
export const inviteCodesSubCol = "invite-codes";
export const entitiesSubCol = "entities";
export const tokensSubCol = "tokens";


// Subcollections (under organisations/{organisationId}/)
export const getConnectionsPath = (organisationId: string) =>
    `${organisationsCol}/${organisationId}/${connectionsSubCol}`;

export const getInviteCodesPath = (organisationId: string) =>
    `${organisationsCol}/${organisationId}/${inviteCodesSubCol}`;

export const getEntitiesPath = (organisationId: string) =>
    `${organisationsCol}/${organisationId}/${entitiesSubCol}`;

export const getTokensPath = (organisationId: string) =>
    `${organisationsCol}/${organisationId}/${tokensSubCol}`;