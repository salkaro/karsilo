"use client"

// External Imports
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
    Box,
    Button,
    Field,
    Input,
    VStack,
    Heading,
    Text,
    Spinner,
    Flex,
} from "@repo/ui"

// Local Imports
import PreparingForm from "./preparing-form"
import { updateOnboarding } from "@/services/firebase/update"
import { joinOrganisationAdmin } from "@/services/firebase/admin-update"


const OnboardingForm = () => {
    const { data: session, status, update: updateSession } = useSession();
    const toastShownRef = useRef(false);
    const searchParams = useSearchParams();
    const inviteIdFromUrl = searchParams.get('inviteId');

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [stage, setStage] = useState(0);

    // Stage 0: User info
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    // Stage 1: Org action choice
    const [orgAction, setOrgAction] = useState<"create" | "join">(inviteIdFromUrl ? "join" : "create")
    // Create
    const [orgName, setOrgName] = useState("");
    // Join
    const [joinCode, setJoinCode] = useState(inviteIdFromUrl || "")

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            setLoading(true);

            // wait 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // refetch session
            await updateSession();

            if (isMounted) {
                setLoading(false);
            }
        };

        if (status !== "authenticated") {
            run();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [updateSession, status]);

    const handleNextStage = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (stage === 0 && (!firstname || !lastname)) {
            toast.error("Please enter your first and last name.");
            return;
        }

        if (stage === 1) {
            if (orgAction === "create" && !orgName.trim()) {
                return
            }
            if (orgAction === "join" && !joinCode.trim()) {
                return
            }
        }

        // Final submission
        if (stage === 1) {
            setLoading(true)
            try {
                if (orgAction === "create") {
                    await updateOnboarding({
                        firstname,
                        lastname,
                        organisation: orgName,
                    })
                    toast.success("Organisation created and onboarding complete!")
                } else if (orgAction === "join") {
                    if (!session?.user?.id) {
                        toast.error("Session not ready yet. Please wait a moment and try again.")
                        setLoading(false)
                        return
                    }

                    const { error } = await joinOrganisationAdmin({ code: joinCode.trim(), uid: session.user.id, firstname, lastname })
                    if (error) throw error;
                    toast.success("Joined organisation successfully!")
                }

                router.push(`/preparing`);
            } catch (err) {
                console.log(err)
                toast.error("Something went wrong, please try again.", { description: "Organisation may not exists or invite code is invalid" })
            } finally {
                setLoading(false)
            }
        } else {
            await updateSession();
            setStage(stage + 1);
        }
    };

    useEffect(() => {
        if (toastShownRef.current) return;

        if (status === "loading") {
            toast.info("Checking your session...");
        } else if (status === "unauthenticated") {
            toast.warning("You are not authenticated.");
        } else if (status === "authenticated") {
            toast.success(`Welcome to your onboarding`);
        }
        toastShownRef.current = true;

    }, [status, session,]);

    async function onClick() {
        router.push("/login")
    }

    const handlePreviousStage = () => {
        setStage((prev) => Math.max(prev - 1, 0));
    };

    if (status === "loading") {
        return <PreparingForm />
    }

    if (status === "unauthenticated") {
        return (
            <VStack gap={6} textAlign="center">
                <Heading size="2xl">Not authenticated</Heading>
                <Text>Please login or create an account</Text>
                <Button onClick={onClick} colorScheme="blue">
                    Go to login
                </Button>
            </VStack>
        )
    }

    return (
        <Box maxW="xl" p={6} textAlign="center">
            {stage === 0 && (
                <Box as="form" onSubmit={(e) => handleNextStage(e)}>
                    <VStack gap={6} align="stretch">
                        <Heading size="xl">Let&apos;s get started</Heading>
                        <VStack gap={4} align="stretch" px={{ xl: 4, "2xl": 0 }}>
                            <Field.Root required>
                                <Field.Label htmlFor="firstname">First Name</Field.Label>
                                <Input
                                    id="firstname"
                                    value={firstname}
                                    type="text"
                                    placeholder="John"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root required>
                                <Field.Label htmlFor="lastname">Last Name</Field.Label>
                                <Input
                                    id="lastname"
                                    value={lastname}
                                    type="text"
                                    placeholder="Smith"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)}
                                />
                            </Field.Root>
                        </VStack>
                        <Button
                            width="full"
                            type="submit"
                            disabled={!firstname || !lastname || loading || status !== "authenticated"}
                            colorScheme="blue"
                            mt={4}
                        >
                            {loading && <Spinner size="sm" mr={2} />}
                            {!loading && "Continue"}
                        </Button>
                    </VStack>
                </Box>
            )}

            {stage === 1 && (
                <Box as="form" onSubmit={(e) => handleNextStage(e)}>
                    <VStack gap={6} align="stretch">
                        <Heading size="xl" mb={4}>Organisation</Heading>

                        <Flex gap={4} justify="center">
                            <Button
                                variant={orgAction === "create" ? "solid" : "ghost"}
                                onClick={() => setOrgAction("create")}
                                type="button"
                            >
                                Create New
                            </Button>
                            <Button
                                variant={orgAction === "join" ? "solid" : "ghost"}
                                onClick={() => setOrgAction("join")}
                                type="button"
                            >
                                Join Existing
                            </Button>
                        </Flex>

                        {orgAction === "create" ? (
                            <VStack gap={4} align="stretch">
                                <Field.Root>
                                    <Field.Label htmlFor="organisation">Organisation Name</Field.Label>
                                    <Input
                                        id="organisation"
                                        value={orgName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgName(e.target.value)}
                                        placeholder="Salkaro Inc."
                                    />
                                </Field.Root>
                            </VStack>
                        ) : (
                            <VStack gap={4} align="stretch">
                                <Field.Root>
                                    <Field.Label htmlFor="joinCode">Join Code</Field.Label>
                                    <Input
                                        id="joinCode"
                                        value={joinCode}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value)}
                                        placeholder="e.g. AbCd1234"
                                    />
                                </Field.Root>
                            </VStack>
                        )}

                        <Flex justify="space-between">
                            <Button variant="ghost" onClick={handlePreviousStage} type="button">
                                Go Back
                            </Button>
                            <Button
                                width="32"
                                type="submit"
                                disabled={loading || status !== "authenticated" || !session?.user?.id}
                                colorScheme="blue"
                            >
                                {loading && <Spinner size="sm" mr={2} />}
                                {loading ? (orgAction === "create" ? "Creating" : "Joining") : (orgAction === "create" ? "Create" : "Join")}
                            </Button>
                        </Flex>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export default OnboardingForm
