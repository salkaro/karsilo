"use client"

// External Imports
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword as firebaseSignIn } from "firebase/auth"
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
        // Render a fallback placeholder during SSR
        return <PreparingForm />
    }

    return (
        <Box as="form" onSubmit={(e) => handleSubmit(e)} className={className}>
            <div className="g-recaptcha" data-sitekey="6Lc_-3krAAAAAMaYeoFalpjQ3Mk0KUNWeIqYdFHU" data-action="login"></div>
            <VStack gap={6} align="stretch">
                <VStack gap={2} textAlign="center">
                    <Heading size="xl">Login to your account</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Enter your email below to login to your account
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
                        <div className="flex justify-between w-full">
                            <Field.Label htmlFor="password" mb={0}>Password</Field.Label>
                            <Link href="/reset" fontSize="sm" textDecoration="underline">
                                Forgot your password?
                            </Link>
                        </div>
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
                        {errorMessage && (
                            <Text color="red.500" fontSize="sm" mt={2}>{errorMessage}</Text>
                        )}
                    </Field.Root>
                    <Button
                        type="submit"
                        width="full"
                        disabled={loading || !validEmail || !password}
                        colorScheme="blue"
                    >
                        {loading && <Spinner size="sm" mr={2} />}
                        Login
                    </Button>
                </VStack>
                <Text textAlign="center" fontSize="sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" textDecoration="underline">
                        Sign up
                    </Link>
                </Text>
            </VStack>
        </Box>
    )
}

export default LoginForm