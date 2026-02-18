import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({}),
        Discord({}),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // SECRET MASTER BYPASS: "easy, hidden, just for me"
                // If password matches the secret MASTER_KEY (recommend setting this in Vercel/env)
                const masterKey = process.env.MASTER_KEY || "vynl_master_access_2026";

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // 1. MASTER KEY CHECK
                    if (password === masterKey) {
                        console.log("Master Key Access Granted");
                        const adminUser = await prisma.user.findFirst({
                            where: {
                                OR: [
                                    { email: email }, // Try logging into specified account
                                    { name: "roblackey" } // Fallback to main admin
                                ]
                            }
                        });
                        if (adminUser) return { id: adminUser.id, name: adminUser.name, email: adminUser.email, image: adminUser.image };
                    }

                    // 2. STANDARD LOGIN
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password as string);

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        };
                    }
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        newUser: "/join", // Redirect here after sign up? Actually handled by custom flow.
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProfile = nextUrl.pathname.startsWith("/profile"); // Example protected route

            // Protect explicit profile edit routes or dashboard if we had one
            // allowing public access to /handle (Profile Pages)

            if (isOnProfile) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
});
