import { Box, Flex } from '@repo/ui'
import { DemoMetrics } from './demo-metrics'
import { DemoChart } from './demo-chart'

const DemoChartsAndMetrics = () => {
    return (
        <Flex
            display={{ base: "none", lg: "flex" }}
            align={{ "xl": "center" }}
            justify="center"
            p={{ base: 4, "2xl": 12 }}
            position="relative"
            overflow="hidden"
            bg="linear-gradient(135deg, #5b21b6 100%, #7c3aed 0%)"
            _before={{
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)
    `,
                backgroundSize: "24px 24px",
                opacity: 0.6,
                pointerEvents: "none",
                zIndex: 0,
            }}
        >
            {/* Rotated wrapper */}
            <Box
                transform="rotateX(20deg) rotateY(-10deg)"
                transformStyle="preserve-3d"
                w="full"
                maxW={{ base: "600px", "2xl": "900px" }}
                position="relative"
            >
                <Box
                    w="full"
                    maxHeight={{ base: "600px", "2xl": "700px" }}
                    position="relative"
                    zIndex={1}
                >
                    {/* Metrics Cards */}
                    <DemoMetrics />

                    {/* Chart */}
                    <Box w="full" h="100%" pointerEvents="auto">
                        <DemoChart />
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default DemoChartsAndMetrics
