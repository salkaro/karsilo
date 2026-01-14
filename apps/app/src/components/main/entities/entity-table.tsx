import { IEntity } from '@/models/entity'
import EditEntityDialog from './edit-entity-dialog';
import React from 'react'
import {
    Table,
    Avatar,
    Box,
    Text,
    HStack,
    VStack,
    IconButton,
    MenuRoot,
    MenuTrigger,
    MenuContent,
    MenuItem,
    Card,
} from '@repo/ui'
import ManageConnectionDialog from './manage-connection-dialog';
import { IConnection } from '@/models/connection';


interface Props {
    organisationId: string;
    entities: IEntity[];
    connections: IConnection[];
    refetchEntities: () => void;
}

const EntityTable: React.FC<Props> = ({ organisationId, entities, connections, refetchEntities }) => {
    const [editingEntity, setEditingEntity] = React.useState<IEntity | null>(null);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Card.Root>
                <Table.Root size="lg" variant="outline" striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Entity</Table.ColumnHeader>
                            <Table.ColumnHeader>Description</Table.ColumnHeader>
                            <Table.ColumnHeader>Connections</Table.ColumnHeader>
                            <Table.ColumnHeader>Created</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {entities.map((entity) => {
                            const connection = connections?.filter(c => c.entityId !== entity.id)[0];

                            return (
                                <Table.Row key={entity.id}>
                                    <Table.Cell>
                                        <HStack gap={3}>
                                            <Avatar.Root size="md">
                                                <Avatar.Image
                                                    src={entity.images?.logo?.primary || entity.images?.profile?.square}
                                                />
                                                <Avatar.Fallback name={entity.name} />
                                            </Avatar.Root>
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="semibold" fontSize="md">
                                                    {entity.name}
                                                </Text>
                                                {entity.owner && (
                                                    <Text fontSize="sm" color="fg.muted">
                                                        {entity.owner}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>
                                    </Table.Cell>

                                    <Table.Cell maxW="300px">
                                        <Text lineClamp={2} color="fg.muted">
                                            {entity.description || '—'}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <HStack gap={2}>
                                            <ManageConnectionDialog
                                                entity={entity}
                                                connection={connection}
                                                onConnectionChange={refetchEntities}
                                            />
                                        </HStack>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text fontSize="sm" color="fg.muted">
                                            {formatDate(entity.createdAt)}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell textAlign="right">
                                        <HStack gap={2} justify="flex-end">
                                            <MenuRoot>
                                                <MenuTrigger asChild>
                                                    <IconButton size="sm" variant="ghost" aria-label="More options">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="1" />
                                                            <circle cx="12" cy="5" r="1" />
                                                            <circle cx="12" cy="19" r="1" />
                                                        </svg>
                                                    </IconButton>
                                                </MenuTrigger>
                                                <MenuContent>
                                                    <MenuItem value="view" onClick={() => setEditingEntity(entity)}>Edit</MenuItem>
                                                    <MenuItem value="delete" color="red.500">Delete</MenuItem>
                                                </MenuContent>
                                            </MenuRoot>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>

                {entities.length === 0 && (
                    <Box p={8} textAlign="center">
                        <Text color="fg.muted" fontSize="lg">
                            No entities found
                        </Text>
                        <Text color="fg.muted" fontSize="sm" mt={2}>
                            Create your first entity to get started
                        </Text>
                    </Box>
                )}
            </Card.Root>

            {editingEntity && (
                <EditEntityDialog
                    entity={editingEntity}
                    onClose={() => setEditingEntity(null)}
                    refetchEntitiesCallback={refetchEntities}
                    organisationId={organisationId}
                />
            )}
        </>
    )
}

export default EntityTable
