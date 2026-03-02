"use client";

import React from "react";
import { generatePalette, ThemeConfig, ProfileSection } from "@/lib/theme-engine";
import {
    Music2, Video, CalendarDays, MessageSquare,
    Mail, ShoppingBag, Globe, User
} from "lucide-react";

interface LivePreviewProps {
    config: ThemeConfig;
    profile: {
        name: string;
        handle: string;
        bio: string;
        avatarUrl?: string;
    };
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
    hero: <User size={14} />,
    bio: <User size={14} />,
    music: <Music2 size={14} />,
    video: <Video size={14} />,
    events: <CalendarDays size={14} />,
    fanboard: <MessageSquare size={14} />,
    contact: <Mail size={14} />,
    store: <ShoppingBag size={14} />,
    social: <Globe size={14} />,
};

export default function LivePreview({ config, profile }: LivePreviewProps) {
    const palette = generatePalette(config.colors, config.mode);
    const enabledSections = config.sections.filter((s) => s.enabled);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                    Live Preview
                </h3>
                <span className="text-[8px] text-neutral-600 uppercase tracking-widest font-mono">
                    vynl.pro/{profile.handle}
                </span>
            </div>

            {/* Preview Frame */}
            <div
                className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                style={{ backgroundColor: palette.background }}
            >
                {/* Mini browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                    style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    <div className="flex-1 mx-3">
                        <div className="text-[7px] font-mono text-center px-3 py-1 rounded-md"
                            style={{ backgroundColor: palette.surfaceHover, color: palette.textSubtle }}>
                            vynl.pro/{profile.handle}
                        </div>
                    </div>
                </div>

                {/* Preview content */}
                <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto"
                    style={{ color: palette.text }}>

                    {enabledSections.map((section) => (
                        <PreviewSection
                            key={section.id}
                            section={section}
                            palette={palette}
                            profile={profile}
                            config={config}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PreviewSection({ section, palette, profile, config }: {
    section: ProfileSection;
    palette: ReturnType<typeof generatePalette>;
    profile: LivePreviewProps["profile"];
    config: ThemeConfig;
}) {
    switch (section.type) {
        case "hero":
            return (
                <div className={`${config.borderRadius} p-6 text-center`}
                    style={{ backgroundColor: palette.primaryMuted }}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-3"
                        style={{ backgroundColor: palette.primary, opacity: 0.7 }} />
                    <h2 className="text-lg font-black tracking-tight" style={{ color: palette.text }}>
                        {profile.name}
                    </h2>
                    <p className="text-[8px] uppercase tracking-[0.3em] mt-1"
                        style={{ color: palette.textMuted }}>
                        @{profile.handle}
                    </p>
                </div>
            );

        case "bio":
            return (
                <div className={`${config.borderRadius} p-4 border`}
                    style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                    <p className="text-[9px] uppercase tracking-widest font-black mb-2"
                        style={{ color: palette.textSubtle }}>About</p>
                    <p className="text-[10px] leading-relaxed"
                        style={{ color: palette.textMuted }}>
                        {profile.bio || "Your story goes here..."}
                    </p>
                </div>
            );

        case "music":
            return (
                <div className={`${config.borderRadius} p-4 border`}
                    style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                    <p className="text-[9px] uppercase tracking-widest font-black mb-3"
                        style={{ color: palette.textSubtle }}>Music</p>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0"
                            style={{ borderColor: palette.border }}>
                            <div className="w-8 h-8 rounded-md"
                                style={{ backgroundColor: palette.primaryMuted }} />
                            <div className="flex-1">
                                <div className="h-2 rounded-full w-24"
                                    style={{ backgroundColor: palette.surfaceHover }} />
                                <div className="h-1.5 rounded-full w-16 mt-1"
                                    style={{ backgroundColor: palette.surfaceHover, opacity: 0.5 }} />
                            </div>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: palette.primary }}>
                                <span className="text-[6px]" style={{ color: palette.background }}>▶</span>
                            </div>
                        </div>
                    ))}
                </div>
            );

        default:
            return (
                <div className={`${config.borderRadius} p-4 border`}
                    style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                    <div className="flex items-center gap-2">
                        <span style={{ color: palette.textSubtle }}>{SECTION_ICONS[section.type]}</span>
                        <p className="text-[9px] uppercase tracking-widest font-black"
                            style={{ color: palette.textSubtle }}>{section.label}</p>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="h-2 rounded-full w-3/4"
                            style={{ backgroundColor: palette.surfaceHover }} />
                        <div className="h-2 rounded-full w-1/2"
                            style={{ backgroundColor: palette.surfaceHover, opacity: 0.5 }} />
                    </div>
                </div>
            );
    }
}
