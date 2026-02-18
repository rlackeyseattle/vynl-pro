"use client";

import React from 'react';
import { Activity, BarChart2, Zap, Radio, Maximize2, Settings } from 'lucide-react';

export default function AnalyzePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">

            {/* Header */}
            <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3 text-cyan-500">
                    <Activity size={24} />
                    <h1 className="text-xl font-bold tracking-widest uppercase">Analyze // Spectrum</h1>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> SOURCE: INPUT 1</span>
                    <span>48kHz / 24bit</span>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

                {/* Main Visualizer */}
                <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded"><Maximize2 size={16} className="text-neutral-500" /></button>
                        <button className="p-2 hover:bg-white/10 rounded"><Settings size={16} className="text-neutral-500" /></button>
                    </div>

                    {/* Fake Spectrum Graph */}
                    <div className="flex-1 flex items-end justify-between px-8 pb-0 gap-1 opacity-80">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className="w-full bg-gradient-to-t from-cyan-900/20 to-cyan-500 rounded-t-sm animate-pulse"
                                style={{
                                    height: `${Math.random() * 80 + 10}%`,
                                    animationDuration: `${Math.random() * 0.5 + 0.2}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Frequency Labels */}
                    <div className="h-8 border-t border-white/5 flex justify-between px-8 items-center text-[10px] text-neutral-600">
                        <span>20Hz</span>
                        <span>100Hz</span>
                        <span>500Hz</span>
                        <span>1kHz</span>
                        <span>5kHz</span>
                        <span>10kHz</span>
                        <span>20kHz</span>
                    </div>
                </div>

                {/* Metrics Sidebar */}
                <div className="grid grid-rows-3 gap-6">
                    {/* Loudness */}
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-2"><BarChart2 size={14} /> Integrated LUFS</h3>
                        <div className="text-5xl font-bold text-white tabular-nums">-14.2</div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[70%]" />
                        </div>
                    </div>

                    {/* True Peak */}
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-2"><Zap size={14} /> True Peak</h3>
                        <div className="text-5xl font-bold text-white tabular-nums">-0.5</div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[95%]" />
                        </div>
                    </div>

                    {/* Stereo Field */}
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6 relative overflow-hidden flex items-center justify-center">
                        <h3 className="absolute top-6 left-6 text-xs font-bold text-neutral-500 uppercase flex items-center gap-2"><Radio size={14} /> Stereo Field</h3>
                        {/* Vectorscope Mockup */}
                        <div className="w-32 h-32 rounded-full border border-white/10 relative">
                            <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full transform scale-y-50 rotate-45 animate-pulse" />
                            <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full transform scale-x-50 -rotate-45 animate-pulse" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
