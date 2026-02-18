"use client";

import React, { useMemo, useState, useEffect } from 'react';
import DiscographyPlayer from '../../components/DiscographyPlayer';
import discographyData from '../../lib/discography_data.json';
import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Music, Info, Mail, ChevronDown, PlayCircle } from 'lucide-react';
import { ThemeConfig, DEFAULT_THEME } from '../../types/theme';
import { motion } from 'framer-motion';

interface ProfileProps {
    profile: {
        handle: string;
        bio: string | null;
        musicianType: string | null;
        avatarUrl: string | null;
        interests: string | null;
        gear: string | null;
        themeConfig: string | null;
        user: {
            name: string | null;
        }
    };
    sessionUser: {
        name?: string | null;
        email?: string | null;
    } | null;
}

export default function ProfileClient({ profile, sessionUser }: ProfileProps) {
    const interests = profile.interests ? JSON.parse(profile.interests) : {};
    const gear = profile.gear ? JSON.parse(profile.gear) : [];
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for sticky nav
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Parse theme config with fallback merging
    const theme: ThemeConfig = useMemo(() => {
        if (!profile.themeConfig) return DEFAULT_THEME;
        try {
            const parsed = JSON.parse(profile.themeConfig);
            return {
                ...DEFAULT_THEME,
                ...parsed,
                colors: { ...DEFAULT_THEME.colors, ...(parsed.colors || {}) },
                fonts: { ...DEFAULT_THEME.fonts, ...(parsed.fonts || {}) },
                layout: { ...DEFAULT_THEME.layout, ...(parsed.layout || {}) },
                hero: { ...DEFAULT_THEME.hero, ...(parsed.hero || {}) }
            };
        } catch (e) {
            console.error("Failed to parse theme config", e);
            return DEFAULT_THEME;
        }
    }, [profile.themeConfig]);

    // CSS Variables
    const themeStyles = {
        '--theme-bg': theme.colors.background,
        '--theme-container-bg': theme.colors.containerBg,
        '--theme-primary': theme.colors.primary,
        '--theme-text': theme.colors.text,
        '--theme-secondary': theme.colors.secondaryText || '#888',
        '--theme-accent': theme.colors.accent,
        '--theme-border': theme.colors.border,
        '--theme-font-heading': theme.fonts.heading,
        '--theme-font-body': theme.fonts.body,
        '--theme-radius': theme.layout.borderRadius,
        '--theme-max-width': theme.layout.maxWidth || '1200px',
    } as React.CSSProperties;

    const heroImage = profile.avatarUrl || "/graphics/profile/main.jpg";

    return (
        <div
            className="min-h-screen text-[var(--theme-text)] font-[var(--theme-font-body)] bg-[var(--theme-bg)] selection:bg-[var(--theme-accent)] selection:text-white"
            style={themeStyles}
        >
            {/* HERO SECTION */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background Image/Video */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                        style={{ filter: `blur(${theme.hero.blur}px)` }}
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: theme.hero.overlayOpacity }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent opacity-80" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-[var(--theme-accent)] text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-4">
                            {profile.musicianType || "Artist"}
                        </h2>
                        <h1
                            className="text-5xl md:text-8xl font-bold mb-6 text-white tracking-tighter"
                            style={{ fontFamily: 'var(--theme-font-heading)' }}
                        >
                            {profile.user.name || profile.handle}
                        </h1>
                        <p className="text-xl md:text-2xl text-[var(--theme-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                            {profile.bio || "Creating immersive soundscapes."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="px-8 py-4 bg-[var(--theme-primary)] text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2">
                                <PlayCircle size={20} /> Latest Release
                            </button>
                            <button className="px-8 py-4 border border-[var(--theme-secondary)] text-[var(--theme-primary)] font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-colors">
                                Contact Management
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                {theme.hero.showScrollIndicator && (
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[var(--theme-secondary)]"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <ChevronDown size={32} />
                    </motion.div>
                )}
            </section>

            {/* STICKY NAVIGATION */}
            <nav
                className={`sticky top-0 z-50 backdrop-blur-md border-b border-[var(--theme-border)/10] transition-all duration-300 ${scrolled ? 'bg-[var(--theme-bg)]/90 py-4 shadow-lg' : 'bg-transparent py-6'}`}
            >
                <div className="max-w-[var(--theme-max-width)] mx-auto px-6 flex justify-between items-center">
                    <span className="text-xl font-bold tracking-tight font-[var(--theme-font-heading)]">
                        {profile.user.name || "VYNL"}
                    </span>

                    <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-[var(--theme-secondary)]">
                        <a href="#music" className="hover:text-[var(--theme-primary)] transition-colors">MUSIC</a>
                        <a href="#about" className="hover:text-[var(--theme-primary)] transition-colors">ABOUT</a>
                        <a href="#contact" className="hover:text-[var(--theme-primary)] transition-colors">CONTACT</a>
                    </div>

                    {sessionUser && (
                        <div className="flex items-center gap-4">
                            <button onClick={() => signOut()} className="text-xs text-[var(--theme-secondary)] hover:text-white flex items-center gap-1">
                                <LogOut size={14} /> SIGN OUT
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="max-w-[var(--theme-max-width)] mx-auto px-6 py-20 space-y-32">

                {/* MUSIC SECTION */}
                <section id="music" className="scroll-mt-32">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-4 text-[var(--theme-accent)]">
                                <Music size={24} />
                                <h3 className="text-sm font-bold tracking-widest uppercase">Discography</h3>
                            </div>
                            <h2 className="text-4xl font-bold font-[var(--theme-font-heading)] mb-6">Latest Sounds</h2>
                            <p className="text-[var(--theme-secondary)] leading-relaxed">
                                Stream the full collection of tracks, remixes, and exclusive cuts directly from the source. High-fidelity audio powered by the VYNL Engine.
                            </p>
                        </div>
                        <div className="md:w-2/3 w-full bg-[var(--theme-container-bg)] p-1 rounded-[var(--theme-radius)] border border-[var(--theme-border)]">
                            <DiscographyPlayer albums={discographyData.albums} />
                        </div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section id="about" className="scroll-mt-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--theme-radius)]">
                            <img
                                src={profile.avatarUrl || "/graphics/profile/main.jpg"}
                                alt="Artist Portrait"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4 text-[var(--theme-accent)]">
                                <Info size={24} />
                                <h3 className="text-sm font-bold tracking-widest uppercase">The Story</h3>
                            </div>
                            <h2 className="text-4xl font-bold font-[var(--theme-font-heading)] mb-8">
                                Behind the Music
                            </h2>
                            <div className="space-y-6 text-lg text-[var(--theme-secondary)] leading-loose">
                                <p>{profile.bio || "No biography available."}</p>

                                {interests.music && (
                                    <div className="pt-4">
                                        <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">Influences</h4>
                                        <p className="text-base">{interests.music}</p>
                                    </div>
                                )}
                            </div>

                            {gear.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-[var(--theme-border)]">
                                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Studio Gear</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {gear.map((item: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-[var(--theme-container-bg)] border border-[var(--theme-border)] text-[11px] uppercase tracking-wider text-[var(--theme-secondary)]"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section id="contact" className="scroll-mt-32 pb-20">
                    <div className="bg-[var(--theme-container-bg)] p-10 md:p-20 rounded-[var(--theme-radius)] text-center border border-[var(--theme-border)] relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6 text-[var(--theme-accent)]">
                                <Mail size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-[var(--theme-font-heading)] mb-6">Let's Create Together</h2>
                            <p className="text-xl text-[var(--theme-secondary)] max-w-2xl mx-auto mb-10">
                                Available for bookings, collaborations, and press inquiries.
                            </p>
                            <a
                                href="mailto:booking@vynl.pro"
                                className="inline-block px-10 py-5 bg-[var(--theme-primary)] text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors"
                            >
                                Get in Touch
                            </a>
                        </div>

                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-[var(--theme-primary)] rounded-full blur-[150px]" />
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-[var(--theme-border)] py-12 text-center">
                <p className="text-[var(--theme-secondary)] text-sm tracking-widest uppercase">
                    © 2026 {profile.user.name || "VYNL"}. Powered by VYNL.PRO
                </p>
            </footer>
        </div>
    );
}
