"use client"

import { useState } from "react";
import { levelThreeAccess } from "@/constants/access";
import { useOrganisation } from "@/hooks/useOrganisation";
import { Button, HStack, Separator, Skeleton, VStack } from "@repo/ui";
import { useSession } from "next-auth/react";
import { LuPlus, LuTicket } from "react-icons/lu";
import DialogActiveInviteCodes from "./dialogs/dialog-active-invite-codes";
import DialogAddMember from "./dialogs/dialog-add-member";
import { IOrganisation } from "@/models/organisation";
import EmployeeTable from "./employee-table";
import { memberLimits } from "@/constants/limits";

const Page = () => {
    const { data: session } = useSession();
    const { organisation, loading } = useOrganisation();

    const [showAddMember, setShowAddMember] = useState(false);
    const [showInviteCodes, setShowInviteCodes] = useState(false);

    const hasLevelThreeAccess = levelThreeAccess.includes(session?.user.organisation?.role as string);

    const subscriptionType = organisation?.subscription || 'free';
    const memberLimit = memberLimits[subscriptionType];
    const maxMemberCountHit = organisation?.members !== -1 && (organisation?.members ?? 0) >= memberLimit;

    if (loading) {
        return (
            <VStack width="full" align="stretch">
                <HStack justify="space-between" w="full">
                    <Skeleton height="40px" width="12rem" />
                    <Skeleton height="40px" width="8rem" />
                </HStack>
                <Separator borderWidth="1px" />

                <VStack w="full"  align="stretch">
                    <HStack justify="space-between" w="full">
                        <Skeleton height="40px" width="20rem" />
                        <Skeleton height="64px" width="8rem" />
                    </HStack>

                    <VStack w="full" align="stretch">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} height="64px" w="full" />
                        ))}
                    </VStack>
                </VStack>
            </VStack>
        );
    }

    return (
        <VStack width="full" align="stretch" spaceY={2} marginY={8}>
            <HStack justify="space-between" w="full">
                {hasLevelThreeAccess && (
                    <Button variant="outline" size="sm" onClick={() => setShowInviteCodes(true)}>
                        <LuTicket />
                        Active Invite Codes
                    </Button>
                )}
                {hasLevelThreeAccess && (
                    <Button variant="outline" size="sm" onClick={() => setShowAddMember(true)} disabled={maxMemberCountHit}>
                        <LuPlus />
                        Add Member
                    </Button>
                )}
            </HStack>
            <Separator borderWidth="1px" />
            <EmployeeTable organisation={organisation as IOrganisation} />

            {/* Dialogs */}
            <DialogActiveInviteCodes
                orgId={organisation?.id as string}
                open={showInviteCodes}
                onClose={() => setShowInviteCodes(false)}
            />
            <DialogAddMember
                organisation={organisation as IOrganisation}
                open={showAddMember}
                onClose={() => setShowAddMember(false)}
            />
        </VStack>
    )
}

export default Page
