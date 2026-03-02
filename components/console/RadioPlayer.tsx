"use client";

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { Play, Pause, Radio, Volume2, VolumeX, ChevronUp, X, Loader2, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Station Data ────────────────────────────────────────────────────────────────
export interface Station {
    id: string;
    name: string;
    stream: string;
    genre: string;
    location?: string;
    color: string;
    emoji: string;
    isVynl?: boolean;
}

const STATIONS: Station[] = [
    // VYNL FM - our own (placeholder stream - will just be silent/looped)
    {
        id: "vynl-fm",
        name: "VYNL FM",
        stream: "", // placeholder until ElevenLabs ad mp3s are ready
        genre: "VYNL Network",
        location: "Missoula, MT",
        color: "#f59e0b",
        emoji: "🎙️",
        isVynl: true,
    },
    // Montana Local
    {
        id: "kmpt",
        name: "The Trail 103.3",
        stream: "https://ice24.securenetsystems.net/KMPT",
        genre: "Country",
        location: "Missoula, MT",
        color: "#f97316",
        emoji: "🤠",
    },
    {
        id: "kbaz",
        name: "Z100 Missoula",
        stream: "https://ice24.securenetsystems.net/KBAZ",
        genre: "Top 40",
        location: "Missoula, MT",
        color: "#a78bfa",
        emoji: "⚡",
    },
    {
        id: "kyss",
        name: "KYSS FM 94.9",
        stream: "https://ice24.securenetsystems.net/KYSS",
        genre: "Country",
        location: "Missoula, MT",
        color: "#34d399",
        emoji: "🎸",
    },
    // National/Genre
    {
        id: "kroq",
        name: "KROQ Alt Nation",
        stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/KROQFMAAC.aac",
        genre: "Alternative Rock",
        location: "Los Angeles",
        color: "#ef4444",
        emoji: "🔥",
    },
    {
        id: "smooth-jazz",
        name: "Smooth Jazz Global",
        stream: "https://streams.radiomast.io/8e6656b5-d40d-4a24-aa01-01cd5a843d6d",
        genre: "Jazz",
        location: "Global",
        color: "#60a5fa",
        emoji: "🎷",
    },
    {
        id: "soma-indie",
        name: "SomaFM Indie Pop",
        stream: "https://ice1.somafm.com/indiepop-128-mp3",
        genre: "Indie",
        location: "San Francisco",
        color: "#e879f9",
        emoji: "🌸",
    },
    {
        id: "soma-rock",
        name: "SomaFM Left Coast 70s",
        stream: "https://ice1.somafm.com/seventies-128-mp3",
        genre: "Classic Rock",
        location: "San Francisco",
        color: "#fb923c",
        emoji: "🕺",
    },
    {
        id: "soma-metal",
        name: "SomaFM Metal Detector",
        stream: "https://ice1.somafm.com/metal-128-mp3",
        genre: "Metal",
        location: "San Francisco",
        color: "#6b7280",
        emoji: "🤘",
    },
    {
        id: "blues",
        name: "Blues Radio UK",
        stream: "https://streaming.bluesradio.uk/blues",
        genre: "Blues",
        location: "UK",
        color: "#1d4ed8",
        emoji: "🎵",
    },
    {
        id: "jazz-24",
        name: "Jazz24",
        stream: "https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1",
        genre: "Jazz",
        location: "Seattle, WA",
        color: "#0ea5e9",
        emoji: "🎺",
    },
    {
        id: "folk",
        name: "Folk Alley",
        stream: "https://stream.wksu.org/wksu2.mp3",
        genre: "Folk / Americana",
        location: "Kent, OH",
        color: "#84cc16",
        emoji: "🪕",
    },
];

// ── Context ─────────────────────────────────────────────────────────────────────
interface RadioContextType {
    station: Station | null;
    playing: boolean;
    volume: number;
    loading: boolean;
    play: (station: Station) => void;
    pause: () => void;
    setVolume: (v: number) => void;
    stations: Station[];
}

const RadioContext = createContext<RadioContextType | null>(null);

export function useRadio() {
    const ctx = useContext(RadioContext);
    if (!ctx) throw new Error("useRadio must be used within RadioProvider");
    return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────────────
export function RadioProvider({ children }: { children: React.ReactNode }) {
    const [station, setStation] = useState<Station | null>(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
        }
        audioRef.current.addEventListener("playing", () => setLoading(false));
        audioRef.current.addEventListener("waiting", () => setLoading(true));
        audioRef.current.addEventListener("error", () => { setLoading(false); setPlaying(false); });
        return () => { audioRef.current?.pause(); };
    }, [volume]);

    const play = useCallback((s: Station) => {
        if (!audioRef.current || !s.stream) return;
        setLoading(true);
        setStation(s);
        audioRef.current.src = s.stream;
        audioRef.current.load();
        audioRef.current.play()
            .then(() => setPlaying(true))
            .catch(() => { setLoading(false); setPlaying(false); });
    }, []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
        setPlaying(false);
    }, []);

    const setVol = useCallback((v: number) => {
        if (audioRef.current) audioRef.current.volume = v;
        setVolume(v);
    }, []);

    return (
        <RadioContext.Provider value={{ station, playing, volume, loading, play, pause, setVolume: setVol, stations: STATIONS }}>
            {children}
        </RadioContext.Provider>
    );
}

