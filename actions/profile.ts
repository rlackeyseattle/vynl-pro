"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    const bio = formData.get("bio") as string;
    const musicianType = formData.get("musicianType") as string;
    const location = formData.get("location") as string;
    const gear = formData.get("gear") as string;
    const interests = formData.get("interests") as string;
    const socialLinks = formData.get("socialLinks") as string;

    try {
        await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                bio,
                musicianType,
                location,
                gear,
                interests,
                socialLinks,
            },
        });

        revalidatePath("/settings");
        revalidatePath(`/${session.user.name}`); // Revalidate public profile
        return { success: true, message: "Profile updated successfully" };
    } catch (error: any) {
        console.error("Update profile error:", error);
        return { success: false, message: "Failed to update profile" };
    }
}

export async function updateTheme(themeConfig: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                themeConfig,
            },
        });

        revalidatePath("/settings");
        revalidatePath(`/${session.user.name}`);
        return { success: true, message: "Theme saved successfully" };
    } catch (error: any) {
        console.error("Update theme error:", error);
        return { success: false, message: "Failed to save theme" };
    }
}
