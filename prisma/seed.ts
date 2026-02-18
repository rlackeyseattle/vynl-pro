const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
    const dataPath = path.join(__dirname, '../lib/vynl_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log("Seeding songs...");
    for (const song of data.songs) {
        await prisma.song.upsert({
            where: { id: song.id },
            update: {},
            create: {
                id: song.id,
                name: song.name,
                artist: song.artist,
                key: song.key,
                bpm: song.bpm,
                lyrics: song.lyrics,
                chords: song.chords,
                genre: song.genre,
                createdAt: new Date(song.created_at),
                updatedAt: new Date(song.updated_at),
            },
        });
    }

    console.log("Seeding setlists...");
    for (const sl of data.setlists) {
        await prisma.setlist.upsert({
            where: { id: sl.id },
            update: {},
            create: {
                id: sl.id,
                name: sl.name,
                description: sl.description,
                createdAt: new Date(sl.created_at || Date.now()),
                updatedAt: new Date(sl.updated_at || Date.now()),
            },
        });

        for (let i = 0; i < sl.song_ids.length; i++) {
            const songId = sl.song_ids[i];
            await prisma.setlistSong.upsert({
                where: { setlistId_songId: { setlistId: sl.id, songId } },
                update: { order: i },
                create: {
                    setlistId: sl.id,
                    songId,
                    order: i,
                }
            });
        }
    }

    // Create seed user
    console.log("Creating seed user/profile...");
    const user = await prisma.user.upsert({
        where: { email: 'rob@vynl.pro' },
        update: {},
        create: {
            name: 'Rob Lackey',
            email: 'rob@vynl.pro',
            profile: {
                create: {
                    handle: 'roblackey',
                    bio: 'Just a dude who likes tech and music baby. Check out my latest release "Low Fires".',
                    avatarUrl: '/graphics/profile/roblackey_v2.jpg',
                    interests: JSON.stringify({
                        general: 'Tech, Music, Production, Coding, Coffee.',
                        music: 'Analog warmth, digital precision, indie rock, acoustic vibes.',
                        tech: 'Next.js, TypeScript, AI agents, MIDI controllers, weird synthesizers.'
                    }),
                    gear: JSON.stringify([
                        'M3 Max MacBook Pro (too many tabs open)',
                        'Universal Audio Interface',
                        'Shure SM7B (The classic)',
                        'Custom Mechanical Keyboards',
                        'A growing collection of vinyl'
                    ]),
                    musicianType: 'Songwriter / Multi-instrumentalist',
                    themeConfig: JSON.stringify({
                        id: 'modern-epk',
                        name: 'Modern EPK',
                        colors: {
                            background: '#050505',
                            containerBg: '#0a0a0a',
                            primary: '#ffffff',
                            text: '#f5f5f5',
                            secondaryText: '#888888',
                            accent: '#3b82f6',
                            border: '#222222'
                        },
                        fonts: {
                            heading: '"Outfit", sans-serif',
                            body: '"Outfit", sans-serif'
                        },
                        layout: {
                            density: 'spacious',
                            borderRadius: '0px',
                            maxWidth: '1400px'
                        },
                        hero: {
                            style: 'full-screen',
                            overlayOpacity: 0.4,
                            blur: 0,
                            showScrollIndicator: true
                        }
                    }),
                }
            }
        }
    });

    console.log("Creating Cody Jack user/profile...");
    const cody = await prisma.user.upsert({
        where: { email: 'cody@vynl.pro' },
        update: {},
        create: {
            name: 'Cody Jack',
            email: 'cody@vynl.pro',
            profile: {
                create: {
                    handle: 'codyjack',
                    bio: 'Analog warmth in a digital world.',
                    musicianType: 'Producer / DJ',
                }
            }
        }
    });

    console.log("Creating initial posts...");
    await prisma.post.createMany({
        data: [
            {
                userId: user.id,
                content: "Just finished tweaking the new DSP engine for VYNL Stage. Low latency is looking incredible. 🚀",
                type: "update",
            },
            {
                userId: cody.id,
                content: "New sketch for the album cover. What do you guys think of the orange/purple palette?",
                type: "image_post",
            },
            {
                userId: user.id,
                content: "Recording vocals tonight for the new single. Can't wait for you all to hear this!",
                type: "update",
            }
        ]
    });

    // Seed Invite Codes
    const inviteCodes = [
        "VYNL-GOLD-2026",
        "VYNL-ARTIST-VIP",
        "VYNL-DEV-TEST"
    ];

    for (const code of inviteCodes) {
        await prisma.inviteCode.upsert({
            where: { code },
            update: {},
            create: {
                code,
                isUsed: false
            }
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
