"use client"

import { usePathname } from 'next/navigation'
import { Box, Heading } from '@repo/ui'

const LayoutHeader = () => {
    const pathname = usePathname()

    const title =
        pathname === "/" || pathname === "/dashboard"
            ? "Dashboard"
            : pathname
                .split("/")
                .filter(Boolean)
                .pop()!
                .split("-")
                .map(w => w[0]?.toUpperCase() + w.slice(1))
                .join(" ")

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            p={{ base: 2, md: 0 }}
        >
            <Heading
                size="2xl"
                fontWeight="semibold"
                mb={4}
                letterSpacing="tight"
            >
                {title}
            </Heading>
        </Box>
    )
}

export default LayoutHeader
