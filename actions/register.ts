"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { validateInviteCode } from "./invite";

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    handle: z.string().min(3, "Handle must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Handle can only contain letters, numbers, and underscores"),
    inviteCode: z.string().min(1, "Invite code is required"),
});

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    const { name, email, password, handle, inviteCode } = parsed.data;
    const normalizedInviteCode = inviteCode.toUpperCase();

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, message: "Email already registered" };
        }

        const existingProfile = await prisma.profile.findUnique({ where: { handle } });
        if (existingProfile) {
            return { success: false, message: "Handle already taken" };
        }

        // 2. Validate Invite Code (Double check)
        const validInvite = await validateInviteCode(normalizedInviteCode);
        if (!validInvite.valid) {
            return { success: false, message: validInvite.message };
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Transaction: Create User, Profile, Claim Invite
        await prisma.$transaction(async (tx) => {
            // Create User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${handle}`, // Default avatar
                },
            });

            // Create Account (Credentials) - NextAuth v5 manual linking
            // Actually, NextAuth Credentials provider doesn't strictly need an Account record if we implement authorize() to check User table directly.
            // But let's stick to checking User table for password hash.
            // We'll verify password against the one we store... wait, the User model doesn't have a password field.
            // I need to add a password field to the User model? Or use the Account model?
            // Standard NextAuth schema usually puts password on User or assumes an external provider.
            // Since I'm migrating to real auth, I'll add `password` to `User` model temporarily or properly.
            // Let's look at schema again. User has no password.
            // I will add `password` to User model in a separate migration first? 
            // OR I can store it in the Account model... but Credentials provider usually looks up User.

            // Let's add `password` to User model. It's the standard way for simple credentials auth.

            throw new Error("Schema update needed: User model missing password field");
        });

        return { success: true };
    } catch (error: any) {
        if (error.message.includes("Schema update needed")) {
            return { success: false, message: "System Error: Database schema mismatch" };
        }
        console.error("Registration error:", error);
        return { success: false, message: "Registration failed" };
    }
}
