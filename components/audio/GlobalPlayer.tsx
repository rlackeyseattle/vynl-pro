"use client";

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function GlobalPlayer() {
    const { currentTrack, isPlaying, togglePlay, progress, nextTrack, prevTrack } = useAudio();

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 w-full h-20 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 z-[100] px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 w-[300px]">
                <div className="w-12 h-12 bg-neutral-800 rounded-md overflow-hidden relative">
                    {currentTrack.cover ? (
                        <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-500 uppercase font-bold text-center">
                            VYNL
                        </div>
                    )}
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                    <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                    <button
                        onClick={prevTrack}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Previous"
                    >
                        <SkipBack size={20} />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="text-white hover:scale-110 transition-transform bg-purple-600 rounded-full p-1 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button
                        onClick={nextTrack}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Next"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full relative overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4 w-[300px] justify-end">
                <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-neutral-500" />
                    <div className="w-20 h-1 bg-neutral-800 rounded-full relative">
                        <div className="absolute left-0 top-0 h-full w-1/2 bg-white"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
