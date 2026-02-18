"use client";

import React from 'react';
import { Folder, Music, FileAudio, Tag, Search, Filter, MoreVertical, Clock, Cloud } from 'lucide-react';

export default function LibraryPage() {
    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans flex">

            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-[#0a0a0a]">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-xs">lib</div>
                    LIBRARY
                </h1>

                <nav className="space-y-1">
                    <NavItem icon={<Music size={16} />} label="All Songs" active />
                    <NavItem icon={<Folder size={16} />} label="Projects" />
                    <NavItem icon={<FileAudio size={16} />} label="Stems" />
                    <NavItem icon={<Clock size={16} />} label="Recent" />
                </nav>

                <div>
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 px-2">Tags</h3>
                    <div className="space-y-1">
                        <TagItem color="bg-red-500" label="Demos" />
                        <TagItem color="bg-blue-500" label="Final Masters" />
                        <TagItem color="bg-green-500" label="Collabs" />
                        <TagItem color="bg-yellow-500" label="Sent" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">

                {/* Search Bar */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/10 transition-colors"
                        />
                    </div>
                    <button className="p-3 bg-[#111] border border-white/5 rounded-xl hover:bg-[#161616]"><Filter size={18} /></button>
                </div>

                {/* File Grid */}
                <div className="space-y-2">
                    <FileRow name="Summer Walker_v3_MASTER.wav" type="WAV" size="42 MB" date="2h ago" tag="Final Masters" />
                    <FileRow name="Neon Nights_DEMO.mp3" type="MP3" size="8 MB" date="5h ago" tag="Demos" />
                    <FileRow name="Guitar Stems_Bridge.zip" type="ZIP" size="124 MB" date="Yesterday" tag="Collabs" />
                    <FileRow name="Project_Alpha_Ableton_v12" type="ALS" size="1.2 MB" date="Yesterday" tag="Projects" />
                    <FileRow name="Vocal Takes_Raw.wav" type="WAV" size="86 MB" date="2 days ago" tag="Stems" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <FileRow key={i} name={`Session_${i + 42}_Bounce.wav`} type="WAV" size="34 MB" date="Last week" />
                    ))}
                </div>

            </div>
        </div>
    );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
            {icon} {label}
        </button>
    );
}

function TagItem({ color, label }: { color: string, label: string }) {
    return (
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:bg-white/5 transition-colors">
            <div className={`w-2 h-2 rounded-full ${color}`} /> {label}
        </button>
    );
}

function FileRow({ name, type, size, date, tag }: { name: string, type: string, size: string, date: string, tag?: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl hover:border-white/10 transition-colors group cursor-pointer hover:bg-[#151515]">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-xs font-bold text-neutral-500">
                    {type}
                </div>
                <div>
                    <h3 className="font-medium text-neutral-200 group-hover:text-white transition-colors">{name}</h3>
                    <p className="text-xs text-neutral-500">{size}</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {tag && (
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-medium text-neutral-400 border border-white/5 border-dashed">
                        {tag}
                    </span>
                )}
                <span className="text-sm text-neutral-500 w-24 text-right">{date}</span>
                <button className="text-neutral-600 hover:text-white"><MoreVertical size={16} /></button>
            </div>
        </div>
    );
}
