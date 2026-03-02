require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Check raw column via raw SQL
    const result = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'password'
    `;
    console.log('password column in DB:', result);

    // Also try to read the password field directly
    const user = await prisma.user.findUnique({
        where: { email: 'rlackey.seattle@gmail.com' },
        select: { id: true, email: true, name: true, password: true }
    });
    console.log('User found:', !!user);
    if (user) {
        console.log('email:', user.email);
        console.log('name:', user.name);
        console.log('password (first 20 chars):', user.password ? user.password.substring(0, 20) + '...' : 'NULL');
        if (user.password) {
            const match = await bcrypt.compare('072425ChlWal!', user.password);
            console.log('Password match:', match);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
