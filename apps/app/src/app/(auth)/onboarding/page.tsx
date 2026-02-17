// Local imports
import OnboardingForm from "@/components/auth/forms/onboarding-form"
import { Metadata } from "next";

// External Imports
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Onboarding | Karsilo",
    description: "Onboarding | Karsil",
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

export default function Onboarding() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingForm />
        </Suspense>
    )
}
