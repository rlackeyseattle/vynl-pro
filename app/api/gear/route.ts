import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/gear — fetch user's gear list
export async function GET(req: NextRequest) {
    const profileId = req.nextUrl.searchParams.get("profileId");
    if (!profileId) return NextResponse.json({ gear: [] });

    const gear = await prisma.gearItem.findMany({
        where: { profileId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ gear });
}

// POST /api/gear — add a gear item
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { profileId, name, brand, serialNumber, category, status, notes, assignedTo, value, tags } = body;

    if (!profileId || !name) {
        return NextResponse.json({ error: "profileId and name required" }, { status: 400 });
    }

    const item = await prisma.gearItem.create({
        data: { profileId, name, brand, serialNumber, category, status: status || "in", notes, assignedTo, value, tags },
    });

    return NextResponse.json({ item });
}

// PATCH /api/gear — update status
export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const { id, status, checkedAt } = body;

    const item = await prisma.gearItem.update({
        where: { id },
        data: { status, checkedAt: checkedAt ? new Date(checkedAt) : undefined },
    });

    return NextResponse.json({ item });
}

// DELETE /api/gear?id=xxx
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await prisma.gearItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
