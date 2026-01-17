'use client'

import React, { useState } from 'react'
import { toast } from "sonner"
import { LuCopy, LuCheck, LuX } from 'react-icons/lu'

import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    Input,
    NativeSelect,
    Spinner,
    Text,
    VStack
} from "@repo/ui"
import { generateInviteCode } from '@/utils/generate'
import { IOrganisation } from '@/models/organisation'
import { createMemberInvite } from '@/services/firebase/create'
import { IMemberInvite } from '@/models/invite'
import { memberLimits } from '@/constants/limits'
import { OrgRoleType } from '@/constants/access'
import { useOrganisationInvites } from '@/hooks/useOrganisationInvites'
import { useTokens } from '@/hooks/useTokens'
import CustomDialog from '@/components/ui/dialog'

const roleOptions: OrgRoleType[] = ["viewer", "developer", "admin"]

interface Props {
    organisation?: IOrganisation;
    open: boolean;
    onClose: () => void;
}

const AddMemberDialog: React.FC<Props> = ({ organisation, open, onClose }) => {
    const [role, setRole] = useState<string>('viewer');
    const { refetch } = useOrganisationInvites(organisation?.id as string);
    const { tokens } = useTokens(organisation?.id as string);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState<string | null>(null);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [uses, setUses] = useState('');
    const [emails, setEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState('');

    let memberLimit = 0;
    if (organisation) {
        memberLimit = memberLimits[organisation?.subscription as keyof typeof memberLimits]
    }

    const roleInfo = {
        "viewer": "Can view data and dashboard, but cannot make any changes.",
        "developer": "Can read data and add api keys, but cannot edit organisation data or employees.",
        "admin": "Full access to the organisation and entities",
    };

    function handleAddEmail() {
        const trimmedEmail = emailInput.trim().toLowerCase();

        if (!trimmedEmail) return;

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (emails.includes(trimmedEmail)) {
            toast.error("Email already added");
            return;
        }

        const newEmails = [...emails, trimmedEmail];
        setEmails(newEmails);
        setUses(String(newEmails.length));
        setEmailInput('');
    }

    function handleRemoveEmail(emailToRemove: string) {
        const newEmails = emails.filter(e => e !== emailToRemove);
        setEmails(newEmails);
        setUses(newEmails.length > 0 ? String(newEmails.length) : '');
    }

    function handleEmailKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    }

    async function handleSubmit() {
        try {
            setIsSubmitting(true);

            // Find admin API key if emails are provided
            let adminToken = null;
            if (emails.length > 0) {
                adminToken = tokens?.find(token => token.id?.endsWith('00'));
                if (!adminToken?.id) {
                    toast.error("No admin API key found. Please create an admin API key first to send invite emails.");
                    setIsSubmitting(false);
                    return;
                }
            }

            // Create invites for each email (or one invite if no emails)
            const invitesToCreate = emails.length > 0 ? emails : [null];
            const createdCodes: string[] = [];

            // Calculate uses per email - divide total uses by number of emails
            const usesPerInvite = emails.length > 0
                ? Math.floor(Number(uses) / emails.length)
                : Number(uses);

            for (const email of invitesToCreate) {
                const newCode = generateInviteCode();
                createdCodes.push(newCode);

                const invite: IMemberInvite = {
                    id: newCode,
                    orgId: organisation?.id as string,
                    usesLeft: usesPerInvite,
                    role,
                    email: email,
                }

                const { error } = await createMemberInvite({ invite });
                if (error) throw error;

                // Send email if this invite has an email and we have an admin token
                if (email && adminToken?.id) {
                    toast.warning("Requires Implementation")
                }
            }

            await refetch();

            if (emails.length > 0) {
                toast.success(`${emails.length} invitation(s) created and sent`);
            } else {
                toast.success("Invitation created");
                setCode(createdCodes[0]);
            }

            // Reset form
            setEmails([]);
            setEmailInput('');

            // Only show code if no emails (manual sharing)
            if (emails.length === 0) {
                setCode(createdCodes[0]);
            }
        } catch (err) {
            console.error("Failed to create invitation:", err)
            toast.error("Failed to create invitation")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleCopy(value: string, label: string) {
        navigator.clipboard.writeText(value)
        setCopiedItem(label)
        setTimeout(() => setCopiedItem(null), 2000)
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            // Reset state when closing
            setCode(null);
            setEmails([]);
            setEmailInput('');
            setUses('');
            setRole('viewer');
            onClose();
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Invite New Member"
            confirmText={emails.length > 0 ? `Send ${emails.length} Invitation${emails.length > 1 ? 's' : ''}` : 'Generate Invitation'}
            onConfirm={code ? undefined : handleSubmit}
            isLoading={isSubmitting}
            loadingText="Processing..."
            hideFooter={!!code}
        >
            {/* Role */}
            {!code && (
                <VStack gap={4} align="stretch">
                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={2}>
                            Email Addresses (optional)
                        </Text>
                        <HStack gap={2}>
                            <Input
                                id="email"
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleEmailKeyPress}
                                placeholder="member@example.com"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddEmail}
                                disabled={!emailInput.trim()}
                            >
                                Add
                            </Button>
                        </HStack>
                        {emails.length > 0 && (
                            <Flex flexWrap="wrap" gap={2} mt={2}>
                                {emails.map((email) => (
                                    <Badge key={email} colorPalette="gray" display="flex" alignItems="center" gap={1}>
                                        {email}
                                        <Box
                                            as={LuX}
                                            w="12px"
                                            h="12px"
                                            cursor="pointer"
                                            _hover={{ color: "red.500" }}
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                handleRemoveEmail(email);
                                            }}
                                        />
                                    </Badge>
                                ))}
                            </Flex>
                        )}
                        <Text fontSize="xs" color="fg.muted" mt={2}>
                            {emails.length > 0
                                ? `${emails.length} email(s) added - invitations will be sent automatically`
                                : 'Add emails to send invitation links directly, or leave empty to generate a code for manual sharing'}
                        </Text>
                    </Box>

                    <Grid
                        templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                        gap={6}
                    >
                        <HStack gap={4}>
                            <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">
                                Role
                            </Text>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    {roleOptions.map((roleOption) => (
                                        <option key={roleOption} value={roleOption}>
                                            {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </HStack>
                        <HStack gap={4}>
                            <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">
                                Uses
                            </Text>
                            <Input
                                id="uses"
                                type="number"
                                value={uses}
                                disabled={emails.length > 0}
                                min={1}
                                max={memberLimit}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (isNaN(value)) {
                                        setUses('');
                                    } else if (value <= memberLimit) {
                                        setUses(String(value));
                                    }
                                }}
                                placeholder={`Max ${memberLimit}`}
                            />
                        </HStack>
                    </Grid>

                    <Grid templateColumns="auto 1fr" gap={2} px={2} alignItems="center" mt={4}>
                        <Text fontSize="sm" color="fg.muted">
                            {roleInfo[role as keyof typeof roleInfo]}
                        </Text>
                    </Grid>
                </VStack>
            )}

            {/* Code + Link display */}
            {code && (
                <VStack gap={3} align="stretch">
                    <HStack>
                        <Input fontSize="sm" value={code} readOnly />
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(code, "Code")}>
                            {copiedItem === "Code" ? <LuCheck /> : <LuCopy />}
                        </Button>
                    </HStack>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Close
                    </Button>
                </VStack>
            )}
        </CustomDialog>
    )
}

export default AddMemberDialog
