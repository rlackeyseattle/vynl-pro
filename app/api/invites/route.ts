import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/invites — list my invites
export async function GET() {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const invites = await prisma.inviteCode.findMany({
        where: { createdBy: user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
}

// POST /api/invites — create a new invite
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const { label, maxUses = 1, expiresInDays } = body;

    // Generate unique 8-char code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase() +
        Math.random().toString(36).substring(2, 6).toUpperCase();

    const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000)
        : null;

    const invite = await prisma.inviteCode.create({
        data: {
            code,
            createdBy: user.id,
            label: label || null,
            maxUses: maxUses || 1,
            expiresAt,
        },
    });

    return NextResponse.json({ invite });
}

// DELETE /api/invites?id=xxx
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.inviteCode.deleteMany({ where: { id, createdBy: user.id } });
    return NextResponse.json({ ok: true });
}
