require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // GearItem table
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "GearItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "serialNumber" TEXT,
    "category" TEXT NOT NULL DEFAULT 'misc',
    "status" TEXT NOT NULL DEFAULT 'in',
    "notes" TEXT,
    "assignedTo" TEXT,
    "value" DOUBLE PRECISION,
    "tags" TEXT,
    "photoUrl" TEXT,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GearItem_pkey" PRIMARY KEY ("id")
  )`);
    console.log('GearItem OK');

    // Directory table — covers ALL musician ecosystem entities
    // artists, labels, cover bands, DJs, photographers, screen printers,
    // music stores, rehearsal spaces, studios, booking agencies, etc.
    await p.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Directory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "entityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "zip" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "spotify" TEXT,
    "bandcamp" TEXT,
    "soundcloud" TEXT,
    "description" TEXT,
    "genres" TEXT,
    "tags" TEXT,
    "photoUrl" TEXT,
    "coverUrl" TEXT,
    "priceRange" TEXT,
    "services" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT,
    "region" TEXT,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedByProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Directory_pkey" PRIMARY KEY ("id")
  )`);
    console.log('Directory OK');

    console.log('All migrations complete.');
}

main().catch(e => console.error('Migration failed:', e.message)).finally(() => p.$disconnect());
