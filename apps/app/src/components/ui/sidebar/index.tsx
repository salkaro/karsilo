"use client"

import { Box, VStack, Text, Link, Separator, Avatar, Flex } from "@repo/ui"
import { usePathname } from "next/navigation"
import { PanelLeft, Settings } from "lucide-react"
import { sidebarItems } from "@/constants/platform"
import { shortenedTitle, title } from "@repo/constants"
import { SidebarUser } from "./sidebar-user"
import { useEffect, useState } from "react"


interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}


export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const [showOverlay, setShowOverlay] = useState(false)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (isOpen) {
            // Run after the render to avoid strict mode warning
            timeout = setTimeout(() => setShowOverlay(true), 0)
        } else {
            timeout = setTimeout(() => setShowOverlay(false), 1000) // match fade duration
        }

        return () => clearTimeout(timeout)
    }, [isOpen])

    return (
        <>
            {/* Dark overlay behind sidebar on mobile */}
            {showOverlay && (
                <Box
                    position="fixed"
                    inset={0}
                    bg="blackAlpha.600"
                    opacity={isOpen ? 1 : 0}
                    transition="opacity 0.3s"
                    zIndex={999}
                    display={{ base: "block", lg: "none" }}
                    onClick={onClose}
                />
            )}

            <Box
                w={{
                    base: isOpen ? "calc(100% - 16px)" : 0, // 16px = 2 (spacing units)
                    md: isOpen ? "250px" : 0,
                }}
                h={{ md: "calc(100% - 16px)" }}
                transition="width 0.4s"
                bg="white"
                borderWidth={isOpen ? "1px" : "0px"}
                borderRight={isOpen ? "1px solid" : "0px"}
                borderColor="gray.200"
                rounded="2xl"
                overflowY="auto"
                display="block"
                zIndex={1000}
                left={{ base: 2, lg: 0 }}
                right={{ base: 2, lg: 0 }}
                top={2}
                bottom={2}
                ml={isOpen ? { md: 2 } : { md: 0 }}
                position={{ base: "fixed", md: "relative" }}
            >
                <VStack align="stretch" gap={0} h="full">
                    {/* Logo/Brand */}
                    <Box px={6} py={4} mt={{ base: 2, md: 0 }}>
                        <Flex align="center" gap={3} w="full">
                            <Avatar.Root size="sm" bg="transparent">
                                <Avatar.Image src="/logos/icon.svg" />
                                <Avatar.Fallback name={shortenedTitle} />
                            </Avatar.Root>

                            <Text fontSize="xl" fontWeight="bold" color="primary" truncate>
                                {title}
                            </Text>

                            {/* Sidebar toggle button (inline with title) */}
                            <Box display={{ base: "flex", lg: "none" }} ml="auto">
                                <PanelLeft size={18} onClick={onClose} />
                            </Box>
                        </Flex>
                    </Box>

                    {/* Main Navigation */}
                    <VStack align="stretch" gap={1} p={4} flex={1}>
                        {/* Application Section */}
                        <Text fontSize="xs" fontWeight="bold" color="muted.foreground" px={3} mb={2} truncate>
                            APPLICATION
                        </Text>
                        {sidebarItems.application.map((item) => {
                            const isActive = pathname === item.url
                            const IconComponent = item.icon

                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                    px={3}
                                    py={2.5}
                                    borderRadius="lg"
                                    bg={isActive ? "purple.50" : "transparent"}
                                    color={isActive ? "purple.600" : "gray.700"}
                                    fontWeight={isActive ? "semibold" : "medium"}
                                    fontSize="sm"
                                    _hover={{
                                        bg: isActive ? "purple.50" : "gray.100",
                                        textDecoration: "none",
                                    }}
                                    transition="all 0.2s"
                                >
                                    <IconComponent size={18} />
                                    <Text truncate>{item.title}</Text>
                                </Link>
                            )
                        })}

                        <Separator my={4} />

                        {/* Internal Section */}
                        <Text fontSize="xs" fontWeight="bold" color="muted.foreground" px={3} mb={2} truncate>
                            INTERNAL
                        </Text>
                        {sidebarItems.internal.map((item) => {
                            const isActive = pathname === item.url
                            const IconComponent = item.icon

                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                    px={3}
                                    py={2.5}
                                    borderRadius="lg"
                                    bg={isActive ? "purple.50" : "transparent"}
                                    color={isActive ? "purple.600" : "gray.700"}
                                    fontWeight={isActive ? "semibold" : "medium"}
                                    fontSize="sm"
                                    _hover={{
                                        bg: isActive ? "purple.50" : "gray.100",
                                        textDecoration: "none",
                                    }}
                                    transition="all 0.2s"
                                >
                                    <IconComponent size={18} />
                                    <Text truncate>{item.title}</Text>
                                </Link>
                            )
                        })}

                        <Separator my={4} />

                        {/* Settings */}
                        <Link
                            href="/settings"
                            display="flex"
                            alignItems="center"
                            gap={3}
                            px={3}
                            py={2.5}
                            borderRadius="lg"
                            bg={pathname === "/settings" ? "purple.50" : "transparent"}
                            color={pathname === "/settings" ? "purple.600" : "gray.700"}
                            fontWeight={pathname === "/settings" ? "semibold" : "medium"}
                            fontSize="sm"
                            _hover={{
                                bg: pathname === "/settings" ? "purple.50" : "gray.100",
                                textDecoration: "none",
                            }}
                            transition="all 0.2s"
                        >
                            <Settings size={18} />
                            <Text truncate>Settings</Text>
                        </Link>
                    </VStack>

                    {/* User Profile Footer */}
                    <SidebarUser />
                </VStack>
            </Box>
        </>
    )
}
