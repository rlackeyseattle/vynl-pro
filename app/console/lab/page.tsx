"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Sparkles, Send, Loader2, Music2, ListMusic, Guitar, Image,
    Copy, Check, ArrowRight, ChevronRight, Zap, FileText, Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "chat" | "songgen" | "setlist" | "flyer" | "video";
interface Message { role: "user" | "assistant"; content: string; }

// ─── ARIA Chat ───────────────────────────────────────────────────────────────
const CHAT_STARTERS = [
    "What should I charge for a 3-hour wedding gig?",
    "Explain modal interchange in plain English",
    "Red flags in a venue contract I should know about",
    "How do streaming royalties actually work in 2025?",
    "Build me a 10-song setlist that builds energy perfectly",
    "Help me craft a pitch email to a festival booker",
];

function CopyBtn({ text }: { text: string }) {
    const [done, setDone] = useState(false);
    return (
        <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            style={{ backgroundColor: "rgba(0,242,242,0.1)", color: "#00f2f2" }}>
            {done ? <Check size={10} /> : <Copy size={10} />}
        </button>
    );
}

function ChatTab() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

    const send = useCallback(async (text?: string) => {
        const content = text ?? input.trim();
        if (!content || loading) return;
        setInput("");
        const history: Message[] = [...messages, { role: "user", content }];
        setMessages(history);
        setLoading(true);
        try {
            const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
            const d = await res.json();
            setMessages([...history, { role: "assistant", content: d.content ?? "Try again." }]);
        } catch { setMessages([...history, { role: "assistant", content: "Connection issue." }]); }
        setLoading(false);
    }, [messages, input, loading]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, rgba(0,242,242,0.15), rgba(167,139,250,0.15))", border: "1px solid rgba(0,242,242,0.2)" }}>
                            <Sparkles size={28} style={{ color: "#00f2f2" }} />
                        </div>
                        <p className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>Ask ARIA anything music-related</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
                            {CHAT_STARTERS.map(s => (
                                <button key={s} onClick={() => send(s)}
                                    className="text-left px-4 py-3 rounded-xl text-xs border transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5 flex items-center gap-2"
                                    style={{ borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                                    <ChevronRight size={10} className="flex-shrink-0" style={{ color: "#00f2f2" }} /> {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start gap-3"}`}>
                                {m.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)" }}>
                                        <Sparkles size={12} className="text-black" />
                                    </div>
                                )}
                                <div className={`relative group max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap`}
                                    style={m.role === "user"
                                        ? { backgroundColor: "rgba(0,242,242,0.1)", color: "#f0f0f0", border: "1px solid rgba(0,242,242,0.15)", borderBottomRightRadius: 4 }
                                        : { backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: 4 }}>
                                    {m.content}
                                    {m.role === "assistant" && <CopyBtn text={m.content} />}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 items-center">
                                <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)" }}>
                                    <Sparkles size={12} className="text-black" />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
                                    <Loader2 size={13} className="animate-spin" style={{ color: "#00f2f2" }} />
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>ARIA is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>
            <div className="border-t px-6 py-4 flex-shrink-0" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex gap-3 items-end max-w-4xl mx-auto">
                    <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                        placeholder="Ask about setlists, contracts, theory, rates..." rows={2}
                        className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,242,242,0.15)", color: "var(--ct-text)", maxHeight: 120 }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.4)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.15)"} />
                    <button onClick={() => send()} disabled={!input.trim() || loading}
                        className="h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-bold disabled:opacity-30 transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", color: "#000" }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Song Generator ──────────────────────────────────────────────────────────
const GENRES = ["Blues Rock", "Indie Pop", "Country", "R&B", "Folk", "Metal", "Jazz", "Hip-Hop", "Punk", "Soul", "Alt Country", "Grunge"] as const;
const MOODS = ["Dark & Brooding", "Hopeful", "Anthemic", "Melancholic", "Triumphant", "Romantic", "Rebellious", "Introspective", "Party", "Dreamy"] as const;
const KEYS = ["C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G", "Ab", "A", "Bb", "B"] as const;
const TEMPOS = ["Slow (60–80 BPM)", "Mid (80–110 BPM)", "Driving (110–130 BPM)", "Fast (130+ BPM)"] as const;

