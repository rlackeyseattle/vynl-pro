import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'rob@vynl.pro' },
            include: { profile: true }
        })
        console.log(JSON.stringify(user, null, 2))
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}
main()
