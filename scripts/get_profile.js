const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profile = await prisma.profile.findFirst();
    if (profile) {
        console.log(`PROFILE_ID:${profile.id}`);
    } else {
        console.log('NO_PROFILE_FOUND');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
