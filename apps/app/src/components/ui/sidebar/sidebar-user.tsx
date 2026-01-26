"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LuCreditCard, LuLogOut, LuSettings, LuEllipsisVertical } from "react-icons/lu"

import {
    Avatar,
    Box,
    Button,
    HStack,
    Menu,
    Portal,
    Separator,
    Text,
    VStack
} from "@repo/ui"
import { createBillingPortalUrl } from "@/services/stripe/create"
import { signOut } from "@/services/sign-out"
import { useOrganisation } from "@/hooks/useOrganisation"
import { levelThreeAccess } from "@repo/constants"

export function SidebarUser() {
    const router = useRouter()
    const { data: session } = useSession()
    const { organisation } = useOrganisation()
    const hasLevelThreeAccess = levelThreeAccess.includes(session?.user.organisation?.role as string)

    async function handleSignOut() {
        await signOut()
    }

    async function handleBillingPortal() {
        try {
            if (organisation?.stripeCustomerId) {
                const billingUrl = await createBillingPortalUrl({ customerId: organisation?.stripeCustomerId })
                if (billingUrl) {
                    window.open(billingUrl, "_blank")
                } else {
                    throw new Error("Failed to create billing portal url")
                }
            } else {
                throw new Error("Organisation is invalid")
            }
        } catch (error) {
            toast.error("Failed to create billing portal url", { description: `${error}` })
        }
    }

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button
                    variant="ghost"
                    w="full"
                    h="16"
                    p={3}
                    justifyContent="flex-start"
                    alignItems="center"
                    _hover={{ bg: "gray.100" }}
                >
                    <HStack gap={3} w="full" align="center">
                        <Avatar.Root size="sm">
                            <Avatar.Image src={session?.user.brand?.imageUrl as string} />
                            <Avatar.Fallback>
                                {`${session?.user.firstname?.slice(0, 1)}${session?.user.lastname?.slice(0, 1)}`}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <VStack align="start" gap={0} flex={1} overflow="hidden" maxWidth="100%">
                            <Text fontSize="sm" fontWeight="medium" truncate>
                                {session?.user.firstname} {session?.user.lastname}
                            </Text>
                            <Text fontSize="xs" color="fg.muted" truncate>
                                {session?.user.email}
                            </Text>
                        </VStack>
                        <Box as={LuEllipsisVertical} color="fg.muted" />
                    </HStack>
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content minW="224px" ml={{ base: 4, md: 0 }}>
                        {/* User Info Header */}
                        <Box p={2}>
                            <HStack gap={2}>
                                <Avatar.Root size="sm">
                                    <Avatar.Image src={session?.user.brand?.imageUrl as string} />
                                    <Avatar.Fallback>
                                        {`${session?.user.firstname?.slice(0, 1)}${session?.user.lastname?.slice(0, 1)}`}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <VStack align="start" gap={0}>
                                    <Text fontSize="sm" fontWeight="medium" truncate>
                                        {session?.user.firstname ?? "Name"} {session?.user.lastname ?? ""}
                                    </Text>
                                    <Text fontSize="xs" color="fg.muted" truncate>
                                        {session?.user.email}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>

                        {hasLevelThreeAccess && (
                            <>
                                <Separator />
                                <Menu.Item value="billing" onClick={handleBillingPortal}>
                                    <LuCreditCard />
                                    Billing
                                </Menu.Item>
                            </>
                        )}

                        <Menu.Item value="settings" onClick={() => router.push("/settings")}>
                            <LuSettings />
                            Settings
                        </Menu.Item>

                        <Separator />

                        <Menu.Item value="logout" onClick={handleSignOut}>
                            <LuLogOut />
                            Log out
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}
