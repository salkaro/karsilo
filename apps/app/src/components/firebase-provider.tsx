"use client"

// Local Imports
import { auth } from "@/lib/firebase/config"
import { signOut } from "@/services/sign-out"
import { idTokenCache } from "@/constants/cache"
import { setCookie } from "@/utils/cookie-handlers"

// External Imports
import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect } from "react"
import { useSession } from "next-auth/react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button, Separator, DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@repo/ui"

interface Props {
    children: React.ReactNode;
}

const FirebaseProvider: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const { status, update: updateSession } = useSession();

    // Derive showDialog directly from status instead of using effect
    const showDialog = status === "unauthenticated";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const path = window.location.pathname;

                if (path == "/preparing") {
                    await updateSession();
                    router.push("/dashboard")
                }

                // Proactively refresh token and cache it
                try {
                    const token = await user.getIdToken(true);
                    setCookie(idTokenCache, token, { expires: 1 });
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                }
            }
        })

        // Set up periodic token refresh (every 50 minutes, tokens expire in 60 minutes)
        const tokenRefreshInterval = setInterval(async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    setCookie(idTokenCache, token, { expires: 1 });
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                }
            }
        }, 50 * 60 * 1000); // 50 minutes

        return () => {
            unsubscribe();
            clearInterval(tokenRefreshInterval);
        }
    }, [router, updateSession])

    const handleReLogin = async () => {
        await signOut("/login");
        router.push("/login")
    }


    if (showDialog) {
        return (
            <DialogRoot open={showDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Session Expired</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <DialogBody>
                        <p className="text-muted-foreground">Your session has expired or you&apos;ve been logged out. Please log back in to continue.</p>
                        <div className="flex justify-center items-center mt-4">
                            <Button onClick={handleReLogin}>
                                Go to login
                                <ArrowRight />
                            </Button>
                        </div>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>
        )
    }

    return <>{children}</>
}

export default FirebaseProvider