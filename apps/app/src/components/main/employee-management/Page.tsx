"use client"

import { Column, DataTable, SummaryCard } from "@/components/ui/table";
import { memberLimits } from "@/constants/limits";
import { useOrganisation } from "@/hooks/useOrganisation";
import { useOrganisationInvites } from "@/hooks/useOrganisationInvites";
import { useOrganisationMembers } from "@/hooks/useOrganisationMembers";
import { IUser } from "@/models/user";
import { updateOrganisationMember } from "@/services/firebase/update";
import { formatDateByTimeAgo } from "@/utils/formatters";
import { Avatar, Badge, Box, HStack, Text } from "@repo/ui";
import { Users } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

const Page = () => {
    const { organisation, loading: loadingOrganisation } = useOrganisation();
    const { members, loading: loadingMembers, refetch: refetchMembers } = useOrganisationMembers(organisation?.id as string);
    const { invites, loading: loadingInvites, refetch: refetchInvites } = useOrganisationInvites(organisation?.id as string);

    // Limits
    const subscriptionType = organisation?.subscription || 'free';
    const memberLimit = memberLimits[subscriptionType];

    // Get role badge color
    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "green";
            case "viewer":
                return "red";
            case "owner":
                return "pink";
            default:
                return "gray";
        }
    };

    // Define columns
    const columns: Column<IUser>[] = useMemo(() => [
        {
            key: "member",
            header: "Customer",
            render: (member: IUser) => {
                return (
                    <HStack gap={2}>
                        <Avatar.Root size="sm">
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
    ], []);



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
                icon: <Users size={20} />,
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
                searchPlaceholder="Search by customer, amount, or description..."
                searchFilter={searchFilter}
                summaryCards={summaryCards}
                onRefresh={onRefresh}
                loading={loadingOrganisation || loadingMembers }
                emptyMessage="No customers found"
            />
        </Box>
    )
}

export default Page
