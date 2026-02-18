"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Instagram, Twitter, Globe, Mail, Music, Disc, Mic2,
    Layers, Cpu, Zap, ArrowDown, Play, Share2, LogOut
} from 'lucide-react';
import { signOut } from "next-auth/react";
import { Profile } from '@prisma/client';
import { EPK_THEME, ThemeConfig, DEFAULT_THEME } from '../../types/theme';

// Extend the Prisma Profile type to include the User relation we fetch
interface ProfileWithUser extends Profile {
    user: {
        name: string | null;
        email: string | null;
    };
}

interface ProfileClientProps {
    profile: ProfileWithUser;
    sessionUser?: {
        name?: string | null;
        email?: string | null;
    } | null;
}

export default function ProfileClient({ profile, sessionUser }: ProfileClientProps) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

    // Parse Theme
    let theme: ThemeConfig = DEFAULT_THEME;
    try {
        if (profile.themeConfig) {
            theme = JSON.parse(profile.themeConfig);
        }
    } catch (e) {
        console.error("Failed to parse theme", e);
    }

    // Dynamic Styles - Use avatarUrl instead of imageUrl
    const bgImage = profile.handle.toLowerCase() === 'roblackey'
        ? "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" // High quality studio/musician vibe
        : (profile.avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop");

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image Parallax */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#050505]" />
                </motion.div>

                {/* Content */}
                <motion.div
                    style={{ opacity: opacityHero }}
                    className="relative z-10 text-center max-w-4xl px-6"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase">
                        {/* Use musicianType instead of role */}
                        {profile.musicianType || "Artist & Producer"}
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-white mix-blend-overlay">
                        {/* Use profile.user.name instead of displayName */}
                        {(profile.user?.name || profile.handle).toUpperCase()}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed mix-blend-plus-lighter">
                        {profile.bio || "Sonic Architect. Visual Designer. Universal Creator."}
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <ArrowDown size={24} />
                </motion.div>
            </header>


            {/* --- "UNCAGED" CONTENT FLOW --- */}
            <div className="relative z-10 px-6 py-24 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Left Column: Bio & Core Info (Glassmorphism) */}
                <div className="lg:col-span-5 space-y-12">
                    <div className="sticky top-12">
                        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Mic2 className="text-cyan-400" size={28} /> About
                            </h2>
                            <p className="text-neutral-400 leading-loose text-lg mb-8">
                                With over a decade of experience in both analog and digital domains, I bridge the gap between vintage warmth and modern precision.
                                My work spans sound design, live performance systems, and visual identity.
                            </p>

                            <div className="space-y-4">
                                <SkillBar label="Music Production" level={95} color="bg-cyan-500" />
                                <SkillBar label="Live Sound Engineering" level={90} color="bg-purple-500" />
                                <SkillBar label="Visual Design" level={85} color="bg-pink-500" />
                                <SkillBar label="Software Development" level={80} color="bg-green-500" />
                            </div>

                            <div className="mt-8 flex gap-4 pt-8 border-t border-white/5">
                                <SocialBtn icon={<Instagram size={20} />} href="#" />
                                <SocialBtn icon={<Twitter size={20} />} href="#" />
                                <SocialBtn icon={<Globe size={20} />} href="#" />
                                <SocialBtn icon={<Mail size={20} />} href="#" />
                            </div>

                            {sessionUser && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Content (Discography, Gallery, Etc) */}
                <div className="lg:col-span-7 space-y-24">

                    {/* Latest Release */}
                    <section>
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">LATEST RELEASE</h3>
                        <div className="group relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"
                                alt="Release Cover"
                                className="object-cover w-full h-full opacity-60 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/90 to-transparent">
                                <h2 className="text-4xl font-bold mb-2">Neon Horizons</h2>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                                        <Play size={18} fill="currentColor" /> STREAM
                                    </button>
                                    <button className="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services / "Band Creation" Teaser */}
                    <section>
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">SERVICES & GEAR</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <ServiceCard icon={<Disc />} title="Mixing & Mastering" desc="Hybrid analog/digital workflow." />
                            <ServiceCard icon={<Cpu />} title="System Design" desc="Mainstage & Ableton Live rigs." />
                            <ServiceCard icon={<Layers />} title="Visuals" desc="Custom Quartz Composer & Resolume." />
                            <ServiceCard icon={<Zap />} title="Consulting" desc="Studio build-outs and acoustic analysis." />
                        </div>
                    </section>

                    {/* Footer / Copyright */}
                    <footer className="pt-12 border-t border-white/5 text-neutral-600 text-sm">
                        <p>© 2026 {profile.user?.name || profile.handle}. Produced by Rocket Tree Labs.</p>
                    </footer>

                </div>

            </div>

        </div>
    );
}

function SkillBar({ label, level, color }: { label: string, level: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                <span>{label}</span>
                <span>{level}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

function SocialBtn({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white/80 hover:text-white">
            {icon}
        </a>
    );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group">
            <div className="text-neutral-500 group-hover:text-white mb-4 transition-colors">{icon}</div>
            <h4 className="font-bold mb-1">{title}</h4>
            <p className="text-sm text-neutral-500">{desc}</p>
        </div>
    );
}
