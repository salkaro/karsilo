"use client"

import { Button, Dialog, Portal } from "@repo/ui"

interface Props {
    trigger: React.ReactNode
    onConfirm: () => void
    title: string
    description: string
}

const AlertContinue: React.FC<Props> = ({ trigger, onConfirm, title, description }) => {
    return (
        <Dialog.Root role="alertdialog">
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {description}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button colorPalette="red" onClick={onConfirm}>
                                    Continue
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default AlertContinue
