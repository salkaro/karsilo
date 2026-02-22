"use client"

// External Imports
import { toast } from "sonner"
import { signIn, getSession } from "next-auth/react"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword as firebaseSignIn, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"
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
    Flex,
    HStack,
} from "@repo/ui"

// Local Imports
import { auth, firestore } from "@/lib/firebase/config"
import PreparingForm from "./preparing-form"
import { usersCol } from "@repo/constants"
import { validateEmail, validateEmailInput, validatePasswordInput } from "@/utils/input-validation"
import { IUser } from '@repo/models'


interface LoginFormProps {
    className?: string;
}

function LoginForm({ className }: LoginFormProps) {
    const searchParams = useSearchParams();

    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Inputs
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Input Validation
    const [hidePassword, setHidePassword] = useState(true);
    const [validEmail, setValidEmail] = useState(false);

    // Page
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handlePasswordInput(value: string) {
        validatePasswordInput(value, setPassword)
    }


    function handleEmailInput(value: string) {
        if (validateEmailInput(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        validateEmail(value, setEmail);
    }


    function handleSubmit(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault()
        setErrorMessage("")
        if (email && password) {
            handleLogin();
        }
    }

    async function handleLogin() {
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                setErrorMessage("Invalid email or password");
            } else {
                await firebaseSignIn(auth, email, password);
                const userRef = doc(firestore, usersCol, auth.currentUser?.uid ?? "");
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data() as IUser;
                if (userData.authentication?.onboarding) {
                    router.push("/onboarding")
                } else {
                    router.push(`/preparing`);
                }
            }
        } catch (e) {
            console.error("Login error:", e);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    async function handleGoogleSignIn() {
        setLoading(true);
        setErrorMessage("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const additionalInfo = getAdditionalUserInfo(result);

            // If this is a brand new Firebase Auth user, delete it and redirect to waitlist
            if (additionalInfo?.isNewUser) {
                await result.user.delete();
                router.push("/waitlist");
                return;
            }

            const idToken = await result.user.getIdToken();

            const signInResult = await signIn("firebase-token", {
                idToken,
                redirect: false,
            });

            if (signInResult?.error) {
                setErrorMessage("Google sign-in failed. Please try again.");
                setLoading(false);
                return;
            }

            const session = await getSession();
            const userData = session?.user as IUser | undefined;

            if (!userData?.id) {
                await auth.signOut();
                router.push("/waitlist");
                return;
            }

            if (userData?.authentication?.onboarding) {
                router.push("/onboarding");
            } else {
                router.push("/preparing");
            }
        } catch (e) {
            console.error("Google sign-in error:", e);
            setErrorMessage("Google sign-in failed. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const accountCreated = searchParams.get("account-created");

        if (accountCreated === "true") {
            toast.success("Account created successfully. Please log in.");
        }
    }, [searchParams]);

    if (!isClient) {
        return <PreparingForm />
    }

    return (
        <Box maxW="md" width="full" className={className}>
            <VStack align="stretch" gap={8}>
                <Flex direction="column" align="center" gap={4}>
                    <Link href="/">
                        <HStack gap={2}>
                            <Image
                                src="/logos/icon.svg"
                                alt="Karsilo"
                                width={40}
                                height={40}
                            />
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                Karsilo
                            </Text>
                        </HStack>
                    </Link>
                    <Box textAlign="center">
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="bold"
                            color="gray.900"
                            mb={2}
                        >
                            Welcome back
                        </Heading>
                        <Text fontSize="md" color="gray.600">
                            Sign in to access your dashboard
                        </Text>
                    </Box>
                </Flex>

                <Box
                    as="form"
                    onSubmit={(e: React.FormEvent<HTMLDivElement>) => handleSubmit(e)}
                    p={{ base: 6, md: 8 }}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <div className="g-recaptcha" data-sitekey="6Lc_-3krAAAAAMaYeoFalpjQ3Mk0KUNWeIqYdFHU" data-action="login"></div>
                    <VStack gap={4}>
                        <Box width="full">
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.700"
                                mb={1}
                            >
                                Email
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
                            <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Password
                                </Text>
                                <Link href="/reset">
                                    <Text fontSize="sm" color="brand.600" fontWeight="medium">
                                        Forgot password?
                                    </Text>
                                </Link>
                            </Flex>
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
                                    placeholder="Enter your password"
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
                            {errorMessage && (
                                <Text color="red.500" fontSize="sm" mt={2}>{errorMessage}</Text>
                            )}
                        </Box>

                        <Button
                            type="submit"
                            width="full"
                            size="lg"
                            bg="brand.600"
                            color="white"
                            _hover={{ bg: "brand.700" }}
                            mt={2}
                            disabled={loading || !validEmail || !password}
                        >
                            {loading && <Spinner size="sm" mr={2} />}
                            Sign In
                        </Button>
                    </VStack>

                    <Box position="relative" textAlign="center" my={6}>
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
                            bg="white"
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
                        _hover={{ bg: "gray.50" }}
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
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Don&apos;t have an account?{" "}
                    <Link href="/waitlist">
                        <Text as="span" color="brand.600" fontWeight="medium">
                            Join the waitlist
                        </Text>
                    </Link>
                </Text>
            </VStack>
        </Box>
    )
}

export default LoginForm
