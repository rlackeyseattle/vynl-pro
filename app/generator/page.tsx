"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, SkipForward, Mic, Wand2, Download } from 'lucide-react';

export default function GeneratorPage() {
    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-blue-900/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10 px-6">

                {/* Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider mb-6">
                        <Sparkles size={12} className="text-purple-400" /> GEN-AUDIO MODEL V1
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-2">
                        What are we creating today?
                    </h1>
                </div>

                {/* Input Area */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl mb-8">
                    <textarea
                        placeholder="Describe the track... (e.g., 'A synthwave song in the style of The Midnight with driving bass and neon textures')"
                        className="w-full bg-transparent border-none text-lg p-4 focus:ring-0 text-white placeholder-neutral-600 min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between px-2 pb-2">
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors"><Mic size={20} /></button>
                            <button className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors"><Wand2 size={20} /></button>
                        </div>
                        <button className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
                            GENERATE
                        </button>
                    </div>
                </div>

                {/* Examples */}
                <div className="flex flex-wrap gap-2 justify-center mb-16">
                    <SuggestionPill text="Lo-fi hip hop beat" />
                    <SuggestionPill text="Cinematic orchestral swell" />
                    <SuggestionPill text="Heavy metal riff" />
                    <SuggestionPill text="Ambient soundscape" />
                </div>

                {/* Result Preview (Mockup) */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                    <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors">
                        <Play size={20} className="ml-1" />
                    </button>

                    <div className="flex-1 h-12 bg-neutral-900 rounded-lg flex items-center px-4 overflow-hidden gap-1">
                        {/* Waveform Bars */}
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="flex-1 bg-purple-500/50 rounded-full"
                                style={{ height: `${Math.random() * 80 + 20}%` }}
                            />
                        ))}
                    </div>

                    <button className="p-2 text-neutral-500 hover:text-white transition-colors"><Download size={20} /></button>
                </div>

            </div>
        </div>
    );
}

function SuggestionPill({ text }: { text: string }) {
    return (
        <button className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.1] text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            {text}
        </button>
    );
}
