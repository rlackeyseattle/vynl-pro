"use client";

import React from "react";
import { Search, Edit3, Save, X, Music, ChevronRight, Mic2, Activity, Play } from "lucide-react";
import { Song, Setlist } from "@prisma/client";

interface StageManagerProps {
    initialSongs: Song[];
    initialSetlists: any[];
}

export default function StageManager({ initialSongs, initialSetlists }: StageManagerProps) {
    const [songs] = React.useState<Song[]>(initialSongs);
    const [search, setSearch] = React.useState("");
    const [selectedSong, setSelectedSong] = React.useState<Song | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editBuffer, setEditBuffer] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);

    const filteredSongs = songs.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.artist?.toLowerCase().includes(search.toLowerCase())
    );

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
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white selection:bg-vynl-teal/30">
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-vynl-teal rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,242,0.2)]">
                        <Mic2 className="text-black" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter uppercase italic">RTLCC // STAGE</h1>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Universal Score Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {selectedSong && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-vynl-teal">{selectedSong.title}</span>
                            <span className="text-[10px] text-neutral-600">|</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{selectedSong.key || "C"} • {selectedSong.bpm || "--"} BPM</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Library Sidebar */}
                <aside className="w-96 border-r border-white/5 flex flex-col bg-neutral-950">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                            <input
                                type="text"
                                placeholder="SEARCH 441 SONGS..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredSongs.map(song => (
                            <button
                                key={song.id}
                                onClick={() => {
                                    setSelectedSong(song);
                                    setIsEditing(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group ${selectedSong?.id === song.id ? 'bg-vynl-teal/10 border-r-2 border-vynl-teal' : 'border-r-2 border-transparent'}`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${selectedSong?.id === song.id ? 'bg-vynl-teal border-vynl-teal text-black' : 'bg-black border-white/5 text-neutral-600 group-hover:text-vynl-teal'}`}>
                                        <Music size={14} />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[10px] font-black uppercase tracking-widest truncate">{song.title}</p>
                                        <p className="text-[8px] text-neutral-600 uppercase tracking-widest mt-0.5 truncate">{song.artist}</p>
                                    </div>
                                </div>
                                <ChevronRight size={12} className="text-neutral-800 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Viewport */}
                <main className="flex-1 flex flex-col bg-black relative">
                    {!selectedSong ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                            <Activity size={48} className="mb-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-2">Signal Ready</h2>
                            <p className="text-[10px] uppercase tracking-widest">Select a score from the archive to begin transmission</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
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

                            {/* Editor Controls */}
                            <div className="absolute bottom-8 right-8 flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-neutral-800 transition-all"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-vynl-teal text-black text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,242,242,0.3)]"
                                        >
                                            <Save size={14} /> {isSaving ? "Saving..." : "Commit Update"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditToggle}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                    >
                                        <Edit3 size={14} /> In-Line Edit
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

// Simple highlighter for chord markers [G]
function formatChartStrings(text: string) {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            return <span key={i} className="text-vynl-teal font-black inline-block -mt-8 mr-1">{part}</span>;
        }
        return <span key={i}>{part}</span>;
    });
}
