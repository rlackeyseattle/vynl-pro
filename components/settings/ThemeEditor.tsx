"use client";

import React from "react";
import { motion } from "framer-motion";
import { SwatchBook, Pipette, Layout, Zap, Flame, Cloud } from "lucide-react";
import { ThemeConfig, PRESET_THEMES } from "@/types/theme";

interface ThemeEditorProps {
    config: ThemeConfig;
    onChange: (config: ThemeConfig) => void;
}

export default function ThemeEditor({ config, onChange }: ThemeEditorProps) {
    const updateColors = (updates: Partial<ThemeConfig["colors"]>) => {
        onChange({
            ...config,
            colors: { ...config.colors, ...updates }
        });
    };

    const updateHero = (updates: Partial<ThemeConfig["hero"]>) => {
        onChange({
            ...config,
            hero: { ...config.hero, ...updates }
        });
    };

    return (
        <div className="space-y-12">
            <section className="space-y-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2 italic flex items-center gap-3">
                        <Layout size={28} className="text-purple-500" /> VISUAL DNA
                    </h2>
                    <p className="text-neutral-500 text-xs tracking-widest uppercase">Sonic aesthetics for your profile</p>
                </div>

                {/* Preset Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PresetCard
                        active={config.colors.primary === "#06b6d4"}
                        label="Midnight Lab"
                        desc="Cyan & Deep Space"
                        icon={<Zap size={18} />}
                        onClick={() => onChange(PRESET_THEMES[0])}
                    />
                    <PresetCard
                        active={config.colors.primary === "#ffffff"}
                        label="Neon Stage"
                        desc="The Standard EPK"
                        icon={<Flame size={18} />}
                        onClick={() => onChange(PRESET_THEMES[1])}
                    />
                    <PresetCard
                        active={config.colors.primary === "#bb86fc"}
                        label="Modern Dark"
                        desc="Purple Fusion"
                        icon={<SwatchBook size={18} />}
                        onClick={() => onChange(PRESET_THEMES[0])} // Just a placeholder for now
                    />
                </div>
            </section>

            {/* Manual Controls */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">

                {/* Colors */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-600 flex items-center gap-2">
                        <Pipette size={14} /> Color Palette
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Primary Glow</span>
                            <input
                                type="color"
                                value={config.colors.primary}
                                onChange={(e) => updateColors({ primary: e.target.value })}
                                className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Accent Deep</span>
                            <input
                                type="color"
                                value={config.colors.accent}
                                onChange={(e) => updateColors({ accent: e.target.value })}
                                className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Effects */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-600 flex items-center gap-2">
                        <Cloud size={14} /> Texture & Atmosphere
                    </h3>

                    <div className="space-y-4">
                        <EffectToggle
                            label="Scroll Indicator"
                            active={config.hero.showScrollIndicator}
                            onToggle={() => updateHero({ showScrollIndicator: !config.hero.showScrollIndicator })}
                        />

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center bg">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 text-nowrap">Hero Blur</span>
                                <span className="text-[10px] font-mono text-purple-500">{config.hero.blur}PX</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={config.hero.blur}
                                onChange={(e) => updateHero({ blur: parseInt(e.target.value) })}
                                className="w-full accent-purple-500"
                            />
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

function PresetCard({ active, label, desc, icon, onClick }: { active: boolean, label: string, desc: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`text-left p-6 rounded-3xl border transition-all relative overflow-hidden group ${active
                ? "bg-white/10 border-white/30 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] scale-[1.02]"
                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
        >
            <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? "bg-white text-black" : "bg-white/10 text-white/50 group-hover:text-white"}`}>
                {icon}
            </div>
            <h4 className={`text-sm font-black tracking-tight ${active ? "text-white" : "text-neutral-400"}`}>{label}</h4>
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-1">{desc}</p>
            {active && (
                <motion.div layoutId="active-preset" className="absolute top-4 right-4 text-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                </motion.div>
            )}
        </button>
    )
}

function EffectToggle({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) {
    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</span>
            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full relative transition-colors ${active ? "bg-purple-600" : "bg-neutral-800"}`}
            >
                <motion.div
                    animate={{ x: active ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    )
}
