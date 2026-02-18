"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Music, ListMusic, ChevronRight, ChevronLeft, ChevronDown,
    Search, Pause, Layout, Monitor,
    ChevronsDown, Plus,
    Hash, AlignLeft, AlignCenter, AlignRight,
    PlusCircle, X, Check, Radio, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './stage.css';

// --- TYPES ---
interface Song {
    id: string;
    name: string;
    artist?: string;
    key?: string;
    bpm?: number;
    lyrics: string;
    chords?: string;
    genre?: string;
}

// === MUSIC THEORY ENGINE ===
const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function noteIndex(note: string): number {
    const n = note.replace(/[b#]*$/, '');
    const accidental = note.slice(n.length);
    let idx = NOTES_SHARP.indexOf(n);
    if (idx === -1) idx = NOTES_FLAT.indexOf(n);
    if (idx === -1) {
        idx = NOTES_SHARP.indexOf(note);
        if (idx === -1) idx = NOTES_FLAT.indexOf(note);
        if (idx === -1) return -1;
        return idx;
    }
    if (accidental === '#') idx = (idx + 1) % 12;
    else if (accidental === 'b') idx = (idx + 11) % 12;
    return idx;
}

function transposeNote(note: string, semitones: number, useFlats: boolean = false): string {
    const idx = noteIndex(note);
    if (idx === -1) return note;
    const newIdx = ((idx + semitones) % 12 + 12) % 12;
    return useFlats ? NOTES_FLAT[newIdx] : NOTES_SHARP[newIdx];
}

function parseChordRoot(chord: string): { root: string; quality: string } | null {
    const m = chord.match(/^([A-G][#b]?)(.*)/);
    if (!m) return null;
    return { root: m[1], quality: m[2] };
}

function transposeChord(chord: string, semitones: number, useFlats: boolean = false): string {
    if (semitones === 0) return chord;
    const slashIdx = chord.indexOf('/');
    if (slashIdx > 0) {
        return transposeChord(chord.slice(0, slashIdx), semitones, useFlats) + '/' + transposeChord(chord.slice(slashIdx + 1), semitones, useFlats);
    }
    const parsed = parseChordRoot(chord);
    if (!parsed) return chord;
    return transposeNote(parsed.root, semitones, useFlats) + parsed.quality;
}

function chordToNashville(chord: string, keyRoot: string): string {
    const parsed = parseChordRoot(chord);
    if (!parsed) return chord;
    const keyIdx = noteIndex(keyRoot);
    const chordIdx = noteIndex(parsed.root);
    if (keyIdx === -1 || chordIdx === -1) return chord;
    const interval = ((chordIdx - keyIdx) % 12 + 12) % 12;
    const degreeMap: Record<number, string> = {
        0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
    };
    let degree = degreeMap[interval] || '?';
    const quality = parsed.quality;
    if (quality.startsWith('m') && !quality.startsWith('maj')) {
        degree = degree.toLowerCase();
        const rest = quality.slice(1);
        if (rest) degree += rest;
    } else if (quality.startsWith('dim') || quality.startsWith('°')) {
        degree += '°';
    } else if (quality.startsWith('aug') || quality.startsWith('+')) {
        degree += '+';
    } else {
        degree += quality;
    }
    return degree;
}

const SECTION_COLORS: Record<string, string> = {
    'intro': '#9d50bb', 'verse': '#00d2ff', 'chorus': '#ffbf47', 'bridge': '#ff6b6b',
    'outro': '#9d50bb', 'solo': '#50bb6e', 'pre-chorus': '#ff9f43',
    'interlude': '#a29bfe', 'hook': '#ffbf47',
};

function getSectionType(line: string): string | null {
    const clean = line.replace(/[\[\]]/g, '').trim().toLowerCase();
    for (const key of Object.keys(SECTION_COLORS)) {
        if (clean.startsWith(key)) return key;
    }
    return null;
}

function isChordLine(line: string): boolean {
    const stripped = line.replace(/\[.*?\]/g, '').trim();
    const chordCount = (line.match(/\[/g) || []).length;
    return chordCount >= 1 && stripped.length < 5;
}

// --- DEMO DATA ---
const DEMO_LIBRARY: Song[] = [
    {
        id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', key: 'Bb', bpm: 72,
        lyrics: `[Intro]
Is this the real life?
Is this just fantasy?
Caught in a landslide
No escape from reality

[Verse 1]
[Bb]Mama, just [Gm]killed a man
Put a [Cm]gun against his head
Pulled my [cm7]trigger, now he's [F]dead`
    },
    {
        id: '2', name: 'Hotel California', artist: 'Eagles', key: 'Bm', bpm: 75,
        lyrics: `[Intro]
[Bm] [F#] [A] [E] [G] [D] [Em] [F#]

[Verse 1]
[Bm]On a dark desert highway, [F#]cool wind in my hair
[A]Warm smell of colitas, [E]rising up through the air
[G]Up ahead in the distance, [D]I saw a shimmering light
[Em]My head grew heavy and my sight grew dim, [F#]I had to stop for the night`
    },
    {
        id: '3', name: 'Mr. Brightside', artist: 'The Killers', key: 'Db', bpm: 148,
        lyrics: `[Verse 1]
[C#]Coming out of my cage
And I've been doing just fine
Gotta gotta be down
Because I want it all`
    }
];

export default function DemoStagePage() {
    const [currentSong, setCurrentSong] = useState<Song | null>(DEMO_LIBRARY[0]);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [fontSize, setFontSize] = useState(1.6);

    // Auto-scroll
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(30);
    const scrollRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const scrollAccumRef = useRef(0);

    // Theory
    const [transpose, setTranspose] = useState(0);
    const [capo, setCapo] = useState(0);
    const [useFlats, setUseFlats] = useState(false);
    const [nashvilleMode, setNashvilleMode] = useState(false);
    const totalShift = transpose - capo;

    const effectiveKey = (() => {
        if (!currentSong?.key) return null;
        const parsed = parseChordRoot(currentSong.key);
        if (!parsed) return null;
        return transposeNote(parsed.root, totalShift, useFlats);
    })();

    // Scroll Logic (Simplified for demo)
    const toggleScroll = () => setIsScrolling(!isScrolling);

    useEffect(() => {
        let raf: number;
        const loop = (ts: number) => {
            if (!isScrolling || !scrollRef.current) return;
            if (lastTimeRef.current === 0) lastTimeRef.current = ts;
            const delta = (ts - lastTimeRef.current) / 1000;
            lastTimeRef.current = ts;
            scrollAccumRef.current += scrollSpeed * delta;
            if (scrollAccumRef.current >= 1) {
                scrollRef.current.scrollTop += Math.floor(scrollAccumRef.current);
                scrollAccumRef.current %= 1;
            }
            raf = requestAnimationFrame(loop);
        };
        if (isScrolling) {
            lastTimeRef.current = 0;
            raf = requestAnimationFrame(loop);
        }
        return () => cancelAnimationFrame(raf);
    }, [isScrolling, scrollSpeed]);

    // Helpers
    const transformChord = (chord: string): string => {
        let c = chord;
        if (totalShift !== 0) c = transposeChord(c, totalShift, useFlats);
        if (nashvilleMode && effectiveKey) c = chordToNashville(c, effectiveKey);
        return c;
    };

    const parseChart = (text: string): React.ReactElement[] | null => {
        if (!text) return null;
        const lines = text.split('\n');
        const elements: React.ReactElement[] = [];
        let currentColor = SECTION_COLORS['verse'];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();
            if (!trimmed) { elements.push(<div key={i} className="chart-spacer" />); i++; continue; }

            // Section Headers
            const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/) || trimmed.match(/^(Verse|Chorus|Bridge|Outro|Intro|Solo|Pre-Chorus|Interlude|Hook)\s*\d*:?\s*$/i);
            if (sectionMatch) {
                let st = getSectionType(trimmed);
                if (st) currentColor = SECTION_COLORS[st];
                elements.push(
                    <div key={i} className="chart-section" style={{ '--section-color': currentColor } as React.CSSProperties}>
                        <span className="section-label-text">{trimmed.replace(/[\[\]:]/g, '')}</span>
                    </div>
                );
                i++; continue;
            }

            // Lyric/Chord Lines
            if (line.includes('[')) {
                const segs = line.split(/(\[.*?\])/g);
                elements.push(
                    <div key={i} className="chart-inline-line">
                        {segs.map((seg, j) => seg.startsWith('[') && seg.endsWith(']')
                            ? <span key={j} className="chord-tag">{transformChord(seg.slice(1, -1))}</span>
                            : <span key={j} className="lyric-seg">{seg}</span>
                        )}
                    </div>
                );
                i++; continue;
            }

            elements.push(<div key={i} className="chart-line">{line}</div>);
            i++;
        }
        return elements;
    };

    const displayedKey = (() => {
        if (!currentSong?.key) return '?';
        if (totalShift === 0) return currentSong.key;
        const parsed = parseChordRoot(currentSong.key);
        if (!parsed) return currentSong.key;
        return transposeNote(parsed.root, totalShift, useFlats) + parsed.quality;
    })();

    return (
        <div className="stage-container">
            {/* Banner */}
            <div className="absolute top-0 left-0 w-full bg-blue-600/20 text-blue-200 text-xs font-bold text-center py-1 z-50 border-b border-blue-500/30 flex items-center justify-center gap-2">
                <Info size={14} /> DEMO MODE: Accessing Public Library. Sign in for personal charts.
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} className="sidebar pt-8">
                        <div className="sidebar-header">
                            <h2 className="gradient-text">VYNL STAGE // DEMO</h2>
                        </div>
                        <div className="sidebar-scroll">
                            <div className="section-label">POPULAR TRACKS</div>
                            {DEMO_LIBRARY.map((song) => (
                                <div key={song.id} className={`setlist-song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                    onClick={() => setCurrentSong(song)}>
                                    <div className="song-info">
                                        <span className="name">{song.name}</span>
                                        <span className="artist">{song.artist}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="main-content pt-8">
                <header className="main-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <Layout size={20} />
                        </button>
                        {currentSong && (
                            <div className="current-info">
                                <h1>{currentSong.name}</h1>
                                <p>{currentSong.artist} • {displayedKey} • {currentSong.bpm} BPM
                                    {capo > 0 && <span className="capo-badge"> • Capo {capo}</span>}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="header-actions">
                        <div className="tool-group">
                            <span className="tool-label">TRANS</span>
                            <button onClick={() => setTranspose(t => t - 1)}>−</button>
                            <span className={`tool-value ${transpose !== 0 ? 'active' : ''}`}>{transpose > 0 ? `+${transpose}` : transpose}</span>
                            <button onClick={() => setTranspose(t => t + 1)}>+</button>
                        </div>
                        <button className={`mode-toggle ${nashvilleMode ? 'active' : ''}`} onClick={() => setNashvilleMode(!nashvilleMode)} title="Nashville"><Hash size={14} /> NSH</button>

                        <div className="scroll-controls">
                            <button className={`scroll-toggle ${isScrolling ? 'active' : ''}`} onClick={toggleScroll}>
                                {isScrolling ? <Pause size={14} /> : <ChevronsDown size={14} />}
                            </button>
                            <input type="range" min="1" max="120" value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))} className="speed-slider" />
                        </div>

                        <div className="font-controls">
                            <button onClick={() => setFontSize(f => Math.max(1, f - 0.2))}>A-</button>
                            <button onClick={() => setFontSize(f => Math.min(4, f + 0.2))}>A+</button>
                        </div>
                    </div>
                </header>

                <div className="chart-viewer-outer" ref={scrollRef}>
                    <motion.div key={currentSong?.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="chart-content" style={{ fontSize: `${fontSize}rem` }}>
                        {currentSong && parseChart(currentSong.lyrics)}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
