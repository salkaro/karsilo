"use client";

import { ReactNode } from "react";
import { Box, Button, Center, Heading, Text, VStack } from "@repo/ui";
import { Lock, ArrowUpCircle, ShieldX } from "lucide-react";
import Link from "next/link";

interface AccessDeniedProps {
    title?: string;
    description?: string;
    showUpgrade?: boolean;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
    title = "Access Denied",
    description = "You don't have permission to view this page.",
    showUpgrade = false,
}) => {
    return (
        <Center py={12} px={4} textAlign="center">
            <VStack gap={4}>
                <Center
                    w="72px"
                    h="72px"
                    borderRadius="full"
                    bg="red.100"
                    _dark={{ bg: "red.900" }}
                >
                    <ShieldX size={28} color="var(--chakra-colors-red-500)" />
                </Center>
                <Box>
                    <Heading size="md" mb={2}>
                        {title}
                    </Heading>
                    <Text
                        fontSize="sm"
                        color="gray.500"
                        _dark={{ color: "gray.400" }}
                        maxW="sm"
                    >
                        {description}
                    </Text>
                </Box>
                {showUpgrade && (
                    <Link href="/settings/billing">
                        <Button colorPalette="purple" size="sm">
                            <ArrowUpCircle size={16} />
                            Upgrade Plan
                        </Button>
                    </Link>
                )}
            </VStack>
        </Center>
    );
};

interface FeatureLockedProps {
    featureName: string;
    requiredPlan?: string;
    description?: string;
}

export const FeatureLocked: React.FC<FeatureLockedProps> = ({
    featureName,
    requiredPlan = "a higher tier",
    description,
}) => {
    return (
        <Center py={12} px={4} textAlign="center">
            <VStack gap={4}>
                <Center
                    w="72px"
                    h="72px"
                    borderRadius="full"
                    bg="orange.100"
                    _dark={{ bg: "orange.900" }}
                >
                    <Lock size={28} color="var(--chakra-colors-orange-500)" />
                </Center>
                <Box>
                    <Heading size="md" mb={2}>
                        {featureName} Not Available
                    </Heading>
                    <Text
                        fontSize="sm"
                        color="gray.500"
                        _dark={{ color: "gray.400" }}
                        maxW="sm"
                    >
                        {description ||
                            `This feature requires ${requiredPlan} plan. Upgrade to unlock ${featureName.toLowerCase()}.`}
                    </Text>
                </Box>
                <Link href="/settings/billing">
                    <Button colorPalette="purple" size="sm">
                        <ArrowUpCircle size={16} />
                        View Plans
                    </Button>
                </Link>
            </VStack>
        </Center>
    );
};

interface LimitReachedProps {
    limitType: string;
    currentCount: number;
    maxCount: number;
    description?: string;
}

export const LimitReached: React.FC<LimitReachedProps> = ({
    limitType,
    currentCount,
    maxCount,
    description,
}) => {
    return (
        <Box
            p={4}
            bg={{ base: "orange.50", _dark: "orange.900" }}
            borderRadius="md"
            border="1px solid"
            borderColor={{ base: "orange.200", _dark: "orange.700" }}
        >
            <VStack gap={2} align="start">
                <Text fontWeight="medium" color={{ base: "orange.800", _dark: "orange.200" }}>
                    {limitType} Limit Reached ({currentCount}/{maxCount})
                </Text>
                <Text fontSize="sm" color={{ base: "orange.700", _dark: "orange.300" }}>
                    {description ||
                        `You've reached your ${limitType.toLowerCase()} limit. Upgrade your plan to add more.`}
                </Text>
                <Link href="/settings/billing">
                    <Button colorPalette="orange" size="xs" variant="outline">
                        <ArrowUpCircle size={14} />
                        Upgrade
                    </Button>
                </Link>
            </VStack>
        </Box>
    );
};

interface AccessGateProps {
    children: ReactNode;
    hasAccess: boolean;
    fallback?: ReactNode;
    accessDeniedProps?: AccessDeniedProps;
}

export const AccessGate: React.FC<AccessGateProps> = ({
    children,
    hasAccess,
    fallback,
    accessDeniedProps,
}) => {
    if (!hasAccess) {
        return fallback || <AccessDenied {...accessDeniedProps} />;
    }
    return <>{children}</>;
};

interface RoleGateProps {
    children: ReactNode;
    userRole: string | null;
    requiredRoles: string[];
    fallback?: ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
    children,
    userRole,
    requiredRoles,
    fallback,
}) => {
    const hasAccess = userRole ? requiredRoles.includes(userRole) : false;

    if (!hasAccess) {
        return (
            fallback || (
                <AccessDenied
                    title="Insufficient Permissions"
                    description="You need a higher role to access this feature. Contact your administrator."
                />
            )
        );
    }

    return <>{children}</>;
};

interface PlanGateProps {
    children: ReactNode;
    currentPlan: string;
    requiredPlans: string[];
    featureName: string;
    fallback?: ReactNode;
}

export const PlanGate: React.FC<PlanGateProps> = ({
    children,
    currentPlan,
    requiredPlans,
    featureName,
    fallback,
}) => {
    const hasAccess = requiredPlans.includes(currentPlan);

    if (!hasAccess) {
        return (
            fallback || (
                <FeatureLocked
                    featureName={featureName}
                    requiredPlan={requiredPlans[0]}
                />
            )
        );
    }

    return <>{children}</>;
};