// ── Player Bar ─────────────────────────────────────────────────────────────────
export function RadioPlayerBar() {
    const { station, playing, volume, loading, play, pause, setVolume, stations } = useRadio();
    const [expanded, setExpanded] = useState(false);
    const [muted, setMuted] = useState(false);
    const [prevVol, setPrevVol] = useState(0.7);

    const toggleMute = () => {
        if (muted) { setVolume(prevVol); } else { setPrevVol(volume); setVolume(0); }
        setMuted(!muted);
    };

    const togglePlay = () => {
        if (!station) { play(stations[1]); return; } // default to first real station
        if (playing) pause(); else play(station);
    };

    return (
        <>
            {/* Station Picker Drawer */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-14 left-0 right-0 z-[99] md:left-[220px]"
                        style={{ backgroundColor: "var(--ct-bg-2)", borderTop: "1px solid var(--ct-border)" }}
                    >
                        <div className="max-h-72 overflow-y-auto p-3">
                            <div className="flex items-center justify-between px-2 py-1 mb-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: "var(--ct-text-muted)" }}>
                                    Select Station
                                </span>
                                <button onClick={() => setExpanded(false)} className="p-1 rounded-lg" style={{ color: "var(--ct-text-muted)" }}>
                                    <X size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {stations.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => { play(s); setExpanded(false); }}
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.02]"
                                        style={{
                                            backgroundColor: station?.id === s.id ? `${s.color}20` : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${station?.id === s.id ? `${s.color}40` : "var(--ct-border)"}`,
                                        }}
                                    >
                                        <span className="text-lg">{s.emoji}</span>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold leading-tight truncate" style={{ color: s.color }}>{s.name}</p>
                                            <p className="text-[8px] truncate" style={{ color: "var(--ct-text-muted)" }}>{s.genre}</p>
                                        </div>
                                        {station?.id === s.id && playing && (
                                            <div className="ml-auto flex gap-0.5">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div key={i} className="w-0.5 rounded-full" style={{ backgroundColor: s.color, height: 10 }}
                                                        animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
                                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Player Bar */}
            <div
                className="fixed bottom-0 left-0 right-0 z-[100] md:left-[220px] flex items-center gap-3 px-4 py-2.5 border-t"
                style={{
                    backgroundColor: "var(--ct-bg-2)",
                    borderColor: "var(--ct-border)",
                    height: "56px",
                }}
            >
                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                    style={{
                        background: station ? `linear-gradient(135deg, ${station.color}, ${station.color}99)` : "rgba(255,255,255,0.08)",
                        boxShadow: station && playing ? `0 0 12px ${station.color}60` : "none",
                    }}
                    title={playing ? "Pause" : "Play"}
                >
                    {loading ? (
                        <Loader2 size={14} className="text-black animate-spin" />
                    ) : playing ? (
                        <Pause size={14} className="text-black" />
                    ) : (
                        <Play size={14} className="text-white ml-0.5" />
                    )}
                </button>

                {/* Station Info */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex-1 min-w-0 flex items-center gap-2.5 text-left group"
                >
                    {station ? (
                        <>
                            <span className="text-base flex-shrink-0">{station.emoji}</span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-bold truncate" style={{ color: station.color }}>
                                        {station.name}
                                    </p>
                                    {playing && (
                                        <div className="flex gap-0.5">
                                            {[0, 1, 2].map(i => (
                                                <motion.div key={i} className="w-0.5 rounded-full" style={{ backgroundColor: station.color, height: 8 }}
                                                    animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
                                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[9px]" style={{ color: "var(--ct-text-muted)" }}>{station.genre}{station.location ? ` · ${station.location}` : ""}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Radio size={14} style={{ color: "var(--ct-text-muted)" }} />
                            <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>VYNL Radio — Select a station</p>
                        </>
                    )}
                    <ChevronUp size={12} className={`ml-auto flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                        style={{ color: "var(--ct-text-muted)" }} />
                </button>

                {/* Volume */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <button onClick={toggleMute} className="p-1" style={{ color: "var(--ct-text-muted)" }} title="Toggle mute">
                        {volume === 0 || muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                    <input
                        type="range" min={0} max={1} step={0.02}
                        value={muted ? 0 : volume}
                        onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)); }}
                        className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: station?.color || "var(--ct-accent)" }}
                    />
                </div>

                {/* VYNL badge */}
                <div className="hidden md:flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg"
                    style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <Music size={9} style={{ color: "#f59e0b" }} />
                    <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: "#f59e0b" }}>VYNL RADIO</span>
                </div>
            </div>
        </>
    );
}
