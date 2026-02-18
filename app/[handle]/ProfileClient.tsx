"use client";

import React, { useMemo } from 'react';
import DiscographyPlayer from '../../components/DiscographyPlayer';
import discographyData from '../../lib/discography_data.json';
import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from 'lucide-react';
import { ThemeConfig, DEFAULT_THEME } from '../../types/theme';

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

    // Parse theme config or use default
    const theme: ThemeConfig = useMemo(() => {
        if (!profile.themeConfig) return DEFAULT_THEME;
        try {
            return JSON.parse(profile.themeConfig);
        } catch (e) {
            console.error("Failed to parse theme config", e);
            return DEFAULT_THEME;
        }
    }, [profile.themeConfig]);

    // Create CSS variables object
    const themeStyles = {
        '--theme-bg': theme.colors.background,
        '--theme-container-bg': theme.colors.containerBg,
        '--theme-primary': theme.colors.primary,
        '--theme-text': theme.colors.text,
        '--theme-accent': theme.colors.accent,
        '--theme-border': theme.colors.border,
        '--theme-font-heading': theme.fonts.heading,
        '--theme-font-body': theme.fonts.body,
        '--theme-radius': theme.layout.borderRadius,
    } as React.CSSProperties;

    return (
        <div
            className="min-h-screen py-10 transition-colors duration-200"
            style={{
                ...themeStyles,
                backgroundColor: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                fontFamily: 'var(--theme-font-body)'
            }}
        >
            <div className="max-w-4xl mx-auto pb-12" style={{ backgroundColor: 'var(--theme-container-bg)' }}>
                {/* Header */}
                <header
                    className="h-20 flex items-center justify-between px-5 text-xl font-bold text-white transition-colors"
                    style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                >
                    <span>VYNL.PRO // Artist Profile</span>
                    {sessionUser && (
                        <div className="flex items-center gap-4 text-xs font-normal">
                            <span className="flex items-center gap-1"><UserIcon size={14} /> {sessionUser.name}</span>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </header>

                <div className="flex flex-col md:flex-row p-5 gap-5">
                    {/* LEFT COLUMN */}
                    <div className="w-full md:w-[300px] shrink-0">
                        <h1
                            className="text-xl font-bold mb-4"
                            style={{ fontFamily: 'var(--theme-font-heading)' }}
                        >
                            {profile.user.name || profile.handle}
                        </h1>

                        <div className="mb-4 border" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                            <div className="p-2">
                                <img
                                    src={profile.avatarUrl || "/graphics/profile/main.jpg"}
                                    alt={profile.handle}
                                    className="w-full border"
                                    style={{ borderColor: 'var(--theme-border)' }}
                                />
                            </div>
                        </div>

                        <div
                            className="mb-5 p-2 border-2 bg-white/5"
                            style={{ borderColor: 'var(--theme-primary)', borderRadius: 'var(--theme-radius)' }}
                        >
                            <h3
                                className="mt-0 text-base font-bold border-b pb-1 mb-2"
                                style={{ color: 'var(--theme-primary)', borderColor: 'var(--theme-border)' }}
                            >
                                Contacting {profile.user.name || profile.handle}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                {['Send Message', 'Add to Friends', 'Forward to Friend', 'Add to Favorites'].map(item => (
                                    <span
                                        key={item}
                                        className="font-bold cursor-pointer hover:underline"
                                        style={{ color: 'var(--theme-accent)' }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4 border" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                            <div
                                className="px-2 py-1 font-bold text-sm text-white"
                                style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                            >
                                {profile.user.name || profile.handle}'s Interests
                            </div>
                            <div className="p-2 text-xs space-y-2">
                                {interests.general && <p><strong>General:</strong> {interests.general}</p>}
                                {interests.music && <p><strong>Music:</strong> {interests.music}</p>}
                                {interests.tech && <p><strong>Tech:</strong> {interests.tech}</p>}
                                {!interests.general && !interests.music && !interests.tech && (
                                    <p className="italic opacity-70">No interests listed yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex-1">
                        <div className="mb-4 border bg-white/5" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                            <div
                                className="px-2 py-1 font-bold text-sm text-white"
                                style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                            >
                                {profile.user.name || profile.handle}'s Discography
                            </div>
                            <div className="p-2">
                                <DiscographyPlayer albums={discographyData.albums} />
                            </div>
                        </div>

                        <div className="mb-4 border" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                            <div
                                className="px-2 py-1 font-bold text-sm text-white"
                                style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                            >
                                Top 8 Friends
                            </div>
                            <div className="p-2">
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i}>
                                            <img
                                                src={`/graphics/friends/${i}.png`}
                                                alt={`Friend ${i}`}
                                                className="w-full aspect-square object-cover border mb-1"
                                                style={{ borderColor: 'var(--theme-border)' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=VYNL';
                                                }}
                                            />
                                            <span className="text-[11px]" style={{ color: 'var(--theme-accent)' }}>Friend {i}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {gear.length > 0 && (
                            <div className="mb-4 border" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                                <div
                                    className="px-2 py-1 font-bold text-sm text-white"
                                    style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                                >
                                    Tech & Gear
                                </div>
                                <div className="p-2 text-xs">
                                    <ul className="list-disc list-inside space-y-1">
                                        {gear.map((item: string, idx: number) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="mb-4 border" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                            <div
                                className="px-2 py-1 font-bold text-sm text-white"
                                style={{ backgroundColor: 'var(--theme-primary)', fontFamily: 'var(--theme-font-heading)' }}
                            >
                                Blurbs
                            </div>
                            <div className="p-4 text-sm italic">
                                {profile.bio || "This user hasn't added a bio yet."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
