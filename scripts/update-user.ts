import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Hashing password...");
    // The password provided by the user
    const rawPassword = "072425ChlWal!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    console.log("Upserting user...");
    const user = await prisma.user.upsert({
        where: { email: "rlackey.seattle@gmail.com" },
        update: {
            name: "rob",
            password: hashedPassword,
        } as any, // bypassing strict types just in case name/password aren't standard NextAuth fields
        create: {
            email: "rlackey.seattle@gmail.com",
            name: "rob",
            password: hashedPassword,
        } as any
    });

    console.log("Successfully updated user credentials:", {
        id: user.id,
        email: user.email,
        name: user.name
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
