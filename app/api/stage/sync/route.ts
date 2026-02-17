import { NextResponse } from 'next/server';

// In-memory store for Stage state (Host to Viewers)
// Note: This works for single instances on Vercel but won't sync across global regions without KV/DB.
// For the user's initial needs, this is a perfect lightweight start.
let currentStageState = {
    songId: null as string | null,
    transpose: 0,
    capo: 0,
    nashvilleMode: false,
    useFlats: false,
    scrollPct: 0,
    isScrolling: false,
    scrollSpeed: 30,
    lastUpdate: Date.now()
};

export async function GET() {
    return NextResponse.json(currentStageState);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Update state with partial data
        currentStageState = {
            ...currentStageState,
            ...body,
            lastUpdate: Date.now()
        };

        return NextResponse.json({ success: true, state: currentStageState });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update stage state' }, { status: 400 });
    }
}
