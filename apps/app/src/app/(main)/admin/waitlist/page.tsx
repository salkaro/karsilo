import Page from "@/components/main/admin/waitlist/Page";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Waitlist | Karsilo Admin",
    description: "Admin waitlist dashboard",
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

export default function WaitlistAdminRoute() {
    return (
        <Page />
    )
}
