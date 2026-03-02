import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Google({}),
        Discord({}),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const masterKey = process.env.MASTER_KEY || "vynl_master_access_2026";
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string() })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                // 1. MASTER KEY BYPASS
                if (password === masterKey) {
                    const adminUser = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { name: email },
                                { name: "roblackey" }
                            ]
                        }
                    });

                    if (adminUser) {
                        return {
                            id: adminUser.id,
                            name: adminUser.name,
                            email: adminUser.email,
                            image: adminUser.image
                        };
                    }
                }

                // 2. STANDARD LOGIN
                if (!email.includes("@")) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !(user as any).password) return null;

                const passwordsMatch = await bcrypt.compare(password, (user as any).password);

                if (passwordsMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    trustHost: true,
});
