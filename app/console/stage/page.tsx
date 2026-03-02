"use client";

import { useState, useEffect, useRef } from "react";
import {
    Music2, Play, Pause, SkipForward, SkipBack, Settings,
    ChevronUp, ChevronDown, Plus, Search, Import, Eye, EyeOff,
    Fullscreen, Moon, Sun, List, FileText, Guitar, Mic2, Clock
} from "lucide-react";

// ── Mock setlist ──────────────────────────────────────────────────────────────
const SETLIST = [
    {
        id: "s1", title: "Neon Rust", key: "E", bpm: 98, duration: "3:47", capo: 0,
        chords: ["E", "A", "B", "C#m"],
        lyrics: `VERSE 1
Under the neon rust of a Missoula night
The steel-string spoke what I couldn't write
She was a roadhouse woman with a honky-tonk soul
And the jukebox played something that made me whole

CHORUS
Neon rust on the bar room sign
Fading like everything that used to be mine
But the music plays on and the bourbon's still cold
And neon rust never gets old

VERSE 2
The crowd don't care if you're sharp or flat
Long as you feel it and you mean where you're at
The bartender tips her hat and pours me a glass
Some nights are built like they're meant to last

[CHORUS]

BRIDGE
Every town's got a bar where the broken ones go
Every bar's got a song that they all seem to know
And every song's got a verse about leaving too soon
Under the neon rust and the Montana moon

[CHORUS x2]

OUTRO — hold on E`,
    },
    {
        id: "s2", title: "Gravel Road", key: "G", bpm: 112, duration: "3:22", capo: 0,
        chords: ["G", "Cadd9", "D", "Em"],
        lyrics: `VERSE 1
Packed the truck at dawn
Left the note on the door
Fifteen hundred miles of county road
And I ain't seen your face anymore

CHORUS
Gravel road, gravel road
Every mile I put between us
Takes me somewhere I don't know
Gravel road

VERSE 2
Radio cuts out past Lolo Pass
Nothing but pine trees and static at last
Finally quiet enough to think
Finally brave enough to drink

[CHORUS]

OUTRO — slow to end on G`,
    },
    {
        id: "s3", title: "Blue Mountains", key: "D", bpm: 76, duration: "4:14", capo: 2,
        chords: ["D", "G", "A", "Bm"],
        lyrics: `(capo 2)

INTRO — fingerpick D

VERSE 1
The Blue Mountains don't care
About the things we left behind
They just stand there in the morning
Like they always had the time

CHORUS
Blue mountains, blue sky
Nothing here but you and I
Blue mountains, don't lie
They were here before hello
They'll be here after goodbye

[VERSE 2 — mirror V1]
[CHORUS]

BRIDGE — Bm G D A x2

[CHORUS — half time]

OUTRO — fade on D`,
    },
];

type DisplayMode = "lyrics" | "chords" | "both";
type ScrollMode = "manual" | "auto";

