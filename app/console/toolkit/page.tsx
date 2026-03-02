"use client";

import { useState, useEffect, useRef } from "react";
import {
    Cpu, Music2, Zap, Gauge, Guitar, Mic2, Radio, Sliders,
    ChevronRight, ExternalLink, Play, Pause, RefreshCw,
    Volume2, Clock
} from "lucide-react";

// ── Tuner ─────────────────────────────────────────────────────────────────────
const STANDARD_TUNING = [
    { string: "E2", hz: 82.41, label: "6th (E)" },
    { string: "A2", hz: 110.00, label: "5th (A)" },
    { string: "D3", hz: 146.83, label: "4th (D)" },
    { string: "G3", hz: 196.00, label: "3rd (G)" },
    { string: "B3", hz: 246.94, label: "2nd (B)" },
    { string: "E4", hz: 329.63, label: "1st (E)" },
];

// ── AI Tools ─────────────────────────────────────────────────────────────────
const AI_TOOLS = [
    { id: "lyric-assist", icon: "✍️", title: "Lyric Assistant", desc: "Get unstuck. Describe your song's vibe and the AI gives you verse/chorus/bridge ideas.", color: "#a78bfa", badge: "AI" },
    { id: "chord-suggest", icon: "🎸", title: "Chord Progression AI", desc: "Enter a key and mood — get 5 progression suggestions with voicing tips.", color: "#f59e0b", badge: "AI" },
    { id: "bio-writer", icon: "📝", title: "Artist Bio Writer", desc: "Generate a professional artist bio from your profile data. Short, long, and press formats.", color: "#34d399", badge: "AI" },
    { id: "set-optimizer", icon: "📋", title: "Setlist Optimizer", desc: "Drop in your song list and the AI suggests optimal order for energy, key flow, and pacing.", color: "#60a5fa", badge: "AI" },
    { id: "contract-draft", icon: "📄", title: "Contract AI", desc: "Generate a basic performance contract with your show details. Always have a contract.", color: "#f472b6", badge: "AI" },
    { id: "press-release", icon: "📰", title: "Press Release Writer", desc: "Touring? New release? Let AI draft your press release from the details you provide.", color: "#fb923c", badge: "AI" },
];

