"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Music, ListMusic, ChevronRight, ChevronLeft, ChevronDown,
    Search, Pause, Layout, Monitor,
    ChevronsDown, Plus,
    Hash, AlignLeft, AlignCenter, AlignRight,
    PlusCircle, X, Check, Radio
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

interface SetlistSummary {
    id: string;
    name: string;
    description: string;
    song_count: number;
}

interface Setlist {
    id: string;
    name: string;
    songs: Song[];
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

// --- SECTION COLORS ---
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

type SortField = 'name' | 'artist' | 'key' | 'genre' | 'bpm';
type MainTab = 'chart' | 'library';

// --- APP COMPONENT ---
export default function StagePage() {
    const [mainTab, setMainTab] = useState<MainTab>('chart');
    const [library, setLibrary] = useState<Song[]>([]);
    const [setlists, setSetlists] = useState<SetlistSummary[]>([]);
    const [expandedSetlists, setExpandedSetlists] = useState<Record<string, Setlist>>({});
    const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [fontSize, setFontSize] = useState(1.6);
    const [isPresenterMode, setPresenterMode] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Auto-scroll
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(30);
    const scrollSpeedRef = useRef(30);
    const scrollRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const scrollAccumRef = useRef(0);

    // Alignment
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

    // Transpose & Capo
    const [transpose, setTranspose] = useState(0);
    const [capo, setCapo] = useState(0);
    const [useFlats, setUseFlats] = useState(false);
    const [nashvilleMode, setNashvilleMode] = useState(false);

    // Library sorting & search
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [libSearch, setLibSearch] = useState('');

    const totalShift = transpose - capo;

    const effectiveKey = (() => {
        if (!currentSong?.key) return null;
        const parsed = parseChordRoot(currentSong.key);
        if (!parsed) return null;
        return transposeNote(parsed.root, totalShift, useFlats);
    })();

    useEffect(() => {
        setTranspose(0);
        setCapo(0);
        setIsScrolling(false);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [currentSong?.id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsRes, listsRes] = await Promise.all([
                    axios.get('/api/songs'),
                    axios.get('/api/setlists')
                ]);
                setLibrary(songsRes.data);
                setSetlists(listsRes.data);
                if (songsRes.data.length > 0) setCurrentSong(songsRes.data[0]);
            } catch (err) {
                console.error("Failed to fetch VYNL data", err);
            }
        };
        fetchData();
    }, []);

    // Scroll engine
    useEffect(() => { scrollSpeedRef.current = scrollSpeed; }, [scrollSpeed]);

    const scrollLoopFn = useRef<((ts: number) => void) | undefined>(undefined);
    scrollLoopFn.current = (timestamp: number) => {
        if (!scrollRef.current) return;
        if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;
        scrollAccumRef.current += scrollSpeedRef.current * delta;
        if (scrollAccumRef.current >= 1) {
            const px = Math.floor(scrollAccumRef.current);
            scrollRef.current.scrollTop += px;
            scrollAccumRef.current -= px;
        }
        const el = scrollRef.current;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            setIsScrolling(false);
            return;
        }
        animFrameRef.current = requestAnimationFrame((ts) => scrollLoopFn.current?.(ts));
    };

    const toggleScroll = () => {
        if (isScrolling) {
            cancelAnimationFrame(animFrameRef.current);
            setIsScrolling(false);
        } else {
            setIsScrolling(true);
            lastTimeRef.current = 0;
            scrollAccumRef.current = 0;
            animFrameRef.current = requestAnimationFrame((ts) => scrollLoopFn.current?.(ts));
        }
    };

    useEffect(() => () => cancelAnimationFrame(animFrameRef.current), []);

    // Setlist operations
    const toggleSetlistExpand = async (id: string) => {
        if (expandedSetlists[id]) {
            const copy = { ...expandedSetlists };
            delete copy[id];
            setExpandedSetlists(copy);
        } else {
            try {
                const res = await axios.get(`/api/setlists/${id}`);
                setExpandedSetlists({ ...expandedSetlists, [id]: res.data });
            } catch (err) { console.error("Failed to load setlist", err); }
        }
    };

    const loadSetlistForPlayback = async (id: string) => {
        try {
            const res = await axios.get(`/api/setlists/${id}`);
            setSelectedSetlist(res.data);
            if (res.data.songs.length > 0) setCurrentSong(res.data.songs[0]);
            setMainTab('chart');
        } catch (err) { console.error("Load Setlist Failed", err); }
    };

    const openSongFromLibrary = (song: Song) => {
        setCurrentSong(song);
        setMainTab('chart');
    };

    const handleNext = () => {
        if (!selectedSetlist || !currentSong) return;
        const idx = selectedSetlist.songs.findIndex(s => s.id === currentSong.id);
        if (idx < selectedSetlist.songs.length - 1) setCurrentSong(selectedSetlist.songs[idx + 1]);
    };

    const handlePrev = () => {
        if (!selectedSetlist || !currentSong) return;
        const idx = selectedSetlist.songs.findIndex(s => s.id === currentSong.id);
        if (idx > 0) setCurrentSong(selectedSetlist.songs[idx - 1]);
    };

    const filteredLibrary = library
        .filter(s =>
            s.name.toLowerCase().includes(libSearch.toLowerCase()) ||
            s.artist?.toLowerCase().includes(libSearch.toLowerCase())
        )
        .sort((a, b) => {
            const av = (a[sortField] ?? '') as any;
            const bv = (b[sortField] ?? '') as any;
            if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av;
            const cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' });
            return sortAsc ? cmp : -cmp;
        });

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else { setSortField(field); setSortAsc(true); }
    };

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

            const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
            if (sectionMatch) {
                const st = getSectionType(trimmed);
                if (st) currentColor = SECTION_COLORS[st];
                elements.push(
                    <div key={i} className="chart-section" style={{ '--section-color': currentColor } as React.CSSProperties}>
                        <span className="section-label-text">{sectionMatch[1]}</span>
                    </div>
                );
                i++; continue;
            }

            const plainMatch = trimmed.match(/^(Verse|Chorus|Bridge|Outro|Intro|Solo|Pre-Chorus|Interlude|Hook)\s*\d*:?\s*$/i);
            if (plainMatch) {
                const st = getSectionType(trimmed);
                if (st) currentColor = SECTION_COLORS[st];
                elements.push(
                    <div key={i} className="chart-section" style={{ '--section-color': currentColor } as React.CSSProperties}>
                        <span className="section-label-text">{trimmed.replace(/:$/, '')}</span>
                    </div>
                );
                i++; continue;
            }

            if (isChordLine(line) && i + 1 < lines.length && !isChordLine(lines[i + 1]) && lines[i + 1].trim()) {
                const segs = line.split(/(\[.*?\])/g);
                elements.push(
                    <div key={i} className="chart-paired-line">
                        <div className="chord-row">
                            {segs.map((seg, j) => seg.startsWith('[') && seg.endsWith(']')
                                ? <span key={j} className="chord-tag">{transformChord(seg.slice(1, -1))}</span>
                                : <span key={j} className="chord-space">{seg}</span>
                            )}
                        </div>
                        <div className="lyric-row">{lines[i + 1]}</div>
                    </div>
                );
                i += 2; continue;
            }

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

    // Broadcast Sync
    useEffect(() => {
        if (!isBroadcasting) return;

        const syncInterval = setInterval(async () => {
            try {
                // Get current scroll percentage
                let scrollPct = 0;
                if (scrollRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                    scrollPct = scrollTop / (scrollHeight - clientHeight);
                }

                await axios.post('/api/stage/sync', {
                    songId: currentSong?.id,
                    songKey: currentSong?.key,
                    transpose,
                    capo,
                    nashvilleMode,
                    useFlats,
                    scrollPct,
                    isScrolling,
                    scrollSpeed,
                    alignment
                });
            } catch (err) {
                console.error('Sync failed:', err);
            }
        }, 1000); // 1s sync

        return () => clearInterval(syncInterval);
    }, [isBroadcasting, currentSong, transpose, capo, nashvilleMode, useFlats, isScrolling, scrollSpeed, alignment]);

    return (
        <div className={`stage-container ${isPresenterMode ? 'presenter-mode' : ''}`}>
            {/* --- SIDEBAR --- */}
            <AnimatePresence>
                {isSidebarOpen && !isPresenterMode && (
                    <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="sidebar">
                        <div className="sidebar-header">
                            <h2 className="gradient-text">VYNL STAGE</h2>
                        </div>

                        <div className="sidebar-search">
                            <Search size={14} />
                            <input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>

                        <div className="sidebar-scroll">
                            <div className="setlist-header-row">
                                <span className="section-label">SETLISTS</span>
                            </div>

                            {setlists.map(list => (
                                <div key={list.id} className="setlist-group">
                                    <div className="setlist-header" onClick={() => toggleSetlistExpand(list.id)}>
                                        <ChevronDown size={14} className={`chevron ${expandedSetlists[list.id] ? 'open' : ''}`} />
                                        <span className="setlist-name">{list.name}</span>
                                        <span className="badge">{list.song_count}</span>
                                        <button className="play-btn" onClick={(e) => { e.stopPropagation(); loadSetlistForPlayback(list.id); }} title="Load Setlist">▶</button>
                                    </div>

                                    <AnimatePresence>
                                        {expandedSetlists[list.id] && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="setlist-songs">
                                                {expandedSetlists[list.id].songs.map((song, idx) => (
                                                    <div key={song.id} className={`setlist-song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                                        onClick={() => { setCurrentSong(song); setSelectedSetlist(expandedSetlists[list.id]); setMainTab('chart'); }}>
                                                        <span className="song-num">{idx + 1}</span>
                                                        <div className="song-info">
                                                            <span className="name">{song.name}</span>
                                                            <span className="artist">{song.artist}</span>
                                                        </div>
                                                        <span className="song-key">{song.key || ''}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {searchQuery && (
                                <>
                                    <div className="section-label" style={{ marginTop: 24 }}>RESULTS</div>
                                    {library
                                        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist?.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .slice(0, 20)
                                        .map(song => (
                                            <div key={song.id} className={`setlist-song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                                onClick={() => { setCurrentSong(song); setMainTab('chart'); }}>
                                                <div className="song-info">
                                                    <span className="name">{song.name}</span>
                                                    <span className="artist">{song.artist}</span>
                                                </div>
                                                <span className="song-key">{song.key || ''}</span>
                                            </div>
                                        ))
                                    }
                                </>
                            )}
                        </div>

                        <div className="sidebar-footer">
                            <button onClick={() => setPresenterMode(true)} title="Presenter Mode">
                                <Monitor size={16} /> PRESENT
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <header className="main-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar">
                            <Layout size={20} />
                        </button>

                        <div className="main-tabs">
                            <button className={mainTab === 'chart' ? 'active' : ''} onClick={() => setMainTab('chart')}>Chart</button>
                            <button className={mainTab === 'library' ? 'active' : ''} onClick={() => setMainTab('library')}>
                                <Music size={14} /> Library
                            </button>
                        </div>

                        {mainTab === 'chart' && currentSong && (
                            <div className="current-info">
                                <h1>{currentSong.name}</h1>
                                <p>{currentSong.artist} • {displayedKey} • {currentSong.bpm || '?'} BPM
                                    {capo > 0 && <span className="capo-badge"> • Capo {capo}</span>}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="header-actions">
                        <div className="tool-group">
                            <span className="tool-label">TRANS</span>
                            <button onClick={() => setTranspose(t => t - 1)} title="Down">−</button>
                            <span className={`tool-value ${transpose !== 0 ? 'active' : ''}`}>{transpose > 0 ? `+${transpose}` : transpose}</span>
                            <button onClick={() => setTranspose(t => t + 1)} title="Up">+</button>
                        </div>

                        <div className="tool-group">
                            <span className="tool-label">CAPO</span>
                            <button onClick={() => setCapo(c => Math.max(0, c - 1))} title="Down">−</button>
                            <span className={`tool-value ${capo > 0 ? 'active' : ''}`}>{capo}</span>
                            <button onClick={() => setCapo(c => Math.min(12, c + 1))} title="Up">+</button>
                        </div>

                        <button className={`mode-toggle ${nashvilleMode ? 'active' : ''}`} onClick={() => setNashvilleMode(!nashvilleMode)} title="Nashville"><Hash size={14} /> NSH</button>
                        <button className={`mode-toggle ${useFlats ? 'active' : ''}`} onClick={() => setUseFlats(!useFlats)} title="Flats">♭</button>

                        <button
                            className={`mode-toggle broadcast-toggle ${isBroadcasting ? 'active animate-pulse' : ''}`}
                            onClick={() => setIsBroadcasting(!isBroadcasting)}
                            title={isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
                        >
                            <Radio size={14} /> {isBroadcasting ? 'LIVE' : 'SYNC'}
                        </button>

                        <div className="scroll-controls">
                            <button className={`scroll-toggle ${isScrolling ? 'active' : ''}`} onClick={toggleScroll} title={isScrolling ? 'Pause' : 'Scroll'}>
                                {isScrolling ? <Pause size={14} /> : <ChevronsDown size={14} />}
                            </button>
                            <input type="range" min="1" max="120" value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))} className="speed-slider" title={`Speed: ${scrollSpeed}`} />
                            <span className="speed-label">{scrollSpeed}</span>
                        </div>

                        <div className="align-controls">
                            <button className={alignment === 'left' ? 'active' : ''} onClick={() => setAlignment('left')} title="Left"><AlignLeft size={14} /></button>
                            <button className={alignment === 'center' ? 'active' : ''} onClick={() => setAlignment('center')} title="Center"><AlignCenter size={14} /></button>
                            <button className={alignment === 'right' ? 'active' : ''} onClick={() => setAlignment('right')} title="Right"><AlignRight size={14} /></button>
                        </div>

                        <div className="font-controls">
                            <button onClick={() => setFontSize(f => Math.max(1, f - 0.2))} title="A-">A-</button>
                            <button onClick={() => setFontSize(f => Math.min(4, f + 0.2))} title="A+">A+</button>
                        </div>

                        {isPresenterMode && <button className="exit-btn" onClick={() => setPresenterMode(false)}>EXIT</button>}
                    </div>

                    {mainTab === 'library' && (
                        <div className="library-header-actions">
                            <span className="library-count">{filteredLibrary.length} songs</span>
                        </div>
                    )}
                </header>

                {/* CHART TAB */}
                {mainTab === 'chart' && (
                    <div className="chart-viewer-outer" ref={scrollRef}>
                        <motion.div key={currentSong?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`chart-content align-${alignment}`} style={{ fontSize: `${fontSize}rem` }}>
                            {currentSong ? (
                                <>
                                    <div className="chart-lead-header">
                                        <h2 className="lead-title">{currentSong.name}</h2>
                                        <p className="lead-artist">{currentSong.artist || 'Unknown Artist'}</p>
                                        <div className="lead-meta">
                                            {displayedKey !== '?' && <span className="meta-chip">Key: {displayedKey}</span>}
                                            {currentSong.bpm && <span className="meta-chip">BPM: {currentSong.bpm}</span>}
                                            {capo > 0 && <span className="meta-chip capo-chip">Capo: {capo}</span>}
                                        </div>
                                        <hr className="lead-divider" />
                                    </div>
                                    {parseChart(currentSong.lyrics)}
                                </>
                            ) : (
                                <div className="placeholder">
                                    <Music size={64} className="icon-faint" />
                                    <p>Select a song from the library to begin.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* LIBRARY TAB */}
                {mainTab === 'library' && (
                    <div className="library-view">
                        <div className="library-search-bar">
                            <Search size={16} />
                            <input placeholder="Search by title or artist..." value={libSearch} onChange={e => setLibSearch(e.target.value)} />
                            {libSearch && <button className="clear-search" onClick={() => setLibSearch('')}><X size={14} /></button>}
                        </div>

                        <div className="library-table">
                            <div className="library-table-header">
                                <div className="lib-th num-col">#</div>
                                <button className={`lib-th title-col ${sortField === 'name' ? 'active' : ''}`} onClick={() => handleSort('name')}>
                                    TITLE {sortField === 'name' && <span>{sortAsc ? '↑' : '↓'}</span>}
                                </button>
                                <button className={`lib-th artist-col ${sortField === 'artist' ? 'active' : ''}`} onClick={() => handleSort('artist')}>
                                    ARTIST {sortField === 'artist' && <span>{sortAsc ? '↑' : '↓'}</span>}
                                </button>
                                <button className={`lib-th key-col ${sortField === 'key' ? 'active' : ''}`} onClick={() => handleSort('key')}>
                                    KEY {sortField === 'key' && <span>{sortAsc ? '↑' : '↓'}</span>}
                                </button>
                                <button className={`lib-th bpm-col ${sortField === 'bpm' ? 'active' : ''}`} onClick={() => handleSort('bpm')}>
                                    BPM {sortField === 'bpm' && <span>{sortAsc ? '↑' : '↓'}</span>}
                                </button>
                                <button className={`lib-th genre-col ${sortField === 'genre' ? 'active' : ''}`} onClick={() => handleSort('genre')}>
                                    GENRE {sortField === 'genre' && <span>{sortAsc ? '↑' : '↓'}</span>}
                                </button>
                                <div className="lib-th action-col"></div>
                            </div>

                            <div className="library-table-body">
                                {filteredLibrary.map((song, idx) => (
                                    <div key={song.id} className={`library-table-row ${currentSong?.id === song.id ? 'active' : ''}`}
                                        onClick={() => openSongFromLibrary(song)}>
                                        <div className="lib-td num-col">{idx + 1}</div>
                                        <div className="lib-td title-col">{song.name}</div>
                                        <div className="lib-td artist-col">{song.artist || '—'}</div>
                                        <div className="lib-td key-col">{song.key || '—'}</div>
                                        <div className="lib-td bpm-col">{song.bpm || '—'}</div>
                                        <div className="lib-td genre-col">{song.genre || '—'}</div>
                                        <div className="lib-td action-col">
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
