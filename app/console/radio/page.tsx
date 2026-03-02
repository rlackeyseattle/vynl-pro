"use client";

import { useState } from "react";
import { Radio, Music2, Mic2, Play, Pause, SkipForward, Volume2, Users, Zap, Globe } from "lucide-react";

// ── Station data ──────────────────────────────────────────────────────────────
const STATIONS = [
    {
        id: "local-pnw",
        name: "🌲 All Local PNW",
        desc: "100% Pacific Northwest artists — WA, OR, MT, ID",
        color: "#34d399",
        bg: "from-emerald-600 to-teal-700",
        listeners: 312,
        nowPlaying: { artist: "Rob Lackey Band", track: "Neon Rust", duration: "3:47" },
        queue: ["Dirty Buttons — Gravel Road", "Silver Creek — Blue Mountains", "The Midnight Drifters — Highway 93"],
        genre: "LOCAL",
    },
    {
        id: "indie-rock",
        name: "🎸 Indie Rock",
        desc: "Guitars, grit, and independent spirit",
        color: "#f472b6",
        bg: "from-pink-600 to-rose-700",
        listeners: 891,
        nowPlaying: { artist: "Cold Shoulder Method", track: "Static City", duration: "4:12" },
        queue: ["Phantom Route — Ghost Signal", "Copper & Coal — Slow Burn", "High Noon Drifters — Desert Glass"],
        genre: "INDIE",
    },
    {
        id: "alt-country",
        name: "🤠 Alt-Country",
        desc: "Honky-tonk, Americana, and twang with a bite",
        color: "#f59e0b",
        bg: "from-amber-600 to-orange-700",
        listeners: 445,
        nowPlaying: { artist: "High Noon Drifters", track: "Last Train to Bozeman", duration: "3:28" },
        queue: ["Copper & Coal — Porch Light", "Dirty Buttons — Whiskey & Wire", "Silver Creek — Rattlesnake Road"],
        genre: "COUNTRY",
    },
    {
        id: "metal-heavy",
        name: "🤘 Heavy & Metal",
        desc: "When it absolutely must go to 11",
        color: "#ef4444",
        bg: "from-red-700 to-rose-900",
        listeners: 567,
        nowPlaying: { artist: "Spoke & Mule", track: "Iron Curtain", duration: "5:03" },
        queue: ["Velvet Code — Chainsaw Gospel", "Neon Wraith — Voltage", "Black Fir — Haunted Valley"],
        genre: "METAL",
    },
    {
        id: "folk-acoustic",
        name: "🎵 Folk & Acoustic",
        desc: "Quiet intensity. Stories told right.",
        color: "#a78bfa",
        bg: "from-violet-600 to-purple-800",
        listeners: 278,
        nowPlaying: { artist: "Phantom Route", track: "Maps of Nowhere", duration: "4:44" },
        queue: ["Cold Shoulder Method — Ember", "Rob Lackey — Hollow Mountain (unplugged)", "Copper & Coal — Rain on the Palouse"],
        genre: "FOLK",
    },
    {
        id: "punk-garage",
        name: "⚡ Punk & Garage",
        desc: "Fast, loud, and proud. Three chords and the truth.",
        color: "#60a5fa",
        bg: "from-blue-600 to-indigo-800",
        listeners: 334,
        nowPlaying: { artist: "Velvet Code", track: "No Signal", duration: "2:11" },
        queue: ["High Noon Drifters — Static", "Black Fir — Teeth", "Neon Wraith — Terminal"],
        genre: "PUNK",
    },
];

// ── Live Shows ─────────────────────────────────────────────────────────────────
const LIVE_SHOWS = [
    { name: "Dirty Buttons LIVE @ Tractor Tavern", status: "LIVE", listeners: 127, started: "14min ago", color: "#ef4444" },
    { name: "Silver Creek Soundcheck — Badlander", status: "PREMERE IN 2h", listeners: 43, started: "", color: "#f59e0b" },
    { name: "VYNL.PRO Local Showcase — Neumos", status: "TOMORROW 8pm", listeners: 0, started: "", color: "#a78bfa" },
];

