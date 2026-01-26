"use client"

import { Button, Dialog, DialogContentProps, Portal, Spinner } from "@repo/ui"
import React from "react"

interface Props extends DialogContentProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: React.ReactNode
    cancelText?: string
    confirmText?: string
    onConfirm?: () => void
    isLoading?: boolean
    loadingText?: string
    hideFooter?: boolean
}

const CustomDialog: React.FC<Props> = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    cancelText = "Cancel",
    confirmText = "Confirm",
    onConfirm,
    isLoading = false,
    loadingText,
    hideFooter = false,
    ...contentProps
}) => {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(e) => onOpenChange(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={{base: 2}}
                >
                    <Dialog.Content {...contentProps}>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                            {description && (
                                <Dialog.Description mt={2}>
                                    {description}
                                </Dialog.Description>
                            )}
                        </Dialog.Header>

                        <Dialog.Body>
                            {children}
                        </Dialog.Body>

                        {!hideFooter && (
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" disabled={isLoading} size="sm">
                                        {cancelText}
                                    </Button>
                                </Dialog.ActionTrigger>
                                {onConfirm && (
                                    <Button onClick={onConfirm} disabled={isLoading} size="sm">
                                        {isLoading && <Spinner size="sm" mr={2} />}
                                        {isLoading ? (loadingText || confirmText) : confirmText}
                                    </Button>
                                )}
                            </Dialog.Footer>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default CustomDialog
