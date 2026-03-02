const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sc = await prisma.song.count();
    const pc = await prisma.profile.count();
    const uc = await prisma.user.count();
    console.log('Counts:', { songs: sc, profiles: pc, users: uc });

    const email = 'rob_local@vynl.pro';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: { include: { _count: { select: { songs: true } } } } }
    });

    if (user) {
        console.log(`User ${user.email} found.`);
        if (user.profile) {
            console.log(`Profile ${user.profile.id} found for user.`);
            console.log(`Song count for this profile: ${user.profile._count.songs}`);
        } else {
            console.log('No profile found for user!');
        }
    } else {
        console.log('No user found for email!');
    }
}

main().finally(() => prisma.$disconnect());
