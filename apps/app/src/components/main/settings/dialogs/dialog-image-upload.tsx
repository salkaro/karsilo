"use client"

import { useState } from "react"
import Image from "next/image"

import {
    Box,
    Center,
    Field,
    Input,
    VStack
} from "@repo/ui"
import CustomDialog from "@/components/ui/dialog"

interface DialogImageUploadProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    currentImageUrl?: string | null
    onSave: (imageUrl: string) => void
    imageShape?: "circle" | "square"
}

const DialogImageUpload = ({
    open,
    onOpenChange,
    title,
    currentImageUrl,
    onSave,
    imageShape = "circle"
}: DialogImageUploadProps) => {
    const [tempImageUrl, setTempImageUrl] = useState("")

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setTempImageUrl(currentImageUrl || "")
        }
        onOpenChange(isOpen)
    }

    const handleSave = () => {
        onSave(tempImageUrl)
        onOpenChange(false)
    }

    const isValidUrl = (urlString: string): boolean => {
        if (!urlString) return false
        try {
            const url = new URL(urlString)
            return url.protocol === "http:" || url.protocol === "https:"
        } catch {
            return false
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            confirmText="Save"
            onConfirm={handleSave}
        >
            <VStack gap={4} align="stretch">
                <Field.Root>
                    <Field.Label htmlFor="imageUrl">Image URL</Field.Label>
                    <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                    />
                </Field.Root>
                {isValidUrl(tempImageUrl) && (
                    <Center>
                        <Box
                            position="relative"
                            w="128px"
                            h="128px"
                            borderRadius={imageShape === "circle" ? "full" : "lg"}
                            overflow="hidden"
                            border="2px solid"
                            borderColor="border"
                        >
                            <Image
                                src={tempImageUrl}
                                alt="Preview"
                                fill
                                style={{ objectFit: "cover" }}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                }}
                            />
                        </Box>
                    </Center>
                )}
            </VStack>
        </CustomDialog>
    )
}

export default DialogImageUpload
