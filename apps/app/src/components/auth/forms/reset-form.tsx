"use client"

// External Imports
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
    Box,
    Button,
    Field,
    Input,
    VStack,
    Heading,
    Text,
    Link,
} from "@repo/ui"

// Local Imports
import PreparingForm from "./preparing-form"
import { resetPassword } from "@/services/firebase/admin-reset"
import { validateEmail, validateEmailInput } from "@/utils/input-validation"

interface ResetFormProps {
    className?: string;
}

function ResetForm({ className }: ResetFormProps) {
    const [isClient, setIsClient] = useState(false);

    // Inputs
    const [email, setEmail] = useState<string>("");

    // Input Validation
    const [validEmail, setValidEmail] = useState(false);

    // Page
    const [loading, setLoading] = useState(false);


    function handleEmailInput(value: string) {
        if (validateEmailInput(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        validateEmail(value, setEmail);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { success, message } = await resetPassword(email);

            if (success) {
                toast(message, { description: "Be sure to check your spam" });
            } else {
                toast(message || 'Something went wrong', { description: "Please try again" });
            }
        } catch {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a fallback placeholder during SSR
        return <PreparingForm />
    }


    return (
        <Box as="form" onSubmit={handleSubmit} className={className}>
            <div className="g-recaptcha" data-sitekey="6Lc_-3krAAAAAMaYeoFalpjQ3Mk0KUNWeIqYdFHU" data-action="password_reset"></div>
            <VStack gap={6} align="stretch">
                <VStack gap={2} textAlign="center">
                    <Heading size="xl">Reset password</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Enter your email below to reset password
                    </Text>
                </VStack>
                <VStack gap={6} align="stretch" px={{ xl: 4, "2xl": 0 }}>
                    <Field.Root required>
                        <Field.Label htmlFor="email">Email</Field.Label>
                        <Input
                            id="email"
                            value={email}
                            type="email"
                            placeholder="m@example.com"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEmailInput(e.target.value)}
                        />
                    </Field.Root>
                    <Button
                        type="submit"
                        width="full"
                        disabled={loading || !validEmail}
                        colorScheme="blue"
                    >
                        Send Reset Link
                    </Button>
                </VStack>
                <Text textAlign="center" fontSize="sm">
                    Know your password?{" "}
                    <Link href="/login" textDecoration="underline">
                        Login
                    </Link>
                </Text>
            </VStack>
        </Box>
    )
}

export default ResetForm