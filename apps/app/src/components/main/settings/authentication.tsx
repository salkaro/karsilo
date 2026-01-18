"use client"

// External Imports
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
    LuCheck,
    LuCopy,
    LuEye,
    LuEyeOff,
    LuKey,
    LuPlus,
    LuRotateCcw,
    LuTrash2,
    LuTriangleAlert
} from "react-icons/lu"
import { toast } from "sonner"

// Local Imports
import { OrgRoleType, apiTokenAccessLevels, apiTokenAccessLevelsName } from "@repo/constants"
import { useTokens } from "@/hooks/useTokens"
import { updateAPIKey } from "@/services/firebase/update"
import { generateApiKey } from "@/utils/generate"
import { useOrganisation } from "@/hooks/useOrganisation"
import {
    Box,
    Button,
    Card,
    Center,
    Code,
    Heading,
    HStack,
    IconButton,
    Spinner,
    Text,
    VStack
} from "@repo/ui"
import AlertContinue from "@/components/ui/alert-continue"
import NoContent from "@/components/ui/no-content"
import AddAPIKeyDialog from "./dialogs/dialog-add-api-key"

const Authentication = () => {
    const { data: session, status } = useSession()
    const { organisation, loading: orgLoading, refetch: refreshOrganisation } = useOrganisation()
    const { tokens, loading: tokensLoading, error: tokensError, refetch: refreshTokens } = useTokens(organisation?.id as string)

    // For showing/hiding API keys
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
    // For copy feedback
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    // Dialog state
    const [showAddDialog, setShowAddDialog] = useState(false)

    const userRole = session?.user.organisation?.role as OrgRoleType | undefined

    async function createNewAPIKey({ name, accessLevel }: { name: string; accessLevel: number }): Promise<{ error?: boolean }> {
        try {
            if (!organisation?.id || !organisation.subscription) {
                toast.error("Failed to add API key", { description: "Your organisation wasn't found. Please try again." })
                return { error: true }
            }
            if (tokens && tokens.length >= 5) {
                toast.error("API key limit hit", { description: "You must delete an existing API key first" })
                return { error: true }
            }
            if (!userRole || userRole === "viewer") {
                toast.error("Invalid permissions", { description: "You do not have sufficient permission to create a new API key" })
                return { error: true }
            }
            const token = generateApiKey(accessLevel as keyof typeof apiTokenAccessLevels)
            // Attach metadata
            token.name = name
            token.createdAt = Date.now()
            const { error } = await updateAPIKey({
                orgId: organisation.id,
                type: "update",
                token,
                perms: userRole,
            })
            if (error) throw error

            await refreshTokens()
            await refreshOrganisation()

            return {}
        } catch (error) {
            toast.error("Failed to create token", { description: `${error}` })
            return { error: true }
        }
    }

    // Rotate
    async function rotateAPIKey(tokenId: string) {
        try {
            if (!organisation?.id || !organisation.subscription) return
            if (!userRole || userRole === "viewer") {
                toast.error("Invalid permissions", { description: "You do not have sufficient permission to rotate this api key" })
                return
            }
            // find existing token metadata
            const existing = tokens?.find(t => t.id === tokenId)
            if (!existing) return
            const newToken = generateApiKey(Number(existing.id?.slice(-2)) as keyof typeof apiTokenAccessLevels)
            newToken.name = existing.name
            newToken.createdAt = Date.now()
            const { error } = await updateAPIKey({
                orgId: organisation.id,
                type: "rotate",
                token: newToken,
                perms: userRole,
                prevId: existing.id
            })
            if (error) throw error
            await refreshTokens()
            await refreshOrganisation()
        } catch (error) {
            toast.error("Failed to rotate token", { description: `${error}` })
        }
    }

    // Delete
    async function deleteAPIKey(tokenId: string) {
        try {
            if (!organisation?.id) return
            if (!userRole || userRole === "viewer") {
                toast.error("Invalid permissions", { description: "You do not have sufficient permission to delete this api key." })
                return
            }
            const { error } = await updateAPIKey({
                orgId: organisation.id,
                type: "delete",
                token: { id: tokenId },
                perms: userRole,
            })
            if (error) throw error
            await refreshTokens()
            await refreshOrganisation()
        } catch (error) {
            toast.error("Failed to delete token", { description: `${error}` })
        }
    }

    function copyToClipboard(apiKey: string) {
        navigator.clipboard.writeText(apiKey)
        setCopiedKey(apiKey)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    function formatDate(timestamp: number) {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    function maskApiKey() {
        return "•".repeat(48)
    }

    if (orgLoading || tokensLoading) {
        return (
            <Center minH="192px" w="full">
                <Spinner size="lg" />
            </Center>
        )
    }

    if (organisation?.id && status !== "loading" && !orgLoading && !tokensLoading && tokensError) {
        return <Text color="red.600">Error loading tokens: {tokensError}</Text>
    }

    return (
        <VStack gap={6} align="stretch">
            <HStack justify="space-between">
                <Heading size="md">API Keys</Heading>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!organisation?.id || userRole === "viewer"}
                    onClick={() => setShowAddDialog(true)}
                >
                    <LuPlus size={16} />
                    Generate New
                </Button>
            </HStack>

            {/* Add API Key Dialog */}
            <AddAPIKeyDialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                addToken={createNewAPIKey}
            />

            {!tokens || tokens.length === 0 ? (
                <NoContent text="You have not generated any API keys" />
            ) : (
                <>
                    {tokens.map(token => {
                        const id = token.id as string
                        const showKey = showKeys[id] ?? false
                        return (
                            <Card.Root key={id} variant="outline">
                                <Card.Header>
                                    <HStack justify="space-between">
                                        <HStack gap={3}>
                                            <Center
                                                w="40px"
                                                h="40px"
                                                bg="orange.100"
                                                _dark={{ bg: "orange.900" }}
                                                borderRadius="full"
                                            >
                                                <LuKey size={20} color="var(--chakra-colors-orange-600)" />
                                            </Center>
                                            <Box>
                                                <Card.Title>{token.name}</Card.Title>
                                                <Card.Description>
                                                    Created {formatDate(token.createdAt as number)}
                                                </Card.Description>
                                            </Box>
                                        </HStack>
                                        <HStack gap={2}>
                                            <IconButton
                                                aria-label={showKey ? "Hide key" : "Show key"}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))}
                                            >
                                                {showKey ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                                            </IconButton>
                                            <IconButton
                                                aria-label="Copy key"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(id)}
                                            >
                                                {copiedKey === id ? (
                                                    <LuCheck size={16} color="var(--chakra-colors-green-500)" />
                                                ) : (
                                                    <LuCopy size={16} />
                                                )}
                                            </IconButton>
                                        </HStack>
                                    </HStack>
                                </Card.Header>

                                <Card.Body pt={4}>
                                    <Box
                                        p={3}
                                        bg="bg.muted"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="border"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Code
                                            fontSize="sm"
                                            bg="transparent"
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {showKey ? token.id : maskApiKey()}
                                        </Code>
                                    </Box>
                                </Card.Body>

                                <Card.Footer>
                                    <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color="fg.muted">
                                            Access Level: {token.id ? apiTokenAccessLevelsName[Number(id.slice(-2)) as keyof typeof apiTokenAccessLevels] : "Unknown"}
                                        </Text>
                                        <HStack gap={2}>
                                            <AlertContinue
                                                trigger={
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        color="orange.600"
                                                    >
                                                        <LuRotateCcw size={16} />
                                                        Rotate
                                                    </Button>
                                                }
                                                onConfirm={() => rotateAPIKey(id)}
                                                title="Are you sure?"
                                                description="This will delete your current key and generate a new one."
                                            />
                                            <AlertContinue
                                                trigger={
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        color="red.600"
                                                    >
                                                        <LuTrash2 size={16} />
                                                        Delete
                                                    </Button>
                                                }
                                                onConfirm={() => deleteAPIKey(id)}
                                                title="Are you sure?"
                                                description="This will permanently delete your API key."
                                            />
                                        </HStack>
                                    </HStack>
                                </Card.Footer>
                            </Card.Root>
                        )
                    })}

                    {/* Security Notice */}
                    <Box
                        bg={{ base: "orange.50", _dark: "orange.900/20" }}
                        border="1px solid"
                        borderColor={{ base: "orange.200", _dark: "orange.800" }}
                        borderRadius="lg"
                        p={4}
                    >
                        <HStack align="flex-start" gap={3}>
                            <Box color={{ base: "orange.600", _dark: "orange.400" }} mt={0.5}>
                                <LuTriangleAlert size={20} />
                            </Box>
                            <Box>
                                <Text fontWeight="medium" color={{ base: "orange.800", _dark: "orange.200" }}>
                                    Security Notice
                                </Text>
                                <Text fontSize="sm" color={{ base: "orange.700", _dark: "orange.300" }} mt={1}>
                                    Store your API key securely. If compromised, rotate it immediately.
                                    Never expose it in client-side code or public repositories.
                                </Text>
                            </Box>
                        </HStack>
                    </Box>
                </>
            )}
        </VStack>
    )
}

export default Authentication
