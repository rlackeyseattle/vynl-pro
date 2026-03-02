import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/venues?q=seattle&state=WA&type=club&limit=50
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const state = url.searchParams.get("state") || "";
    const city = url.searchParams.get("city") || "";
    const type = url.searchParams.get("type") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const venues = await prisma.venue.findMany({
        where: {
            AND: [
                q ? {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { city: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } },
                    ]
                } : {},
                state ? { state: { equals: state, mode: "insensitive" } } : {},
                city ? { city: { contains: city, mode: "insensitive" } } : {},
                type ? { venueType: { equals: type, mode: "insensitive" } } : {},
            ]
        },
        orderBy: [{ verified: "desc" }, { name: "asc" }],
        take: limit,
    });

    return NextResponse.json({ venues, total: venues.length });
}

// POST /api/venues — admin: add a new venue manually
export async function POST(req: NextRequest) {
    const body = await req.json();
    const venue = await prisma.venue.create({
        data: { ...body, dataSource: "manual" },
    });
    return NextResponse.json({ venue });
}
