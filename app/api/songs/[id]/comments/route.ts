import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const comments = await prisma.songComment.findMany({
            where: { songId: id },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    try {
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const comment = await prisma.songComment.create({
            data: {
                content,
                songId: id,
                userId: user.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }
}
