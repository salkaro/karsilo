"use client"

// External Imports
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LuCamera } from "react-icons/lu"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Local Imports
import { IOrganisation } from "@repo/models"
import { useOrganisation } from "@/hooks/useOrganisation"
import { updateOrganisation } from "@/services/firebase/update"
import { createOrganisation } from "@/services/firebase/admin-create"
import { joinOrganisationAdmin } from "@/services/firebase/admin-update"
import { levelTwoAccess, levelThreeAccess, currencies } from "@repo/constants"
import {
    Box,
    Button,
    Card,
    Field,
    Flex,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Spinner,
    Text,
    VStack
} from "@repo/ui"
import DialogImageUpload from "./dialogs/dialog-image-upload"
import { formatDateByTimeAgo } from "@/utils/formatters"

const Organisation = () => {
    // Hooks
    const { data: session } = useSession()
    const { organisation, refetch } = useOrganisation()
    const router = useRouter()

    // States
    const [changes, setChanges] = useState<Partial<IOrganisation>>({})
    const [loading, setLoading] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)

    // No-org states
    const [orgAction, setOrgAction] = useState<"create" | "join">("create")
    const [newOrgName, setNewOrgName] = useState("")
    const [newOrgCurrency, setNewOrgCurrency] = useState("")
    const [joinCode, setJoinCode] = useState("")

    const hasLevelTwoAccess = levelTwoAccess.includes(session?.user.organisation?.role as string)
    const hasLevelThreeAccess = levelThreeAccess.includes(session?.user.organisation?.role as string)

    // Merge organisation with any pending changes
    const updateOrg = organisation ? { ...organisation, ...changes } : undefined

    const handleChange = (key: keyof IOrganisation, value: unknown) => {
        setChanges((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSave() {
        if (!hasLevelThreeAccess) return

        setLoading(true)

        const { error } = await updateOrganisation({ organisation: updateOrg as IOrganisation })

        if (error) {
            toast.error("Failed to update organisation", {
                description: error,
            })
        } else {
            toast.success("Organisation updated successfully")
            setChanges({})
        }
        refetch()

        setLoading(false)
    }

    async function handleCreateOrJoin(e: React.FormEvent) {
        e.preventDefault()

        if (!session?.user?.id || !session?.user?.email) {
            toast.error("Session not ready. Please try again.")
            return
        }

        setLoading(true)
        try {
            if (orgAction === "create") {
                if (!newOrgName.trim()) {
                    toast.error("Please enter an organisation name")
                    return
                }

                const { error } = await createOrganisation({
                    name: newOrgName.trim(),
                    ownerId: session.user.id,
                    email: session.user.email,
                    currency: newOrgCurrency || undefined,
                })

                if (error) throw error
                toast.success("Organisation created successfully!")
            } else {
                if (!joinCode.trim()) {
                    toast.error("Please enter an invite code")
                    return
                }

                const { error } = await joinOrganisationAdmin({
                    code: joinCode.trim(),
                    uid: session.user.id,
                })

                if (error) throw new Error(error)
                toast.success("Joined organisation successfully!")
            }

            router.push("/preparing")
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Something went wrong",
                { description: "Organisation may not exist or invite code is invalid" }
            )
        } finally {
            setLoading(false)
        }
    }

    // Get organisation initials
    const getOrgInitials = () => {
        if (updateOrg?.name) {
            const words = updateOrg.name.trim().split(/\s+/)
            if (words.length >= 2) {
                return `${words[0][0]}${words[1][0]}`.toUpperCase()
            }
            return updateOrg.name.substring(0, 2).toUpperCase()
        }
        return "ORG"
    }

    const handleOpenImageDialog = () => {
        if (!hasLevelThreeAccess) return
        setImageDialogOpen(true)
    }

    const handleSaveImage = (imageUrl: string) => {
        handleChange("brand", { imageUrl })
    }

    return (
        <VStack gap={4} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="md">Organisation</Heading>
                <Text color="gray.500" fontSize="sm">
                    Your organisation information
                </Text>
            </Box>

            {!organisation && (
                <Card.Root variant="outline">
                    <Card.Body>
                        <VStack gap={5} align="stretch">
                            <Text color="gray.600" fontSize="sm">
                                You are not part of an organisation. Create a new one or join an existing organisation with an invite code.
                            </Text>

                            <Flex gap={4}>
                                <Button
                                    variant={orgAction === "create" ? "solid" : "ghost"}
                                    onClick={() => setOrgAction("create")}
                                    size="sm"
                                >
                                    Create New
                                </Button>
                                <Button
                                    variant={orgAction === "join" ? "solid" : "ghost"}
                                    onClick={() => setOrgAction("join")}
                                    size="sm"
                                >
                                    Join Existing
                                </Button>
                            </Flex>

                            <Box as="form" onSubmit={handleCreateOrJoin}>
                                {orgAction === "create" ? (
                                    <VStack gap={4} align="stretch">
                                        <Field.Root required>
                                            <Field.Label>Organisation Name</Field.Label>
                                            <Input
                                                value={newOrgName}
                                                onChange={(e) => setNewOrgName(e.target.value)}
                                                placeholder="e.g. Salkaro Inc."
                                                disabled={loading}
                                            />
                                        </Field.Root>
                                        <Field.Root>
                                            <Field.Label>Currency</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field
                                                    value={newOrgCurrency}
                                                    onChange={(e) => setNewOrgCurrency(e.target.value)}
                                                >
                                                    <option value="">Select currency</option>
                                                    {currencies.map((c) => (
                                                        <option key={c.code} value={c.code}>
                                                            {c.symbol} - {c.name} ({c.code})
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </Field.Root>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={loading || !newOrgName.trim()}
                                            >
                                                {loading && <Spinner size="sm" mr={2} />}
                                                {loading ? "Creating..." : "Create Organisation"}
                                            </Button>
                                        </Box>
                                    </VStack>
                                ) : (
                                    <VStack gap={4} align="stretch">
                                        <Field.Root required>
                                            <Field.Label>Invite Code</Field.Label>
                                            <Input
                                                value={joinCode}
                                                onChange={(e) => setJoinCode(e.target.value)}
                                                placeholder="e.g. AbCd1234"
                                                disabled={loading}
                                            />
                                            <Field.HelperText>
                                                Ask your organisation admin for an invite code
                                            </Field.HelperText>
                                        </Field.Root>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={loading || !joinCode.trim()}
                                            >
                                                {loading && <Spinner size="sm" mr={2} />}
                                                {loading ? "Joining..." : "Join Organisation"}
                                            </Button>
                                        </Box>
                                    </VStack>
                                )}
                            </Box>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            )}

            {organisation && (
                <>
                    <Card.Root variant="outline">
                        <Card.Body>
                            <VStack gap={4} align="stretch">
                                {/* Organisation Logo */}
                                <HStack gap={4}>
                                    <Box
                                        position="relative"
                                        cursor={hasLevelThreeAccess ? "pointer" : "not-allowed"}
                                        onClick={handleOpenImageDialog}
                                        role="group"
                                        flexShrink={0}
                                    >
                                        {updateOrg?.brand?.imageUrl ? (
                                            <Image
                                                src={updateOrg.brand.imageUrl}
                                                alt="Organisation Logo"
                                                width={500}
                                                height={500}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                    border: "2px solid var(--chakra-colors-border)"
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                w="80px"
                                                h="80px"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="border"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bg="gray.100"
                                                _dark={{ bg: "gray.800" }}
                                            >
                                                <Text fontSize="2xl" fontWeight="semibold" color="gray.500">
                                                    {getOrgInitials()}
                                                </Text>
                                            </Box>
                                        )}
                                        {/* Hover overlay */}
                                        {hasLevelThreeAccess && (
                                            <Box
                                                position="absolute"
                                                inset={0}
                                                bg="blackAlpha.600"
                                                borderRadius="lg"
                                                opacity={0}
                                                _groupHover={{ opacity: 1 }}
                                                transition="opacity 0.2s"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <LuCamera size={32} color="white" />
                                            </Box>
                                        )}
                                    </Box>
                                </HStack>

                                {hasLevelTwoAccess && (
                                    <Field.Root>
                                        <Field.Label>ID</Field.Label>
                                        <Input
                                            value={organisation?.id || ""}
                                            readOnly
                                        />
                                    </Field.Root>
                                )}

                                <Field.Root>
                                    <Field.Label>Name</Field.Label>
                                    <Input
                                        value={updateOrg?.name || ""}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        readOnly={!hasLevelThreeAccess}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Currency</Field.Label>
                                    <NativeSelect.Root disabled={!hasLevelThreeAccess}>
                                        <NativeSelect.Field
                                            value={updateOrg?.currency || ""}
                                            onChange={(e) => handleChange("currency", e.target.value)}
                                        >
                                            <option value="">Select currency</option>
                                            {currencies.map((currency) => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.symbol} - {currency.name} ({currency.code})
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>
                            </VStack>
                        </Card.Body>

                        {hasLevelThreeAccess && (
                            <Card.Footer>
                                <Box w="full" display="flex" justifyContent="flex-end">
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading && <Spinner size="sm" mr={2} />}
                                        {loading ? "Updating..." : "Save Changes"}
                                    </Button>
                                </Box>
                            </Card.Footer>
                        )}
                    </Card.Root>

                    {/* Footer info */}
                    <HStack justify="space-between" px={4}>
                        <Text fontSize="sm" color="gray.500">
                            {organisation?.members} active member{(organisation?.members && organisation?.members > 1) ? "s" : ""}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Created{" "}
                            {updateOrg?.createdAt
                                ? formatDateByTimeAgo(updateOrg.createdAt)
                                : "N/A"}
                        </Text>
                    </HStack>
                </>
            )}

            {/* Image Upload Dialog */}
            <DialogImageUpload
                open={imageDialogOpen}
                onOpenChange={setImageDialogOpen}
                title="Update Organisation Logo"
                currentImageUrl={updateOrg?.brand?.imageUrl}
                onSave={handleSaveImage}
                imageShape="square"
            />
        </VStack>
    )
}

export default Organisation
