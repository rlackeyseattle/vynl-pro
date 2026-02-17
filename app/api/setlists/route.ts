import { NextResponse } from 'next/server';
import data from '@/lib/vynl_data.json';

export async function GET() {
    const summaries = data.setlists.map(sl => ({
        id: sl.id,
        name: sl.name,
        description: sl.description,
        song_count: sl.song_ids.length
    }));
    return NextResponse.json(summaries);
}