export default function RadioPage() {
    const [playing, setPlaying] = useState<string | null>("local-pnw");
    const [activeTab, setActiveTab] = useState<"stations" | "live">("stations");

    const activeStation = STATIONS.find(s => s.id === playing);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* ── Header ─────────────────────────────────── */}
            <div className="px-8 pt-10 pb-6 border-b" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center gap-3 mb-1">
                    <Radio size={20} style={{ color: "var(--ct-accent)" }} />
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>
                        PNW Radio
                    </h1>
                </div>
                <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>
                    Genre stations, all-local rotation, and live show streams from the Pacific Northwest scene
                </p>

                <div className="flex gap-2 mt-4">
                    {(["stations", "live"] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all capitalize"
                            style={activeTab === tab
                                ? { backgroundColor: "var(--ct-accent)", color: "#000" }
                                : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}>
                            {tab === "live" ? "🔴 Live Shows" : "📻 Stations"}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Now Playing bar ─────────────────────────── */}
            {activeStation && (
                <div className="px-8 py-4 flex items-center gap-4"
                    style={{ background: `linear-gradient(135deg, ${activeStation.color}18, transparent)`, borderBottom: "1px solid var(--ct-border)" }}>
                    {/* Animated VU bars */}
                    <div className="flex items-end gap-0.5 w-8 h-6 flex-shrink-0">
                        {[4, 7, 5, 8, 6, 9, 4, 7].map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm"
                                style={{
                                    height: `${h * 10}%`,
                                    backgroundColor: activeStation.color,
                                    animation: `vuPulse ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                                    opacity: 0.8,
                                }} />
                        ))}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: activeStation.color }}>
                            ▶ NOW PLAYING — {activeStation.name}
                        </p>
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--ct-text)" }}>
                            {activeStation.nowPlaying.artist} — {activeStation.nowPlaying.track}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="p-2 rounded-lg transition-all hover:bg-white/10" style={{ color: "var(--ct-text-muted)" }}>
                            <SkipForward size={15} />
                        </button>
                        <button onClick={() => setPlaying(null)}
                            className="p-2 rounded-lg transition-all hover:bg-white/10"
                            style={{ color: "var(--ct-text-muted)" }}>
                            <Pause size={15} />
                        </button>
                    </div>
                    <style>{`
                        @keyframes vuPulse {
                            from { transform: scaleY(0.4); }
                            to { transform: scaleY(1); }
                        }
                    `}</style>
                </div>
            )}

            <div className="px-8 py-6">
                {activeTab === "stations" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {STATIONS.map(station => {
                            const isPlaying = playing === station.id;
                            return (
                                <div key={station.id}
                                    className="relative group p-5 rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                                    style={{
                                        backgroundColor: isPlaying ? `${station.color}10` : "rgba(255,255,255,0.025)",
                                        border: `1px solid ${isPlaying ? station.color + "40" : "var(--ct-border)"}`,
                                    }}
                                    onClick={() => setPlaying(station.id)}>

                                    {/* Gradient bg */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${station.bg} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-base font-black" style={{ color: "var(--ct-text)" }}>{station.name}</p>
                                                <p className="text-xs mt-0.5" style={{ color: "var(--ct-text-muted)" }}>{station.desc}</p>
                                            </div>
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                                                style={{ backgroundColor: isPlaying ? station.color : "rgba(255,255,255,0.06)", color: isPlaying ? "#000" : station.color }}>
                                                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--ct-text-muted)" }}>
                                            <span className="flex items-center gap-1">
                                                <Users size={10} /> {station.listeners}
                                            </span>
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: station.color + "20", color: station.color }}>
                                                {station.genre}
                                            </span>
                                        </div>

                                        <div className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                            <p className="font-medium mb-1" style={{ color: isPlaying ? station.color : "var(--ct-text-muted)" }}>
                                                {isPlaying ? "▶ " : ""}{station.nowPlaying.artist} — {station.nowPlaying.track}
                                            </p>
                                            <p className="text-[10px] opacity-60">Up next: {station.queue[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="max-w-2xl space-y-3">
                        {LIVE_SHOWS.map((show, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl transition-all"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <div className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: show.color, animation: show.status === "LIVE" ? "pulse 1.5s ease-in-out infinite" : "none" }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>{show.name}</p>
                                    {show.listeners > 0 && (
                                        <p className="text-xs mt-0.5" style={{ color: "var(--ct-text-muted)" }}>
                                            {show.listeners} listening · started {show.started}
                                        </p>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: show.color + "20", color: show.color }}>
                                    {show.status}
                                </span>
                                {show.status === "LIVE" && (
                                    <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all flex-shrink-0"
                                        style={{ backgroundColor: show.color + "20", color: show.color, border: `1px solid ${show.color}30` }}>
                                        <Play size={11} /> Tune In
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="mt-6 p-5 rounded-2xl text-center"
                            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px dashed var(--ct-border)" }}>
                            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>🎙️ Broadcast Your Show</p>
                            <p className="text-xs mb-3" style={{ color: "var(--ct-text-muted)" }}>
                                Artists and venues can livestream directly through VYNL.PRO
                            </p>
                            <button className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
                                style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                                Coming Soon
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
