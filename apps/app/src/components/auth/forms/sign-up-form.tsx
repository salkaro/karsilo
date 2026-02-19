"use client"

// External Imports
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useEffect, useRef, useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { FaRegCheckCircle } from "react-icons/fa"
import { doc, updateDoc } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Image from "next/image"
import {
    Box,
    Button,
    Input,
    InputGroup,
    IconButton,
    VStack,
    Heading,
    Text,
    Link,
    Spinner,
    Stack,
    Flex,
    HStack,
} from "@repo/ui"

// Local Imports
import { usersCol } from "@repo/constants"
import { IUser } from "@repo/models"
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
        setHasEightCharacters(value.length >= 8);
        setHasOneNumber(/\d/.test(value));
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

    async function handleGoogleSignIn() {
        setLoading(true);
        setErrorMessage("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const signInResult = await signIn("firebase-token", {
                idToken,
                redirect: false,
            });

            if (signInResult?.error) {
                setErrorMessage("Google sign-up failed. Please try again.");
                setLoading(false);
                return;
            }

            const session = await getSession();
            const userData = session?.user as IUser | undefined;

            if (!userData || userData.authentication?.onboarding) {
                const onboardingUrl = inviteId ? `/onboarding?inviteId=${inviteId}` : '/onboarding';
                router.push(onboardingUrl);
            } else {
                router.push("/preparing");
            }
        } catch (e) {
            console.error("Google sign-up error:", e);
            setErrorMessage("Google sign-up failed. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkVerificationInterval = setInterval(async () => {
            try {
                if (!auth.currentUser) {
                    return;
                }

                const wasVerifiedBefore = auth.currentUser.emailVerified;

                try {
                    await auth.currentUser.reload();
                } catch (reloadError) {
                    console.error("Error reloading user:", reloadError);
                    return;
                }

                const isVerifiedNow = auth.currentUser.emailVerified;

                if (!wasVerifiedBefore && isVerifiedNow) {
                    setEmailVerified(true);
                    setEmailVerifying(false);

                    try {
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
        return <PreparingForm />
    }

    if (emailVerifying) {
        return (
            <Box maxW="md" width="full">
                <Box
                    p={{ base: 6, md: 8 }}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <VStack gap={4} textAlign="center">
                        <Box
                            p={4}
                            bg="brand.50"
                            borderRadius="full"
                            color="brand.600"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </Box>
                        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900">
                            Please verify your email
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            We sent a verification link to your email. Please check your inbox and click the link to continue.
                        </Text>
                        <Spinner size="sm" color="brand.600" />
                        <Text color="gray.500" fontSize="xs">
                            Awaiting verification...
                        </Text>
                    </VStack>
                </Box>
            </Box>
        );
    }

    if (emailVerified) {
        return (
            <Box maxW="md" width="full">
                <Box
                    p={{ base: 6, md: 8 }}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <VStack gap={4} textAlign="center">
                        <Box
                            p={4}
                            bg="green.50"
                            borderRadius="full"
                            color="green.600"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </Box>
                        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900">
                            Email Verified
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Your email has been verified. Redirecting you now...
                        </Text>
                        <Spinner size="sm" color="brand.600" />
                    </VStack>
                </Box>
            </Box>
        );
    }

    return (
        <Flex minH="calc(100vh - 48px)" width="full" maxW="1200px" className={className}>
            {/* Left side - Form */}
            <Flex
                flex={1}
                direction="column"
                justify="center"
                align="center"
                p={{ base: 6, md: 12 }}
            >
                <Box maxW="md" width="full">
                    <VStack align="stretch" gap={8}>
                        <Box textAlign="center">
                            <Heading
                                as="h1"
                                fontSize={{ base: "2xl", md: "3xl" }}
                                fontWeight="bold"
                                color="gray.900"
                                mb={2}
                            >
                                Start your free trial
                            </Heading>
                            <Text fontSize="md" color="gray.600">
                                No credit card required. Get started in minutes.
                            </Text>
                        </Box>

                        <Box
                            as="form"
                            onSubmit={(e: React.FormEvent<HTMLDivElement>) => handleSubmit(e)}
                        >
                            <VStack gap={4}>
                                <Box width="full">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="gray.700"
                                        mb={1}
                                    >
                                        Work email
                                    </Text>
                                    <Input
                                        id="email"
                                        value={email}
                                        type="email"
                                        placeholder="john@company.com"
                                        size="lg"
                                        bg="white"
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        _focus={{
                                            border: "2px solid",
                                            borderColor: "brand.500",
                                            boxShadow: "none",
                                            outline: "none",
                                        }}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEmailInput(e.target.value)}
                                    />
                                </Box>

                                <Box width="full">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="gray.700"
                                        mb={1}
                                    >
                                        Password
                                    </Text>
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
                                            placeholder="Create a password"
                                            size="lg"
                                            bg="white"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            _focus={{
                                                border: "2px solid",
                                                borderColor: "brand.500",
                                                boxShadow: "none",
                                                outline: "none",
                                            }}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value)}
                                        />
                                    </InputGroup>
                                </Box>

                                <Stack gap={1} width="full" px={1}>
                                    <HStack gap={2} fontSize="sm" color={hasEightCharacters ? "green.600" : "gray.400"}>
                                        <FaRegCheckCircle />
                                        <Text>At least 8 characters</Text>
                                    </HStack>
                                    <HStack gap={2} fontSize="sm" color={hasOneNumber ? "green.600" : "gray.400"}>
                                        <FaRegCheckCircle />
                                        <Text>At least 1 number</Text>
                                    </HStack>
                                    <HStack gap={2} fontSize="sm" color={hasOneSpecial ? "green.600" : "gray.400"}>
                                        <FaRegCheckCircle />
                                        <Text>At least 1 special character</Text>
                                    </HStack>
                                </Stack>

                                {errorMessage && (
                                    <Text color="red.500" fontSize="sm">{errorMessage}</Text>
                                )}

                                <Button
                                    type="submit"
                                    width="full"
                                    size="lg"
                                    bg="brand.600"
                                    color="white"
                                    _hover={{ bg: "brand.700" }}
                                    mt={2}
                                    disabled={loading || !hasEightCharacters || !hasOneNumber || !hasOneSpecial || !validEmail}
                                >
                                    {loading ? (
                                        <>
                                            Processing...
                                            <Spinner size="sm" ml={2} />
                                        </>
                                    ) : "Create Account"}
                                </Button>
                            </VStack>
                        </Box>

                        <Box position="relative" textAlign="center">
                            <Box
                                position="absolute"
                                top="50%"
                                left={0}
                                right={0}
                                height="1px"
                                bg="gray.200"
                            />
                            <Text
                                position="relative"
                                display="inline-block"
                                px={4}
                                bg="gray.50"
                                fontSize="sm"
                                color="gray.500"
                            >
                                Or continue with
                            </Text>
                        </Box>

                        <Button
                            width="full"
                            size="lg"
                            variant="outline"
                            borderColor="gray.300"
                            _hover={{ bg: "gray.100" }}
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            type="button"
                        >
                            <HStack gap={2}>
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <Text>Continue with Google</Text>
                            </HStack>
                        </Button>

                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            Already have an account?{" "}
                            <Link href="/login">
                                <Text as="span" color="brand.600" fontWeight="medium">
                                    Sign in
                                </Text>
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </Flex>

            {/* Right side - Benefits */}
            <Flex
                flex={1}
                direction="column"
                justify="center"
                p={{ base: 6, md: 12 }}
                bg="brand.600"
                display={{ base: "none", lg: "flex" }}
                position="relative"
                overflow="hidden"
                borderRadius="2xl"
                my={6}
                mr={6}
            >
                {/* Decorative purple circles */}
                <Box
                    position="absolute"
                    top="-100px"
                    right="-80px"
                    width="350px"
                    height="350px"
                    bg="brand.500"
                    opacity={0.3}
                    borderRadius="full"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="-120px"
                    left="-100px"
                    width="400px"
                    height="400px"
                    bg="brand.500"
                    opacity={0.25}
                    borderRadius="full"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="40%"
                    right="-60px"
                    width="200px"
                    height="200px"
                    bg="brand.400"
                    opacity={0.2}
                    borderRadius="full"
                    pointerEvents="none"
                />

                <Box maxW="md" position="relative" zIndex={1}>
                    <HStack gap={3} mb={8}>
                        <Image
                            src="/logos/icon.svg"
                            alt="Karsilo"
                            width={40}
                            height={40}
                        />
                        <Text fontSize="2xl" fontWeight="bold" color="white">
                            Karsilo
                        </Text>
                    </HStack>

                    <Heading
                        as="h2"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="bold"
                        color="white"
                        mb={6}
                        lineHeight="1.3"
                    >
                        Join thousands of founders who trust Karsilo
                    </Heading>

                    <VStack align="stretch" gap={4}>
                        {[
                            "Connect unlimited Stripe accounts",
                            "Real-time revenue dashboard",
                            "Automated weekly reports",
                            "Bank-level security",
                            "Cancel anytime, no questions asked",
                        ].map((benefit, index) => (
                            <HStack key={index} gap={3}>
                                <Box
                                    p={1}
                                    bg="whiteAlpha.200"
                                    borderRadius="full"
                                    color="white"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </Box>
                                <Text fontSize="md" color="white">
                                    {benefit}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>

                    <Box mt={12} p={6} bg="whiteAlpha.100" borderRadius="xl">
                        <Text fontSize="md" color="white" fontStyle="italic" mb={4}>
                            "Karsilo saved me hours every week. I finally know exactly how
                            much I'm making across all my products."
                        </Text>
                        <Text fontSize="sm" color="brand.200">
                            — Sarah Chen, Founder of 3 SaaS products
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}

export default SignUpForm
