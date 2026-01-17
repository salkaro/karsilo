"use client"

// External Imports
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LuCamera } from "react-icons/lu"
import { toast } from "sonner"
import Image from "next/image"

// Local Imports
import { IOrganisation } from "@/models/organisation"
import { useOrganisation } from "@/hooks/useOrganisation"
import { updateOrganisation } from "@/services/firebase/update"
import { levelTwoAccess, levelThreeAccess } from "@/constants/access"
import { currencies } from "@/constants/currencies"
import {
    Box,
    Button,
    Card,
    Field,
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

    // States
    const [changes, setChanges] = useState<Partial<IOrganisation>>({})
    const [loading, setLoading] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)

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
                                    <NativeSelect.Root disabled={hasLevelThreeAccess}>
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
                                        colorPalette="purple"
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
