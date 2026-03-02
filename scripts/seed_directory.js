require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// ── PNW Music Ecosystem Directory Seed ────────────────────────────────────────
// Entity types: artist, label, cover-band, dj, photographer, screen-printer,
// music-store, rehearsal-space, recording-studio, booking-agency,
// instrument-repair, radio-station, promoter, videographer, graphic-designer

const ENTRIES = [
    // ── RECORDING STUDIOS ─────────────────────────────────────────────────────
    { entityType: "recording-studio", name: "London Bridge Studio", city: "Seattle", state: "WA", website: "https://londonbridgestudio.com", description: "Legendary Seattle studio. Alice in Chains, Pearl Jam, Soundgarden recorded here.", genres: '["rock","grunge","metal","alternative"]', priceRange: "$150-$300/hr", region: "pnw", verified: true },
    { entityType: "recording-studio", name: "Studio X Seattle", city: "Seattle", state: "WA", description: "Full-service recording, mixing, and mastering.", priceRange: "$75-$150/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Avast! Recording Co.", city: "Seattle", state: "WA", website: "https://avastrecording.com", description: "Beloved indie recording studio in Seattle. Great gear, great vibe.", priceRange: "$75-$125/hr", region: "pnw", verified: true },
    { entityType: "recording-studio", name: "Robert Lang Studios", city: "Shoreline", state: "WA", description: "Iconic studio where Nirvana recorded. 5 rooms, world-class equipment.", priceRange: "$200-$400/hr", region: "pnw", verified: true },
    { entityType: "recording-studio", name: "Flatline Audio", city: "Portland", state: "OR", description: "Full-service Portland recording and mixing facility.", priceRange: "$60-$120/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Hallowed Halls", city: "Portland", state: "OR", description: "Portland studio known for indie and folk recordings.", priceRange: "$50-$100/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Smashed Plastic Recordings", city: "Missoula", state: "MT", description: "Missoula's top recording facility.", priceRange: "$40-$90/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Ten Mile Ranch Recording", city: "Bozeman", state: "MT", description: "Full-service studio in the Gallatin Valley.", priceRange: "$50-$100/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Studio Mojo", city: "Spokane", state: "WA", description: "Eastern Washington recording and production.", priceRange: "$40-$80/hr", region: "pnw", verified: false },
    { entityType: "recording-studio", name: "Jackpot! Recording Studio", city: "Portland", state: "OR", website: "https://jackpotrecording.com", description: "Elliott Smith mixed records here. Legendary Portland studio.", priceRange: "$75-$150/hr", region: "pnw", verified: true },

    // ── REHEARSAL SPACES ──────────────────────────────────────────────────────
    { entityType: "rehearsal-space", name: "Fender's Music", city: "Seattle", state: "WA", description: "Rehearsal rooms by the hour. Multiple room sizes.", priceRange: "$15-$25/hr", region: "pnw", verified: false },
    { entityType: "rehearsal-space", name: "The HUB Seattle", city: "Seattle", state: "WA", description: "Band rehearsal and storage in SODO.", priceRange: "$12-$20/hr", region: "pnw", verified: false },
    { entityType: "rehearsal-space", name: "Practice Pad", city: "Portland", state: "OR", description: "Affordable Portland rehearsal rooms with lockout storage.", priceRange: "$10-$18/hr", region: "pnw", verified: false },
    { entityType: "rehearsal-space", name: "Missoula Jam Space", city: "Missoula", state: "MT", description: "Rehearsal rooms with full backline available.", priceRange: "$10-$20/hr", region: "pnw", verified: false },

    // ── MUSIC STORES ─────────────────────────────────────────────────────────
    { entityType: "music-store", name: "Trading Musician", city: "Seattle", state: "WA", address: "5908 Roosevelt Way NE", website: "https://tradingmusician.com", description: "Seattle's best used instrument shop. Incredible rotating inventory.", region: "pnw", verified: true },
    { entityType: "music-store", name: "Emerald City Guitars", city: "Seattle", state: "WA", website: "https://emeraldcityguitars.com", description: "High-end vintage and boutique guitars. Known worldwide.", region: "pnw", verified: true },
    { entityType: "music-store", name: "GuitarVault", city: "Seattle", state: "WA", description: "Premium vintage guitar dealer.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Groth Music", city: "Portland", state: "OR", description: "Full-service Portland instrument shop.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Guitarsmith", city: "Portland", state: "OR", description: "Portland guitar shop with repair and setup services.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Portland Music Company", city: "Portland", state: "OR", description: "Full-line music store with lessons and rentals.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Montana Music", city: "Missoula", state: "MT", description: "Missoula's go-to instrument store.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Bitterroot Music", city: "Hamilton", state: "MT", description: "Bitterroot Valley instrument shop.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Rockin' Rudy's", city: "Missoula", state: "MT", address: "237 Blaine St", description: "Legendary Missoula record store. CDs, vinyl, local music section.", region: "pnw", verified: true },
    { entityType: "music-store", name: "Bozeman Music Center", city: "Bozeman", state: "MT", description: "Bozeman's full-service music store.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Spokane Music", city: "Spokane", state: "WA", description: "Eastern WA instrument and gear shop.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Georgetown Records", city: "Seattle", state: "WA", description: "Independent Seattle record store.", region: "pnw", verified: false },
    { entityType: "music-store", name: "Everyday Music", city: "Portland", state: "OR", description: "Portland new and used records and CDs.", region: "pnw", verified: false },

    // ── INSTRUMENT REPAIR ─────────────────────────────────────────────────────
    { entityType: "instrument-repair", name: "Robertson & Sons Violin Shop", city: "Albuquerque", state: "NM", description: "Well-known luthier with PNW contacts.", region: "pnw", verified: false },
    { entityType: "instrument-repair", name: "Seattle Drum Service", city: "Seattle", state: "WA", description: "Drum repair, restoration, and sales.", region: "pnw", verified: false },
    { entityType: "instrument-repair", name: "The Guitar Shop PDX", city: "Portland", state: "OR", description: "Portland guitar repair and setup specialist.", region: "pnw", verified: false },
    { entityType: "instrument-repair", name: "Missoula Guitar Works", city: "Missoula", state: "MT", description: "Guitar repair and setup in Missoula.", region: "pnw", verified: false },
    { entityType: "instrument-repair", name: "Bozeman Guitar Works", city: "Bozeman", state: "MT", description: "Setup, repair, and custom builds.", region: "pnw", verified: false },

    // ── SCREEN PRINTERS / MERCH ────────────────────────────────────────────────
    { entityType: "screen-printer", name: "Invisible Creature", city: "Seattle", state: "WA", website: "https://invisiblecreature.com", description: "Seattle design and print studio. Known for amazing band poster and merch work.", services: '["screen printing","poster design","apparel"]', region: "pnw", verified: true },
    { entityType: "screen-printer", name: "Uncle Bobos Printing", city: "Seattle", state: "WA", description: "Band merch specialists. T-shirts, hoodies, hats.", services: '["screen printing","embroidery","apparel"]', region: "pnw", verified: false },
    { entityType: "screen-printer", name: "Stumptown Printers", city: "Portland", state: "OR", description: "Portland band merch and apparel printing.", services: '["screen printing","apparel","posters"]', region: "pnw", verified: false },
    { entityType: "screen-printer", name: "Artcraft Printers", city: "Missoula", state: "MT", description: "Missoula screen printing and embroidery.", services: '["screen printing","embroidery"]', region: "pnw", verified: false },
    { entityType: "screen-printer", name: "Big Sky Printing", city: "Bozeman", state: "MT", description: "Band merch and promo printing in Bozeman.", services: '["screen printing","apparel","stickers"]', region: "pnw", verified: false },
    { entityType: "screen-printer", name: "Montana Made Merch", city: "Missoula", state: "MT", description: "Tour merch production for Montana bands.", services: '["screen printing","apparel","design"]', region: "pnw", verified: false },
    { entityType: "screen-printer", name: "Pacific Print & Promo", city: "Spokane", state: "WA", description: "Custom merch and promotional items.", services: '["screen printing","embroidery","vinyl"]', region: "pnw", verified: false },

    // ── PHOTOGRAPHERS ─────────────────────────────────────────────────────────
    { entityType: "photographer", name: "Linda Derschang Photography", city: "Seattle", state: "WA", description: "Concert and live music photography in Seattle.", genres: '["rock","indie","all"]', services: '["live photography","EPK photos","press photos"]', region: "pnw", verified: false },
    { entityType: "photographer", name: "Andria Potofsky", city: "Seattle", state: "WA", description: "Music photographer specializing in live performance.", services: '["live photography","portrait","EPK"]', region: "pnw", verified: false },
    { entityType: "photographer", name: "Portland Music Photos", city: "Portland", state: "OR", description: "Portland live music photographer.", services: '["live photography","press photos"]', region: "pnw", verified: false },
    { entityType: "photographer", name: "Missoula Music Photo", city: "Missoula", state: "MT", description: "Live and studio music photography.", services: '["live photography","EPK photos"]', region: "pnw", verified: false },
    { entityType: "photographer", name: "Bozeman Portrait Co.", city: "Bozeman", state: "MT", description: "EPK and press photos for Bozeman artists.", services: '["EPK photos","portrait","press photos"]', region: "pnw", verified: false },

    // ── BOOKING AGENCIES ──────────────────────────────────────────────────────
    { entityType: "booking-agency", name: "Monqui Presents", city: "Portland", state: "OR", website: "https://monqui.com", description: "Portland-based booking and promotions. Books Pacific Northwest tours.", region: "pnw", verified: true },
    { entityType: "booking-agency", name: "STG Presents", city: "Seattle", state: "WA", website: "https://stgpresents.org", description: "Books the Moore, Neptune, and Paramount in Seattle.", region: "pnw", verified: true },
    { entityType: "booking-agency", name: "Knitting Factory Entertainment", city: "Spokane", state: "WA", description: "Booking and promotions for the PNW.", region: "pnw", verified: true },
    { entityType: "booking-agency", name: "Liquid Kitty Booking", city: "Missoula", state: "MT", description: "Montana-focused booking agency.", region: "pnw", verified: false },
    { entityType: "booking-agency", name: "High Gate Presents", city: "Portland", state: "OR", description: "Pacific Northwest booking and promotion.", region: "pnw", verified: false },

    // ── LABELS ────────────────────────────────────────────────────────────────
    { entityType: "label", name: "Sub Pop Records", city: "Seattle", state: "WA", website: "https://subpop.com", description: "Legendary Seattle indie label. Nirvana, Soundgarden, Fleet Foxes, Father John Misty.", genres: '["indie","rock","alternative","folk"]', region: "pnw", verified: true },
    { entityType: "label", name: "Barsuk Records", city: "Seattle", state: "WA", website: "https://barsuk.com", description: "Seattle indie label. Death Cab for Cutie, Nada Surf, Mates of State.", genres: '["indie","alternative","folk"]', region: "pnw", verified: true },
    { entityType: "label", name: "Hardly Art", city: "Seattle", state: "WA", description: "Sub Pop imprint for emerging artists.", genres: '["indie","rock","lo-fi"]', region: "pnw", verified: true },
    { entityType: "label", name: "Kill Rock Stars", city: "Portland", state: "OR", website: "https://killrockstars.com", description: "Influential Portland indie label. Bikini Kill, Sleater-Kinney, Elliott Smith.", genres: '["punk","indie","riot grrrl"]', region: "pnw", verified: true },
    { entityType: "label", name: "Jealous Butcher Records", city: "Portland", state: "OR", description: "Portland indie label.", genres: '["indie","folk","alternative"]', region: "pnw", verified: false },
    { entityType: "label", name: "Tender Loving Empire", city: "Portland", state: "OR", description: "Portland indie label and retail shop.", genres: '["indie","folk"]', region: "pnw", verified: false },
    { entityType: "label", name: "Glacial Pace Records", city: "Seattle", state: "WA", description: "Fleet Foxes' label imprint.", genres: '["folk","indie"]', region: "pnw", verified: false },
    { entityType: "label", name: "Suicide Squeeze Records", city: "Seattle", state: "WA", website: "https://suicidesqueeze.net", description: "Seattle indie label. Ween, Pedro the Lion, Sage Francis.", genres: '["indie","punk","alternative"]', region: "pnw", verified: true },

    // ── DJs ───────────────────────────────────────────────────────────────────
    { entityType: "dj", name: "DJ Riz", city: "Seattle", state: "WA", description: "Seattle DJ. Hip-hop and electronic.", genres: '["hip-hop","electronic","soul"]', services: '["events","club nights","weddings"]', region: "pnw", verified: false },
    { entityType: "dj", name: "Vitamin D", city: "Seattle", state: "WA", description: "Pioneer of the Seattle hip-hop scene. Also known as David Watts.", genres: '["hip-hop","beats"]', region: "pnw", verified: true },
    { entityType: "dj", name: "Bass and Treble Events", city: "Portland", state: "OR", description: "Portland DJ collective for events and weddings.", genres: '["all","wedding","corporate"]', services: '["wedding DJ","corporate events","club"]', region: "pnw", verified: false },
    { entityType: "dj", name: "Western MT DJ Services", city: "Missoula", state: "MT", description: "Missoula DJ for weddings, events, and private parties.", genres: '["all","wedding","country"]', services: '["wedding DJ","events"]', region: "pnw", verified: false },
    { entityType: "dj", name: "Gallatin Sound", city: "Bozeman", state: "MT", description: "Bozeman DJ and sound production.", genres: '["all","electronic","country"]', services: '["events","wedding","corporate"]', region: "pnw", verified: false },

    // ── PROMOTERS ─────────────────────────────────────────────────────────────
    { entityType: "promoter", name: "AEG Presents Northwest", city: "Seattle", state: "WA", description: "Major concert promoter for the Pacific Northwest.", region: "pnw", verified: true },
    { entityType: "promoter", name: "Live Nation Pacific Northwest", city: "Seattle", state: "WA", description: "Major touring concert promoter.", region: "pnw", verified: true },
    { entityType: "promoter", name: "Neumos/Barboza Productions", city: "Seattle", state: "WA", description: "Capitol Hill Seattle venue promoter.", region: "pnw", verified: true },
    { entityType: "promoter", name: "Portland Presents", city: "Portland", state: "OR", description: "Independent Portland concert promoter.", region: "pnw", verified: false },
    { entityType: "promoter", name: "Blackfoot Shows", city: "Missoula", state: "MT", description: "Montana indie concert promoter. Books Top Hat, The Wilma.", region: "pnw", verified: true },
    { entityType: "promoter", name: "406 Presents", city: "Bozeman", state: "MT", description: "Montana statewide concert promotion.", region: "pnw", verified: false },

    // ── RADIO STATIONS ────────────────────────────────────────────────────────
    { entityType: "radio-station", name: "KEXP 90.3 FM", city: "Seattle", state: "WA", website: "https://kexp.org", description: "World-famous Seattle indie music station. Plays local, national, and international artists.", genres: '["indie","alternative","world","all"]', region: "pnw", verified: true },
    { entityType: "radio-station", name: "KNDD 107.7 FM (The End)", city: "Seattle", state: "WA", description: "Seattle alternative and rock station.", genres: '["alternative","rock","indie"]', region: "pnw", verified: true },
    { entityType: "radio-station", name: "KBGA 89.9 FM", city: "Missoula", state: "MT", website: "https://kbga.org", description: "University of Montana student-run radio. Heavy local music support.", genres: '["indie","punk","local","all"]', region: "pnw", verified: true },
    { entityType: "radio-station", name: "KUFM 89.1 FM / Montana Public Radio", city: "Missoula", state: "MT", website: "https://mtpr.org", description: "Montana Public Radio with local music programming.", region: "pnw", verified: true },
    { entityType: "radio-station", name: "KBZZ FM", city: "Bozeman", state: "MT", description: "Bozeman radio station.", region: "pnw", verified: false },
    { entityType: "radio-station", name: "KMTT 103.7 The Mountain", city: "Seattle", state: "WA", description: "Seattle adult alternative station.", genres: '["adult alternative","rock","folk"]', region: "pnw", verified: true },
    { entityType: "radio-station", name: "OPB Music", city: "Portland", state: "OR", website: "https://opb.org", description: "Oregon Public Broadcasting music arm.", genres: '["classical","jazz","world","folk"]', region: "pnw", verified: true },
    { entityType: "radio-station", name: "XRAY.fm", city: "Portland", state: "OR", website: "https://xray.fm", description: "Portland community radio. Strong local music support.", genres: '["indie","punk","local","experimental"]', region: "pnw", verified: true },

    // ── GRAPHIC DESIGNERS / VISUAL ARTISTS ────────────────────────────────────
    { entityType: "graphic-designer", name: "Methane Studios", city: "Seattle", state: "WA", description: "Poster and album art design for bands.", services: '["poster design","album art","branding"]', region: "pnw", verified: false },
    { entityType: "graphic-designer", name: "Aesthetic Apparatus", city: "Minneapolis", state: "MN", description: "Screen-printed poster and merch art. Works with PNW acts.", services: '["poster art","merchandise design"]', region: "pnw", verified: false },
    { entityType: "graphic-designer", name: "Portland Band Design", city: "Portland", state: "OR", description: "Logo, EPK, and social media design for musicians.", services: '["logo design","EPK layout","social media"]', region: "pnw", verified: false },

    // ── VIDEOGRAPHERS ─────────────────────────────────────────────────────────
    { entityType: "videographer", name: "Grunge Productions", city: "Seattle", state: "WA", description: "Music video and live performance videography.", services: '["music video","live recording","EPK video"]', region: "pnw", verified: false },
    { entityType: "videographer", name: "Columbia River Films", city: "Portland", state: "OR", description: "Portland-based music video production.", services: '["music video","documentary","live"]', region: "pnw", verified: false },
    { entityType: "videographer", name: "Montana Music Video", city: "Missoula", state: "MT", description: "Music video production for Montana artists.", services: '["music video","live recording"]', region: "pnw", verified: false },

    // ── SOUND COMPANIES / PA RENTAL ────────────────────────────────────────────
    { entityType: "sound-company", name: "Loud Audio", city: "Seattle", state: "WA", description: "PA system rental and live sound production.", services: '["PA rental","live sound","backline rental"]', region: "pnw", verified: false },
    { entityType: "sound-company", name: "Pacific Sound", city: "Portland", state: "OR", description: "Portland PA rental and sound reinforcement.", services: '["PA rental","live sound","staging"]', region: "pnw", verified: false },
    { entityType: "sound-company", name: "Montana Sound Co.", city: "Missoula", state: "MT", description: "Montana PA rental and live production.", services: '["PA rental","live sound","backline"]', region: "pnw", verified: false },
    { entityType: "sound-company", name: "Bozeman Sound", city: "Bozeman", state: "MT", description: "Gallatin Valley sound rental and engineering.", services: '["PA rental","live sound"]', region: "pnw", verified: false },

    // ── MANAGERS ──────────────────────────────────────────────────────────────
    { entityType: "manager", name: "Northwest Artist Management", city: "Seattle", state: "WA", description: "Artist management for Pacific Northwest acts.", region: "pnw", verified: false },
    { entityType: "manager", name: "Big Sky Management", city: "Missoula", state: "MT", description: "Montana-based artist management.", region: "pnw", verified: false },
    { entityType: "manager", name: "Trail Mix Management", city: "Portland", state: "OR", description: "Independent artist management, Portland.", region: "pnw", verified: false },
];

async function seed() {
    console.log(`Seeding ${ENTRIES.length} PNW directory entries...`);
    let added = 0, skipped = 0;

    for (const e of ENTRIES) {
        try {
            const existing = await p.directory.findFirst({ where: { name: e.name, city: e.city } });
            if (existing) { skipped++; continue; }
            await p.directory.create({ data: { ...e, dataSource: 'manual' } });
            added++;
            process.stdout.write('.');
        } catch (err) {
            console.error(`\nError seeding ${e.name}:`, err.message);
        }
    }

    console.log(`\n\nDone! Added: ${added}, Skipped: ${skipped}`);
}

seed().catch(console.error).finally(() => p.$disconnect());
