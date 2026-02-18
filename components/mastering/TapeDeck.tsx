"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TapeDeckProps {
    isPlaying: boolean;
}

export default function TapeDeck({ isPlaying }: TapeDeckProps) {
    return (
        <div className="w-full  h-[120px] bg-[#1a1a1a] rounded flex items-center justify-center gap-8 relative overflow-hidden border border-gray-800 shadow-inner">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

            {/* Left Reel */}
            <motion.div
                className="w-24 h-24 rounded-full border-4 border-gray-400 bg-gray-800 relative shadow-2xl"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-2 border border-gray-600 rounded-full" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2 rotate-45" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2 -rotate-45" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2" />
                {/* Tape Spool (Visual approximation of tape) */}
                <div className="absolute inset-6 bg-[#332211] rounded-full opacity-80" />
            </motion.div>

            {/* Tape Path (Center) */}
            <div className="flex flex-col items-center justify-center gap-1 z-10">
                <div className="w-16 h-8 bg-gray-300 rounded mx-auto flex items-center justify-center shadow-md">
                    <span className="text-[8px] font-mono text-black font-bold tracking-widest">VYNL-LABS</span>
                </div>
                {/* Tape bridge */}
                <div className="w-full h-1 bg-[#332211]" />
            </div>

            {/* Right Reel */}
            <motion.div
                className="w-24 h-24 rounded-full border-4 border-gray-400 bg-gray-800 relative shadow-2xl"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-2 border border-gray-600 rounded-full" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2 rotate-45" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2 -rotate-45" />
                <div className="absolute w-full h-2 bg-gray-400 top-1/2 -translate-y-1/2" />
                {/* Tape Spool (Less full on right initially, but static for now) */}
                <div className="absolute inset-8 bg-[#332211] rounded-full opacity-80" />
            </motion.div>
        </div>
    );
}
