"use client";

import { IEntity } from '@/models/entity';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    DialogBackdrop,
    DialogPositioner,
    DialogTrigger,
    Button,
    HStack,
    VStack,
    Text,
    Portal,
    Separator,
} from '@repo/ui';
import { IConnection } from '@/models/connection';
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
        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="center" size="lg">
            <DialogTrigger asChild>
                {hasConnections ? (
                    <HStack gap={2} cursor="pointer">
                        {hasConnections && (
                            <StripeIcon />
                        )}
                    </HStack>
                ) : (
                    <Button size="xs" variant="outline" colorPalette="gray">
                        Connect
                    </Button>
                )}
            </DialogTrigger>

            <Portal>
                <DialogBackdrop />
                <DialogPositioner>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manage Connections</DialogTitle>
                        </DialogHeader>

                        <Separator />

                        <DialogBody marginTop={4}>
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
                        </DialogBody>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>

                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogPositioner>
            </Portal>
        </DialogRoot>
    );
};

export default ManageConnectionDialog;
