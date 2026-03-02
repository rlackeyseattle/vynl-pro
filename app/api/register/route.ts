import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    handle: z
        .string()
        .min(2, "Handle must be at least 2 characters")
        .max(30, "Handle must be under 30 characters")
        .regex(/^[a-z0-9_-]+$/, "Handle can only contain lowercase letters, numbers, _ and -"),
    name: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = registerSchema.safeParse({
            ...body,
            email: body.email?.toLowerCase(),
            handle: body.handle?.toLowerCase(),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password, handle, name } = parsed.data;

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // Check if handle already exists
        const existingHandle = await prisma.profile.findUnique({ where: { handle } });
        if (existingHandle) {
            return NextResponse.json(
                { error: "That handle is already taken." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user + profile atomically
        const user = await prisma.user.create({
            data: {
                email,
                name: name || handle,
                password: hashedPassword,
                profile: {
                    create: {
                        handle,
                        bio: "",
                        musicianType: "",
                    },
                },
            } as any,
            include: { profile: true },
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
