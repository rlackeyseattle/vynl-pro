"use client";

import React, { useState, useEffect } from "react";
import ConsoleTopBar from "@/components/console/ConsoleTopBar";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Library, ListMusic, Gauge,
    Music, ChevronRight, Edit3, Save, X, Activity,
    ArrowUpDown, Filter, Hash, Clock, Zap, BarChart3,
    GripVertical, Plus, Trash2, Play
} from "lucide-react";

interface SongData {
    id: string;
    title: string;
    artist: string | null;
    genre: string | null;
    bpm: number | null;
    key: string | null;
    chartData: string | null;
    createdAt: string;
}

interface SetlistData {
    id: string;
    name: string;
    description: string | null;
    songs: { id: string; order: number; song: SongData }[];
}

type WoodshedTab = "library" | "chart" | "setlists";
type SortField = "title" | "artist" | "genre" | "bpm" | "key";
type SortDir = "asc" | "desc";

export default function WoodshedPage() {
    const [activeTab, setActiveTab] = useState<WoodshedTab>("library");
    const [songs, setSongs] = useState<SongData[]>([]);
    const [setlists, setSetlists] = useState<SetlistData[]>([]);
    const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("title");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [isEditing, setIsEditing] = useState(false);
    const [editBuffer, setEditBuffer] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch songs and setlists
    useEffect(() => {
        Promise.all([
            fetch("/api/songs").then(r => r.json()),
            fetch("/api/songs").then(r => r.json()), // will add setlists endpoint
        ]).then(([songsData]) => {
            setSongs(Array.isArray(songsData) ? songsData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Filter and sort songs
    const filteredSongs = songs
        .filter(s =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.artist?.toLowerCase().includes(search.toLowerCase()) ||
            s.genre?.toLowerCase().includes(search.toLowerCase()) ||
            s.key?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const aVal = (a[sortField] ?? "").toString().toLowerCase();
            const bVal = (b[sortField] ?? "").toString().toLowerCase();
            if (sortField === "bpm") {
                return sortDir === "asc" ? (a.bpm || 0) - (b.bpm || 0) : (b.bpm || 0) - (a.bpm || 0);
            }
            return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

    // Stats
    const genreCount = new Set(songs.map(s => s.genre).filter(Boolean)).size;
    const avgBpm = songs.length > 0
        ? Math.round(songs.reduce((sum, s) => sum + (s.bpm || 0), 0) / songs.filter(s => s.bpm).length)
        : 0;
    const keyCount = new Set(songs.map(s => s.key).filter(Boolean)).size;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const handleSelectSong = (song: SongData) => {
        setSelectedSong(song);
        setIsEditing(false);
        setActiveTab("chart");
    };

    const handleEditToggle = () => {
        if (selectedSong) {
            setEditBuffer(selectedSong.chartData || "");
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!selectedSong) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/songs/${selectedSong.id}/chart`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chartData: editBuffer }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedSong(updated);
                setSongs(prev => prev.map(s => s.id === updated.id ? { ...s, chartData: updated.chartData } : s));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const TABS = [
        { id: "library" as const, label: "Library", icon: Library, count: songs.length },
        { id: "chart" as const, label: "Chart", icon: Music },
        { id: "setlists" as const, label: "Setlists", icon: ListMusic },
    ];

    return (
        <div className="flex flex-col h-screen">
            <ConsoleTopBar zoneName="THE WOODSHED" zoneDescription="Rehearsal Room" />

            {/* Tab Bar */}
            <div className="flex items-center gap-1 px-8 pt-4 pb-0">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-[9px] font-black uppercase tracking-widest transition-all
                            ${activeTab === tab.id
                                ? "bg-white/[0.06] text-white border-t border-x border-white/10"
                                : "text-neutral-600 hover:text-neutral-400"
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="text-[7px] px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-400 font-mono ml-1">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden border-t border-white/10">
                <AnimatePresence mode="wait">
                    {activeTab === "library" && (
                        <motion.div
                            key="library"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full flex flex-col"
                        >
                            {/* Stats row */}
                            <div className="flex items-center gap-6 px-8 py-4 border-b border-white/5">
                                <Stat icon={<Music size={12} />} label="Songs" value={songs.length.toString()} />
                                <Stat icon={<Hash size={12} />} label="Genres" value={genreCount.toString()} />
                                <Stat icon={<Zap size={12} />} label="Avg BPM" value={avgBpm.toString()} />
                                <Stat icon={<BarChart3 size={12} />} label="Keys" value={keyCount.toString()} />

                                <div className="flex-1" />

                                {/* Search */}
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={13} />
                                    <input
                                        type="text"
                                        placeholder="Search songs..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-9 pr-4 py-2
                                            text-[10px] font-black uppercase tracking-widest
                                            focus:outline-none focus:border-amber-400/30 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-8 py-3 border-b border-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600">
                                <SortHeader label="Title" field="title" span={4} current={sortField} dir={sortDir} onSort={handleSort} />
                                <SortHeader label="Artist" field="artist" span={3} current={sortField} dir={sortDir} onSort={handleSort} />
                                <SortHeader label="Genre" field="genre" span={2} current={sortField} dir={sortDir} onSort={handleSort} />
                                <SortHeader label="BPM" field="bpm" span={1} current={sortField} dir={sortDir} onSort={handleSort} />
                                <SortHeader label="Key" field="key" span={2} current={sortField} dir={sortDir} onSort={handleSort} />
                            </div>

                            {/* Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <span className="text-[10px] text-neutral-700 uppercase tracking-widest animate-pulse">Loading library...</span>
                                    </div>
                                ) : filteredSongs.length === 0 ? (
                                    <div className="flex items-center justify-center py-20">
                                        <span className="text-[10px] text-neutral-700 uppercase tracking-widest">No songs found</span>
                                    </div>
                                ) : (
                                    filteredSongs.map((song, i) => (
                                        <button
                                            key={song.id}
                                            onClick={() => handleSelectSong(song)}
                                            className={`w-full grid grid-cols-12 gap-4 px-8 py-3 text-left border-b border-white/[0.03]
                                                hover:bg-amber-400/[0.03] transition-all group
                                                ${selectedSong?.id === song.id ? "bg-amber-400/[0.05]" : ""}`}
                                        >
                                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                                                <span className="text-[8px] text-neutral-700 font-mono w-5 text-right flex-shrink-0">{i + 1}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest truncate group-hover:text-amber-400 transition-colors">
                                                    {song.title}
                                                </span>
                                            </div>
                                            <div className="col-span-3 text-[10px] text-neutral-500 uppercase tracking-widest truncate">
                                                {song.artist || "—"}
                                            </div>
                                            <div className="col-span-2">
                                                {song.genre && (
                                                    <span className="text-[8px] px-2 py-1 rounded-md bg-white/[0.04] text-neutral-400 uppercase tracking-widest">
                                                        {song.genre}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-1 text-[10px] text-neutral-500 font-mono">
                                                {song.bpm || "—"}
                                            </div>
                                            <div className="col-span-2 flex items-center justify-between">
                                                <span className="text-[10px] text-neutral-500 font-mono">{song.key || "—"}</span>
                                                <ChevronRight size={12} className="text-neutral-800 group-hover:text-amber-400 transition-colors" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "chart" && (
                        <motion.div
                            key="chart"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full flex flex-col"
                        >
                            {!selectedSong ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                                    <Activity size={48} className="mb-6" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-2">No Chart Selected</h2>
                                    <p className="text-[10px] uppercase tracking-widest">Select a song from the Library tab</p>
                                </div>
                            ) : (
                                <>
                                    {/* Chart header */}
                                    <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
                                        <div>
                                            <h2 className="text-sm font-black uppercase tracking-widest">{selectedSong.title}</h2>
                                            <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">
                                                {selectedSong.artist || "Unknown"} · {selectedSong.key || "?"} · {selectedSong.bpm || "—"} BPM · {selectedSong.genre || ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-widest uppercase hover:bg-neutral-800 transition-all"
                                                    >
                                                        <X size={12} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={isSaving}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-black text-[9px] font-black tracking-widest uppercase hover:bg-amber-300 transition-all disabled:opacity-50"
                                                    >
                                                        <Save size={12} /> {isSaving ? "Saving..." : "Save"}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={handleEditToggle}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-[9px] font-black tracking-widest uppercase hover:bg-white/10 transition-all"
                                                >
                                                    <Edit3 size={12} /> Edit Chart
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Chart content */}
                                    <div className="flex-1 overflow-y-auto px-12 py-8">
                                        {isEditing ? (
                                            <textarea
                                                value={editBuffer}
                                                onChange={(e) => setEditBuffer(e.target.value)}
                                                className="w-full h-full bg-transparent text-white font-mono text-lg leading-relaxed focus:outline-none resize-none"
                                                placeholder="Enter lyrics and chord markers like [G] [Am]..."
                                                spellCheck={false}
                                            />
                                        ) : (
                                            <pre className="font-mono text-xl md:text-2xl leading-[2.5] whitespace-pre-wrap text-neutral-300">
                                                {formatChartStrings(selectedSong.chartData || "")}
                                            </pre>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "setlists" && (
                        <motion.div
                            key="setlists"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full flex flex-col p-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Placeholder setlist cards */}
                                {["Friday Happy Hour", "Saturday Night", "Jazz Brunch", "Acoustic Set", "Full Band", "Covers Only", "Originals", "Holiday Special", "Open Mic", "Private Event"].map((name, i) => (
                                    <motion.div
                                        key={name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <ListMusic size={16} className="text-amber-400" />
                                            <span className="text-[7px] font-mono text-neutral-600">{Math.floor(Math.random() * 20) + 5} songs</span>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">{name}</p>
                                        <p className="text-[8px] text-neutral-600 uppercase tracking-widest mt-1">
                                            ~{Math.floor(Math.random() * 90) + 30} min
                                        </p>
                                    </motion.div>
                                ))}

                                {/* New setlist button */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="p-5 rounded-2xl border border-dashed border-white/10 hover:border-amber-400/30 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                                >
                                    <Plus size={20} className="text-neutral-600" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">New Setlist</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-components

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-amber-400">{icon}</span>
            <div>
                <p className="text-xs font-black tracking-tight">{value}</p>
                <p className="text-[7px] text-neutral-600 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

function SortHeader({ label, field, span, current, dir, onSort }: {
    label: string; field: SortField; span: number;
    current: SortField; dir: SortDir; onSort: (f: SortField) => void;
}) {
    const isActive = current === field;
    return (
        <button
            onClick={() => onSort(field)}
            className={`col-span-${span} flex items-center gap-1 hover:text-white transition-colors
                ${isActive ? "text-amber-400" : ""}`}
        >
            {label}
            {isActive && <ArrowUpDown size={8} />}
        </button>
    );
}

function formatChartStrings(text: string) {
    if (!text) return <span className="text-neutral-700 text-sm italic">No chart data</span>;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            return <span key={i} className="text-amber-400 font-black inline-block -mt-8 mr-1">{part}</span>;
        }
        return <span key={i}>{part}</span>;
    });
}
