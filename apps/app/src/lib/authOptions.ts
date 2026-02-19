// Local Imports
import { auth } from "@/lib/firebase/config";
import { IUser, IJwtToken } from "@repo/models";
import { retrieveUserAdmin, retrieveUserAndCreateAdmin } from "@/services/firebase/admin-retrieve";
import { isProduction, root } from "@repo/constants";

// External Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Ensure Firebase Admin is initialized
import "@repo/firebase";


export const authOptions: NextAuthOptions = {
    cookies: {
        sessionToken: {
            name: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: isProduction,
                domain: isProduction ? `.${root.replace("https://", "")}` : undefined,
            },
        },
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid email or password");
                }
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        credentials.email,
                        credentials.password
                    );

                    return {
                        id: userCredential.user.uid,
                        email: userCredential.user.email,
                    };

                } catch (error) {
                    throw new Error(`Invalid credentials: ${error}`);
                }
            },
        }),
        CredentialsProvider({
            id: "firebase-token",
            name: "Firebase Token",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken) {
                    throw new Error("No ID token provided");
                }
                try {
                    const decodedToken = await getAdminAuth().verifyIdToken(credentials.idToken);

                    return {
                        id: decodedToken.uid,
                        email: decodedToken.email ?? null,
                    };
                } catch (error) {
                    throw new Error(`Invalid token: ${error}`);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email as string;
                try {
                    const userDoc = (await retrieveUserAndCreateAdmin({ uid: user.id, email: user.email }) ?? {}) as IUser;
                    token.user = userDoc;
                } catch (error) {
                    console.error('Error retrieving user (jwt):', error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            const { user } = token as IJwtToken;
            try {
                if (!user.id) return session;
                const userDoc = await retrieveUserAdmin({ uid: user.id }) as IUser;
                if (userDoc) {
                    session.user = userDoc as IUser;
                }
            } catch (error) {
                console.error('Error retrieving user (session):', error);
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET
};