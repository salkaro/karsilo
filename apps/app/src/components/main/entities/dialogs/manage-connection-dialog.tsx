"use client";

import { IEntity, IConnection } from '@repo/models';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    Button,
    HStack,
    VStack,
    Text,
    Separator,
} from '@repo/ui';
import CustomDialog from '@/components/ui/dialog';
import { StripeIcon } from '@/icons/icons';

interface Props {
    entity: IEntity;
    connection: IConnection;
    onConnectionChange: () => void;
}

const ManageConnectionDialog: React.FC<Props> = ({ entity, connection, onConnectionChange }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const hasConnections = connection;

    const handleStripeConnect = async () => {
        if (hasConnections) {
            // Handle disconnect
            setIsLoading(true);
            try {
                const response = await fetch('/api/connections/disconnect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: "stripe", connectionId: connection.id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to disconnect');
                }

                toast.success('Stripe disconnected successfully');
                onConnectionChange?.();
                setOpen(false);
            } catch (error) {
                console.error('Error disconnecting Stripe:', error);
                toast.error('Failed to disconnect Stripe');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Handle connect - redirect to OAuth flow
            window.location.href = `/api/connections/stripe/connect?entityId=${entity.id}`;
        }
    };

    return (
        <>
            {hasConnections ? (
                <HStack gap={2} cursor="pointer" onClick={() => setOpen(true)}>
                    <StripeIcon />
                </HStack>
            ) : (
                <Button size="xs" variant="outline" colorPalette="gray" onClick={() => setOpen(true)}>
                    Connect
                </Button>
            )}

            <CustomDialog
                open={open}
                onOpenChange={setOpen}
                title="Manage Connections"
                cancelText="Close"
                hideFooter
            >
                <Separator mb={4} />

                <VStack gap={4} align="stretch">
                    {/* Stripe Connection */}
                    <HStack
                        justify="space-between"
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor="gray.200"
                    >
                        <HStack gap={3}>
                            <StripeIcon />
                            <VStack align="start" gap={0}>
                                <Text fontWeight="medium" fontSize="sm">
                                    Stripe Payments
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                    {hasConnections
                                        ? 'Connected to Stripe'
                                        : 'Accept payments and manage subscriptions'}
                                </Text>
                            </VStack>
                        </HStack>
                        <Button
                            size="sm"
                            colorPalette={hasConnections ? 'red' : 'purple'}
                            variant={hasConnections ? 'outline' : 'solid'}
                            onClick={handleStripeConnect}
                            loading={isLoading}
                        >
                            {hasConnections ? 'Disconnect' : 'Connect'}
                        </Button>
                    </HStack>
                </VStack>
            </CustomDialog>
        </>
    );
};

export default ManageConnectionDialog;
