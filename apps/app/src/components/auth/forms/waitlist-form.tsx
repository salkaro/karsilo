"use client"

// External Imports
import { useState } from "react"
import Image from "next/image"
import {
    Box,
    Button,
    Field,
    Input,
    NativeSelect,
    VStack,
    Heading,
    Text,
    Spinner,
    Flex,
    HStack,
} from "@repo/ui"

// Local Imports
import { createWaitlistEntry } from "@/services/firebase/admin-create"
import { validateEmailInput } from "@/utils/input-validation"

const revenueOptions = ["< $10k", "$10k – $100k", "$100k – $1M", "$1M+"];
const employeesOptions = ["1 – 10", "11 – 50", "51 – 200", "201 – 500", "500+"];
const countryOptions = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Netherlands", "Sweden", "Norway", "Denmark", "Finland",
    "Ireland", "Switzerland", "Austria", "Belgium", "Spain", "Italy",
    "Portugal", "Brazil", "Mexico", "India", "Japan", "South Korea",
    "Singapore", "New Zealand", "South Africa", "United Arab Emirates",
    "Israel", "Poland", "Czech Republic", "Other",
];

function WaitlistForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [stripeAccounts, setStripeAccounts] = useState<number | "">(1)
    const [revenue, setRevenue] = useState("")
    const [employees, setEmployees] = useState("")
    const [country, setCountry] = useState("")

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const isFormValid =
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        validateEmailInput(email) &&
        stripeAccounts !== "" && stripeAccounts >= 1 &&
        revenue !== "" &&
        employees !== ""

    async function handleSubmit(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault()
        if (!isFormValid) return

        setLoading(true)
        setErrorMessage("")

        try {
            const result = await createWaitlistEntry({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                stripeAccounts: stripeAccounts as number,
                revenue,
                employees,
                country: country || undefined,
            })

            if (result.error) {
                setErrorMessage(result.error)
            } else {
                setSubmitted(true)
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
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
                            You&apos;re on the waitlist!
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Thanks for your interest in Karsilo. We&apos;ll be in touch soon with next steps.
                        </Text>
                    </VStack>
                </Box>
            </Box>
        )
    }

    return (
        <Flex minH="calc(100vh - 48px)" width="full" maxW="1200px">
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
                                Join the Waitlist
                            </Heading>
                            <Text fontSize="md" color="gray.600">
                                Be the first to know when we launch. No commitment required.
                            </Text>
                        </Box>

                        <Box
                            as="form"
                            onSubmit={(e: React.FormEvent<HTMLDivElement>) => handleSubmit(e)}
                        >
                            <VStack gap={4}>
                                <HStack gap={4} width="full" flexDirection={{ base: "column", sm: "row" }}>
                                    <Field.Root required>
                                        <Field.Label htmlFor="firstName">First Name</Field.Label>
                                        <Input
                                            id="firstName"
                                            value={firstName}
                                            type="text"
                                            placeholder="John"
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                        />
                                    </Field.Root>
                                    <Field.Root required>
                                        <Field.Label htmlFor="lastName">Last Name</Field.Label>
                                        <Input
                                            id="lastName"
                                            value={lastName}
                                            type="text"
                                            placeholder="Smith"
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                        />
                                    </Field.Root>
                                </HStack>

                                <Field.Root required>
                                    <Field.Label htmlFor="email">Work Email</Field.Label>
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label htmlFor="stripeAccounts">Number of Stripe Accounts</Field.Label>
                                    <Input
                                        id="stripeAccounts"
                                        value={stripeAccounts}
                                        type="number"
                                        min={1}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const val = e.target.value;
                                            if (val === "") {
                                                setStripeAccounts("");
                                            } else {
                                                const num = parseInt(val);
                                                if (!isNaN(num)) setStripeAccounts(Math.max(1, num));
                                            }
                                        }}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>Annual Revenue</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                            value={revenue}
                                            onChange={(e) => setRevenue(e.target.value)}
                                        >
                                            <option value="">Select revenue range</option>
                                            {revenueOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>Number of Employees</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                            value={employees}
                                            onChange={(e) => setEmployees(e.target.value)}
                                        >
                                            <option value="">Select team size</option>
                                            {employeesOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Country</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option value="">Select country</option>
                                            {countryOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Field.Root>

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
                                    disabled={!isFormValid || loading}
                                >
                                    {loading ? (
                                        <>
                                            Submitting...
                                            <Spinner size="sm" ml={2} />
                                        </>
                                    ) : "Join Waitlist"}
                                </Button>
                            </VStack>
                        </Box>
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
                            &quot;Karsilo saved me hours every week. I finally know exactly how
                            much I&apos;m making across all my products.&quot;
                        </Text>
                        <Text fontSize="sm" color="brand.200">
                            — Sarah Chen, Founder of 3 SaaS products
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}

export default WaitlistForm