function SongGenTab() {
    const [form, setForm] = useState({ title: "", genre: GENRES[0], mood: MOODS[0], key: KEYS[6], tempo: TEMPOS[1], bars: "12", style: "verse-chorus" });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true); setResult("");
        const prompt = `Generate a complete song blueprint for a musician:
Title: "${form.title || "Untitled"}"
Genre: ${form.genre}
Mood: ${form.mood}  
Key: ${form.key} major/minor (pick what fits the mood)
Tempo: ${form.tempo}
Structure: ${form.style}
Length: approximately ${form.bars} bars per section

Please provide:
1. CHORD CHART — List each section with exact chords in both standard notation and Nashville Numbers
2. SONG STRUCTURE — Intro, Verse, Pre-Chorus, Chorus, Bridge, Outro with bar counts
3. MELODY NOTES — Suggested scale tones for the vocal melody over each section
4. LYRIC FRAMEWORK — 1-2 lines of lyric direction per section (themes, not full lyrics)
5. PRODUCTION NOTES — Key instruments, tone suggestions, arrangement ideas
6. TEMPO & FEEL — Exact BPM suggestion and rhythmic feel description

Format it cleanly with section headers. Be specific and usable by a working musician.`;
        try {
            const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }) });
            const d = await res.json();
            setResult(d.content ?? "Generation failed — try again.");
        } catch { setResult("Connection issue. Try again."); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-full gap-0 min-h-0">
            {/* Form */}
            <div className="w-full md:w-72 flex-shrink-0 border-r p-6 space-y-4 overflow-y-auto" style={{ borderColor: "var(--ct-border)" }}>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Song Title</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Midnight Highway"
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                </div>
                {([["genre", GENRES], ["mood", MOODS], ["key", KEYS], ["tempo", TEMPOS]] as [string, readonly string[]][]).map(([field, opts]) => (
                    <div key={field}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>{field}</label>
                        <select value={(form as Record<string, string>)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                            {opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Structure</label>
                    <select value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                        <option value="verse-chorus">Classic Verse-Chorus</option>
                        <option value="aaba">AABA (Jazz Standard)</option>
                        <option value="12-bar-blues">12-Bar Blues</option>
                        <option value="through-composed">Through-Composed</option>
                        <option value="verse-prechorus-chorus">V-PC-Chorus-Bridge</option>
                    </select>
                </div>
                <button onClick={generate} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", color: "#000" }}>
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Guitar size={14} /> Generate Blueprint</>}
                </button>
            </div>
            {/* Result */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,242,242,0.05)", border: "1px solid rgba(0,242,242,0.15)" }}>
                            <Guitar size={24} style={{ color: "#00f2f2" }} />
                        </div>
                        <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Fill in the form and click Generate Blueprint</p>
                        <p className="text-xs max-w-xs" style={{ color: "rgba(255,255,255,0.2)" }}>ARIA will build a complete chord chart, song structure, melody guide, and production notes</p>
                    </div>
                )}
                {loading && (
                    <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="animate-spin" style={{ color: "#00f2f2" }} />
                            <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>ARIA is composing your blueprint...</p>
                        </div>
                    </div>
                )}
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black" style={{ color: "var(--ct-text)" }}>{form.title || "Song Blueprint"}</h3>
                            <button onClick={() => navigator.clipboard.writeText(result)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                                style={{ backgroundColor: "rgba(0,242,242,0.08)", color: "#00f2f2", border: "1px solid rgba(0,242,242,0.2)" }}>
                                <Copy size={11} /> Copy All
                            </button>
                        </div>
                        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }}>
                            {result}
                        </pre>
                        <button onClick={generate} className="mt-4 text-xs flex items-center gap-1.5" style={{ color: "var(--ct-text-muted)" }}>
                            <Zap size={11} style={{ color: "#00f2f2" }} /> Regenerate
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── Setlist Generator ───────────────────────────────────────────────────────
const SET_LENGTHS = ["30 minutes", "45 minutes", "60 minutes", "75 minutes", "90 minutes", "2 hours"] as const;
const ENERGY_ARCS = ["Build to a Peak (opener → banger)", "Steady Burn (consistent energy)", "Explosive Start (hit opener, hold)", "Storytelling Arc (slow build, emotional climax)", "Dance Party (high energy throughout)"] as const;
const GIG_TYPES = ["Original Band", "Cover Band", "Dive Bar", "Wedding / Private", "Festival", "Theater / Listening Room", "College Bar", "Outdoor Stage"] as const;

function SetlistTab() {
    const [form, setForm] = useState({ length: SET_LENGTHS[1], arc: ENERGY_ARCS[0], gigType: GIG_TYPES[0], genre: "Mix of originals", notes: "" });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true); setResult("");
        const prompt = `You are a professional tour manager and setlist curator. Build a ${form.length} setlist.

Gig Type: ${form.gigType}
Energy Arc: ${form.arc}
Genre / Catalog: ${form.genre}
Special Notes: ${form.notes || "None"}

Create a detailed setlist with:
1. SETLIST — Numbered song titles with (key, BPM, duration) for each
2. PACING NOTES — Brief note on why each song lands where it does
3. TRANSITIONS — Suggested segues, medleys, or key changes between songs
4. STAGE BANTER CUE — One short crowd interaction moment (where and what to say)
5. ENCORE — If applicable, suggest 1-2 encore songs with rationale

If genuine song titles aren't known, generate plausible realistic song titles with genre-appropriate style. Make it feel like a real working setlist from a professional act.`;
        try {
            const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }) });
            setResult((await res.json()).content ?? "Try again.");
        } catch { setResult("Connection issue."); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-full min-h-0">
            <div className="w-full md:w-72 flex-shrink-0 border-r p-6 space-y-4 overflow-y-auto" style={{ borderColor: "var(--ct-border)" }}>
                {([["length", SET_LENGTHS], ["arc", ENERGY_ARCS], ["gigType", GIG_TYPES]] as [string, readonly string[]][]).map(([field, opts]) => (
                    <div key={field}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>{field === "gigType" ? "Gig Type" : field === "arc" ? "Energy Arc" : "Set Length"}</label>
                        <select value={(form as Record<string, string>)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                            {opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Genre / Catalog</label>
                    <input value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="e.g. Blues rock originals + some Hendrix"
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Special Notes</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Outdoor show, no sound check, need to finish by 11pm..."
                        rows={3} className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                </div>
                <button onClick={generate} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", color: "#000" }}>
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Building...</> : <><ListMusic size={14} /> Build Setlist</>}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,242,242,0.05)", border: "1px solid rgba(0,242,242,0.15)" }}>
                            <ListMusic size={24} style={{ color: "#00f2f2" }} />
                        </div>
                        <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Configure your show and hit Build Setlist</p>
                    </div>
                )}
                {loading && <div className="h-full flex items-center justify-center"><div className="flex flex-col items-center gap-3"><Loader2 size={32} className="animate-spin" style={{ color: "#00f2f2" }} /><p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Building your setlist...</p></div></div>}
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black" style={{ color: "var(--ct-text)" }}>Your Setlist — {form.length}</h3>
                            <button onClick={() => navigator.clipboard.writeText(result)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "rgba(0,242,242,0.08)", color: "#00f2f2", border: "1px solid rgba(0,242,242,0.2)" }}><Copy size={11} /> Copy</button>
                        </div>
                        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }}>{result}</pre>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── Flyer Generator ─────────────────────────────────────────────────────────
