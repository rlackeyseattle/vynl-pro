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
    inviteCode: z.string().optional(),
});

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    const { name, email, password, handle, inviteCode } = parsed.data;
    const normalizedInviteCode = inviteCode ? inviteCode.toUpperCase() : null;

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

        // 2. Validate Invite Code (Optional now)
        if (normalizedInviteCode) {
            const validInvite = await validateInviteCode(normalizedInviteCode);
            // Relaxed check: Only fail if code is provided but invalid? 
            // Or just ignore if invalid? Let's enforce if provided, but allow empty.
            if (!validInvite.valid) {
                // For public access mode, we can arguably just ignore invalid codes and proceed.
                // But let's be nice and warn if they tried a code and it failed.
                // Actually, user wants BYPASS. So let's just proceed.
            }
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
                    password: hashedPassword, // Store hashed password directly on User model
                    image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${handle}`,
                },
            });

            // Create Profile
            await tx.profile.create({
                data: {
                    userId: user.id,
                    handle: handle,
                    bio: "New VYNL.PRO Member",
                    musicianType: "Artist",
                }
            });

            // Claim Invite Code (if provided and NOT 'PUBLIC')
            if (normalizedInviteCode && normalizedInviteCode !== "PUBLIC") {
                // We need to use 'claimInviteCode' logic here, but since we are in a transaction,
                // we should ideally use 'tx' to be safe, but 'claimInviteCode' uses 'prisma'.
                // To stay atomic, we should reimplement the simple update here using 'tx'.

                const invite = await tx.inviteCode.findUnique({ where: { code: normalizedInviteCode } });
                if (invite && !invite.isUsed) {
                    await tx.inviteCode.update({
                        where: { code: normalizedInviteCode },
                        data: { isUsed: true, usedById: user.id }
                    });
                }
            }
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
