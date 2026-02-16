"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogBackdrop,
    DialogPositioner,
    Button,
    VStack,
    HStack,
    Box,
    Text,
    Separator,
    Portal,
} from "@repo/ui";
import { AlertTriangle, Trash2, Users, Building2 } from "lucide-react";
import { useOrganisation } from "@/hooks/useOrganisation";
import { useOrganisationMembers } from "@/hooks/useOrganisationMembers";
import { useEntities } from "@/hooks/useEntities";
import { useDowngradeCheck } from "@/hooks/useDowngradeCheck";
import { removeMemberFromOrganisation } from "@/services/firebase/admin-delete";
import { deleteEntity } from "@/services/firebase/entities/delete";
import { withTokenRefresh } from "@/utils/token-refresh";
import { IUser } from "@repo/models";
import { IEntity } from "@repo/models";

export default function DowngradeModal() {
    const { organisation, loading: orgLoading, refetch: refetchOrg } = useOrganisation();
    const { members, refetch: refetchMembers } = useOrganisationMembers(organisation?.id ?? null);
    const { entities, refetch: refetchEntities } = useEntities(organisation?.id ?? null);
    const { isOverLimit, memberLimit, entityLimit, membersToRemove, entitiesToRemove } = useDowngradeCheck(organisation);

    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
    const [removingEntityId, setRemovingEntityId] = useState<string | null>(null);

    const isOpen = !orgLoading && organisation !== null && isOverLimit;

    // Filter out the owner from removable members
    const removableMembers = members?.filter((m) => m.organisation?.role !== "owner") ?? [];

    // Calculate how many more need to be removed based on actual list lengths
    const currentMemberCount = members?.length ?? 0;
    const currentEntityCount = entities?.length ?? 0;
    const membersStillToRemove = Math.max(0, currentMemberCount - memberLimit);
    const entitiesStillToRemove = Math.max(0, currentEntityCount - entityLimit);
    const allWithinLimits = membersStillToRemove <= 0 && entitiesStillToRemove <= 0;

    const handleRemoveMember = async (member: IUser) => {
        if (!organisation?.id || !member.id) return;

        setRemovingMemberId(member.id);
        try {
            const { error } = await withTokenRefresh((idToken) =>
                removeMemberFromOrganisation({ idToken, orgId: organisation.id, memberUid: member.id })
            );

            if (error) throw new Error(error);

            toast.success(`Removed ${member.firstname || member.email} from organisation`);
            await Promise.all([refetchMembers(), refetchOrg()]);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to remove member");
        } finally {
            setRemovingMemberId(null);
        }
    };

    const handleRemoveEntity = async (entity: IEntity) => {
        if (!organisation?.id || !entity.id) return;

        setRemovingEntityId(entity.id);
        try {
            const { error } = await deleteEntity({
                organisationId: organisation.id,
                entityId: entity.id,
            });

            if (error) throw new Error(error);

            toast.success(`Removed entity "${entity.name}"`);
            await Promise.all([refetchEntities(), refetchOrg()]);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to remove entity");
        } finally {
            setRemovingEntityId(null);
        }
    };

    const handleContinue = () => {
        // Modal will close automatically since isOverLimit will be false after refetch
        refetchOrg();
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={() => {}}
            placement="center"
            size="lg"
            closeOnInteractOutside={false}
            closeOnEscape={false}
        >
            <Portal>
                <DialogBackdrop />
                <DialogPositioner>
                    <DialogContent>
                        <DialogHeader>
                            <HStack gap={2}>
                                <Box color="orange.500">
                                    <AlertTriangle size={20} />
                                </Box>
                                <DialogTitle>Action Required: Plan Downgrade</DialogTitle>
                            </HStack>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={5} align="stretch">
                                <Box bg="orange.50" p={4} borderRadius="lg" borderWidth="1px" borderColor="orange.200">
                                    <Text fontSize="sm" color="orange.800">
                                        Your subscription has been downgraded and your current usage exceeds
                                        the new plan limits. Please remove the excess items below to continue
                                        using the application.
                                    </Text>
                                </Box>

                                {/* Members Section */}
                                {membersToRemove > 0 && (
                                    <VStack gap={3} align="stretch">
                                        <HStack gap={2}>
                                            <Users size={18} />
                                            <Text fontWeight="semibold" fontSize="md">
                                                Remove Team Members
                                            </Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600">
                                            Current: {currentMemberCount} / Limit: {memberLimit}
                                            {membersStillToRemove > 0 && (
                                                <Text as="span" color="red.500" fontWeight="medium">
                                                    {" "} — Remove {membersStillToRemove} member{membersStillToRemove !== 1 ? "s" : ""}
                                                </Text>
                                            )}
                                        </Text>
                                        <Separator />
                                        <VStack gap={2} align="stretch" maxH="200px" overflowY="auto">
                                            {removableMembers.map((member) => (
                                                <HStack
                                                    key={member.id}
                                                    justify="space-between"
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="md"
                                                >
                                                    <VStack gap={0} align="start">
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            {member.firstname
                                                                ? `${member.firstname} ${member.lastname || ""}`
                                                                : member.email}
                                                        </Text>
                                                        {member.firstname && (
                                                            <Text fontSize="xs" color="gray.500">
                                                                {member.email}
                                                            </Text>
                                                        )}
                                                        <Text fontSize="xs" color="gray.400">
                                                            {member.organisation?.role}
                                                        </Text>
                                                    </VStack>
                                                    <Button
                                                        size="xs"
                                                        colorPalette="red"
                                                        variant="outline"
                                                        onClick={() => handleRemoveMember(member)}
                                                        disabled={removingMemberId !== null}
                                                        loading={removingMemberId === member.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </Button>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </VStack>
                                )}

                                {/* Entities Section */}
                                {entitiesToRemove > 0 && (
                                    <VStack gap={3} align="stretch">
                                        <HStack gap={2}>
                                            <Building2 size={18} />
                                            <Text fontWeight="semibold" fontSize="md">
                                                Remove Entities
                                            </Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600">
                                            Current: {currentEntityCount} / Limit: {entityLimit}
                                            {entitiesStillToRemove > 0 && (
                                                <Text as="span" color="red.500" fontWeight="medium">
                                                    {" "} — Remove {entitiesStillToRemove} entit{entitiesStillToRemove !== 1 ? "ies" : "y"}
                                                </Text>
                                            )}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Removing an entity will also remove its connected accounts.
                                        </Text>
                                        <Separator />
                                        <VStack gap={2} align="stretch" maxH="200px" overflowY="auto">
                                            {entities?.map((entity) => (
                                                <HStack
                                                    key={entity.id}
                                                    justify="space-between"
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="md"
                                                >
                                                    <VStack gap={0} align="start">
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            {entity.name}
                                                        </Text>
                                                        {entity.description && (
                                                            <Text fontSize="xs" color="gray.500">
                                                                {entity.description}
                                                            </Text>
                                                        )}
                                                        <HStack gap={1} mt={1}>
                                                            {entity.connections?.stripeConnectionId && (
                                                                <Box px={2} py={0.5} bg="purple.50" borderRadius="full">
                                                                    <Text fontSize="2xs" color="purple.600">Stripe</Text>
                                                                </Box>
                                                            )}
                                                            {entity.connections?.googleConnectionId && (
                                                                <Box px={2} py={0.5} bg="blue.50" borderRadius="full">
                                                                    <Text fontSize="2xs" color="blue.600">Google</Text>
                                                                </Box>
                                                            )}
                                                        </HStack>
                                                    </VStack>
                                                    <Button
                                                        size="xs"
                                                        colorPalette="red"
                                                        variant="outline"
                                                        onClick={() => handleRemoveEntity(entity)}
                                                        disabled={removingEntityId !== null}
                                                        loading={removingEntityId === entity.id}
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </Button>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </VStack>
                                )}
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                colorPalette="purple"
                                onClick={handleContinue}
                                disabled={!allWithinLimits}
                            >
                                {allWithinLimits
                                    ? "Continue"
                                    : `Remove ${membersStillToRemove + entitiesStillToRemove} more item${membersStillToRemove + entitiesStillToRemove !== 1 ? "s" : ""}`
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogPositioner>
            </Portal>
        </DialogRoot>
    );
}
