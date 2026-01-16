import Page from "@/components/main/entities/Page";

import { Metadata } from "next";

import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Entities | Karsilo",
    description: "Entities",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function EntitiesPage() {
    return (
        <Suspense>
            <Page />
        </Suspense>
    )
}
