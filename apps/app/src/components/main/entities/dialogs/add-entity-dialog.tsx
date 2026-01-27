"use client";

import { entityLimits } from "@repo/constants";
import { IOrganisation } from "@repo/models";
import { createEntity } from "@/services/firebase/entities/create";
import { useState } from "react";
import { toast } from "sonner";
import {
    Button,
    Input,
    Textarea,
    VStack,
    Field,
    Text,
} from "@repo/ui";
import CustomDialog from "@/components/ui/dialog";
import { Plus } from "lucide-react";


interface Props {
    organisation: IOrganisation;
    refetchEntitiesCallback: () => void;
}

const AddEntityDialog: React.FC<Props> = ({ organisation, refetchEntitiesCallback }) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [logoPrimary, setLogoPrimary] = useState('')
    const [loading, setLoading] = useState(false)

    const subscriptionTier = organisation?.subscription ?? "free"
    const entityLimit = entityLimits[subscriptionTier as keyof typeof entityLimits]
    const currentEntityCount = organisation?.entities ?? 0
    const canAddEntity = entityLimit === -1 || currentEntityCount < entityLimit

    const handleSubmit = async () => {
        if (!organisation?.id) {
            toast.error('Organisation not found')
            return
        }

        if (!canAddEntity) {
            toast.error(`Entity limit reached. Upgrade your plan to create more entities.`)
            return
        }

        if (!name.trim()) {
            toast.error('Please enter an entity name')
            return
        }

        setLoading(true)

        try {
            const { error } = await createEntity({
                organisationId: organisation.id,
                name: name.trim(),
                description: description.trim() || undefined,
                logoPrimary: logoPrimary.trim() || undefined,
            })

            if (error) {
                throw new Error(error)
            }

            await refetchEntitiesCallback();

            toast.success('Entity created successfully!')

            // Reset form and close dialog
            setName('')
            setDescription('')
            setLogoPrimary('')
            setOpen(false)
        } catch (error) {
            console.error('Error creating entity:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to create entity')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                colorPalette="purple"
                size="sm"
                disabled={!canAddEntity}
                onClick={() => setOpen(true)}
            >
                <Plus />
                Add Entity
            </Button>

            <CustomDialog
                open={open}
                onOpenChange={setOpen}
                title="Create New Entity"
                onConfirm={handleSubmit}
            >
                <VStack gap={4} align="stretch">
                    <Field.Root required>
                        <Field.Label>Entity Name</Field.Label>
                        <Input
                            placeholder="e.g., My Company"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                        />
                        <Field.HelperText>
                            The name of your organization or brand
                        </Field.HelperText>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                            placeholder="Brief description of your entity..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows={3}
                        />
                        <Field.HelperText>
                            Optional description for internal reference
                        </Field.HelperText>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Logo URL</Field.Label>
                        <Input
                            placeholder="https://example.com/logo.png"
                            value={logoPrimary}
                            onChange={(e) => setLogoPrimary(e.target.value)}
                            disabled={loading}
                            type="url"
                        />
                        <Field.HelperText>
                            Optional URL to your primary logo image
                        </Field.HelperText>
                    </Field.Root>

                    {!canAddEntity && (
                        <Text
                            fontSize="sm"
                            color="red.500"
                            p={3}
                            bg="red.50"
                            borderRadius="md"
                        >
                            You&apos;ve reached your entity limit. Upgrade your plan to create more entities.
                        </Text>
                    )}
                </VStack>
            </CustomDialog>
        </>
    )
}

export default AddEntityDialog;
