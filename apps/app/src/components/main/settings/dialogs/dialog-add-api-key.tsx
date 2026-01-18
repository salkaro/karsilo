"use client"

import { useState } from "react"
import { toast } from "sonner"

import { apiTokenAccessLevelsName } from "@repo/constants"
import {
    Grid,
    Input,
    NativeSelect,
    Text,
    VStack
} from "@repo/ui"
import CustomDialog from "@/components/ui/dialog"

interface Props {
    open: boolean
    onClose: () => void
    addToken: (data: { name: string; accessLevel: number }) => Promise<{ error?: boolean }>
}

const AddAPIKeyDialog: React.FC<Props> = ({ open, onClose, addToken }) => {
    const [name, setName] = useState("")
    const [accessLevel, setAccessLevel] = useState<string>("0")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit() {
        if (!name.trim()) {
            toast.error("Name is required", { description: "Please provide all the relevant details to create an API key." })
            return
        }
        try {
            setIsSubmitting(true)
            const { error } = await addToken({ name: name.trim(), accessLevel: Number(accessLevel) })
            if (error) return
            toast.success("API key added", { description: `Successfully added '${name}' as an API key` })
            handleClose()
        } catch {
            toast.error("Failed to add API key", { description: `An error occurred when trying to add '${name}' as an API key. Please try again.` })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleClose() {
        setName("")
        setAccessLevel("0")
        onClose()
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            handleClose()
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="New API Key"
            confirmText="Create API Key"
            onConfirm={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
        >
            <VStack gap={4} align="stretch" py={4}>
                {/* Name */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Name
                    </Text>
                    <Input
                        id="key-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mobile App Key"
                    />
                </Grid>

                {/* Access Level */}
                <Grid templateColumns="1fr 3fr" gap={4} alignItems="center">
                    <Text fontSize="sm" textAlign="right">
                        Access Level
                    </Text>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            id="access-level"
                            value={accessLevel}
                            onChange={(e) => setAccessLevel(e.target.value)}
                        >
                            {Object.entries(apiTokenAccessLevelsName).map(([level, label]) => (
                                <option key={level} value={level}>
                                    {label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Grid>
            </VStack>
        </CustomDialog>
    )
}

export default AddAPIKeyDialog
