"use client"

// External Imports
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { useEffect, useRef, useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { FaRegCheckCircle } from "react-icons/fa"
import { doc, updateDoc } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import {
    Box,
    Button,
    Field,
    Input,
    InputGroup,
    IconButton,
    VStack,
    Heading,
    Text,
    Link,
    Spinner,
    Stack,
} from "@repo/ui"

// Local Imports
import { usersCol } from "@repo/constants"
import PreparingForm from "./preparing-form"
import { auth, firestore } from "@/lib/firebase/config"
import { validateEmail, validateEmailInput, validatePasswordInput } from "@/utils/input-validation"

interface SignUpFormProps {
    className?: string;
}

function SignUpForm({ className }: SignUpFormProps) {
    const [isClient, setIsClient] = useState(false);
    const searchParams = useSearchParams();
    const inviteId = searchParams.get('inviteId');

    // Inputs
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Input Validation
    const [validEmail, setValidEmail] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [hasOneNumber, setHasOneNumber] = useState(false);
    const [hasOneSpecial, setHasOneSpecial] = useState(false);
    const [hasEightCharacters, setHasEightCharacters] = useState(false);

    // Page
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Auth
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Refs to persist values for email verification polling
    const emailRef = useRef<string | null>(null);
    const passwordRef = useRef<string | null>(null);

    function handlePasswordInput(value: string) {
        validatePasswordInput(value, setPassword)
        // At least 8 characters
        setHasEightCharacters(value.length >= 8);

        // At least one digit
        setHasOneNumber(/\d/.test(value));

        // At least one special character (adjust the class as you like)
        setHasOneSpecial(/[!@#$%^&*()_+=]/.test(value));
    };

    function handleEmailInput(value: string) {
        if (validateEmailInput(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        validateEmail(value, setEmail);
    };

    async function handleSignUp() {
        try {
            setLoading(true);
            setErrorMessage("");
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            emailRef.current = email;
            passwordRef.current = password;
            await sendEmailVerification(user);
            setEmailVerifying(true);
        } catch (e: unknown) {
            console.error(e);
            setErrorMessage("Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    function handleSubmit(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault();
        if (email && password) {
            handleSignUp();
        }
    };

    useEffect(() => {
        const checkVerificationInterval = setInterval(async () => {
            try {
                if (!auth.currentUser) {
                    return;
                }

                // Store the current verification status before reload
                const wasVerifiedBefore = auth.currentUser.emailVerified;

                // Reload the user properly with error handling
                try {
                    await auth.currentUser.reload();
                } catch (reloadError) {
                    console.error("Error reloading user:", reloadError);
                    return;
                }

                // Check the new verification status
                const isVerifiedNow = auth.currentUser.emailVerified;

                // Only proceed if the status changed from unverified to verified
                // This prevents the false positive issue you were experiencing
                if (!wasVerifiedBefore && isVerifiedNow) {
                    setEmailVerified(true);
                    setEmailVerifying(false);

                    try {
                        // Sign in with NextAuth credentials
                        const result = await signIn("credentials", {
                            email: emailRef.current,
                            password: passwordRef.current,
                            redirect: false,
                        });

                        if (result?.error) {
                            console.error("Error during sign-in (1):", result.error);
                            return;
                        }
                    } catch (error) {
                        console.error("Error during sign-in (2):", error)
                    }

                    try {
                        await updateDoc(
                            doc(firestore, usersCol, auth.currentUser.uid),
                            { 'authentication.onboarding': true }
                        );
                    } catch (error) {
                        console.error("Error setting onboarding: ", error)
                    }

                    clearInterval(checkVerificationInterval);
                    // If there's an inviteId, pass it to the onboarding page
                    const onboardingUrl = inviteId ? `/onboarding?inviteId=${inviteId}` : '/onboarding';
                    router.push(onboardingUrl);
                }
            } catch (error) {
                console.error("Error in verification check:", error);
            }
        }, 3000);

        return () => clearInterval(checkVerificationInterval);
    }, [router, inviteId]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a fallback placeholder during SSR
        return <PreparingForm />
    }

    return (
        <>
            {(!emailVerifying && !emailVerified) && (
                <Box as="form" onSubmit={(e) => handleSubmit(e)} className={className}>
                    <VStack gap={6} align="stretch">
                        <VStack gap={2} textAlign="center">
                            <Heading size="xl">Create your account</Heading>
                            <Text color="gray.500" fontSize="sm">
                                Sign up to get started.
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
                            <Field.Root required>
                                <Field.Label htmlFor="password">Password</Field.Label>
                                <InputGroup
                                    endElement={
                                        <IconButton
                                            aria-label={hidePassword ? "Show password" : "Hide password"}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setHidePassword(!hidePassword)}
                                        >
                                            {hidePassword ? <IoMdEye /> : <IoMdEyeOff />}
                                        </IconButton>
                                    }
                                >
                                    <Input
                                        id="password"
                                        value={password}
                                        type={hidePassword ? 'password' : 'text'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value)}
                                    />
                                </InputGroup>
                            </Field.Root>
                            <Stack gap={1} px={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" fontSize="sm" color={hasEightCharacters ? "inherit" : "gray.400"}>
                                    <FaRegCheckCircle />
                                    <Text flex={1} ml={2}>Must contain at least 8 characters</Text>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" fontSize="sm" color={hasOneNumber ? "inherit" : "gray.400"}>
                                    <FaRegCheckCircle />
                                    <Text flex={1} ml={2}>Must contain at least 1 number</Text>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" fontSize="sm" color={hasOneSpecial ? "inherit" : "gray.400"}>
                                    <FaRegCheckCircle />
                                    <Text flex={1} ml={2}>Must contain at least 1 special character</Text>
                                </Box>
                            </Stack>

                            {errorMessage && (
                                <Text color="red.500" fontSize="sm">{errorMessage}</Text>
                            )}
                            <Button
                                type="submit"
                                width="full"
                                disabled={loading || !hasEightCharacters || !hasOneNumber || !hasOneSpecial || !validEmail}
                                colorScheme="blue"
                            >
                                {loading ? (
                                    <>
                                        Processing...
                                        <Spinner size="sm" ml={2} />
                                    </>
                                ) : "Sign Up"}
                            </Button>
                        </VStack>
                        <Text textAlign="center" fontSize="sm">
                            Already have an account?{" "}
                            <Link href="/login" textDecoration="underline">
                                Login
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            )}

            {emailVerifying && (
                <VStack gap={2} textAlign="center">
                    <Heading size="xl">Please verify your email</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Awaiting verification...
                    </Text>
                </VStack>
            )}

            {emailVerified && (
                <VStack gap={2} textAlign="center">
                    <Heading size="xl">Email Verified</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Your email has been verified, please wait...
                    </Text>
                </VStack>
            )}
        </>
    );
}

export default SignUpForm