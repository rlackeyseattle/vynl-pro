import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                inviteCode: { label: "Invite Code", type: "text" },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6), inviteCode: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password, inviteCode } = parsedCredentials.data;

                    // INVITE-ONLY LOGIC
                    // For now, only 'VYNL2026' is a valid invite code
                    if (inviteCode !== "VYNL2026") {
                        throw new Error("Invalid Invite Code.");
                    }

                    // MOCK USER CHECK
                    // In a real app, you'd check your DB here.
                    if (email === "rob@vynl.pro" && password === "password123") {
                        return { id: "1", name: "Rob Lackey", email: "rob@vynl.pro" };
                    }

                    // Allow new registrations for anyone with the code for demo purposes
                    return { id: Math.random().toString(), name: email.split('@')[0], email };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProfile = nextUrl.pathname.startsWith("/profile");
            if (isOnProfile) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
});
