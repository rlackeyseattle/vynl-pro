"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Speaker, Mic2, Zap, Settings, Truck, Box, Layers, Radio } from 'lucide-react';

export default function RocketTreeLabs() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-hidden selection:bg-cyan-500/30">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-24 border-b border-cyan-900/30 pb-12"
                >
                    <div className="flex items-center gap-4 mb-4 text-cyan-500">
                        <Cpu size={32} />
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Rocket Tree Labs</h1>
                    </div>
                    <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                        Creative solutions for all musicians. From independent hobbyists to pro touring rigs.
                        Designing the future of zero-latency performance.
                    </p>
                </motion.div>

                {/* Hero Product: Universal Drive */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-32 grid md:grid-cols-2 gap-12 items-center"
                >
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-6">
                            <Zap size={12} /> PROTOTYPE PHASE
                        </div>
                        <h2 className="text-4xl font-bold mb-6 text-white">The Universal Audio Drive</h2>
                        <ul className="space-y-4 mb-8 text-neutral-400">
                            <li className="flex items-start gap-3">
                                <CheckIcon />
                                <span><strong>Zero Latency:</strong> Real-time processing for live performance.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckIcon />
                                <span><strong>Universal Compatibility:</strong> Runs off a single USB stick. Plug & Play.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckIcon />
                                <span><strong>OS Agnostic:</strong> Bootable environment optimized purely for audio.</span>
                            </li>
                        </ul>
                        <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest transition-colors clip-path-slant">
                            Join Waitlist
                        </button>
                    </div>
                    <div className="order-1 md:order-2 relative aspect-square bg-neutral-900/50 rounded-xl border border-white/5 flex items-center justify-center p-12 group">
                        <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500" />

                        {/* Mockup Graphic */}
                        <div className="relative w-48 h-80 bg-neutral-800 rounded-lg border-2 border-neutral-700 shadow-2xl skew-y-3 transform transition-transform group-hover:-skew-y-0 duration-500 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-16 border-2 border-cyan-500 rounded bg-black/50" />
                            <div className="h-2 w-24 bg-neutral-700 rounded-full animate-pulse" />
                            <div className="text-[10px] text-cyan-500 font-mono text-center px-4">BOOTING AUDIO KERNEL...</div>
                        </div>
                    </div>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <ServiceCard
                        icon={<Speaker size={32} />}
                        title="Custom Studio Design"
                        desc="Acoustic treatment and architectural planning for rooms that translate perfectly."
                    />
                    <ServiceCard
                        icon={<Box size={32} />}
                        title="Live Sound Rigs"
                        desc="Turnkey touring solutions. IEM racks, playback systems, and redundant networking."
                    />
                    <ServiceCard
                        icon={<Settings size={32} />}
                        title="System Integration"
                        desc="Optimizing existing workflows. Cable management, patchbays, and digital clocking."
                    />
                </div>

            </div>
        </div>
    );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-xl group">
            <div className="mb-6 text-neutral-500 group-hover:text-cyan-400 transition-colors">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function CheckIcon() {
    return <div className="w-5 h-5 rounded bg-cyan-900/30 flex items-center justify-center text-cyan-400 mt-0.5"><div className="w-2 h-2 bg-current rounded-full" /></div>
}
