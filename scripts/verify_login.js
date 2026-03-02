const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'rlackey.seattle@gmail.com' },
    });

    if (!user) {
        console.log('USER NOT FOUND');
        return;
    }

    console.log('User:', user.email, '|', user.name);
    console.log('Has password:', !!user.password);

    const ok = await bcrypt.compare('072425ChlWal!', user.password);
    console.log('Password match:', ok);

    const profile = await prisma.profile.findFirst({
        where: { userId: user.id },
        include: { _count: { select: { songs: true } } },
    });

    console.log('Profile:', profile?.handle, '| Songs:', profile?._count?.songs);
}

main().finally(() => prisma.$disconnect());
