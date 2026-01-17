// Local imports
import OnboardingForm from "@/components/auth/forms/onboarding-form"

// External Imports
import { Suspense } from "react"


export default function Onboarding() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingForm />
        </Suspense>
    )
}
