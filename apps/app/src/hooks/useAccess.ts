"use client";

import { useSession } from "next-auth/react";
import { useOrganisation } from "./useOrganisation";
import {
    levelOneAccess,
    levelTwoAccess,
    levelThreeAccess,
    memberLimits,
    entityLimits,
    apiAccess,
    OrgRoleType,
} from "@repo/constants";

export type SubscriptionTier = "free" | "starter" | "growth" | "pro";

interface UseAccessReturn {
    // Role-based access
    userRole: OrgRoleType | null;
    hasViewerAccess: boolean;
    hasMemberAccess: boolean;
    hasAdminAccess: boolean;
    isOwner: boolean;

    // Plan-based limits
    subscription: SubscriptionTier;
    memberLimit: number;
    entityLimit: number;
    currentMembers: number;
    currentEntities: number;
    canAddMember: boolean;
    canAddEntity: boolean;
    hasApiAccess: boolean;

    // Loading states
    loading: boolean;

    // Helper functions
    checkRoleAccess: (requiredRoles: string[]) => boolean;
    checkPlanFeature: (feature: keyof typeof apiAccess) => boolean;
}

export function useAccess(): UseAccessReturn {
    const { data: session, status } = useSession();
    const { organisation, loading: orgLoading } = useOrganisation();

    const loading = status === "loading" || orgLoading;

    // Get user role from session
    const userRole = (session?.user?.organisation?.role as OrgRoleType) ?? null;

    // Role-based access checks
    const hasViewerAccess = userRole ? levelOneAccess.includes(userRole) : false;
    const hasMemberAccess = userRole ? levelTwoAccess.includes(userRole) : false;
    const hasAdminAccess = userRole ? levelThreeAccess.includes(userRole) : false;
    const isOwner = userRole === "owner";

    // Plan-based limits
    const subscription = (organisation?.subscription as SubscriptionTier) ?? "free";
    const memberLimit = memberLimits[subscription] ?? memberLimits.free;
    const entityLimit = entityLimits[subscription] ?? entityLimits.free;
    const currentMembers = organisation?.members ?? 0;
    const currentEntities = organisation?.entities ?? 0;

    // Limit checks
    const canAddMember = memberLimit === -1 || currentMembers < memberLimit;
    const canAddEntity = entityLimit === -1 || currentEntities < entityLimit;
    const hasApiAccess = apiAccess[subscription] ?? false;

    // Helper function to check if user has required role access
    const checkRoleAccess = (requiredRoles: string[]): boolean => {
        if (!userRole) return false;
        return requiredRoles.includes(userRole);
    };

    // Helper function to check if plan has a specific feature
    const checkPlanFeature = (feature: keyof typeof apiAccess): boolean => {
        return apiAccess[feature] ?? false;
    };

    return {
        // Role-based access
        userRole,
        hasViewerAccess,
        hasMemberAccess,
        hasAdminAccess,
        isOwner,

        // Plan-based limits
        subscription,
        memberLimit,
        entityLimit,
        currentMembers,
        currentEntities,
        canAddMember,
        canAddEntity,
        hasApiAccess,

        // Loading states
        loading,

        // Helper functions
        checkRoleAccess,
        checkPlanFeature,
    };
}
