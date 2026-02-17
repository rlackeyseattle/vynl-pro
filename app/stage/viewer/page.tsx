"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Radio, Music, Music2, Hash, ChevronUp, ChevronDown } from 'lucide-react';
import '../stage.css';

interface Song {
    id: string;
    name: string;
    artist?: string;
    lyrics: string;
}

// Minimal music theory for viewer
const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function noteIndex(note: string): number {
    const n = note.replace(/[b#]*$/, '');
    const accidental = note.slice(n.length);
    let idx = NOTES_SHARP.indexOf(n);
    if (idx === -1) idx = NOTES_FLAT.indexOf(n);
    if (idx === -1) return -1;
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

function transposeChord(chord: string, semitones: number, useFlats: boolean = false): string {
    const slashIdx = chord.indexOf('/');
    if (slashIdx > 0) {
        return transposeChord(chord.slice(0, slashIdx), semitones, useFlats) + '/' + transposeChord(chord.slice(slashIdx + 1), semitones, useFlats);
    }
    const m = chord.match(/^([A-G][#b]?)(.*)/);
    if (!m) return chord;
    return transposeNote(m[1], semitones, useFlats) + m[2];
}

function chordToNashville(chord: string, keyRoot: string): string {
    const m = chord.match(/^([A-G][#b]?)(.*)/);
    if (!m) return chord;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndexFull = (n: string) => {
        let idx = notes.indexOf(n);
        if (idx === -1) {
            const map: any = { 'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10 };
            idx = map[n] ?? -1;
        }
        return idx;
    };

    const keyIdx = noteIndexFull(keyRoot);
    const chordIdx = noteIndexFull(m[1]);
    if (keyIdx === -1 || chordIdx === -1) return chord;

    const interval = ((chordIdx - keyIdx) % 12 + 12) % 12;
    const degreeMap: Record<number, string> = {
        0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
    };
    let degree = degreeMap[interval] || '?';
    const quality = m[2];
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

export default function ViewerPage() {
    const [state, setState] = useState<any>(null);
    const [songs, setSongs] = useState<Record<string, Song>>({});
    const scrollRef = useRef<HTMLDivElement>(null);

    // Local Overrides
    const [localTranspose, setLocalTranspose] = useState(0);
    const [localCapo, setLocalCapo] = useState(0);
    const [localNashville, setLocalNashville] = useState(false);
    const [localUseFlats, setLocalUseFlats] = useState(false);

    // Initial load
    useEffect(() => {
        axios.get('/api/songs').then(res => {
            const map: Record<string, Song> = {};
            res.data.forEach((s: Song) => map[s.id] = s);
            setSongs(map);
        });
    }, []);

    // Polling
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get('/api/stage/sync');
                setState((prev: any) => {
                    // Sync scroll if host moved
                    if (res.data.scrollPct !== undefined && scrollRef.current) {
                        const { scrollHeight, clientHeight } = scrollRef.current;
                        const targetScroll = res.data.scrollPct * (scrollHeight - clientHeight);
                        // Smoothly scroll to target
                        scrollRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                    return res.data;
                });
            } catch (err) {
                console.error('Poll failed:', err);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const currentSong = state?.songId ? songs[state.songId] : null;

    if (!state) return (
        <div className="stage-container flex flex-col items-center justify-center bg-[#0a0a0a] text-white h-screen">
            <Radio size={48} className="animate-pulse text-[#ff4b2b] mb-4" />
            <p className="text-xl font-medium">Waiting for Host to start broadcasting...</p>
        </div>
    );

    return (
        <div className="stage-container viewer-mode">
            <header className="main-header" style={{ padding: '10px 20px', justifyContent: 'space-between' }}>
                <div className="song-info">
                    {currentSong ? (
                        <>
                            <h2 className="text-lg font-bold">{currentSong.name}</h2>
                            <p className="text-xs text-gray-400">{currentSong.artist}</p>
                        </>
                    ) : (
                        <h2 className="text-lg font-bold">Waiting for song...</h2>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {/* Local Overrides Toolbar */}
                    <div className="flex items-center gap-2 bg-[#111] border border-white/5 rounded-lg px-2 py-1">
                        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                            <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Pitch</span>
                            <button onClick={() => setLocalTranspose(prev => prev - 1)} className="p-1 hover:bg-white/5 rounded" title="Lower Pitch"><ChevronDown size={14} /></button>
                            <span className="text-xs font-mono w-6 text-center text-blue-400">{localTranspose > 0 ? '+' : ''}{localTranspose}</span>
                            <button onClick={() => setLocalTranspose(prev => prev + 1)} className="p-1 hover:bg-white/5 rounded" title="Raise Pitch"><ChevronUp size={14} /></button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                            <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Capo</span>
                            <button onClick={() => setLocalCapo(prev => Math.max(0, prev - 1))} className="p-1 hover:bg-white/5 rounded" title="Lower Capo"><ChevronDown size={14} /></button>
                            <span className="text-xs font-mono w-4 text-center text-amber-500">{localCapo}</span>
                            <button onClick={() => setLocalCapo(prev => prev + 1)} className="p-1 hover:bg-white/5 rounded" title="Raise Capo"><ChevronUp size={14} /></button>
                        </div>

                        <button
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors ${localNashville ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setLocalNashville(!localNashville)}
                            title="Toggle Nashville Number System"
                        >
                            <Hash size={12} /> NSH
                        </button>

                        <button
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors ${localUseFlats ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setLocalUseFlats(!localUseFlats)}
                            title="Toggle Flats/Sharps"
                        >
                            ♭
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-full text-red-500 text-xs font-bold animate-pulse">
                        <Radio size={12} /> LIVE FROM HOST
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div
                    ref={scrollRef}
                    className="chart-viewer"
                    style={{
                        fontSize: '1.8rem',
                        textAlign: state.alignment || 'left',
                        padding: '40px'
                    }}
                >
                    {currentSong?.lyrics.split('\n').map((line, i) => {
                        const isSection = line.trim().startsWith('[') && line.trim().endsWith(']');
                        if (isSection) {
                            return (
                                <div key={i} className="section-header" style={{ marginTop: '30px', borderLeft: '4px solid #ff4b2b', paddingLeft: '15px' }}>
                                    {line.replace(/[\[\]]/g, '')}
                                </div>
                            );
                        }

                        // Combined rendering logic
                        const parts = line.split(/(\[.*?\])/);
                        const hostShift = (state.transpose || 0) - (state.capo || 0);
                        const totalShift = hostShift + localTranspose - localCapo;
                        const useFlats = localUseFlats || state.useFlats;

                        // Calculate effective key for Nashville
                        const baseKey = state.songKey || 'C'; // Fallback to C if not provided
                        const currentKeyRoot = transposeNote(baseKey, hostShift + localTranspose, useFlats);

                        return (
                            <div key={i} className="lyric-row" style={{ marginBottom: '8px' }}>
                                {parts.map((p, j) => {
                                    if (p.startsWith('[') && p.endsWith(']')) {
                                        const chord = p.slice(1, -1);
                                        let displayChord = transposeChord(chord, totalShift, useFlats);

                                        if (localNashville) {
                                            displayChord = chordToNashville(displayChord, currentKeyRoot);
                                        }

                                        return <span key={j} className="chord-tag">{displayChord}</span>;
                                    }
                                    return <span key={j}>{p}</span>;
                                })}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
