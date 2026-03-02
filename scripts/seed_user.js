const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const EMAIL = 'rlackey.seattle@gmail.com';
const PASSWORD = '072425ChlWal!';
const NAME = 'Rob Lackey';
const PROFILE_ID = 'cmlvljak6000019u78nvsi3aol';

async function main() {
    console.log('Seeding permanent user account...');

    // Hash the password
    const hashedPassword = await bcrypt.hash(PASSWORD, 12);
    console.log('Password hashed.');

    // Upsert the user
    const user = await prisma.user.upsert({
        where: { email: EMAIL },
        update: {
            name: NAME,
            password: hashedPassword,
        },
        create: {
            email: EMAIL,
            name: NAME,
            password: hashedPassword,
        },
    });
    console.log(`User ready: ${user.email} (${user.id})`);

    // Check if the target profile exists
    const existingProfile = await prisma.profile.findUnique({
        where: { id: PROFILE_ID },
    });

    if (existingProfile) {
        // Re-link the profile to this user
        await prisma.profile.update({
            where: { id: PROFILE_ID },
            data: { userId: user.id },
        });
        console.log(`Linked existing profile ${PROFILE_ID} to user.`);
    } else {
        // Create a new profile
        await prisma.profile.create({
            data: {
                id: PROFILE_ID,
                userId: user.id,
                handle: 'roblackey',
                bio: 'Musician, Engineer, Builder.',
            },
        });
        console.log(`Created new profile ${PROFILE_ID} for user.`);
    }

    // Verify
    const songCount = await prisma.song.count({
        where: { profileId: PROFILE_ID },
    });
    console.log(`Profile has ${songCount} songs.`);
    console.log('Done. You can now log in at /login.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
