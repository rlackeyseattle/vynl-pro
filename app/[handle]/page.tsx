import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { auth } from "@/auth";

interface PageProps {
    params: Promise<{ handle: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { handle } = await params;
    const session = await auth();

    const profile = await prisma.profile.findUnique({
        where: { handle },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            songs: {
                include: {
                    comments: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                }
                            }
                        }
                    },
                    likes: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!profile) {
        notFound();
    }

    return (
        <ProfileClient
            profile={profile as any}
            sessionUser={session?.user || null}
        />
    );
}
