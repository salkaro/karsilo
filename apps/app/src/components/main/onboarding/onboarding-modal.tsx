"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogBackdrop,
    DialogPositioner,
    Button,
    Input,
    Textarea,
    VStack,
    HStack,
    Box,
    Text,
    Field,
    Portal,
} from "@repo/ui";
import {
    ArrowRight,
    ArrowLeftRight,
    Users,
    FileBarChart,
    Package,
} from "lucide-react";
import { useOrganisation } from "@/hooks/useOrganisation";
import { createEntity } from "@/services/firebase/entities/create";
import { entitiesCookieKey } from "@/constants/cookies";
import { setSessionStorage } from "@/utils/storage-handlers";
import { useRouter } from "next/navigation";

const FEATURES = [
    {
        icon: ArrowLeftRight,
        title: "Payments",
        desc: "Track and manage all your payment transactions",
    },
    {
        icon: Users,
        title: "Customers",
        desc: "View and manage your customer base",
    },
    {
        icon: FileBarChart,
        title: "Reports",
        desc: "Generate detailed business reports",
    },
    {
        icon: Package,
        title: "Products",
        desc: "Manage your product catalog and pricing",
    },
];

export default function OnboardingModal() {
    const router = useRouter();
    const { organisation, loading: orgLoading, refetch: refetchOrg } = useOrganisation();

    const [step, setStep] = useState<1 | 2>(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logoPrimary, setLogoPrimary] = useState("");
    const [loading, setLoading] = useState(false);

    const isOpen = !orgLoading && organisation !== null && (organisation.entities ?? 0) === 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!organisation?.id) {
            toast.error("Organisation not found");
            return;
        }

        if (!name.trim()) {
            toast.error("Please enter an entity name");
            return;
        }

        setLoading(true);

        try {
            const { entity, error } = await createEntity({
                organisationId: organisation.id,
                name: name.trim(),
                description: description.trim() || undefined,
                logoPrimary: logoPrimary.trim() || undefined,
            });

            if (error) {
                throw new Error(error);
            }

            if (entity) {
                const storageKey = `${organisation.id}_${entitiesCookieKey}`;
                setSessionStorage(storageKey, JSON.stringify([entity]));
            }

            toast.success("Entity created successfully! Welcome to Karsilo.");
            await refetchOrg();
            router.push("/entities")
        } catch (error) {
            console.error("Error creating entity:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to create entity"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={() => { }}
            placement="center"
            size="md"
            closeOnInteractOutside={false}
            closeOnEscape={false}
        >
            <Portal>
                <DialogBackdrop />
                <DialogPositioner>
                    <DialogContent>
                        {step === 1 && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Welcome to Karsilo</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                    <VStack gap={5} align="stretch">
                                        <Text color="gray.600" fontSize="sm">
                                            Karsilo helps you monitor and manage multiple Stripe
                                            accounts from one place. Create an entity to represent
                                            a business, brand, or project you want to track.
                                        </Text>

                                        <VStack gap={2} align="stretch">
                                            {FEATURES.map((feature) => (
                                                <HStack
                                                    key={feature.title}
                                                    gap={3}
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="lg"
                                                >
                                                    <Box
                                                        p={2}
                                                        bg="purple.50"
                                                        borderRadius="md"
                                                        color="purple.600"
                                                    >
                                                        <feature.icon size={18} />
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="semibold" fontSize="sm">
                                                            {feature.title}
                                                        </Text>
                                                        <Text fontSize="xs" color="gray.500">
                                                            {feature.desc}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                            ))}
                                        </VStack>

                                        <Text fontSize="xs" color="gray.400">
                                            Create your first entity to unlock all features.
                                        </Text>
                                    </VStack>
                                </DialogBody>
                                <DialogFooter>
                                    <Button
                                        colorPalette="purple"
                                        onClick={() => setStep(2)}
                                    >
                                        Get Started
                                        <ArrowRight size={16} />
                                    </Button>
                                </DialogFooter>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Create Your First Entity</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <DialogBody>
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
                                                    onChange={(e) =>
                                                        setDescription(e.target.value)
                                                    }
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
                                                    onChange={(e) =>
                                                        setLogoPrimary(e.target.value)
                                                    }
                                                    disabled={loading}
                                                    type="url"
                                                />
                                                <Field.HelperText>
                                                    Optional URL to your primary logo image
                                                </Field.HelperText>
                                            </Field.Root>
                                        </VStack>
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            disabled={loading}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorPalette="purple"
                                            loading={loading}
                                            disabled={!name.trim()}
                                        >
                                            Create Entity
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </>
                        )}
                    </DialogContent>
                </DialogPositioner>
            </Portal>
        </DialogRoot>
    );
}
