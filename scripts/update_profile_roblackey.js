/**
 * Seed / update Rob Lackey's vynl.pro profile with full Musical DNA data.
 * Run: node scripts/update_profile_roblackey.js
 *
 * This populates bio, genre, social links, EPK data, and show photos.
 * Show photos are served from /shows/ (public directory, deployed to Vercel).
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const HANDLE = 'roblackey';

// Build list of show photo URLs (relative, served via Vercel/public/)
const SHOWS_DIR = path.join(__dirname, '..', 'public', 'shows');
let showPhotoUrls = [];
try {
    const files = fs.readdirSync(SHOWS_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    showPhotoUrls = files.map(f => `/shows/${f}`);
    console.log(`Found ${files.length} show photos.`);
} catch {
    console.warn('public/shows not found — run copy_shows.ps1 first.');
}

const BIO = `Rob Lackey is a Pacific Northwest-based multi-genre musician, producer, and performer with over 20 years deep in the craft. 

Raised in the musical landscapes of Montana and seasoned by the Seattle scene, Rob's sound is rooted in blues-soaked Americana folk with a cinematic grunge edge — part John Mayer's singing sustain, part Jerry Cantrell's dark melodic weight, part Clutch's working-man grit.

He fronts and writes for Low Fires, and has performed under the names Stillwaters and Surrender with a Smile. He's also DJ Avaunt — a turntablist and producer with a hip-hop and electronic production ear that bleeds into his guitar-centered work.

Rob's current album project, "The Weight of Constellations," is a 20-track cosmic stoner blues rock journey through Pacific Northwest identity, Montana roots, generational trauma, road life, and stargazing at 2 AM. Cinematic. Patient. Built in the dark.

Performer first, studio craftsman second — Rob thinks in bodies of work, live rooms, and the space between a good chord and a better lyric.`;

const SOCIAL_LINKS = {
    website: 'https://vynl.pro/roblackey',
    instagram: '@roblackey',
    youtube: 'https://www.youtube.com/@roblackey',
    spotify: '',
    facebook: 'Rob Lackey Music',
};

const EPK_DATA = {
    artistName: 'Rob Lackey',
    tagline: 'Pacific Northwest storytelling with teeth.',
    bio: BIO,
    genre: 'Cosmic Stoner Blues Rock / Americana Folk / Singer-Songwriter',
    location: 'Pacific Northwest (Seattle / Missoula)',
    email: 'rlackey.seattle@gmail.com',
    bookingEmail: 'rlackey.seattle@gmail.com',
    phone: '',
    website: 'https://vynl.pro/roblackey',
    instagram: '@roblackey',
    youtube: 'https://www.youtube.com/@roblackey',
    twitter: '',
    spotify: '',
    achievements: [
        'Current album: "The Weight of Constellations" — 20-track Cosmic Stoner Blues Rock record',
        'Bands: Low Fires · Stillwaters · Surrender with a Smile',
        'DJ Persona: DJ Avaunt — turntablist / hip-hop / electronic producer',
        'Influences: John Mayer · Jerry Cantrell / AiC · Clutch · Tool · Bon Iver',
        'Studied under: Rick Beato, Music is Win, Adam Neely, Produce Like A Pro',
        '20+ years of songwriting, production, and live performance',
        'Pacific Northwest local scene: Seattle / Missoula / Flathead Valley',
    ],
    pressQuotes: [
        { quote: 'Blues-soaked soul with a cinematic grit — the kind of songwriter who writes songs that feel like places.', source: 'STRATA A&R Notes' },
    ],
    techRiderNotes: '3-4 piece band. Guitar/vocals, bass, drums, keys optional. Need 4 monitor mixes, DI for bass, SM58 for vocals, direct XLR for acoustic. Low stage volume preferred — we use IEMs.',
    showPhotos: showPhotoUrls.slice(0, 30), // First 30 for EPK
    pressPhotoUrl: showPhotoUrls[0] || '',
};

async function main() {
    console.log(`Updating profile for @${HANDLE}...`);

    const profile = await prisma.profile.findUnique({ where: { handle: HANDLE } });

    if (!profile) {
        console.error(`Profile @${HANDLE} not found. Run seed_user.js first.`);
        process.exit(1);
    }

    await prisma.profile.update({
        where: { handle: HANDLE },
        data: {
            bio: BIO,
            musicianType: 'Cosmic Stoner Blues Rock / Americana',
            socialLinks: JSON.stringify(SOCIAL_LINKS),
            epkData: JSON.stringify(EPK_DATA),
        },
    });

    console.log(`✅ @${HANDLE} profile updated with full Musical DNA.`);
    console.log(`   Show photos linked: ${EPK_DATA.showPhotos.length}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
