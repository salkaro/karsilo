"use client";

import { useState, useEffect, useCallback } from "react";
import { retrieveWaitlistEntries } from "@/services/firebase/admin-retrieve";
import { IWaitlistEntry } from "@repo/models";

interface UseWaitlistReturn {
    entries: IWaitlistEntry[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useWaitlist(): UseWaitlistReturn {
    const [entries, setEntries] = useState<IWaitlistEntry[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { entries: fetched, error: err } = await retrieveWaitlistEntries();

            if (err) {
                throw new Error(err);
            }

            setEntries(fetched ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch waitlist entries");
            setEntries(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const refetch = useCallback(async () => {
        await fetchEntries();
    }, [fetchEntries]);

    return { entries, loading, error, refetch };
}
