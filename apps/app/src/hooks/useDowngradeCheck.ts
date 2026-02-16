import { useMemo } from "react";
import { IOrganisation } from "@repo/models";
import { memberLimits, entityLimits } from "@repo/constants";

interface DowngradeCheckResult {
    isOverLimit: boolean;
    memberLimit: number;
    entityLimit: number;
    membersToRemove: number;
    entitiesToRemove: number;
}

export function useDowngradeCheck(organisation: IOrganisation | null): DowngradeCheckResult {
    return useMemo(() => {
        if (!organisation) {
            return {
                isOverLimit: false,
                memberLimit: 0,
                entityLimit: 0,
                membersToRemove: 0,
                entitiesToRemove: 0,
            };
        }

        const subscriptionType = organisation.subscription || "free";
        const memberLimit = memberLimits[subscriptionType];
        const entityLimit = entityLimits[subscriptionType];

        const currentMembers = organisation.members ?? 0;
        const currentEntities = organisation.entities ?? 0;

        const membersToRemove = Math.max(0, currentMembers - memberLimit);
        const entitiesToRemove = Math.max(0, currentEntities - entityLimit);

        console.log(currentMembers, membersToRemove, entitiesToRemove)

        return {
            isOverLimit: membersToRemove > 0 || entitiesToRemove > 0,
            memberLimit,
            entityLimit,
            membersToRemove,
            entitiesToRemove,
        };
    }, [organisation]);
}
