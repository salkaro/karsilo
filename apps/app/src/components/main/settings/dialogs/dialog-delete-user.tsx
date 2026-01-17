"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { deleteUserAdmin } from "@/services/firebase/admin-delete"
import { withTokenRefresh } from "@/utils/token-refresh"
import { removeAllCookies } from "@/utils/cookie-handlers"
import {
    Box,
    Input,
    List,
    Text,
    VStack
} from "@repo/ui"
import CustomDialog from "@/components/ui/dialog"

interface Props {
    open: boolean
    onClose: () => void
}

const DialogDeleteUser: React.FC<Props> = ({ open, onClose }) => {
    const router = useRouter()
    const { data: session } = useSession()
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isOwner = session?.user.organisation?.role === "owner"

    async function handleSubmit() {
        if (!email.trim()) {
            toast.error("Email is required", {
                description: "Please enter your email to confirm account deletion."
            })
            return
        }
        if (session?.user?.email !== email) {
            toast.error("Incorrect email", {
                description: "The email you entered does not match your account. Please try again."
            })
            return
        }

        setIsSubmitting(true)

        // Step 1: Delete cookies
        removeAllCookies()

        // Step 2: Delete user
        try {
            await withTokenRefresh((idToken) => deleteUserAdmin({ idToken }))

            toast.success("User deleted", {
                description: "Your account has been permanently deleted.",
            })

            router.push("/")
        } catch {
            toast.error("Failed to delete account", {
                description: "Something went wrong while deleting your account. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            setEmail("")
            onClose()
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Delete user"
            confirmText="Delete"
            onConfirm={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Deleting..."
        >
            <VStack gap={6} align="stretch" py={4}>
                <Text fontSize="sm" color="fg.muted">
                    Deleting your account is permanent and cannot be undone.
                </Text>

                <List.Root gap={3}>
                    <List.Item display="flex" alignItems="flex-start" gap={2}>
                        <Text fontSize="2xl" lineHeight="1">•</Text>
                        <Text fontSize="sm" color="fg.muted">
                            Your personal account data will be permanently deleted and cannot be recovered.
                        </Text>
                    </List.Item>

                    {isOwner && (
                        <>
                            <List.Item display="flex" alignItems="flex-start" gap={2}>
                                <Text fontSize="2xl" lineHeight="1">•</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    The organisation you own will also be permanently deleted.
                                </Text>
                            </List.Item>
                            <List.Item display="flex" alignItems="flex-start" gap={2}>
                                <Text fontSize="2xl" lineHeight="1">•</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    All current members will not be deleted, but they will have this organisation removed from their account.
                                </Text>
                            </List.Item>
                            <List.Item display="flex" alignItems="flex-start" gap={2}>
                                <Text fontSize="2xl" lineHeight="1">•</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    Only billing and payment data will remain, securely stored by Stripe for compliance.
                                </Text>
                            </List.Item>
                        </>
                    )}
                </List.Root>

                <Text fontWeight="medium" color="red.500" fontSize="sm">
                    This action is irreversible. Please be certain before proceeding.
                </Text>

                <Box>
                    <Input
                        id="confirm-email"
                        type="text"
                        name="confirm-email-no-autofill"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email to confirm"
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                    />
                </Box>
            </VStack>
        </CustomDialog>
    )
}

export default DialogDeleteUser
