import { NextResponse } from 'next/server';
import data from '@/lib/vynl_data.json';

export async function GET() {
    return NextResponse.json(data.songs);
}
