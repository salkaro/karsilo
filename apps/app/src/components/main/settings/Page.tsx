"use client"

import { VStack, Tabs, Skeleton } from "@repo/ui"
import { settingsSubItems } from "@/constants/platform"
import { useSession } from "next-auth/react";
import { useOrganisation } from "@/hooks/useOrganisation";
import { levelTwoAccess } from "@repo/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Overview from "./overview";
import Organisation from "./organisation";
import Billing from "./billing";
import Authentication from "./authentication";

const Page = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { loading: organisationLoading } = useOrganisation();
    const { data: session } = useSession();

    const [value, setValue] = useState<string>('overview');

    const hasLevelTwoAccess = levelTwoAccess.includes(session?.user.organisation?.role as string);

    const tabs = useMemo(() => {
        const base = [
            ...settingsSubItems.slice(0, 3)
        ];
        if (hasLevelTwoAccess) {
            base.push(
                ...settingsSubItems.slice(3)
            )
        }
        return base;
    }, [hasLevelTwoAccess]);

    const updateHash = useCallback(
        (details: { value: string }) => {
            const tabValue = details.value;
            setValue(tabValue);

            const newUrl = `${pathname}#${tabValue}`;
            router.replace(newUrl, { scroll: false });
        },
        [pathname, router]
    );

    // Update active tab based on URL hash on mount or hash change
    useEffect(() => {
        const syncFromHash = () => {
            const hash = window.location.hash.slice(1);
            if (tabs.some(t => t.url.replace("/settings#", "") === hash)) {
                setValue(hash);
            } else {
                updateHash({ value: "overview" });
            }
        };

        // Initial load
        syncFromHash();

        // Listen for future changes (e.g., clicking external links or browser back)
        window.addEventListener("hashchange", syncFromHash);

        return () => {
            window.removeEventListener("hashchange", syncFromHash);
        };
    }, [updateHash, tabs]);



    if (organisationLoading && (value === 'organisation' || value === 'billing')) {
        return (
            <div className="space-y-6 p-4">
                <Skeleton className="h-10 w-64" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }

    return (
        <VStack align="stretch" gap={6}>
            <Tabs.Root value={value} onValueChange={updateHash}>
                <Tabs.List>
                    {tabs.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <Tabs.Trigger key={item.url} value={item.url.split("#")[1]}>
                                <IconComponent size={16} />
                                {item.title}
                            </Tabs.Trigger>
                        )
                    })}
                </Tabs.List>

                <Tabs.Content value="overview" pt={6}>
                    <Overview />
                </Tabs.Content>

                <Tabs.Content value="organisation" pt={6}>
                    <Organisation />
                </Tabs.Content>

                <Tabs.Content value="billing" pt={6}>
                    <Billing />
                </Tabs.Content>

                <Tabs.Content value="authentication" pt={6}>
                    <Authentication />
                </Tabs.Content>
            </Tabs.Root>
        </VStack>
    )
}

export default Page
