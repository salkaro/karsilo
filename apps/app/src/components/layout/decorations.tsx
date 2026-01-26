import { Box } from '@repo/ui'

const Decorations = () => {
    return (
        <>
            {/* Top right - large */}
            <Box
                position="absolute"
                top="-100px"
                right="-40px"
                width="170px"
                height="170px"
                borderRadius="full"
                bg="gray.100"
                opacity={0.6}
                pointerEvents="none"
                zIndex={0}
            />
            {/* Bottom left - large */}
            <Box
                position="absolute"
                bottom="-120px"
                left="-80px"
                width="280px"
                height="280px"
                borderRadius="full"
                bg="gray.100"
                opacity={0.5}
                pointerEvents="none"
                zIndex={0}
            />
            {/* Middle right - small */}
            <Box
                position="absolute"
                top="40%"
                right="-60px"
                width="140px"
                height="140px"
                borderRadius="full"
                bg="gray.100"
                opacity={0.4}
                pointerEvents="none"
                zIndex={0}
            />
            {/* Top left - medium */}
            <Box
                position="absolute"
                top="15%"
                left="-70px"
                width="180px"
                height="180px"
                borderRadius="full"
                bg="gray.100"
                opacity={0.35}
                pointerEvents="none"
                zIndex={0}
            />
        </>
    )
}

export default Decorations
