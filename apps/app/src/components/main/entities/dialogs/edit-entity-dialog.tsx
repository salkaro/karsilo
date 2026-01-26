"use client";

import { IEntity } from '@repo/models';
import { updateEntity } from '@/services/firebase/entities/update';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Input,
    Textarea,
    VStack,
    Field,
} from '@repo/ui';
import CustomDialog from '@/components/ui/dialog';

interface Props {
    organisationId: string;
    entity: IEntity;
    onClose?: () => void;
    refetchEntitiesCallback?: () => void;
}

const EditEntityDialog: React.FC<Props> = ({ organisationId, entity, onClose, refetchEntitiesCallback }) => {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState(entity.name);
    const [description, setDescription] = useState(entity.description || '');
    const [logoPrimary, setLogoPrimary] = useState(entity.images?.logo?.primary || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(entity.name);
        setDescription(entity.description || '');
        setLogoPrimary(entity.images?.logo?.primary || '');
    }, [entity]);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            onClose?.();
        }, 200); // Wait for animation
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) handleClose();
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('Please enter an entity name');
            return;
        }

        // Check if anything changed
        const hasChanges =
            name !== entity.name ||
            description !== (entity.description || '') ||
            logoPrimary !== (entity.images?.logo?.primary || '');

        if (!hasChanges) {
            toast.info('No changes to save');
            handleClose();
            return;
        }

        setLoading(true);

        try {
            const updates: Record<string, unknown> = {};

            if (name !== entity.name) {
                updates.name = name.trim();
            }

            if (description !== (entity.description || '')) {
                updates.description = description.trim() || null;
            }

            if (logoPrimary !== (entity.images?.logo?.primary || '')) {
                updates.imagePath = 'images.logo.primary';
                updates.imageUrl = logoPrimary.trim() || null;
            }

            const { error } = await updateEntity({
                organisationId,
                entityId: entity.id,
                ...updates,
            });

            if (error) {
                throw new Error(error);
            }

            await refetchEntitiesCallback?.();

            toast.success('Entity updated successfully!');
            handleClose();
        } catch (error) {
            console.error('Error updating entity:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update entity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Edit"
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
                </VStack>
        </CustomDialog>
    );
};

export default EditEntityDialog;
