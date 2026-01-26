"use client";

import { useMemo, useState } from "react";
import { IEntity, IConnection } from "@repo/models";
import {
    Avatar,
    Text,
    HStack,
    VStack,
    Button,
    Menu,
    Portal,
} from "@repo/ui";
import CustomDialog from "@/components/ui/dialog";
import { LuEllipsisVertical } from "react-icons/lu";
import { DataTable, Column } from "@/components/ui/table";
import { formatDateByTimeAgo } from "@/utils/formatters";
import { deleteEntity } from "@/services/firebase/entities/delete";
import { toast } from "sonner";
import ManageConnectionDialog from "./dialogs/manage-connection-dialog";
import EditEntityDialog from "./dialogs/edit-entity-dialog";

interface Props {
    organisationId: string;
    entities: IEntity[];
    connections: IConnection[];
    refetchEntities: () => void;
}

const EntityTable: React.FC<Props> = ({
    organisationId,
    entities,
    connections,
    refetchEntities,
}) => {
    const [editingEntity, setEditingEntity] = useState<IEntity | null>(null);
    const [deletingEntity, setDeletingEntity] = useState<IEntity | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deletingEntity) return;

        setDeleting(true);
        try {
            const { error } = await deleteEntity({
                organisationId,
                entityId: deletingEntity.id,
            });

            if (error) throw new Error(error);

            toast.success("Entity deleted successfully");
            setDeletingEntity(null);
            refetchEntities();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete entity"
            );
        } finally {
            setDeleting(false);
        }
    };

    const columns: Column<IEntity>[] = useMemo(
        () => [
            {
                key: "entity",
                header: "Entity",
                render: (entity: IEntity) => (
                    <HStack gap={3}>
                        <Avatar.Root size="sm">
                            <Avatar.Image
                                src={
                                    entity.images?.logo?.primary ||
                                    entity.images?.profile?.square
                                }
                            />
                            <Avatar.Fallback name={entity.name}>
                                {entity.name?.charAt(0) || "?"}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <VStack align="start" gap={0}>
                            <Text fontWeight="medium" fontSize="sm">
                                {entity.name}
                            </Text>
                            {entity.owner && (
                                <Text fontSize="xs" color="gray.500">
                                    {entity.owner}
                                </Text>
                            )}
                        </VStack>
                    </HStack>
                ),
            },
            {
                key: "description",
                header: "Description",
                render: (entity: IEntity) => (
                    <Text fontSize="sm" color="gray.500" lineClamp={2}>
                        {entity.description || "\u2014"}
                    </Text>
                ),
            },
            {
                key: "connections",
                header: "Connections",
                render: (entity: IEntity) => {
                    const connection = connections?.find(
                        (c) => c.entityId === entity.id
                    );
                    return (
                        <ManageConnectionDialog
                            entity={entity}
                            connection={connection as IConnection}
                            onConnectionChange={refetchEntities}
                        />
                    );
                },
            },
            {
                key: "created",
                header: "Created",
                align: "right",
                render: (entity: IEntity) => (
                    <Text fontSize="sm" color="gray.500">
                        {formatDateByTimeAgo(entity.createdAt)}
                    </Text>
                ),
            },
            {
                key: "actions",
                header: "",
                align: "right",
                render: (entity: IEntity) => (
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
                                            onClick={() => setEditingEntity(entity)}
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            value="delete"
                                            color="red.500"
                                            onClick={() => setDeletingEntity(entity)}
                                        >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </HStack>
                ),
            },
        ],
        [connections, refetchEntities]
    );

    const searchFilter = (entity: IEntity, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            (entity.name?.toLowerCase().includes(q) ?? false) ||
            (entity.description?.toLowerCase().includes(q) ?? false) ||
            (entity.owner?.toLowerCase().includes(q) ?? false)
        );
    };

    return (
        <>
            <DataTable
                data={entities}
                columns={columns}
                getRowKey={(entity) => entity.id}
                searchPlaceholder="Search entities..."
                searchFilter={searchFilter}
                onRefresh={refetchEntities}
                emptyMessage="No entities found"
            />

            {editingEntity && (
                <EditEntityDialog
                    entity={editingEntity}
                    onClose={() => setEditingEntity(null)}
                    refetchEntitiesCallback={refetchEntities}
                    organisationId={organisationId}
                />
            )}

            <CustomDialog
                open={!!deletingEntity}
                onOpenChange={(open) => {
                    if (!open) setDeletingEntity(null);
                }}
                title="Delete Entity"
                confirmText="Delete"
                onConfirm={handleDelete}
                isLoading={deleting}
            >
                Are you sure you want to delete{" "}
                <Text as="span" fontWeight="semibold">
                    {deletingEntity?.name}
                </Text>
                ? This action cannot be undone.
            </CustomDialog>
        </>
    );
};

export default EntityTable;
