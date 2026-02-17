import { NextRequest, NextResponse } from 'next/server';
import data from '@/lib/vynl_data.json';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const setlist = data.setlists.find(sl => sl.id === id);

    if (!setlist) {
        return NextResponse.json({ error: 'Setlist not found' }, { status: 404 });
    }

    // Map song IDs to full song objects
    const fullSongs = setlist.song_ids
        .map(songId => data.songs.find(s => s.id === songId))
        .filter(Boolean);

    return NextResponse.json({
        ...setlist,
        songs: fullSongs
    });
}
