"use client"

import { useMemo } from 'react'

// Local Imports
import { useOrganisation } from '@/hooks/useOrganisation'
import { useEntities } from '@/hooks/useEntities'
import { useProducts, ProductWithStats } from '@/hooks/useProducts'

// External Imports
import { Box, Separator, Skeleton, SimpleGrid, VStack } from '@repo/ui'
import BalanceTable from './balance-table'
import { TopProducts } from '../products/top-products'

const DashboardSkeleton = () => (
    <VStack gap={4} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="120px" width="100%" borderRadius="lg" />
            ))}
        </SimpleGrid>
        <Skeleton height="1px" width="100%" />
        <Skeleton height="60px" width="100%" borderRadius="lg" />
        <Skeleton height="300px" width="100%" borderRadius="lg" />
    </VStack>
);

const Page = () => {
    const { organisation, loading: loadingOrganisation } = useOrganisation();
    const { entities } = useEntities(organisation?.id ?? null);
    const { productsByConnection, loading: loadingProducts } = useProducts({
        organisationId: organisation?.id ?? null,
        entities,
    });

    const allProducts: ProductWithStats[] = useMemo(() => {
        if (!productsByConnection) return [];
        return Object.values(productsByConnection).flat();
    }, [productsByConnection]);

    if (loadingOrganisation || loadingProducts) {
        return <DashboardSkeleton />;
    }

    return (
        <Box>
            <TopProducts products={allProducts} maxItems={6} columns={{base: 1, md: 2, lg: 3}}/>

            <Separator borderWidth="1px" marginY={4} />

            <BalanceTable organisationId={organisation?.id ?? null} currency={organisation?.currency} />
        </Box>
    )
}

export default Page