export default function StagePage() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
    const [scrollMode, setScrollMode] = useState<ScrollMode>("manual");
    const [fontSize, setFontSize] = useState(18);
    const [darkMode, setDarkMode] = useState(true);
    const [showImport, setShowImport] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [importUrl, setImportUrl] = useState("");
    const [scrollPos, setScrollPos] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

    const song = SETLIST[currentIdx];

    useEffect(() => {
        if (isRunning && scrollMode === "auto") {
            autoScrollRef.current = setInterval(() => {
                setScrollPos(prev => prev + 1);
                if (contentRef.current) {
                    contentRef.current.scrollTop += 1;
                }
            }, 80);
        } else {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        }
        return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    }, [isRunning, scrollMode]);

    const prev = () => { setCurrentIdx(i => Math.max(0, i - 1)); setIsRunning(false); };
    const next = () => { setCurrentIdx(i => Math.min(SETLIST.length - 1, i + 1)); setIsRunning(false); };

    const bg = darkMode ? "#070710" : "#f5f0e8";
    const fg = darkMode ? "#f1f5f9" : "#1e293b";
    const panel = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
    const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
    const accent = "#e47a2e";

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: fg, transition: "all 0.3s ease" }}>
            {/* ── TOOLBAR ─────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-6 py-3 border-b flex-wrap" style={{ borderColor: border, backgroundColor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}>
                <div className="flex items-center gap-2 mr-4">
                    <Mic2 size={16} style={{ color: accent }} />
                    <span className="font-black text-sm tracking-tight" style={{ color: fg }}>VYNL Stage</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold" style={{ backgroundColor: accent + "20", color: accent }}>TELEPROMPTER</span>
                </div>

                {/* Song selector */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${border}` }}>
                    <button onClick={prev} disabled={currentIdx === 0} className="disabled:opacity-30"><SkipBack size={14} /></button>
                    <select value={currentIdx} onChange={e => setCurrentIdx(Number(e.target.value))}
                        className="text-xs font-bold bg-transparent focus:outline-none px-2"
                        style={{ color: fg }}>
                        {SETLIST.map((s, i) => (
                            <option key={s.id} value={i} style={{ backgroundColor: darkMode ? "#111" : "#fff" }}>
                                {i + 1}. {s.title}
                            </option>
                        ))}
                    </select>
                    <button onClick={next} disabled={currentIdx === SETLIST.length - 1} className="disabled:opacity-30"><SkipForward size={14} /></button>
                </div>

                {/* Display mode */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: panel }}>
                    {(["lyrics", "chords", "both"] as DisplayMode[]).map(m => (
                        <button key={m} onClick={() => setDisplayMode(m)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize transition-all"
                            style={displayMode === m ? { backgroundColor: accent, color: "#fff" } : { color: fg, opacity: 0.5 }}>
                            {m}
                        </button>
                    ))}
                </div>

                {/* Font size */}
                <div className="flex items-center gap-1">
                    <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="p-1 rounded opacity-60 hover:opacity-100">
                        <ChevronDown size={14} />
                    </button>
                    <span className="text-xs font-mono w-6 text-center">{fontSize}</span>
                    <button onClick={() => setFontSize(s => Math.min(40, s + 2))} className="p-1 rounded opacity-60 hover:opacity-100">
                        <ChevronUp size={14} />
                    </button>
                </div>

                <button onClick={() => setScrollMode(m => m === "auto" ? "manual" : "auto")}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                    style={{
                        backgroundColor: scrollMode === "auto" ? accent + "20" : panel,
                        border: `1px solid ${scrollMode === "auto" ? accent + "60" : border}`,
                        color: scrollMode === "auto" ? accent : fg,
                    }}>
                    {scrollMode === "auto" ? "⚙️ Auto-Scroll" : "👆 Manual"}
                </button>

                <div className="flex gap-2 ml-auto">
                    <button onClick={() => setShowImport(true)}
                        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                        style={{ backgroundColor: panel, border: `1px solid ${border}`, color: fg }}>
                        <Import size={11} /> Import Chart
                    </button>
                    <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${border}` }}>
                        {darkMode ? <Sun size={13} style={{ color: fg }} /> : <Moon size={13} style={{ color: fg }} />}
                    </button>
                </div>
            </div>

            {/* ── SONG INFO BAR ───────────────────────────────────── */}
            <div className="flex items-center gap-6 px-6 py-3 text-xs" style={{ backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)", borderBottom: `1px solid ${border}` }}>
                <span className="font-black text-base" style={{ color: accent }}>{song.title}</span>
                <div className="flex items-center gap-4 opacity-70">
                    <span>Key: <strong>{song.key}</strong></span>
                    {song.capo > 0 && <span>Capo {song.capo}</span>}
                    <span>♩={song.bpm}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {song.duration}</span>
                </div>
                {displayMode !== "lyrics" && (
                    <div className="flex gap-2 ml-4">
                        {song.chords.map(c => (
                            <span key={c} className="font-bold text-sm px-2 py-0.5 rounded-lg"
                                style={{ backgroundColor: accent + "20", color: accent }}>
                                {c}
                            </span>
                        ))}
                    </div>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] opacity-50">{currentIdx + 1}/{SETLIST.length}</span>
                </div>
            </div>

            {/* ── TELEPROMPTER CONTENT ─────────────────────────────── */}
            <div ref={contentRef} className="flex-1 overflow-y-auto px-10 py-8 font-mono leading-relaxed"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
                {displayMode !== "chords" && (
                    <pre className="whitespace-pre-wrap font-mono" style={{ color: fg, fontFamily: "monospace" }}>
                        {song.lyrics}
                    </pre>
                )}
                {displayMode === "chords" && (
                    <div>
                        <p className="text-2xl font-bold mb-4" style={{ color: accent }}>Chord Chart — {song.title}</p>
                        <div className="flex gap-6 flex-wrap">
                            {song.chords.map(c => (
                                <div key={c} className="text-center">
                                    <div className="w-16 h-20 rounded-xl flex items-center justify-center text-2xl font-black mb-2"
                                        style={{ backgroundColor: accent + "20", color: accent }}>
                                        {c}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── TRANSPORT BAR ───────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: border, backgroundColor: darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)" }}>
                {/* Prev song */}
                <button onClick={prev} disabled={currentIdx === 0}
                    className="flex items-center gap-2 text-xs font-bold disabled:opacity-30 transition-all">
                    <SkipBack size={16} />
                    {currentIdx > 0 ? SETLIST[currentIdx - 1].title : ""}
                </button>

                {/* Play / pause */}
                <button onClick={() => setIsRunning(r => !r)}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${accent}, #f59e0b)`, color: "#000" }}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Next song */}
                <button onClick={next} disabled={currentIdx === SETLIST.length - 1}
                    className="flex items-center gap-2 text-xs font-bold disabled:opacity-30 transition-all">
                    {currentIdx < SETLIST.length - 1 ? SETLIST[currentIdx + 1].title : ""}
                    <SkipForward size={16} />
                </button>
            </div>

            {/* ── IMPORT MODAL ─────────────────────────────────────── */}
            {showImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setShowImport(false)}>
                    <div className="w-full max-w-md mx-4 p-6 rounded-2xl space-y-4" onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: darkMode ? "#111" : "#fff", border: `1px solid ${border}` }}>
                        <div className="flex items-center gap-2">
                            <Guitar size={16} style={{ color: accent }} />
                            <p className="text-sm font-bold" style={{ color: fg }}>Import from Ultimate Guitar</p>
                        </div>
                        <p className="text-xs" style={{ color: darkMode ? "#6b7280" : "#9ca3af" }}>
                            Paste an Ultimate Guitar tab URL or chord chart URL to import the chords and structure directly into your setlist.
                        </p>
                        <input value={importUrl} onChange={e => setImportUrl(e.target.value)}
                            placeholder="https://tabs.ultimate-guitar.com/..."
                            className="w-full text-sm px-4 py-3 rounded-xl focus:outline-none transition-all"
                            style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${border}`, color: fg }} />
                        <div className="flex gap-2 flex-wrap">
                            {["Paste from UG", "Import .txt file", "Import .chordpro"].map(opt => (
                                <button key={opt} className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                                    style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${border}`, color: fg }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: accent + "15", border: `1px solid ${accent}30`, color: accent }}>
                            💡 Pro tip: Ultimate Guitar's public tab URLs can be imported directly. Private or premium tabs require copy-paste.
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowImport(false)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-medium"
                                style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: fg }}>
                                Cancel
                            </button>
                            <button onClick={() => { alert("Import feature coming soon — parsing UG and ChordPro formats."); setShowImport(false); }}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                                style={{ background: `linear-gradient(135deg, ${accent}, #f59e0b)`, color: "#000" }}>
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
