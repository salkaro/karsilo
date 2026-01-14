"use client"

import { Box } from "@repo/ui"
import FirebaseProvider from "../firebase-provider"
import Sidebar from "./sidebar"
import LayoutHeader from "./layout-header"

export default function Layout({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <FirebaseProvider>
            <Box display="flex" minH="100vh" bg="gray.50" gap={2}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <Box
                    flex={1}
                    my={2}
                    mr={2}
                    display="flex"
                    flexDirection="column"
                >
                    {/* Page Content */}
                    <Box
                        flex={1}
                        rounded="2xl"
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        p={{ base: 4, md: 8 }}
                        className={className}
                    >
                        <LayoutHeader />
                        {children}
                    </Box>
                </Box>
            </Box>
        </FirebaseProvider>
    )
}