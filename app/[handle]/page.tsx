import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import ProfileClient from './ProfileClient';

interface PageProps {
    params: {
        handle: string;
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { handle } = params;
    const session = await auth();

    const profile = await prisma.profile.findUnique({
        where: { handle },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
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
