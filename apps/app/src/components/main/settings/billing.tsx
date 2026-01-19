"use client"

// External Imports
import { useSession } from "next-auth/react"
import { LuZap, LuRocket, LuStar, LuCrown, LuUsers, LuCreditCard } from "react-icons/lu"
import { toast } from "sonner"

// Local Imports
import { memberLimits, levelThreeAccess } from "@repo/constants"
import { useOrganisation } from "@/hooks/useOrganisation"
import { createBillingPortalUrl } from "@/services/stripe/create"
import { IOrganisation, SubscriptionType } from "@repo/models"
import {
    Box,
    Button,
    Card,
    Grid,
    Heading,
    HStack,
    Progress,
    Text,
    VStack
} from "@repo/ui"
import StripePricingTable from "@/components/ui/pricing-table"

const Billing = () => {
    const { organisation } = useOrganisation()
    const { data: session } = useSession()

    const hasLevelThreeAccess = levelThreeAccess.includes(session?.user.organisation?.role as string)

    async function handleBillingPortal() {
        try {
            if (organisation?.stripeCustomerId) {
                const billingUrl = await createBillingPortalUrl({ customerId: organisation?.stripeCustomerId })
                if (billingUrl) {
                    window.open(billingUrl, "_blank")
                } else {
                    throw new Error("Failed to create billing portal url")
                }
            } else {
                throw new Error("Organisation is invalid")
            }
        } catch (error) {
            toast.error("Failed to create billing portal url", { description: `${error}` })
        }
    }

    return (
        <VStack gap={4} align="stretch">
            {hasLevelThreeAccess && (
                <>
                    <HStack justify="space-between" width="full">
                        <Heading size="md">Billing</Heading>
                        <Button onClick={handleBillingPortal} size="sm">
                            Manage
                        </Button>
                    </HStack>
                    <Box marginBottom={20}>
                        <StripePricingTable />
                    </Box>
                </>
            )}
            <CurrentSubscription organisation={organisation as IOrganisation} hasLevelThreeAccess={hasLevelThreeAccess} />
        </VStack>
    )
}

const getSubscriptionIcon = (type: SubscriptionType) => {
    const size = 24

    switch (type) {
        case "free":
            return <LuZap size={size} />
        case "growth":
            return <LuRocket size={size} />
        case "essential":
            return <LuStar size={size} />
        case "pro":
            return <LuCrown size={size} />
        default:
            return <LuZap size={size} />
    }
}

const getSubscriptionColor = (type: SubscriptionType) => {
    switch (type) {
        case "free":
            return "gray.500"
        case "growth":
            return "blue.500"
        case "essential":
            return "purple.500"
        case "pro":
            return "orange.500"
        default:
            return "gray.500"
    }
}

const CurrentSubscription = ({ organisation, hasLevelThreeAccess }: { organisation: IOrganisation, hasLevelThreeAccess: boolean }) => {
    const subscriptionType = organisation?.subscription || "free"
    const memberLimit = memberLimits[subscriptionType]
    const currentMembers = organisation?.members || 0
    const iconColor = getSubscriptionColor(subscriptionType)

    return (
        <VStack gap={6} align="stretch">
            <Card.Root variant="outline">
                <Card.Header>
                    <Card.Title>Current Subscription</Card.Title>
                    <Card.Description>Your current plan and usage details</Card.Description>
                </Card.Header>
                <Card.Body>
                    <VStack gap={6} align="stretch">
                        {/* Subscription Plan */}
                        <HStack
                            gap={4}
                            p={4}
                            bg="bg.muted"
                            borderRadius="lg"
                        >
                            <Box
                                p={3}
                                borderRadius="full"
                                bg="bg"
                                border="2px solid"
                                borderColor={iconColor}
                                color={iconColor}
                            >
                                {getSubscriptionIcon(subscriptionType)}
                            </Box>
                            <Box flex={1}>
                                <Text fontSize="sm" color="fg.muted">Current Plan</Text>
                                <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
                                    {subscriptionType}
                                </Text>
                            </Box>
                        </HStack>

                        {/* Usage Stats */}
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                            {/* Members */}
                            <HStack
                                align="flex-start"
                                gap={3}
                                p={4}
                                border="1px solid"
                                borderColor="border"
                                borderRadius="lg"
                            >
                                <Box p={2} borderRadius="md" bg="blue.500/10">
                                    <LuUsers size={20} color="var(--chakra-colors-blue-500)" />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" color="fg.muted">Team Members</Text>
                                    <Text fontSize="xl" fontWeight="semibold">
                                        {currentMembers} / {memberLimit === -1 ? "Unlimited" : memberLimit}
                                    </Text>
                                    {memberLimit !== -1 && (
                                        <Progress.Root
                                            mt={2}
                                            value={Math.min((currentMembers / memberLimit) * 100, 100)}
                                            size="sm"
                                            colorPalette="blue"
                                        >
                                            <Progress.Track>
                                                <Progress.Range />
                                            </Progress.Track>
                                        </Progress.Root>
                                    )}
                                </Box>
                            </HStack>

                            {/* Stripe Customer */}
                            {(organisation?.stripeCustomerId && hasLevelThreeAccess) && (
                                <HStack
                                    align="flex-start"
                                    gap={3}
                                    p={4}
                                    border="1px solid"
                                    borderColor="border"
                                    borderRadius="lg"
                                >
                                    <Box p={2} borderRadius="md" bg="purple.500/10">
                                        <LuCreditCard size={20} color="var(--chakra-colors-purple-500)" />
                                    </Box>
                                    <Box minW={0} flex={1}>
                                        <Text fontSize="sm" color="fg.muted">Customer ID</Text>
                                        <Text
                                            fontSize="sm"
                                            fontFamily="mono"
                                            truncate
                                            title={organisation.stripeCustomerId}
                                        >
                                            {organisation.stripeCustomerId}
                                        </Text>
                                    </Box>
                                </HStack>
                            )}
                        </Grid>
                    </VStack>
                </Card.Body>
            </Card.Root>

            {!hasLevelThreeAccess && (
                <Box
                    p={4}
                    bg="bg.muted"
                    borderRadius="lg"
                    border="1px dashed"
                    borderColor="border"
                >
                    <Text fontSize="sm" color="fg.muted">
                        <Text as="span" fontWeight="medium">Need to upgrade?</Text>{" "}
                        Please contact your organization administrator to manage your subscription.
                    </Text>
                </Box>
            )}
        </VStack>
    )
}

export default Billing