function FlyerTab() {
    const [form, setForm] = useState({ artist: "", venue: "", date: "", city: "", genre: "Rock", vibe: "Dark & Cinematic" });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true); setResult("");
        const prompt = `Write a complete show flyer text and social media package for a musician:

Artist: ${form.artist || "Your Band"}
Venue: ${form.venue || "The Venue"}
Date/Time: ${form.date || "TBD"}
City: ${form.city || "Seattle, WA"}
Genre: ${form.genre}
Vibe/Aesthetic: ${form.vibe}

Generate:
1. FLYER HEADLINE — A punchy 3-7 word headline (not just the artist name)
2. FLYER BODY COPY — Date, venue, city, door time, ticket price placeholder, age restriction placeholder
3. TAGLINE — One unforgettable sentence that captures the vibe
4. INSTAGRAM CAPTION — With emojis, hashtags, and a call to action (≤280 chars)
5. FACEBOOK EVENT DESCRIPTION — 2-3 paragraphs with full show details and flavor
6. TWITTER/X POST — Punchy, max 240 chars with hashtags
7. EMAIL SUBJECT LINE — 5 options for a show announcement email
8. PRESS ONE-LINER — For use in local music blogs and event listings

Make it feel like it was written by a savvy music PR professional who actually cares about the show.`;
        try {
            const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }) });
            setResult((await res.json()).content ?? "Try again.");
        } catch { setResult("Connection issue."); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-full min-h-0">
            <div className="w-full md:w-72 flex-shrink-0 border-r p-6 space-y-4 overflow-y-auto" style={{ borderColor: "var(--ct-border)" }}>
                {[["artist", "Artist / Band Name", "The Midnight Echo"], ["venue", "Venue", "The Tractor Tavern"], ["date", "Date & Time", "Sat March 15 · Doors 8pm"], ["city", "City, State", "Seattle, WA"]].map(([k, label, ph]) => (
                    <div key={k}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>{label}</label>
                        <input value={(form as Record<string, string>)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                    </div>
                ))}
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Genre</label>
                    <select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                        {["Rock", "Country", "Blues", "R&B/Soul", "Hip-Hop", "Folk/Americana", "Metal", "Indie Pop", "Jazz", "Electronic/DJ"].map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--ct-text-muted)" }}>Visual Vibe</label>
                    <select value={form.vibe} onChange={e => setForm(f => ({ ...f, vibe: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                        {["Dark & Cinematic", "Bright & Energetic", "Vintage / Retro", "Gritty & Raw", "Ethereal / Dreamy", "Cool & Minimal", "Psychedelic", "Elegant / Upscale"].map(v => <option key={v}>{v}</option>)}
                    </select>
                </div>
                <button onClick={generate} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", color: "#000" }}>
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Writing...</> : <><Image size={14} /> Generate Promo Copy</>}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,242,242,0.05)", border: "1px solid rgba(0,242,242,0.15)" }}>
                            <Image size={24} style={{ color: "#00f2f2" }} />
                        </div>
                        <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Fill in show details and generate all your promo copy</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Flyer text, Instagram caption, FB event, Twitter post, email subject lines</p>
                    </div>
                )}
                {loading && <div className="h-full flex items-center justify-center"><div className="flex flex-col items-center gap-3"><Loader2 size={32} className="animate-spin" style={{ color: "#00f2f2" }} /><p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Writing your promo copy...</p></div></div>}
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black" style={{ color: "var(--ct-text)" }}>Promo Package</h3>
                            <button onClick={() => navigator.clipboard.writeText(result)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "rgba(0,242,242,0.08)", color: "#00f2f2", border: "1px solid rgba(0,242,242,0.2)" }}><Copy size={11} /> Copy All</button>
                        </div>
                        <pre className="text-xs leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }}>{result}</pre>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "chat", label: "ARIA Chat", icon: Sparkles, desc: "Music attorney · Theory · Business" },
    { id: "songgen", label: "Song Gen", icon: Guitar, desc: "Chord charts · Structure · Melody" },
    { id: "setlist", label: "Setlist Gen", icon: ListMusic, desc: "Smart setlists from your catalog" },
    { id: "flyer", label: "Promo Copy", icon: Image, desc: "Flyers, captions, email copy" },
    { id: "video", label: "Video Gen", icon: Video, desc: "Coming soon" },
];

export default function LabPage() {
    const [tab, setTab] = useState<Tab>("chat");

    return (
        <div className="flex flex-col" style={{ height: "calc(100vh - 56px)", backgroundColor: "var(--ct-bg)" }}>
            {/* Header + Tabs */}
            <div className="flex-shrink-0 border-b px-6 pt-5 pb-0" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", boxShadow: "0 0 20px rgba(0,242,242,0.3)" }}>
                        <Sparkles size={16} className="text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>The Lab</h1>
                        <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>AI-powered tools for working musicians · Powered by xAI Grok</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>ARIA online</span>
                    </div>
                </div>
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                    {TABS.map(t => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                            <button key={t.id} onClick={() => t.id !== "video" && setTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${active ? "border-current" : "border-transparent"} ${t.id === "video" ? "opacity-30 cursor-not-allowed" : ""}`}
                                style={{ color: active ? "#00f2f2" : "var(--ct-text-muted)" }}>
                                <Icon size={13} />
                                {t.label}
                                {t.id === "video" && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>Soon</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="h-full">
                        {tab === "chat" && <ChatTab />}
                        {tab === "songgen" && <SongGenTab />}
                        {tab === "setlist" && <SetlistTab />}
                        {tab === "flyer" && <FlyerTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