// ── Metronome sounds (visual only, no AudioContext on server) ─────────────────
export default function ToolkitPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "tuner" | "metronome" | "ai">("overview");
    // Metronome state
    const [bpm, setBpm] = useState(120);
    const [metroRunning, setMetroRunning] = useState(false);
    const [beat, setBeat] = useState(0);
    const [timeSignature, setTimeSignature] = useState(4);
    const metroRef = useRef<NodeJS.Timeout | null>(null);
    // Tuner state
    const [selectedString, setSelectedString] = useState(5); // high E
    const [tunerActive, setTunerActive] = useState(false);
    const [cents, setCents] = useState(0); // -50 to +50
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiOutput, setAiOutput] = useState("");
    const [aiTool, setAiTool] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Metronome tick
    useEffect(() => {
        if (metroRunning) {
            metroRef.current = setInterval(() => {
                setBeat(b => (b + 1) % timeSignature);
            }, (60 / bpm) * 1000);
        } else {
            if (metroRef.current) clearInterval(metroRef.current);
            setBeat(0);
        }
        return () => { if (metroRef.current) clearInterval(metroRef.current); };
    }, [metroRunning, bpm, timeSignature]);

    // Simulated tuner drift
    useEffect(() => {
        if (!tunerActive) return;
        const interval = setInterval(() => {
            setCents(prev => {
                const drift = (Math.random() - 0.5) * 4;
                const next = Math.max(-50, Math.min(50, prev + drift));
                return Math.round(next * 2) / 2;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [tunerActive]);

    const tunerColor = Math.abs(cents) < 5 ? "#34d399" : Math.abs(cents) < 15 ? "#f59e0b" : "#f87171";
    const tunerLabel = Math.abs(cents) < 5 ? "IN TUNE" : cents > 0 ? "SHARP +" + Math.abs(cents).toFixed(0) : "FLAT " + Math.abs(cents).toFixed(0);

    const runAI = (tool: (typeof AI_TOOLS)[0]) => {
        setAiTool(tool.id);
        setAiLoading(true);
        setAiOutput("");
        setTimeout(() => {
            const responses: Record<string, string> = {
                "lyric-assist": `VERSE 1 IDEA\nThe coffee's cold and the highway's wide\nAnd everything I thought I knew has died\nBut the mile markers tell me I'm still moving\nEven when the destination needs improving\n\nCHORUS IDEA\nStill breathing still trying still driving this thing\nBattered but not broken still got enough to sing\n\nBRIDGE IDEA (contrast — pull back)\nMaybe I don't need a destination\nMaybe moving is the whole equation`,
                "chord-suggest": `KEY: E MAJOR — Mood: Melancholic Drive\n\n1. I → V → vi → IV (E - B - C#m - A) — classic, timeless\n2. I → IV → I → V (E - A - E - B) — driving, great for verses\n3. vi → IV → I → V (C#m - A - E - B) — emotional chorus feel\n4. I → ♭VII → IV (E - D - A) — Nashville-tinged, alt-country\n5. ii → V → I → IV (F#m - B - E - A) — jazz-informed Americana`,
                "bio-writer": `Rob Lackey Band is a Pacific Northwest-rooted indie rock and Americana outfit carving out their own brand of road-worn, honest music.

Led by guitarist and vocalist Rob Lackey, the band blends alt-country grit with indie rock's restless energy — equal parts Tractor Tavern sweat and Montana highway miles.

Their music documents the kind of life lived between gigs: the long drives, the small venues that feel like home, and the communities that show up every Friday night.

Available for booking across WA, OR, MT, and ID.`,
                "set-optimizer": `OPTIMIZED SETLIST ORDER\n\n1. Gravel Road (opener — mid-tempo, familiar, gets 'em in)\n2. Neon Rust (build energy — your best hook)\n3. [Add mid-energy song] — keep the room warm\n4. Blue Mountains (slow it down — let them breathe and feel)\n5. [Add your biggest banger here — peak energy]\n6. [Penultimate — come back up from ballad]\n7. [Closer — something celebratory or anthemic]\n\nTip: Start in G or D, save key changes for emotional peaks.`,
                "contract-draft": `PERFORMANCE AGREEMENT\n\nARTIST: Rob Lackey Band\nVENUE: _______\nDATE: _______\nSHOW TIME: _______\nSOUNDCHECK: _______\nGUARANTEE: $_______ / Door Split: _____%\n\nBoth parties agree that the Artist will perform one (1) set of approximately [X] minutes. Venue provides PA, lighting, and stage access from [time]. Artist requires [backline requirements].\n\nPayment due at end of performance. Cancellation by Venue with less than 7 days notice: 50% of guarantee due.\n\n[Add your touring rider details in the Toolkit section]\n\nSigned: ________ Date: ________`,
                "press-release": `FOR IMMEDIATE RELEASE\n\nROB LACKEY BAND ANNOUNCES SPRING MONTANA-WASHINGTON TOUR\n\nMissoula, MT — Rob Lackey Band, the Pacific Northwest's hardest-working indie Americana outfit, today announced a run of spring dates across Montana and Washington, kicking off April 8 at Missoula's Top Hat Billiards.\n\nThe tour supports the band's newly released single "Neon Rust," which has already [milestone/achievement]. The run includes stops at [venues].\n\n"We've been building toward this for a year," says frontman Rob Lackey. "These towns are our people. We're coming back loud."\n\nTickets available at the door. Media inquiries: [email]\n\n###`,
            };
            setAiOutput(responses[tool.id] || "AI response coming soon...");
            setAiLoading(false);
        }, 1800);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-0">
                <div className="flex items-center gap-2 mb-1">
                    <Cpu size={18} style={{ color: "#a78bfa" }} />
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>Toolkit</h1>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--ct-text-muted)" }}>
                    AI writing tools, chromatic tuner, metronome, chord finder, and more.
                </p>

                <div className="flex gap-1 border-b" style={{ borderColor: "var(--ct-border)" }}>
                    {([
                        { key: "overview", label: "🧰 Overview" },
                        { key: "tuner", label: "🎸 Tuner" },
                        { key: "metronome", label: "⏱ Metronome" },
                        { key: "ai", label: "✨ AI Tools" },
                    ] as { key: typeof activeTab; label: string }[]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                            style={activeTab === t.key ? { color: "#a78bfa", borderBottom: "2px solid #a78bfa" } : { color: "var(--ct-text-muted)" }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* ── OVERVIEW ─────────────────────────────────────── */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-4xl">
                        {[
                            { label: "Chromatic Tuner", icon: "🎸", desc: "Tune any instrument", tab: "tuner" as typeof activeTab, color: "#34d399" },
                            { label: "Metronome", icon: "⏱", desc: "BPM, time signature, tap tempo", tab: "metronome" as typeof activeTab, color: "#f59e0b" },
                            { label: "AI Writing Tools", icon: "✨", desc: "Lyrics, bios, press releases", tab: "ai" as typeof activeTab, color: "#a78bfa" },
                            { label: "Stage Rider", icon: "📋", desc: "Tech rider & stage plot", tab: "overview" as typeof activeTab, color: "#f472b6" },
                            { label: "Chord Finder", icon: "🎵", desc: "Find any chord voicing", tab: "overview" as typeof activeTab, color: "#60a5fa" },
                            { label: "Key Finder", icon: "🔑", desc: "Identify songs in key", tab: "overview" as typeof activeTab, color: "#fb923c" },
                            { label: "BPM Tap Tempo", icon: "👆", desc: "Tap to find the BPM", tab: "metronome" as typeof activeTab, color: "#f59e0b" },
                            { label: "Set Clock", icon: "⏰", desc: "Time your sets", tab: "overview" as typeof activeTab, color: "#34d399" },
                        ].map(tool => (
                            <button key={tool.label} onClick={() => setActiveTab(tool.tab)}
                                className="text-left p-5 rounded-2xl border transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                                <span className="text-2xl block mb-2">{tool.icon}</span>
                                <p className="text-sm font-bold mb-0.5" style={{ color: "var(--ct-text)" }}>{tool.label}</p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{tool.desc}</p>
                                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold" style={{ color: tool.color }}>
                                    Open <ChevronRight size={10} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* ── TUNER ────────────────────────────────────────── */}
                {activeTab === "tuner" && (
                    <div className="max-w-sm mx-auto space-y-6">
                        <div className="p-6 rounded-2xl border text-center space-y-4"
                            style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            {/* Selected note display */}
                            <div>
                                <p className="text-5xl font-black mb-1" style={{ color: tunerActive ? tunerColor : "var(--ct-text-muted)" }}>
                                    {STANDARD_TUNING[selectedString].string.replace(/\d/, "")}
                                </p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                    {STANDARD_TUNING[selectedString].label} · {STANDARD_TUNING[selectedString].hz} Hz
                                </p>
                            </div>

                            {/* Cents meter */}
                            <div className="relative h-4 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-0.5 h-full bg-white/20" />
                                </div>
                                {tunerActive && (
                                    <div className="absolute top-0 bottom-0 w-4 rounded-full transition-all duration-100"
                                        style={{
                                            backgroundColor: tunerColor,
                                            left: `calc(50% + ${(cents / 50) * 46}% - 8px)`,
                                            boxShadow: `0 0 12px ${tunerColor}`,
                                        }} />
                                )}
                            </div>

                            <p className="text-lg font-black" style={{ color: tunerActive ? tunerColor : "var(--ct-text-muted)" }}>
                                {tunerActive ? tunerLabel : "—"}
                            </p>

                            <button onClick={() => setTunerActive(a => !a)}
                                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                                style={{
                                    background: tunerActive ? "rgba(248,113,113,0.2)" : "linear-gradient(135deg, #34d399, #06b6d4)",
                                    border: tunerActive ? "1px solid rgba(248,113,113,0.3)" : "none",
                                    color: tunerActive ? "#f87171" : "#000",
                                }}>
                                {tunerActive ? "Stop" : "🎙️ Start Tuner"}
                            </button>

                            {tunerActive && (
                                <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>
                                    (Microphone access required in production — simulated for demo)
                                </p>
                            )}
                        </div>

                        {/* String selector */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--ct-text-muted)" }}>
                                Select String
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {STANDARD_TUNING.map((s, i) => (
                                    <button key={s.string} onClick={() => { setSelectedString(i); setCents(0); }}
                                        className="py-3 rounded-xl font-bold text-sm transition-all"
                                        style={selectedString === i
                                            ? { background: "linear-gradient(135deg, #34d399, #06b6d4)", color: "#000" }
                                            : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                                        {s.string.replace(/\d/, "")}
                                        <span className="block text-[8px] opacity-60 font-normal mt-0.5">{s.label.split(" ")[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── METRONOME ────────────────────────────────────── */}
                {activeTab === "metronome" && (
                    <div className="max-w-sm mx-auto space-y-5">
                        <div className="p-6 rounded-2xl border text-center space-y-5"
                            style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            {/* BPM display */}
                            <div>
                                <p className="text-7xl font-black tracking-tighter" style={{ color: "var(--ct-text)" }}>{bpm}</p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>BPM</p>
                            </div>

                            {/* Beat dots */}
                            <div className="flex justify-center gap-3">
                                {Array.from({ length: timeSignature }).map((_, i) => (
                                    <div key={i} className="w-4 h-4 rounded-full transition-all duration-100"
                                        style={{
                                            backgroundColor: metroRunning && beat === i
                                                ? (i === 0 ? "#f59e0b" : "#34d399")
                                                : "rgba(255,255,255,0.1)",
                                            boxShadow: metroRunning && beat === i ? `0 0 16px ${i === 0 ? "#f59e0b" : "#34d399"}` : "none",
                                            transform: metroRunning && beat === i ? "scale(1.4)" : "scale(1)",
                                        }} />
                                ))}
                            </div>

                            {/* Time signature */}
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Time Sig:</span>
                                {[2, 3, 4, 5, 6].map(ts => (
                                    <button key={ts} onClick={() => { setTimeSignature(ts); setBeat(0); }}
                                        className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                                        style={timeSignature === ts
                                            ? { backgroundColor: "#f59e0b", color: "#000" }
                                            : { backgroundColor: "rgba(255,255,255,0.06)", color: "var(--ct-text-muted)" }}>
                                        {ts}/4
                                    </button>
                                ))}
                            </div>

                            {/* BPM slider */}
                            <div className="space-y-2">
                                <input type="range" min={20} max={280} value={bpm}
                                    onChange={e => { setBpm(Number(e.target.value)); }}
                                    className="w-full accent-amber-400" />
                                <div className="flex justify-between text-[9px]" style={{ color: "var(--ct-text-muted)" }}>
                                    <span>Largo 20</span><span>Andante 76</span><span>Allegro 168</span><span>Presto 200+</span>
                                </div>
                            </div>

                            {/* Common tempos */}
                            <div className="flex flex-wrap gap-1 justify-center">
                                {[60, 70, 80, 90, 100, 110, 120, 140, 160, 180].map(b => (
                                    <button key={b} onClick={() => setBpm(b)}
                                        className="text-[9px] px-2 py-1 rounded-lg transition-all"
                                        style={bpm === b
                                            ? { backgroundColor: "#f59e0b", color: "#000", fontWeight: 700 }
                                            : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)" }}>
                                        {b}
                                    </button>
                                ))}
                            </div>

                            <button onClick={() => setMetroRunning(r => !r)}
                                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                                style={{
                                    background: metroRunning ? "rgba(248,113,113,0.2)" : "linear-gradient(135deg, #f59e0b, #f97316)",
                                    border: metroRunning ? "1px solid rgba(248,113,113,0.3)" : "none",
                                    color: metroRunning ? "#f87171" : "#000",
                                }}>
                                {metroRunning ? "⏹ Stop" : "▶ Start"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── AI TOOLS ─────────────────────────────────────── */}
                {activeTab === "ai" && (
                    <div className="max-w-3xl">
                        {aiTool ? (
                            <div className="space-y-4">
                                <button onClick={() => { setAiTool(null); setAiOutput(""); }}
                                    className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                    ← Back to tools
                                </button>
                                <div>
                                    <textarea placeholder="Add context, show details, song ideas, mood..."
                                        value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                                        rows={3}
                                        className="w-full text-sm px-4 py-3 rounded-xl focus:outline-none resize-none transition-all mb-3"
                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                                    <button onClick={() => runAI(AI_TOOLS.find(t => t.id === aiTool)!)} disabled={aiLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff" }}>
                                        {aiLoading ? "✨ Generating..." : "✨ Generate"}
                                    </button>
                                </div>
                                {aiOutput && (
                                    <div className="p-5 rounded-2xl border font-mono text-sm leading-relaxed whitespace-pre-wrap"
                                        style={{ backgroundColor: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)", color: "var(--ct-text)" }}>
                                        {aiOutput}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {AI_TOOLS.map(tool => (
                                    <button key={tool.id}
                                        onClick={() => { setAiTool(tool.id); runAI(tool); }}
                                        className="text-left p-5 rounded-2xl border transition-all hover:scale-[1.02]"
                                        style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-2xl">{tool.icon}</span>
                                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: tool.color + "20", color: tool.color }}>
                                                {tool.badge}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>{tool.title}</p>
                                        <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{tool.desc}</p>
                                        <div className="flex items-center gap-1 mt-3 text-[10px] font-bold" style={{ color: tool.color }}>
                                            Try it <ChevronRight size={10} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
