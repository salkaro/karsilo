"use client"

// Local Imports
import { useOrganisation } from '@/hooks/useOrganisation'

// External Imports
import { Box } from '@repo/ui'
import BalanceTable from './balance-table'

const Page = () => {
    const { organisation, loading: loadingOrganisation } = useOrganisation();
 
    return (
        <Box>
            <BalanceTable organisationId={organisation?.id ?? null} currency={organisation?.currency} />
        </Box>
    )
}

export default Page
