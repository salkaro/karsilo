"use client"

// External Imports
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import {
    Box,
    Button,
    Input,
    VStack,
    Heading,
    Text,
    Link,
    Flex,
    HStack,
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
                            Reset your password
                        </Heading>
                        <Text fontSize="md" color="gray.600">
                            Enter your email and we'll send you a reset link
                        </Text>
                    </Box>
                </Flex>

                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    p={{ base: 6, md: 8 }}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <div className="g-recaptcha" data-sitekey="6Lc_-3krAAAAAMaYeoFalpjQ3Mk0KUNWeIqYdFHU" data-action="password_reset"></div>
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

                        <Button
                            type="submit"
                            width="full"
                            size="lg"
                            bg="brand.600"
                            color="white"
                            _hover={{ bg: "brand.700" }}
                            mt={2}
                            disabled={loading || !validEmail}
                        >
                            Send Reset Link
                        </Button>
                    </VStack>
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Remember your password?{" "}
                    <Link href="/login">
                        <Text as="span" color="brand.600" fontWeight="medium">
                            Sign in
                        </Text>
                    </Link>
                </Text>
            </VStack>
        </Box>
    )
}

export default ResetForm
