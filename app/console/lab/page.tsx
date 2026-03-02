"use client";

import React, { useState } from "react";
import ConsoleTopBar from "@/components/console/ConsoleTopBar";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wand2, Disc, Brain, ListMusic,
    Sparkles, Send, Copy, RefreshCw, Download,
    Sliders, Volume2, ArrowRight, Zap, Music2, Clock
} from "lucide-react";

type LabTab = "lyrics" | "mastering" | "setlist" | "songgen";

export default function LabPage() {
    const [activeTab, setActiveTab] = useState<LabTab>("lyrics");
    const [lyricPrompt, setLyricPrompt] = useState("");
    const [lyricOutput, setLyricOutput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [masteringPreset, setMasteringPreset] = useState("balanced");

    const TABS = [
        { id: "lyrics" as const, label: "Lyric Assist", icon: Wand2 },
        { id: "mastering" as const, label: "AI Mastering", icon: Disc },
        { id: "setlist" as const, label: "Smart Setlists", icon: ListMusic },
        { id: "songgen" as const, label: "Song Gen", icon: Brain },
    ];

    const handleGenerateLyrics = () => {
        if (!lyricPrompt.trim()) return;
        setIsGenerating(true);
        // Simulate AI response
        setTimeout(() => {
            setLyricOutput(
                `Midnight drives through neon rain
Headlights paint the windowpane
You left your ghost inside my car
A phantom riding, near and far

[Chorus]
We were electric, we were wild
Running like a reckless child
Through the fire, through the flame
Nothing ever felt the same

Echoes linger on the dash
Memories burning into ash
But the road keeps pulling me
Past the places we used to be`
            );
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen">
            <ConsoleTopBar zoneName="THE LAB" zoneDescription="AI Production Studio" />

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
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden border-t border-white/10">
                <AnimatePresence mode="wait">
                    {/* LYRIC ASSIST */}
                    {activeTab === "lyrics" && (
                        <motion.div key="lyrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full flex">
                            {/* Input side */}
                            <div className="flex-1 flex flex-col border-r border-white/5 p-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-4 flex items-center gap-2">
                                    <Sparkles size={12} className="text-violet-400" /> Prompt
                                </h3>
                                <textarea
                                    value={lyricPrompt}
                                    onChange={(e) => setLyricPrompt(e.target.value)}
                                    placeholder="Describe the mood, theme, or provide a seed lyric..."
                                    rows={6}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400/30 transition-all resize-none mb-4"
                                />
                                <div className="flex gap-2 mb-6">
                                    {["Verses + Chorus", "Bridge Only", "Hook Ideas", "Full Song"].map((mode) => (
                                        <button key={mode} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-[8px] font-black uppercase tracking-widest text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all">
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleGenerateLyrics}
                                    disabled={isGenerating || !lyricPrompt.trim()}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 disabled:opacity-50 transition-all"
                                >
                                    {isGenerating ? (
                                        <><RefreshCw size={14} className="animate-spin" /> Generating...</>
                                    ) : (
                                        <><Wand2 size={14} /> Generate Lyrics</>
                                    )}
                                </button>
                            </div>

                            {/* Output side */}
                            <div className="flex-1 flex flex-col p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Output</h3>
                                    {lyricOutput && (
                                        <div className="flex items-center gap-2">
                                            <button title="Copy" className="p-2 rounded-lg text-neutral-600 hover:text-violet-400 hover:bg-white/[0.04] transition-all">
                                                <Copy size={14} />
                                            </button>
                                            <button title="Regenerate" onClick={handleGenerateLyrics} className="p-2 rounded-lg text-neutral-600 hover:text-violet-400 hover:bg-white/[0.04] transition-all">
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-6 overflow-y-auto">
                                    {lyricOutput ? (
                                        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-neutral-300">{lyricOutput}</pre>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                                            <Wand2 size={32} className="mb-4" />
                                            <p className="text-[10px] uppercase tracking-widest">AI-generated lyrics will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI MASTERING */}
                    {activeTab === "mastering" && (
                        <motion.div key="mastering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full overflow-y-auto p-8 space-y-6">
                            {/* Upload Area */}
                            <div className="p-12 rounded-2xl border-2 border-dashed border-white/10 hover:border-violet-400/30 transition-colors text-center cursor-pointer">
                                <Volume2 size={32} className="text-neutral-600 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Drop an audio file here</p>
                                <p className="text-[8px] text-neutral-700 uppercase tracking-widest">WAV, FLAC, or MP3 • Max 100MB</p>
                            </div>

                            {/* Presets */}
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-4">Mastering Preset</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { id: "balanced", label: "Balanced", desc: "Natural, warm" },
                                        { id: "loud", label: "Loud", desc: "Maximized, punchy" },
                                        { id: "warm", label: "Warm", desc: "Analog, vintage" },
                                        { id: "bright", label: "Bright", desc: "Crisp, airy" },
                                    ].map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => setMasteringPreset(preset.id)}
                                            className={`p-4 rounded-xl border text-left transition-all
                                                ${masteringPreset === preset.id
                                                    ? "border-violet-400/50 bg-violet-400/10"
                                                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">{preset.label}</p>
                                            <p className="text-[8px] text-neutral-600">{preset.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="grid grid-cols-3 gap-6">
                                <SliderControl label="Loudness" value={75} color="violet" />
                                <SliderControl label="Stereo Width" value={60} color="violet" />
                                <SliderControl label="Low End" value={50} color="violet" />
                            </div>

                            <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 transition-all mx-auto">
                                <Zap size={14} /> Master Track
                            </button>
                        </motion.div>
                    )}

                    {/* SMART SETLISTS */}
                    {activeTab === "setlist" && (
                        <motion.div key="setlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full overflow-y-auto p-8 space-y-6 max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <Brain size={32} className="text-violet-400 mx-auto mb-4" />
                                <h3 className="text-sm font-black uppercase tracking-widest mb-2">AI Setlist Generator</h3>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Build the perfect setlist based on your library</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Venue Type</label>
                                        <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-violet-400/30">
                                            <option>Bar / Pub</option>
                                            <option>Jazz Club</option>
                                            <option>Concert Hall</option>
                                            <option>Private Event</option>
                                            <option>Outdoor Festival</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Set Length</label>
                                        <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-violet-400/30">
                                            <option>30 min</option>
                                            <option>45 min</option>
                                            <option>60 min</option>
                                            <option>90 min</option>
                                            <option>2 hours</option>
                                            <option>3 hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Mood / Energy</label>
                                    <div className="flex gap-2">
                                        {["Chill", "Building", "High Energy", "Varied", "Intimate"].map((mood) => (
                                            <button key={mood} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-[8px] font-black uppercase tracking-widest text-neutral-500 hover:text-white hover:border-violet-400/30 transition-all">
                                                {mood}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 transition-all mt-4">
                                    <Brain size={14} /> Generate Setlist
                                </button>
                            </div>

                            {/* Example generated setlist */}
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-violet-400">Generated: Jazz Club 60 min</h4>
                                    <div className="flex items-center gap-2">
                                        <button title="Save to Woodshed" className="p-2 rounded-lg text-neutral-600 hover:text-violet-400 hover:bg-white/[0.04] transition-all">
                                            <Download size={14} />
                                        </button>
                                        <button title="Regenerate" className="p-2 rounded-lg text-neutral-600 hover:text-violet-400 hover:bg-white/[0.04] transition-all">
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>
                                </div>
                                {[
                                    { title: "Blue Bossa", bpm: 140, key: "Cm" },
                                    { title: "Autumn Leaves", bpm: 120, key: "Gm" },
                                    { title: "Take Five", bpm: 170, key: "Ebm" },
                                    { title: "So What", bpm: 138, key: "Dm" },
                                    { title: "Misty", bpm: 80, key: "Eb" },
                                    { title: "All The Things You Are", bpm: 130, key: "Ab" },
                                    { title: "Solar", bpm: 160, key: "Cm" },
                                    { title: "Round Midnight", bpm: 65, key: "Ebm" },
                                ].map((song, i) => (
                                    <div key={song.title} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-b-0">
                                        <span className="text-[8px] font-mono text-neutral-700 w-4 text-right">{i + 1}</span>
                                        <Music2 size={12} className="text-violet-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest flex-1">{song.title}</span>
                                        <span className="text-[8px] text-neutral-600 font-mono">{song.key}</span>
                                        <span className="text-[8px] text-neutral-700 font-mono">{song.bpm} BPM</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* SONG GEN */}
                    {activeTab === "songgen" && (
                        <motion.div key="songgen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center p-12">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-6 border border-violet-400/10">
                                    <Brain size={40} className="text-violet-400" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-3">AI Song Generation</h3>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-8 max-w-md">
                                    Generate full instrumental demos from text prompts. Coming soon — powered by custom models trained on your style.
                                </p>
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-400 text-[9px] font-black uppercase tracking-widest">
                                        Coming Soon
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-neutral-500 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">
                                        Join Waitlist
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-components

function SliderControl({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
                <span className="text-[9px] font-mono text-neutral-400">{value}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-${color}-400 rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
