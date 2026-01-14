"use client";

import { useSession } from 'next-auth/react';
import { entityLimits } from '@/constants/limits';
import { useEntities } from '@/hooks/useEntities';
import { useOrganisation } from '@/hooks/useOrganisation';
import { levelTwoAccess } from '@/constants/access';
import AddEntityDialog from './add-entity-dialog';
import EntityTable from './entity-table';
import { Box, VStack, Separator, Skeleton, Text, HStack, Badge } from '@repo/ui';
import { useConnections } from '@/hooks/useConnections';
import { IConnection } from '@/models/connection';

const Page = () => {
    const { data: session } = useSession();
    const { organisation, loading: loadingOrganisation } = useOrganisation();
    const { entities, refetch: refetchEntities, loading: loadingEntities } = useEntities(organisation?.id ?? null);
    const { connections, refetch: refetchConnections } = useConnections(organisation?.id as string);
    console.log(connections)

    const subscription = organisation?.subscription ?? 'free';
    const limit = entityLimits[subscription as keyof typeof entityLimits];
    const canAddEntity = limit === -1 || (entities?.length ?? 0) < limit;
    const hasEditAccess = levelTwoAccess.includes(session?.user.organisation?.role as string);

    const handleEntityCreated = async () => {
        await refetchEntities();
        await refetchConnections();
    };

    // Check if feature is not included first (before showing loading state)
    if (!loadingOrganisation && limit === 0) {
        return (
            <Box p={8} textAlign="center" bg="red.50" borderRadius="lg" mt={8}>
                <VStack gap={4}>
                    <Text fontSize="xl" fontWeight="bold" color="red.700">
                        Feature Not Included
                    </Text>
                    <Text color="red.600">
                        Entities are not included in your current plan. Upgrade to get access.
                    </Text>
                    <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>
                            Upgrade to unlock:
                        </Text>
                        <VStack gap={1} align="start">
                            <Text fontSize="sm">• Create and manage entities</Text>
                            <Text fontSize="sm">• Connect with Stripe and Google</Text>
                            <Text fontSize="sm">• Track entity metrics</Text>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        );
    }

    if (loadingOrganisation || loadingEntities) {
        return (
            <VStack gap={6} mt={8} align="stretch">
                <HStack justify="space-between">
                    <Skeleton height="40px" width="120px" />
                </HStack>
                <Skeleton height="400px" width="full" />
            </VStack>
        );
    }

    return (
        <VStack gap={6} mt={8} align="stretch">
            {hasEditAccess && (
                <HStack justify="space-between" align="center">
                    <HStack gap={3}>
                        <AddEntityDialog
                            organisation={organisation!}
                            refetchEntitiesCallback={handleEntityCreated}
                        />
                        <Badge
                            colorPalette={canAddEntity ? "purple" : "orange"}
                            variant="subtle"
                        >
                            {limit === -1 ? 'Unlimited' : `${entities?.length ?? 0}/${limit}`}
                        </Badge>
                    </HStack>
                </HStack>
            )}

            {hasEditAccess && <Separator />}

            {entities && entities.length > 0 ? (
                <EntityTable
                    entities={entities}
                    refetchEntities={handleEntityCreated}
                    organisationId={organisation?.id as string}
                    connections={connections as IConnection[]}
                />
            ) : (
                <Box p={8} textAlign="center" bg="gray.50" borderRadius="lg">
                    <VStack gap={3}>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                            No entities yet
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                            {hasEditAccess
                                ? 'Create your first entity to get started'
                                : 'No entities have been created yet'}
                        </Text>
                    </VStack>
                </Box>
            )}

            {hasEditAccess && !canAddEntity && (
                <Box p={4} bg="orange.50" borderRadius="lg" borderWidth="1px" borderColor="orange.200">
                    <VStack gap={2} align="start">
                        <Text fontSize="sm" fontWeight="semibold" color="orange.700">
                            Entity Limit Reached
                        </Text>
                        <Text fontSize="sm" color="orange.600">
                            You&apos;ve reached your limit of {limit} {limit === 1 ? 'entity' : 'entities'}.
                            Upgrade your plan to create more entities.
                        </Text>
                    </VStack>
                </Box>
            )}
        </VStack>
    );
};

export default Page;
