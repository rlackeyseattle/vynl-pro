import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Updating Rob Lackey profile picture...')
    try {
        const user = await prisma.user.update({
            where: { email: 'rob@vynl.pro' },
            data: {
                profile: {
                    update: {
                        avatarUrl: '/graphics/profile/roblackey_v2.jpg'
                    }
                }
            }
        })
        console.log('Profile updated successfully!')
    } catch (e) {
        console.error('Error updating profile:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
