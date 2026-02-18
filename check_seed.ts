import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    try {
        const count = await prisma.song.count()
        console.log(`Songs: ${count}`)
        const users = await prisma.user.count()
        console.log(`Users: ${users}`)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}
main()
