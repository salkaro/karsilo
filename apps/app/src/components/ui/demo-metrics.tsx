import { Box, Flex, Grid, Text } from "@repo/ui";

export const DemoMetrics = () => {
    const metrics = [
        { label: "Revenue", value: "$12,455", change: "+23%", isPositive: true },
        { label: "Customers", value: "1,468", change: "+6%", isPositive: true },
        { label: "Subscriptions", value: "847", change: "+12%", isPositive: true },
        { label: "Payments", value: "22,209", change: "+8%", isPositive: true },
    ];

    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={8}>
            {metrics.map((metric) => (
                <Box
                    key={metric.label}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="lg"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    transition="all 0.2s"
                    _hover={{
                        bg: "rgba(255, 255, 255, 0.15)",
                        transform: "translateY(-2px)",
                    }}
                    cursor="pointer"
                    height={{ base: "24" }}
                >
                    <Text fontSize="sm" color="whiteAlpha.800" mb={2}>
                        {metric.label}
                    </Text>
                    <Flex align="baseline" gap={2}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">
                            {metric.value}
                        </Text>
                        <Text
                            fontSize="sm"
                            color={metric.isPositive ? "green.300" : "red.300"}
                            fontWeight="600"
                        >
                            {metric.change}
                        </Text>
                    </Flex>
                </Box>
            ))}
        </Grid>
    )
}