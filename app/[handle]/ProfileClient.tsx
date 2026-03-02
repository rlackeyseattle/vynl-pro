"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Instagram, Twitter, Globe, Mail, Youtube,
    Play, Pause, SkipForward, SkipBack, Volume2,
    Share2, Heart, MessageCircle, ExternalLink,
    Music2, Radio, ShoppingBag, Users, ChevronDown,
    Layout, LogOut, Star, CheckCircle, Headphones,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface Song {
    id: string;
    title: string;
    artist?: string | null;
    genre?: string | null;
    bpm?: number | null;
    key?: string | null;
    audioUrl?: string | null;
    likes: { id: string; userId: string }[];
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        user: { name: string | null; image: string | null };
    }[];
}

interface Profile {
    id: string;
    handle: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    heroImages?: string | null;
    musicianType?: string | null;
    socialLinks?: string | null;
    epkData?: string | null;
    user: { name: string | null; email: string | null; image: string | null };
    songs: Song[];
}

interface ProfileClientProps {
    profile: Profile;
    sessionUser: { email?: string | null; name?: string | null } | null;
}

export default function ProfileClient({ profile, sessionUser }: ProfileClientProps) {
    const isOwner = sessionUser?.email === profile.user.email;
    const [activeSongId, setActiveSongId] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const [localSongs, setLocalSongs] = useState(profile.songs);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    // Parse data
    const social = profile.socialLinks ? (() => { try { return JSON.parse(profile.socialLinks!); } catch { return {}; } })() : {};
    const epk = profile.epkData ? (() => { try { return JSON.parse(profile.epkData!); } catch { return {}; } })() : {};
    const heroImages: string[] = profile.heroImages ? (() => { try { return JSON.parse(profile.heroImages!); } catch { return []; } })() : [];
    const heroImage = heroImages[0] || profile.bannerUrl || null;

    const artistName = epk.artistName || profile.user.name || profile.handle;
    const tagline = epk.tagline || profile.musicianType || "Independent Artist";
    const bookingEmail = epk.bookingEmail || profile.user.email;

    // Active song object
    const activeSong = localSongs.find(s => s.id === activeSongId) || null;

    // Parallax scroll
    useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Audio control
    useEffect(() => {
        if (!audioRef.current) return;
        if (playing && activeSong?.audioUrl) {
            audioRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
        }
    }, [playing, activeSongId]);

    const selectSong = (id: string) => {
        if (activeSongId === id) {
            setPlaying(!playing);
        } else {
            setActiveSongId(id);
            setPlaying(true);
        }
    };

    const skipSong = (dir: 1 | -1) => {
        if (!activeSong) return;
        const idx = localSongs.findIndex(s => s.id === activeSongId);
        const next = localSongs[(idx + dir + localSongs.length) % localSongs.length];
        if (next) selectSong(next.id);
    };

    const toggleLike = async (songId: string) => {
        setLikedSongs(prev => {
            const n = new Set(prev);
            if (n.has(songId)) n.delete(songId); else n.add(songId);
            return n;
        });
    };

    const postComment = async (songId: string) => {
        const content = commentTexts[songId]?.trim();
        if (!content) return;
        try {
            const res = await fetch(`/api/songs/${songId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                const newComment = await res.json();
                setLocalSongs(prev => prev.map(s =>
                    s.id === songId ? { ...s, comments: [newComment, ...s.comments] } : s
                ));
                setCommentTexts(prev => ({ ...prev, [songId]: "" }));
            }
        } catch { }
    };

    return (
        <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
            {/* Hidden audio */}
            {activeSong?.audioUrl && (
                <audio
                    ref={audioRef}
                    src={activeSong.audioUrl}
                    onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                    onEnded={() => skipSong(1)}
                />
            )}

            {/* HERO — Full screen parallax */}
            <div ref={heroRef} className="relative h-screen overflow-hidden">
                {heroImage ? (
                    <div
                        className="absolute inset-0 scale-110"
                        style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.1)` }}
                    >
                        <img src={heroImage} alt={artistName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/60 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-950 to-[#080810]">
                        {/* Animated orbs */}
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
                    </div>
                )}

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 px-8 pb-20 md:px-16">
                    <div className="max-w-5xl mx-auto">
                        {/* Avatar + Name */}
                        <div className="flex items-end gap-6 mb-6">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0 bg-neutral-800">
                                {profile.avatarUrl || profile.user.image ? (
                                    <img src={profile.avatarUrl || profile.user.image!} alt={artistName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-neutral-600">
                                        {artistName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-neutral-400 font-mono">@{profile.handle}</span>
                                    <CheckCircle size={12} className="text-cyan-400" />
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">{artistName}</h1>
                                <p className="text-neutral-400 mt-2 text-sm">{tagline}</p>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            {localSongs.length > 0 && (
                                <button
                                    onClick={() => selectSong(localSongs[0].id)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:scale-105 transition-all"
                                >
                                    <Play size={14} fill="black" /> Play Latest
                                </button>
                            )}
                            {bookingEmail && (
                                <a href={`mailto:${bookingEmail}`}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium hover:bg-white/20 transition-all">
                                    <Mail size={14} /> Book Now
                                </a>
                            )}
                            <button
                                onClick={() => navigator.share?.({ title: artistName, url: window.location.href })}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium hover:bg-white/20 transition-all">
                                <Share2 size={14} /> Share
                            </button>
                            {isOwner && (
                                <Link href="/console"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition-all">
                                    <Layout size={14} /> Console
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown size={20} className="text-neutral-600" />
                </div>
            </div>

            {/* === STICKY PLAYER (shows when song is active) === */}
            {activeSong && (
                <div className="sticky top-0 z-50 bg-[#080810]/95 backdrop-blur-xl border-b border-white/[0.06]">
                    <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-4">
                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button title="Previous track" onClick={() => skipSong(-1)} className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors">
                                <SkipBack size={14} />
                            </button>
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all"
                            >
                                {playing ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}
                            </button>
                            <button title="Next track" onClick={() => skipSong(1)} className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors">
                                <SkipForward size={14} />
                            </button>
                        </div>

                        {/* Song info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{activeSong.title}</p>
                            <div className="relative h-1 bg-white/10 rounded-full mt-1.5 cursor-pointer"
                                onClick={(e) => {
                                    if (!audioRef.current || !duration) return;
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
                                }}>
                                <div className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full transition-all"
                                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                            </div>
                        </div>

                        <div className="text-[10px] text-neutral-500 font-mono">
                            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}{" / "}
                            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
                        </div>
                        <Volume2 size={14} className="text-neutral-500" />
                    </div>
                </div>
            )}

            {/* === MAIN CONTENT === */}
            <div className="max-w-5xl mx-auto px-8 py-16 space-y-20">

                {/* Bio */}
                {profile.bio && (
                    <section>
                        <SectionLabel label="About" />
                        <p className="text-neutral-300 leading-relaxed text-base max-w-2xl mt-4">{profile.bio}</p>
                    </section>
                )}

                {/* Music */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <SectionLabel label="Music" />
                        <span className="text-xs text-neutral-600">{localSongs.length} tracks</span>
                    </div>
                    {localSongs.length === 0 ? (
                        <div className="py-16 text-center text-neutral-700 text-sm border border-dashed border-white/[0.05] rounded-2xl">
                            No tracks uploaded yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {localSongs.map((song, idx) => {
                                const isActive = song.id === activeSongId;
                                const isLiked = likedSongs.has(song.id);
                                return (
                                    <div key={song.id}
                                        className={`group rounded-2xl border transition-all ${isActive
                                            ? "bg-white/[0.06] border-cyan-500/30"
                                            : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10"
                                            }`}>
                                        <div className="flex items-center gap-4 p-4">
                                            {/* Play button */}
                                            <button
                                                onClick={() => selectSong(song.id)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                                                    ${isActive
                                                        ? "bg-cyan-400 text-black"
                                                        : "bg-white/[0.06] text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
                                                    }`}
                                            >
                                                {isActive && playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                            </button>

                                            {/* Track info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-neutral-200"}`}>
                                                    {song.title}
                                                </p>
                                                <p className="text-xs text-neutral-600 mt-0.5">
                                                    {[song.genre, song.key, song.bpm ? `${song.bpm} BPM` : null].filter(Boolean).join(" · ")}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleLike(song.id)}
                                                    className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-pink-400" : "text-neutral-600 hover:text-pink-400"}`}
                                                >
                                                    <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
                                                    <span>{song.likes.length + (isLiked ? 1 : 0)}</span>
                                                </button>
                                                <button className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-300 transition-colors">
                                                    <MessageCircle size={13} />
                                                    <span>{song.comments.length}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comments — expand on active */}
                                        {isActive && (
                                            <div className="px-4 pb-4 border-t border-white/[0.04] pt-4 mt-1">
                                                {sessionUser && (
                                                    <div className="flex gap-2 mb-3">
                                                        <input
                                                            value={commentTexts[song.id] || ""}
                                                            onChange={e => setCommentTexts(prev => ({ ...prev, [song.id]: e.target.value }))}
                                                            onKeyDown={e => e.key === "Enter" && postComment(song.id)}
                                                            placeholder="Leave a comment…"
                                                            className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-neutral-700"
                                                        />
                                                        <button onClick={() => postComment(song.id)}
                                                            className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/30 transition-all">
                                                            Post
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {song.comments.map(c => (
                                                        <div key={c.id} className="flex gap-2 items-start">
                                                            <div className="w-5 h-5 rounded-full bg-neutral-800 overflow-hidden flex-shrink-0 mt-0.5">
                                                                {c.user.image && <img src={c.user.image} alt="" className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] font-semibold text-cyan-400">{c.user.name} </span>
                                                                <span className="text-xs text-neutral-400">{c.content}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Press quotes from EPK */}
                {epk.pressQuotes?.some((q: any) => q.quote?.trim()) && (
                    <section>
                        <SectionLabel label="Press" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {epk.pressQuotes.filter((q: any) => q.quote?.trim()).map((q: any, i: number) => (
                                <blockquote key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                    <p className="text-sm text-neutral-300 italic leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                                    {q.source && <cite className="text-xs text-neutral-600 not-italic mt-2 block">— {q.source}</cite>}
                                </blockquote>
                            ))}
                        </div>
                    </section>
                )}

                {/* Highlights from EPK */}
                {epk.achievements?.some((a: string) => a?.trim()) && (
                    <section>
                        <SectionLabel label="Highlights" />
                        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {epk.achievements.filter((a: string) => a?.trim()).map((a: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <Star size={12} className="text-amber-400 mt-0.5 flex-shrink-0" /> {a}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Connect */}
                <section>
                    <SectionLabel label="Connect" />
                    <div className="flex flex-wrap gap-3 mt-4">
                        {social.website && <SocialBtn href={social.website} icon={<Globe size={14} />} label="Website" />}
                        {epk.spotify && <SocialBtn href={epk.spotify} icon={<Music2 size={14} />} label="Spotify" />}
                        {social.instagram && <SocialBtn href={`https://instagram.com/${social.instagram.replace("@", "")}`} icon={<Instagram size={14} />} label="Instagram" />}
                        {social.youtube && <SocialBtn href={social.youtube} icon={<Youtube size={14} />} label="YouTube" />}
                        {social.twitter && <SocialBtn href={`https://twitter.com/${social.twitter.replace("@", "")}`} icon={<Twitter size={14} />} label="Twitter" />}
                        {bookingEmail && <SocialBtn href={`mailto:${bookingEmail}`} icon={<Mail size={14} />} label="Booking" accent />}
                    </div>
                </section>

                {/* Coming soon modules */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: <Radio size={18} />, label: "Radio Station", soon: true },
                        { icon: <ShoppingBag size={18} />, label: "Store & Merch", soon: true },
                        { icon: <Headphones size={18} />, label: "Podcast", soon: true },
                        { icon: <Users size={18} />, label: "Fan Community", soon: true },
                    ].map((item) => (
                        <div key={item.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center opacity-50">
                            <div className="flex justify-center text-neutral-500 mb-2">{item.icon}</div>
                            <p className="text-xs text-neutral-600">{item.label}</p>
                            <p className="text-[9px] text-neutral-700 mt-0.5">Coming Soon</p>
                        </div>
                    ))}
                </section>

                {/* Owner footer */}
                {isOwner && (
                    <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
                        <Link href="/console"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-all">
                            <Layout size={14} /> Go to Console
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-500 text-xs hover:text-red-400 transition-all">
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionLabel({ label }: { label: string }) {
    return <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">{label}</h2>;
}

function SocialBtn({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent?: boolean }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${accent
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                    : "bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/20"
                }`}>
            {icon} {label} <ExternalLink size={10} className="text-neutral-600" />
        </a>
    );
}
