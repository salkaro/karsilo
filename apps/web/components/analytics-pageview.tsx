"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "./lib/analytics";

/**
 * Analytics Pageview Tracker (Internal)
 *
 * This component tracks page views in Google Analytics 4.
 * It automatically tracks the initial page load and subsequent route changes.
 */
function AnalyticsPageviewInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsPageview() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageviewInternal />
    </Suspense>
  );
}
