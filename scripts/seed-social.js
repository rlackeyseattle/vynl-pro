const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'test@vynl.pro' },
        update: {},
        create: {
            email: 'test@vynl.pro',
            name: 'Rob Lackey',
            profile: {
                create: {
                    handle: 'roblackey',
                    bio: 'Founder of VYNL Pro. Crafting the future of independent music operating systems.',
                    musicianType: 'Producer / Architect',
                }
            }
        }
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'rtlcc@vynl.pro' },
        update: {},
        create: {
            email: 'rtlcc@vynl.pro',
            name: 'RTLCC Project',
            profile: {
                create: {
                    handle: 'rtlcc',
                    bio: 'The Real-Time Live Chord Chart system.',
                    musicianType: 'Software Suite',
                }
            }
        }
    });

    console.log('Seed data created:', { user, user2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
