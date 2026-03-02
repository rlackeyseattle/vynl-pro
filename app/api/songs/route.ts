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
        const profile = await prisma.profile.findFirst({
            where: { user: { email: userEmail } }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const songs = await prisma.song.findMany({
            where: { profileId: profile.id },
            orderBy: { title: 'asc' }
        });

        return NextResponse.json(songs);
    } catch (error) {
        console.error("Songs fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
    }
}
