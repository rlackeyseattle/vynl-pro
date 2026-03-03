import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true },
        });
        return NextResponse.json({ profile: user?.profile || null });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { profile: true } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const allowedFields = ["name", "handle", "bio", "genre", "location", "website",
            "instagram", "twitter", "youtube", "spotify", "pressQuote",
            "pressQuoteSource", "bookingEmail", "managementEmail"];

        const data: Record<string, string> = {};
        for (const k of allowedFields) {
            if (body[k] !== undefined) data[k] = body[k];
        }

        if (user.profile) {
            await prisma.profile.update({ where: { userId: user.id }, data });
        } else {
            // Auto-generate handle if not provided — required & unique
            const baseHandle = (data.handle || user.email?.split("@")[0] || "artist")
                .toLowerCase().replace(/[^a-z0-9]/g, "");
            const handle = `${baseHandle}${Math.floor(Math.random() * 9000 + 1000)}`;
            await prisma.profile.create({ data: { userId: user.id, handle, ...data } });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
