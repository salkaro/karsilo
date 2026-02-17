// Local Imports
import LoginForm from "@/components/auth/forms/login-form"
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Login | Karsilo",
    description: "Login | Karsil",
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

export default function Login() {
    return (
        <LoginForm />
    )
}
