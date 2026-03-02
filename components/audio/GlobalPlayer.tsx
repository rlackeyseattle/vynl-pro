"use client";

import React from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalPlayer() {
    const { currentTrack, isPlaying, togglePlay } = useAudio();

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 z-[300] flex items-center px-10 justify-between"
            >
                <div className="flex items-center gap-4 w-1/3">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
                        {currentTrack.imageUrl ? <img src={currentTrack.imageUrl} alt="Cover" className="w-full h-full object-cover" /> : <Disc className="text-white/20" />}
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest">{currentTrack.title}</h4>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{currentTrack.artist}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-6">
                        <button className="text-neutral-500 hover:text-white transition-colors"><SkipBack size={18} /></button>
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button className="text-neutral-500 hover:text-white transition-colors"><SkipForward size={18} /></button>
                    </div>
                    <div className="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-vynl-teal" initial={{ width: 0 }} animate={{ width: '40%' }} />
                    </div>
                </div>

                <div className="flex justify-end gap-4 w-1/3 items-center">
                    <Volume2 size={16} className="text-neutral-500" />
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white/40 w-2/3" />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function Disc(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>;
}
