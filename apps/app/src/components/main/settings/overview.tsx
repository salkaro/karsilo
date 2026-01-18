"use client"

// External Imports
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

// Local imports
import { IUser } from "@repo/models"
import { updateUser } from "@/services/firebase/update"
import { formatDateByTimeAgo } from "@/utils/formatters"
import {
    Avatar,
    Box,
    Button,
    Card,
    Field,
    Heading,
    HStack,
    Input,
    Separator,
    Spinner,
    Text,
    VStack
} from "@repo/ui"
import DialogDeleteUser from "./dialogs/dialog-delete-user"
import DialogImageUpload from "./dialogs/dialog-image-upload"

const Overview = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Derive initial user from session, but allow local edits
    const sessionUser = session?.user as IUser | undefined;
    const [userEdits, setUserEdits] = useState<Partial<IUser>>({});

    // Merge session user with local edits
    const user = sessionUser ? { ...sessionUser, ...userEdits } : undefined;

    const handleChange = (key: keyof IUser, value: unknown) => {
        setUserEdits((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSave() {
        setLoading(true);
        const { error } = await updateUser({ user: user as IUser });

        if (error) {
            toast.error("Failed to update user", {
                description: error,
            });
        } else {
            toast.success("Profile updated successfully");
        }

        setLoading(false);
    }

    // Get user initials
    const getUserInitials = () => {
        if (user?.firstname && user?.lastname) {
            return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
        } else if (user?.firstname) {
            return user.firstname[0].toUpperCase();
        } else if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return "U";
    };

    const handleOpenImageDialog = () => {
        setImageDialogOpen(true);
    };

    const handleSaveImage = (imageUrl: string) => {
        handleChange("brand", { imageUrl });
    };


    return (
        <VStack gap={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" width="full">
                <Box>
                    <Heading size="md">Personal</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Your personal information
                    </Text>
                </Box>
            </HStack>

            {/* Main Card */}
            <Card.Root size="md" variant="outline">
                <Card.Body>
                    <VStack gap={6} align="stretch">
                        {/* Profile Picture */}
                        <Box position="relative" width="fit-content">
                            <Avatar.Root
                                size="2xl"
                                cursor="pointer"
                                onClick={handleOpenImageDialog}
                                _hover={{ opacity: 0.85 }}
                            >
                                <Avatar.Fallback>{getUserInitials()}</Avatar.Fallback>
                                <Avatar.Image src={user?.brand?.imageUrl as string} />
                            </Avatar.Root>
                        </Box>

                        {/* Form fields */}
                        <Field.Root>
                            <Field.Label>First Name</Field.Label>
                            <Input
                                value={user?.firstname || ''}
                                onChange={(e) => handleChange('firstname', e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Last Name</Field.Label>
                            <Input
                                value={user?.lastname || ''}
                                onChange={(e) => handleChange('lastname', e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input
                                type="email"
                                value={user?.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </Field.Root>
                    </VStack>
                </Card.Body>

                <Card.Footer pt={2}>
                    <Box w="full" display="flex" justifyContent="flex-end">
                        <Button
                            colorPalette="purple"
                            size="sm"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading && <Spinner size="sm" mr={2} />}
                            {loading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Card.Footer>
            </Card.Root>

            {/* Joined date */}
            <Text fontSize="sm" color="gray.500" textAlign="right" pr={4}>
                Joined{' '}
                {user?.metadata?.createdAt
                    ? formatDateByTimeAgo(user.metadata.createdAt)
                    : 'N/A'}
            </Text>

            {/* Danger Zone */}
            <Box>
                <Heading size="md" mb={1}>
                    Danger zone
                </Heading>
                <Text color="gray.500" fontSize="sm">
                    Irreversible and destructive actions
                </Text>
            </Box>

            <Card.Root variant="outline" rounded="lg">
                <Card.Body>
                    <Heading size="md" color="red.600" mb={3}>
                        Delete user
                    </Heading>

                    <Separator />

                    <HStack justify="space-between" align="stretch" my={6}>
                        <Text color="gray.600">
                            Once your account is deleted, it cannot be recovered. Please make sure you&apos;re
                            absolutely certain.
                        </Text>

                        <Box>
                            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                                Delete user
                            </Button>
                        </Box>
                    </HStack>
                </Card.Body>
            </Card.Root>

            {/* Dialogs */}
            <DialogDeleteUser
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />
            <DialogImageUpload
                open={imageDialogOpen}
                onOpenChange={setImageDialogOpen}
                title="Update Profile Picture"
                currentImageUrl={user?.brand?.imageUrl}
                onSave={handleSaveImage}
                imageShape="circle"
            />
        </VStack>
    )
}

export default Overview
