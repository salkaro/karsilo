"use client"

import { Column, DataTable, SummaryCard } from "@/components/ui/table";
import { levelThreeAccess, OrgRoleType } from "@/constants/access";
import { memberLimits } from "@/constants/limits";
import { useOrganisationInvites } from "@/hooks/useOrganisationInvites";
import { useOrganisationMembers } from "@/hooks/useOrganisationMembers";
import { IOrganisation } from "@/models/organisation";
import { IUser } from "@/models/user";
import { updateOrganisationMember } from "@/services/firebase/update";
import { formatDateByTimeAgo } from "@/utils/formatters";
import { Avatar, Badge, Box, Button, HStack, Menu, Portal, Text } from "@repo/ui";
import { LuEllipsisVertical, LuUsers } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import UpdateMemberDialog from "./dialogs/dialog-update-member";

interface Props {
    organisation: IOrganisation;
}

const EmployeeTable: React.FC<Props> = ({ organisation }) => {
    const { data: session } = useSession();
    const { members, loading: loadingMembers, refetch: refetchMembers } = useOrganisationMembers(organisation?.id as string);
    const { refetch: refetchInvites } = useOrganisationInvites(organisation?.id as string);

    // Limits
    const subscriptionType = organisation?.subscription || 'free';
    const memberLimit = memberLimits[subscriptionType];

    const hasLevelThreeAccess = levelThreeAccess.includes(session?.user.organisation?.role as OrgRoleType);

    const [editingMember, setEditingMember] = useState<IUser | null>(null);

    // Get role badge color
    const getRoleColor = (role: string) => {
        switch (role) {
            case "member":
                return "blue";
            case "admin":
                return "green";
            case "owner":
                return "pink";
            default:
                return "gray";
        }
    };

    // Define columns
    const columns: Column<IUser>[] = useMemo(() => {
        const baseColumns: Column<IUser>[] = [
            {
                key: "member",
                header: "Member",
                render: (member: IUser) => {
                    return (
                        <HStack gap={2}>
                            <Avatar.Root size="sm">
                                <Avatar.Image src={member?.brand?.imageUrl as string} />
                                <Avatar.Fallback>
                                    {member?.firstname?.charAt(0) || member?.email?.charAt(0)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <Text fontSize="sm" fontWeight="medium">
                                {`${member?.firstname} ${member?.lastname}` || "Unknown"}
                            </Text>
                        </HStack>
                    );
                },
            },
            {
                key: "email",
                header: "Email",
                render: (member: IUser) => (
                    <Text fontSize="sm" color="gray.600">
                        {member.email}
                    </Text>
                ),
            },
            {
                key: "role",
                header: "Role",
                render: (member: IUser) => (
                    <Badge
                        size="sm"
                        colorPalette={getRoleColor(member.organisation?.role as string)}
                        variant="subtle"
                    >
                        {member.organisation?.role && (member.organisation?.role.charAt(0).toUpperCase() + member.organisation?.role.slice(1))}
                    </Badge>
                ),
            },
            {
                key: "joined",
                header: "Joined",
                render: (member: IUser) => (
                    <Text fontSize="sm" color="gray.600">
                        {formatDateByTimeAgo(member.organisation?.joinedAt)}
                    </Text>
                ),
            },
        ];

        // Add actions column if user has level three access
        if (hasLevelThreeAccess) {
            baseColumns.push({
                key: "actions",
                header: "",
                render: (member: IUser) => {
                    const canEdit = levelThreeAccess.includes(session?.user.organisation?.role as string) &&
                        member.id !== session?.user.id &&
                        member.organisation?.role !== "owner";

                    if (!canEdit) {
                        return <Box />;
                    }

                    return (
                        <HStack justify="flex-end">
                            <Menu.Root>
                                <Menu.Trigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        color="fg.muted"
                                    >
                                        <LuEllipsisVertical />
                                    </Button>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content minW="128px">
                                            <Menu.Item
                                                value="edit"
                                                onClick={() => setEditingMember(member)}
                                            >
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item
                                                value="remove"
                                                color="red.500"
                                                onClick={() => handleRemove(member)}
                                            >
                                                Remove
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </HStack>
                    );
                },
            });
        }

        return baseColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLevelThreeAccess, session?.user.organisation?.role, session?.user.id, refetchMembers]);



    async function onRefresh() {
        await refetchMembers();
        await refetchInvites();
    }

    // Search filter
    const searchFilter = (member: IUser, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            (member.firstname?.toLowerCase().includes(q) ?? false) ||
            (member.lastname?.toLowerCase().includes(q) ?? false) ||
            (member.email?.toLowerCase().includes(q) ?? false) ||
            (member.organisation?.role?.toLowerCase().includes(q) ?? false)
        );
    };

    // Calculate totals
    const summaryCards: SummaryCard[] = useMemo(() => {
        const numMembers = members?.length ?? 0;
        return [
            {
                icon: <LuUsers size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "",
                value: `${numMembers} / ${memberLimit}`
            },
        ];
    }, [members, memberLimit]);


    async function handleRemove(member: IUser) {
        try {
            const { error } = await updateOrganisationMember({ member, organisation, remove: true });
            if (error) throw error;

            toast("Member removed", {
                description: "This member has been successfully removed",
            });

        } catch {
            toast("Failed to remove member", {
                description: "Something went wrong while removing this member. Please try again.",
            });
        }
    }

    return (
        <Box>
            <DataTable
                data={members ?? []}
                columns={columns}
                getRowKey={(member: IUser) => member.id}
                searchPlaceholder="Search by member, email, or role..."
                searchFilter={searchFilter}
                summaryCards={summaryCards}
                onRefresh={onRefresh}
                loading={loadingMembers}
                emptyMessage="No members found"
            />
            {editingMember && (
                <UpdateMemberDialog
                    member={editingMember}
                    organisation={organisation}
                    refetch={refetchMembers}
                    onClose={() => setEditingMember(null)}
                />
            )}
        </Box>
    )
}

export default EmployeeTable
