const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profileId = 'cmlvljak6000019u78nvsi3aol';
    const email = 'rob_local@vynl.pro';

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Rob Lackey (Local)',
        }
    });

    const profile = await prisma.profile.upsert({
        where: { id: profileId },
        update: { userId: user.id },
        create: {
            id: profileId,
            userId: user.id,
            handle: 'rob-local',
            bio: 'Local development profile'
        }
    });

    console.log(`Successfully linked user ${user.email} to profile ${profile.id}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
