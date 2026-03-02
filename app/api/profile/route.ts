import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();

    // Local bypass
    if (!session && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email || "rlackey.seattle@gmail.com";

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                profile: {
                    include: {
                        songs: {
                            orderBy: { createdAt: "desc" }
                        }
                    }
                }
            }
        });

        if (!user || !user.profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            image: user.image,
            profile: {
                ...user.profile,
                songs: user.profile.songs,
            },
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await auth();

    // Local bypass
    if (!session && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email || "rlackey.seattle@gmail.com";

    try {
        const body = await request.json();
        const { handle, bio, musicianType, socialLinks, themeConfig, avatarUrl, bannerUrl, epkData, heroImages } = body;

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Build update data — only include provided fields
        const updateData: any = {};
        if (handle !== undefined) updateData.handle = handle;
        if (bio !== undefined) updateData.bio = bio;
        if (musicianType !== undefined) updateData.musicianType = musicianType;
        if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
        if (themeConfig !== undefined) updateData.themeConfig = themeConfig;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
        if (epkData !== undefined) updateData.epkData = epkData;
        if (heroImages !== undefined) updateData.heroImages = heroImages;

        const profile = await prisma.profile.update({
            where: { userId: user.id },
            data: updateData,
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
