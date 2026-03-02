import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    // Local bypass for in-line editing
    if (!session && process.env.NODE_ENV !== 'development') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { chartData } = await req.json();

        const updatedSong = await prisma.song.update({
            where: { id },
            data: { chartData },
        });

        // Revalidate RTLCC and Profile views
        revalidatePath("/rtlcc");

        return NextResponse.json(updatedSong);
    } catch (error) {
        console.error("Failed to update chart:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
