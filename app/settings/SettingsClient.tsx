"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { User, Profile } from "@prisma/client";
import { updateProfile, updateTheme } from "@/actions/profile";
import { Save, User as UserIcon, Music, MapPin, AtSign, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import ThemeEditor from "@/components/settings/ThemeEditor";
import { ThemeConfig, DEFAULT_THEME } from "@/types/theme";

interface SettingsClientProps {
    user: User & { profile: Profile | null };
    profile: Profile | null;
}

type SettingsTab = "identity" | "theme" | "gear";

export default function SettingsClient({ user, profile }: SettingsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<SettingsTab>("identity");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        bio: profile?.bio || "",
        musicianType: profile?.musicianType || "Artist",
        location: profile?.location || "",
        gear: profile?.gear || "",
        interests: profile?.interests || "",
        socialLinks: profile?.socialLinks || "",
    });

    const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
        try {
            return profile?.themeConfig ? JSON.parse(profile.themeConfig) : DEFAULT_THEME;
        } catch (e) {
            return DEFAULT_THEME;
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            let result;
            if (activeTab === "identity") {
                const form = new FormData();
                Object.entries(formData).forEach(([key, value]) => form.append(key, value));
                result = await updateProfile(form);
            } else if (activeTab === "theme") {
                result = await updateTheme(JSON.stringify(themeConfig));
            }

            if (result?.success) {
                setMessage({ type: "success", text: result.message });
            } else {
                setMessage({ type: "error", text: result?.message || "Failed to save" });
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-white/20">
            {/* Dynamic Background Preview */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] blur-[150px] rounded-full animate-pulse"
                    style={{ backgroundColor: `${themeConfig.colors.primary}22` }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] blur-[150px] rounded-full animate-pulse"
                    style={{ backgroundColor: `${themeConfig.colors.accent}22`, animationDelay: "2s" }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">VYNL.PRO</Link>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] text-neutral-500 font-mono tracking-[0.2em] uppercase">Profile Builder</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href={`/${profile?.handle}`} className="text-[10px] text-white/50 hover:text-white transition-colors font-bold tracking-widest uppercase mb-[-2px]">
                        View Live Profile
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-white text-black text-xs font-black tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        SAVE CHANGES
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

                {/* Sidebar / Nav */}
                <div className="lg:col-span-3 space-y-2">
                    <NavButton
                        active={activeTab === "identity"}
                        onClick={() => setActiveTab("identity")}
                        icon={<UserIcon size={16} />}
                        label="Identity"
                    />
                    <NavButton
                        active={activeTab === "theme"}
                        onClick={() => setActiveTab("theme")}
                        icon={<Sparkles size={16} />}
                        label="Visual Theme"
                    />
                    <NavButton icon={<Music size={16} />} label="Gear & Socials" disabled />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-12 pb-24">

                    {/* Status Messages */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-bold ${message.type === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                : "bg-red-500/10 border-red-500/20 text-red-500"
                                }`}
                        >
                            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </motion.div>
                    )}

                    {/* TAB CONTENT: IDENTITY */}
                    {activeTab === "identity" && (
                        <motion.section
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter mb-2 italic">IDENTITY</h2>
                                <p className="text-neutral-500 text-xs tracking-widest uppercase">Base profile configuration</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">Full Name</label>
                                    <input
                                        name="name"
                                        value={user.name || ""}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-neutral-400 cursor-not-allowed outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">Handle</label>
                                    <div className="relative">
                                        <AtSign size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700" />
                                        <input
                                            name="handle"
                                            value={profile?.handle || ""}
                                            disabled
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-neutral-400 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell the world who you are..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm min-h-[120px] focus:border-white/20 transition-colors outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">Musician Type</label>
                                    <input
                                        name="musicianType"
                                        value={formData.musicianType}
                                        onChange={handleChange}
                                        placeholder="e.g. Lead Vocalist / Producer"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white/20 transition-colors outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">Location</label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700" />
                                        <input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, State"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-white/20 transition-colors outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* TAB CONTENT: THEME */}
                    {activeTab === "theme" && (
                        <motion.section
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <ThemeEditor config={themeConfig} onChange={setThemeConfig} />
                        </motion.section>
                    )}

                </div>
            </main>
        </div>
    );
}

function NavButton({ active, icon, label, disabled, onClick }: { active?: boolean, icon: React.ReactNode, label: string, disabled?: boolean, onClick?: () => void }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active
                ? "bg-white text-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
                : "text-neutral-500 hover:text-white hover:bg-white/5"
                } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
        >
            {icon}
            {label}
        </button>
    )
}
