"use client"

import { LuInbox } from "react-icons/lu"
import { Box, Center, Heading, Text, VStack } from "@repo/ui"

interface Props {
    text?: string
}

const NoContent: React.FC<Props> = ({ text }) => {
    return (
        <Center py={12} px={4} textAlign="center">
            <VStack gap={4}>
                <Center
                    w="72px"
                    h="72px"
                    borderRadius="full"
                    bg="gray.100"
                    _dark={{ bg: "gray.800" }}
                >
                    <LuInbox size={24} />
                </Center>
                <Box>
                    <Heading size="md" mb={2}>
                        {text}
                    </Heading>
                    <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} maxW="sm">
                        There&apos;s nothing to display here at the moment. Check back later or try refreshing the page.
                    </Text>
                </Box>
            </VStack>
        </Center>
    )
}

export default NoContent
