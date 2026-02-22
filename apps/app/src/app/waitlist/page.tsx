// Local Imports
import WaitlistForm from "@/components/auth/forms/waitlist-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join the Waitlist | Karsilo",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Waitlist() {
    return (
        <WaitlistForm />
    );
}
