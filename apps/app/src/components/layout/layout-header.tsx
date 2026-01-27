"use client"

import { usePathname } from 'next/navigation'
import { Box, Heading, Separator } from '@repo/ui'
import { PanelLeft } from 'lucide-react'


interface LayoutHeaderProps {
    onSidebarToggle: () => void
}

const LayoutHeader = ({ onSidebarToggle }: LayoutHeaderProps) => {
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
            mb={4}
            zIndex={3}
        >
            <Box display="flex" alignItems="center" gap={3}>
                {/* Sidebar toggle button */}
                <Box
                    as="button"
                    onClick={onSidebarToggle}
                    display={{ base: "inline-flex" }}
                    cursor="pointer"
                >
                    <PanelLeft size={16} />
                </Box>

                {/* Vertical separator */}
                <Separator orientation="vertical" h="5" borderWidth="1px" />

                {/* Title */}
                <Heading
                    size={{base: "lg", md: "2xl"}}
                    fontWeight="semibold"
                    letterSpacing="tight"
                >
                    {title}
                </Heading>
            </Box>
        </Box>
    )
}

export default LayoutHeader
