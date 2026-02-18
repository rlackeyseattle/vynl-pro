"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageCircle, Heart, Share2 } from 'lucide-react';

export default function TheGreatAmericanSoundtrack() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[1fr_400px] gap-0 min-h-screen">

                {/* --- LEFT: VIDEO CONTENT --- */}
                <div className="flex flex-col p-6 lg:p-12 overflow-y-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">The Great American Soundtrack</h1>
                        <p className="text-neutral-400">Exploring the stories behind the sound.</p>
                    </header>

                    {/* Video Player Container */}
                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 mb-8 relative group">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/s9pD1YdbeIE?si=demo"
                            title="Rick Beato Interview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>

                    {/* Episode Info */}
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/5">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Analysis: Why Modern Music Sounds Like This</h2>
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <span>Season 3, Ep 4</span>
                                    <span>•</span>
                                    <span>1hr 24min</span>
                                    <span>•</span>
                                    <span className="text-red-500 font-bold">LIVE</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><Heart size={20} /></button>
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><Share2 size={20} /></button>
                            </div>
                        </div>
                        <p className="text-neutral-400 leading-relaxed max-w-4xl">
                            We dive deep into the production techniques defined an era. Rick breaks down the theory, the gear, and the happy accidents that created the hits we know today. Joined by special guests from the industry.
                        </p>
                    </div>
                </div>

                {/* --- RIGHT: LIVE CHAT --- */}
                <div className="bg-[#0f0f0f] border-l border-white/5 flex flex-col h-[calc(100vh-80px)] lg:h-screen sticky top-0">
                    <div className="p-4 border-b border-white/5 bg-[#0f0f0f] z-10 flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2"><MessageCircle size={16} /> LIVE CHAT</h3>
                        <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-900/20 px-2 py-1 rounded-full animate-pulse">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 3.2K ONLINE
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
                        <ChatMessage user="AlexM" time="12:04" text="Wait, does he mean the 1176 or the LA-2A here?" color="text-blue-400" />
                        <ChatMessage user="StudioRat99" time="12:05" text="Def the 1176, you can hear that attack time." color="text-green-400" />
                        <ChatMessage user="VynlUser_01" time="12:05" text="This mix is pristine." color="text-purple-400" />
                        <ChatMessage user="ProducerDave" time="12:06" text="Anyone know what mic he's using?" color="text-yellow-400" />
                        <ChatMessage user="RobLackey" time="12:07" text="Looks like a vintage U47." color="text-red-500" isMod />
                        <ChatMessage user="SarahJ" time="12:07" text="Mind blown 🤯" color="text-pink-400" />
                        {/* Faux history */}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <ChatMessage key={i} user={`GuestUser_${i + 20}`} time={`12:0${8 + i}`} text="Loving this content!" color="text-neutral-500" />
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/5 bg-[#0f0f0f]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Say something..."
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                <Send size={14} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ChatMessage({ user, time, text, color, isMod }: { user: string, time: string, text: string, color: string, isMod?: boolean }) {
    return (
        <div className="text-sm group hover:bg-white/5 p-2 -mx-2 rounded transition-colors">
            <div className="flex items-baseline gap-2 mb-0.5">
                <span className={`font-bold ${color} text-xs flex items-center gap-1`}>
                    {user} {isMod && <span className="bg-red-500 text-white text-[10px] px-1 rounded-[2px] ml-0.5">MOD</span>}
                </span>
                <span className="text-[10px] text-neutral-600">{time}</span>
            </div>
            <p className="text-neutral-300 leading-snug">{text}</p>
        </div>
    );
}
