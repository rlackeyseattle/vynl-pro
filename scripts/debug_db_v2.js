const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const sc = await prisma.song.count();
        console.log('--- DB SUMMARY ---');
        console.log('Songs found:', sc);

        const firstSong = await prisma.song.findFirst();
        if (firstSong) {
            console.log('Sample song:', firstSong.title, 'Profile ID:', firstSong.profileId);
        } else {
            console.log('No songs in database.');
        }

        const profile = await prisma.profile.findFirst({
            where: { id: 'cmlvljak6000019u78nvsi3aol' }
        });
        console.log('Target Profile (cmlvljak6000019u78nvsi3aol) exists:', !!profile);

    } catch (err) {
        console.error('Error querying DB:', err);
    }
}

main().finally(() => prisma.$disconnect());
