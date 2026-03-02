import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const genre = formData.get("genre") as string;
        const bpm = formData.get("bpm") as string;
        const key = formData.get("key") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);

        const audioUrl = `/uploads/${fileName}`;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: { profile: true }
        });

        if (!user?.profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const song = await prisma.song.create({
            data: {
                title,
                genre,
                bpm: bpm ? parseInt(bpm) : null,
                key,
                audioUrl,
                profileId: user.profile.id,
            }
        });

        return NextResponse.json(song);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload music" }, { status: 500 });
    }
}
