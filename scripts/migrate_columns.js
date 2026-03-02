require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // Venue table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Venue" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "zip" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "capacity" INTEGER,
    "venueType" TEXT,
    "genres" TEXT,
    "description" TEXT,
    "photoUrl" TEXT,
    "coverUrl" TEXT,
    "payType" TEXT,
    "typicalFee" TEXT,
    "ageLimit" TEXT,
    "soundSystem" TEXT,
    "backline" TEXT,
    "loadIn" TEXT,
    "soundcheck" TEXT,
    "parking" BOOLEAN,
    "greenRoom" BOOLEAN,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
  )`);

    // BandTeam table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "BandTeam" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inviteCode" TEXT,
    "settings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BandTeam_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BandTeam_profileId_key" UNIQUE ("profileId"),
    CONSTRAINT "BandTeam_inviteCode_key" UNIQUE ("inviteCode")
  )`);

    // BandMember table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "BandMember" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "teamId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BandMember_pkey" PRIMARY KEY ("id")
  )`);

    // TeamChannel table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "TeamChannel" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamChannel_pkey" PRIMARY KEY ("id")
  )`);

    // Booking table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "venueId" TEXT,
    "venueName" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "fee" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inquiry',
    "notes" TEXT,
    "contractId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Booking_contractId_key" UNIQUE ("contractId")
  )`);

    // Contract table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Contract" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "artistId" TEXT NOT NULL,
    "venueId" TEXT,
    "title" TEXT NOT NULL,
    "templateType" TEXT NOT NULL DEFAULT 'performance',
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "artistSigned" BOOLEAN NOT NULL DEFAULT false,
    "venueSigned" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
  )`);

    // Add new columns to InviteCode if needed
    await p.$executeRawUnsafe(`ALTER TABLE "InviteCode" ADD COLUMN IF NOT EXISTS "label" TEXT`);
    await p.$executeRawUnsafe(`ALTER TABLE "InviteCode" ADD COLUMN IF NOT EXISTS "maxUses" INTEGER NOT NULL DEFAULT 1`);
    await p.$executeRawUnsafe(`ALTER TABLE "InviteCode" ADD COLUMN IF NOT EXISTS "useCount" INTEGER NOT NULL DEFAULT 0`);

    // Add bandMemberships relation support to User
    // (BandMember already has userId field, FK constraint added separately)

    console.log('All tables created/updated OK');
}

main().catch(e => console.error('Migration failed:', e.message)).finally(() => p.$disconnect());
