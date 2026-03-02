"use client";

import React from "react";
import { Bell, Search } from "lucide-react";

interface ConsoleTopBarProps {
    zoneName: string;
    zoneDescription: string;
}

export default function ConsoleTopBar({ zoneName, zoneDescription }: ConsoleTopBarProps) {
    return (
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-8
            bg-black/60 backdrop-blur-xl border-b border-white/[0.04]">
            {/* Zone Title */}
            <div>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] leading-none">{zoneName}</h1>
                <p className="text-[8px] text-neutral-600 uppercase tracking-[0.3em] mt-1">{zoneDescription}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <button title="Search" className="p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Search size={16} />
                </button>

                {/* Notifications */}
                <button title="Notifications" className="relative p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Bell size={16} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </button>
            </div>
        </header>
    );
}
