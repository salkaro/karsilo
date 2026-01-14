"use client"

import { Box, Heading, Text, VStack, Tabs } from "@repo/ui"
import { settingsSubItems } from "@/constants/platform"

export default function SettingsPage() {
    return (
        <VStack align="stretch" gap={6}>
            <Tabs.Root defaultValue="overview">
                <Tabs.List>
                    {settingsSubItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <Tabs.Trigger key={item.url} value={item.url.split("#")[1]}>
                                <IconComponent size={16} />
                                {item.title}
                            </Tabs.Trigger>
                        )
                    })}
                </Tabs.List>

                <Tabs.Content value="overview" pt={6}>
                    <Box
                        bg="white"
                        borderRadius="xl"
                        p={6}
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        <Heading size="lg" mb={2}>Overview</Heading>
                        <Text color="muted.foreground" mb={4}>
                            Edit personal information
                        </Text>
                        <Text color="muted.foreground">
                            Personal information form will go here
                        </Text>
                    </Box>
                </Tabs.Content>

                <Tabs.Content value="organisation" pt={6}>
                    <Box
                        bg="white"
                        borderRadius="xl"
                        p={6}
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        <Heading size="lg" mb={2}>Organisation</Heading>
                        <Text color="muted.foreground" mb={4}>
                            Edit organisational data & add members
                        </Text>
                        <Text color="muted.foreground">
                            Organisation settings will go here
                        </Text>
                    </Box>
                </Tabs.Content>

                <Tabs.Content value="billing" pt={6}>
                    <Box
                        bg="white"
                        borderRadius="xl"
                        p={6}
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        <Heading size="lg" mb={2}>Billing</Heading>
                        <Text color="muted.foreground" mb={4}>
                            View billing & manage memberships
                        </Text>
                        <Text color="muted.foreground">
                            Billing information will go here
                        </Text>
                    </Box>
                </Tabs.Content>
            </Tabs.Root>
        </VStack>
    )
}
