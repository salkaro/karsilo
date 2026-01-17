'use client'

import React, { useState } from 'react'
import { toast } from "sonner"
import { LuCopy, LuCheck, LuTrash2, LuMail, LuLoader } from 'react-icons/lu'

import {
    Badge,
    Box,
    Button,
    HStack,
    Skeleton,
    Table,
    Text,
    VStack
} from "@repo/ui"
import { useOrganisationInvites } from '@/hooks/useOrganisationInvites'
import { deleteInviteCodeAdmin } from '@/services/firebase/admin-delete'
import { withTokenRefresh } from '@/utils/token-refresh'
import { extractRoleBadgeVariant } from '@/utils/extract'
import { formatDateByTimeAgo } from '@/utils/formatters'
import { root } from '@/constants/site'
import CustomDialog from '@/components/ui/dialog'

interface Props {
    orgId: string | null;
    open: boolean;
    onClose: () => void;
}

const ActiveInviteCodesDialog: React.FC<Props> = ({ orgId, open, onClose }) => {
    const { invites, loading, error, refetch } = useOrganisationInvites(orgId);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

    function handleCopy(code: string) {
        navigator.clipboard.writeText(`${root}/sign-up?id=${code}`)
        setCopiedCode(code)
        toast.success("Link copied to clipboard")
        setTimeout(() => setCopiedCode(null), 2000)
    }

    async function handleDelete(inviteId: string) {
        if (!orgId) return;

        try {
            setDeletingId(inviteId);

            const { error } = await withTokenRefresh((idToken) =>
                deleteInviteCodeAdmin({
                    idToken,
                    inviteId,
                    orgId
                })
            );

            if (error) throw new Error(error);

            toast.success("Invite deleted");
            await refetch();
        } catch (err) {
            console.error("Failed to delete invite:", err);
            toast.error(err instanceof Error ? err.message : "Failed to delete invite");
        } finally {
            setDeletingId(null);
        }
    }

    async function handleSendEmail(_inviteId: string, _inviteEmail: string | null | undefined) {
        setSendingEmailId(_inviteId);
        toast.warning("Requires Implementation")
        setSendingEmailId(null);
    }

    function getBadgeColorPalette(variant: string): string {
        switch (variant) {
            case 'destructive':
                return 'red'
            case 'secondary':
                return 'gray'
            case 'outline':
                return 'gray'
            default:
                return 'brand'
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={(isOpen) => !isOpen && onClose()}
            title="Active Invite Codes"
            maxW="4xl"
            maxH="80vh"
            overflowY="auto"
        >
            <Box overflowX="auto">
                {loading && (
                    <VStack gap={2} align="stretch">
                        <Skeleton height="40px" borderRadius="lg" />
                        <Skeleton height="64px" borderRadius="lg" />
                        <Skeleton height="64px" borderRadius="lg" />
                        <Skeleton height="64px" borderRadius="lg" />
                    </VStack>
                )}

                {error && (
                    <Text fontSize="sm" color="red.500" py={4}>
                        Error: {error}
                    </Text>
                )}

                {!loading && !error && invites && invites.length === 0 && (
                    <Text fontSize="sm" color="fg.muted" textAlign="center" py={8}>
                        No active invite codes found. Create one using the &quot;Add Member&quot; button.
                    </Text>
                )}

                {!loading && !error && invites && invites.length > 0 && (
                    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Box overflowX="auto">
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Invite Code</Table.ColumnHeader>
                                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                                        <Table.ColumnHeader>Role</Table.ColumnHeader>
                                        <Table.ColumnHeader>Uses Left</Table.ColumnHeader>
                                        <Table.ColumnHeader>Created</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {invites.map((invite) => (
                                        <Table.Row key={invite.id}>
                                            <Table.Cell fontFamily="mono" fontSize="sm" whiteSpace="nowrap">
                                                {invite.id}
                                            </Table.Cell>
                                            <Table.Cell fontSize="sm" whiteSpace="nowrap">
                                                {invite.email ? (
                                                    <Text color="fg.muted">{invite.email}</Text>
                                                ) : (
                                                    <Text color="fg.subtle" fontStyle="italic">No email</Text>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell whiteSpace="nowrap">
                                                <Badge colorPalette={getBadgeColorPalette(extractRoleBadgeVariant(invite.role))}>
                                                    {invite.role?.charAt(0).toUpperCase()}{invite.role?.slice(1)}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell whiteSpace="nowrap">
                                                {invite.usesLeft ?? 0}
                                            </Table.Cell>
                                            <Table.Cell whiteSpace="nowrap">
                                                {formatDateByTimeAgo(invite.createdAt)}
                                            </Table.Cell>
                                            <Table.Cell textAlign="right" whiteSpace="nowrap">
                                                <HStack justify="flex-end" gap={2}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopy(invite.id as string)}
                                                        disabled={!invite.id}
                                                        title="Copy invite code"
                                                    >
                                                        {copiedCode === invite.id ? (
                                                            <LuCheck />
                                                        ) : (
                                                            <LuCopy />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSendEmail(invite.id as string, invite.email)}
                                                        disabled={!invite.email || sendingEmailId === invite.id}
                                                        title={invite.email ? "Send invite email" : "No email address"}
                                                    >
                                                        {sendingEmailId === invite.id ? (
                                                            <Box as={LuLoader} animation="spin 1s linear infinite" />
                                                        ) : (
                                                            <Box as={LuMail} color="blue.500" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(invite.id as string)}
                                                        disabled={deletingId === invite.id || !invite.id}
                                                        title="Delete invite code"
                                                    >
                                                        {deletingId === invite.id ? (
                                                            <Box as={LuLoader} animation="spin 1s linear infinite" />
                                                        ) : (
                                                            <Box as={LuTrash2} color="red.500" />
                                                        )}
                                                    </Button>
                                                </HStack>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Box>
                )}
            </Box>
        </CustomDialog>
    )
}

export default ActiveInviteCodesDialog
