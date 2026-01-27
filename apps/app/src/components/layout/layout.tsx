"use client"

import { Box } from "@repo/ui"
import FirebaseProvider from "../firebase-provider"
import OnboardingModal from "../main/onboarding/onboarding-modal"

import LayoutHeader from "./layout-header"
import Sidebar from "../ui/sidebar"
import Decorations from "./decorations"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Layout({ className, children }: { className?: string, children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname()

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        const timeout = setTimeout(() => setIsSidebarOpen(false), 0)
        return () => clearTimeout(timeout)
    }, [pathname])

    return (
        <FirebaseProvider>
            <Box display="flex" h="100vh" bg="gray.50" gap={2} overflowY="hidden">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

                {/* Main Content Area */}
                <Box
                    flex={1}
                    my={{ md: 2 }}
                    mr={{ md: 2 }}
                    display="flex"
                    flexDirection="column"
                    overflowY="hidden"
                >
                    {/* Page Content */}
                    <Box
                        flex={1}
                        rounded={{ md: "2xl" }}
                        bg="white"
                        borderWidth={{ md: "1px" }}
                        borderColor={{ md: "gray.200" }}
                        p={{ base: 4, md: 8 }}
                        className={className}
                        position="relative"
                        overflowX="hidden"
                        overflowY="auto"
                        style={{
                            scrollbarWidth: "none", 
                            msOverflowStyle: "none"
                        }}
                    >
                        <Decorations />
                        <Box position="relative" zIndex={1}>
                            <LayoutHeader onSidebarToggle={toggleSidebar} />
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <OnboardingModal />
        </FirebaseProvider>
    )
}