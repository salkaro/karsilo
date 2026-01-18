'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import {
    Box,
    Grid,
    Input,
    NativeSelect,
    Text,
    VStack
} from "@repo/ui"
import { IUser, IOrganisation } from '@repo/models'
import { levelOneAccess, levelsToIndex, OrgRoleType } from '@repo/constants'
import { updateOrganisationMember } from '@/services/firebase/update'
import CustomDialog from '@/components/ui/dialog'

interface Props {
    member: IUser;
    organisation: IOrganisation;
    refetch: () => Promise<void>;
    onClose: () => void;
}

const UpdateMemberDialog: React.FC<Props> = ({ member, organisation, refetch, onClose }) => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [accessLevel, setAccessLevel] = useState<string>(levelsToIndex[member.organisation?.role as keyof typeof levelsToIndex])

    async function handleSubmit() {
        setIsSubmitting(true);

        try {
            if (member.organisation) {
                member.organisation.role = levelOneAccess[Number(accessLevel)] as OrgRoleType;
                const { error } = await updateOrganisationMember({ member, organisation });
                if (error) throw error
                await refetch();
            }

            toast.success("Member updated", {
                description: "This member has been successfully updated",
            });

            setOpen(false);
            onClose();
        } catch {
            toast.error("Failed to update member", {
                description: "Something went wrong while updating this member. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen);
        if (!isOpen) onClose();
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Update member"
            confirmText="Update"
            onConfirm={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Updating..."
        >
            <VStack gap={4} align="stretch">
                <Box>
                    <Text fontWeight="medium" fontSize="sm" mb={2}>
                        First Name
                    </Text>
                    <Input
                        type="text"
                        disabled
                        value={member.firstname as string}
                        readOnly
                    />
                </Box>
                <Box>
                    <Text fontWeight="medium" fontSize="sm" mb={2}>
                        Last Name
                    </Text>
                    <Input
                        type="text"
                        disabled
                        value={member.lastname as string}
                        readOnly
                    />
                </Box>
                {/* Access Level */}
                <Grid templateColumns="1fr 3fr" alignItems="center" gap={4}>
                    <Text fontWeight="medium" fontSize="sm" textAlign="right">
                        Access Level
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={accessLevel}
                            onChange={(e) => setAccessLevel(e.target.value)}
                        >
                            {Object.entries(levelOneAccess.slice(0, Number(levelsToIndex[session?.user?.organisation?.role as keyof typeof levelsToIndex]) + 1)).map(([level, label]) => (
                                <option key={level} value={level}>
                                    {label.charAt(0).toUpperCase() + label.slice(1)}
                                </option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>
                </Grid>
            </VStack>
        </CustomDialog>
    )
}

export default UpdateMemberDialog
