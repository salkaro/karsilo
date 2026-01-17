"use client"

import { Box, VStack, Text, Link, Separator, Avatar, HStack, Flex } from "@repo/ui"
import { usePathname } from "next/navigation"
import { Building2, Settings } from "lucide-react"
import { sidebarItems } from "@/constants/platform"
import { useSession } from "next-auth/react"
import { shortenedTitle, title } from "@/constants/site"
import { SidebarUser } from "./sidebar-user"

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <Box
            w="250px"
            bg="white"
            borderWidth="1px"
            borderRight="1px solid"
            borderColor="gray.200"
            rounded="2xl"
            overflowY="auto"
            my={2}
            ml={2}
            display={{ base: "none", lg: "block" }}
        >
            <VStack align="stretch" gap={0} h="full">
                {/* Logo/Brand */}
                <Box px={6} py={4}>
                    <Flex align="center" gap={3} mx="auto" w="full">
                        <Avatar.Root size="sm" bg="transparent">
                            <Avatar.Image src="/logos/icon.svg" />
                            <Avatar.Fallback name={shortenedTitle} />
                        </Avatar.Root>
                        <Text fontSize="xl" fontWeight="bold" color="primary">
                            {title}
                        </Text>
                    </Flex>
                </Box>

                {/* Main Navigation */}
                <VStack align="stretch" gap={1} p={4} flex={1}>
                    {/* Application Section */}
                    <Text fontSize="xs" fontWeight="bold" color="muted.foreground" px={3} mb={2}>
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
                                <Text>{item.title}</Text>
                            </Link>
                        )
                    })}

                    <Separator my={4} />

                    {/* Internal Section */}
                    <Text fontSize="xs" fontWeight="bold" color="muted.foreground" px={3} mb={2}>
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
                                <Text>{item.title}</Text>
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
                        <Text>Settings</Text>
                    </Link>
                </VStack>

                {/* User Profile Footer */}
                <SidebarUser />
            </VStack>
        </Box>
    )
}
