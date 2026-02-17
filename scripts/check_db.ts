import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking profiles...");
    const profiles = await prisma.profile.findMany();
    for (const profile of profiles) {
        console.log(`Handle: ${profile.handle}`);
        console.log(`Bio: ${profile.bio}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
