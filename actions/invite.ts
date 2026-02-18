"use server";

import { prisma } from "@/lib/prisma";

export async function validateInviteCode(code: string) {
    if (!code) return { valid: false, message: "Code is required" };
    const normalizedCode = code.toUpperCase();

    try {
        const invite = await prisma.inviteCode.findUnique({
            where: { code: normalizedCode },
        });

        if (!invite) {
            return { valid: false, message: "Invalid invite code" };
        }

        if (invite.isUsed) {
            return { valid: false, message: "This code has already been claimed" };
        }

        if (invite.expiresAt && invite.expiresAt < new Date()) {
            return { valid: false, message: "This code has expired" };
        }

        return { valid: true, message: "Code is valid" };
    } catch (error) {
        console.error("Error validating invite code:", error);
        return { valid: false, message: "Internal server error" };
    }
}

export async function claimInviteCode(code: string, userId: string) {
    try {
        const normalizedCode = code.toUpperCase();
        // Re-validate inside the transaction/action to prevent race conditions
        const invite = await prisma.inviteCode.findUnique({
            where: { code: normalizedCode },
        });

        if (!invite || invite.isUsed) {
            return { success: false, message: "Invalid or used code" };
        }

        await prisma.inviteCode.update({
            where: { code: normalizedCode },
            data: {
                isUsed: true,
                usedById: userId,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error claiming invite code:", error);
        return { success: false, message: "Failed to claim code" };
    }
}
