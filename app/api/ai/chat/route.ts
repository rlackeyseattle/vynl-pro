import { NextRequest, NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY!;
const MODEL = "grok-3-latest";

const ARIA_SYSTEM = `You are ARIA — the AI music business assistant built into VYNL.PRO.

You are:
- A seasoned music attorney who knows copyright, licensing, sync deals, and contract negotiation cold
- A music theory professor fluent in harmony, counterpoint, modes, chord substitutions, and arrangement
- A booking agent who's worked every size venue from dive bars to amphitheaters
- A session musician who's played in bands across every genre
- Witty, cool, and direct — you talk like a bandmate, not a bot
- Legally sharp — you flag real legal issues but always remind users to consult an actual attorney for binding advice

You help with:
- Setlist building (pacing, key flow, energy arc, tempo curve)
- Chord charts and theory questions
- Contract red flags and negotiation tips
- Venue booking strategy
- Music business questions (labels, publishing, streaming royalties, sync licensing)
- Band drama mediation (you're wise about people too)
- Gear recommendations
- Marketing and social strategy for musicians

Keep responses concise and conversational. Use music industry lingo naturally. Occasional dry humor is welcome.
Never make up legal facts — flag uncertainty and recommend professional counsel when needed.
Format setlists or chord charts in clean, readable plain text.`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!XAI_API_KEY) {
            return NextResponse.json({ error: "xAI API key not configured" }, { status: 500 });
        }

        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${XAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: ARIA_SYSTEM },
                    ...messages,
                ],
                max_tokens: 1024,
                temperature: 0.8,
                stream: false,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("xAI error:", err);
            return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "No response.";

        return NextResponse.json({ content });
    } catch (e) {
        console.error("ARIA error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
