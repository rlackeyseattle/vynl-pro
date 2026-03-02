const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const profileId = 'cmlvljak6000019u78nvsi3aol';
const dataDir = 'c:\\Users\\rlack';

async function main() {
    console.log('Starting VYNL Stage Sync...');

    // 1. Load Songs
    const songsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'songs_sync.json'), 'utf8'));
    console.log(`Loaded ${songsData.length} songs from sync file.`);

    // 2. Load Setlist Details
    const setlistFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('setlist_pl_') && f.endsWith('.json'));
    const setlistsFull = setlistFiles.map(f => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')));
    console.log(`Loaded ${setlistsFull.length} detailed setlists.`);

    // Clear existing data for this profile to ensure clean sync
    console.log('Cleaning up existing songs and setlists...');
    try {
        await prisma.setlistSong.deleteMany({
            where: { setlist: { profileId } }
        });
        await prisma.setlist.deleteMany({
            where: { profileId }
        });
        await prisma.song.deleteMany({
            where: { profileId }
        });
        console.log('Cleanup successful.');
    } catch (err) {
        console.error('Cleanup failed (might be expected if DB is empty):', err.message);
    }

    // 3. Insert Songs
    console.log('Syncing songs...');
    let successCount = 0;
    for (const song of songsData) {
        try {
            await prisma.song.create({
                data: {
                    id: song.id,
                    profileId: profileId,
                    title: song.name,
                    artist: song.artist,
                    bpm: (song.bpm && !isNaN(parseInt(song.bpm))) ? parseInt(song.bpm) : null,
                    key: song.key,
                    chartData: song.lyrics || '',
                }
            });
            successCount++;
            if (successCount % 50 === 0) console.log(`Synced ${successCount} songs...`);
        } catch (e) {
            console.error(`Failed to sync song ${song.name} (${song.id}):`, e.message);
        }
    }
    console.log(`Songs synced successfully (${successCount}/${songsData.length}).`);

    const finalCount = await prisma.song.count();
    console.log(`VERIFICATION: Total songs in DB now: ${finalCount}`);

    // 4. Insert Setlists and Associations
    console.log('Syncing setlists...');
    for (const sl of setlistsFull) {
        try {
            const createdSetlist = await prisma.setlist.create({
                data: {
                    id: sl.id,
                    profileId: profileId,
                    name: sl.name,
                    description: sl.description,
                }
            });

            if (sl.song_ids && Array.isArray(sl.song_ids)) {
                for (let i = 0; i < sl.song_ids.length; i++) {
                    const songId = sl.song_ids[i];
                    const songExists = await prisma.song.findUnique({ where: { id: songId } });
                    if (songExists) {
                        await prisma.setlistSong.create({
                            data: {
                                setlistId: createdSetlist.id,
                                songId: songId,
                                order: i
                            }
                        });
                    }
                }
            }
            console.log(`Synced setlist: ${sl.name}`);
        } catch (err) {
            console.error(`Failed to sync setlist ${sl.name}:`, err.message);
        }
    }

    console.log('Setlists synced successfully.');
    console.log('Sync complete!');
}

main()
    .catch(e => {
        console.error('Sync failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
