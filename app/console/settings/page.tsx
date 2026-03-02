"use client";

import { useState } from "react";
import { Palette, Check, Guitar, Zap } from "lucide-react";
import { useConsoleTheme } from "@/components/console/ConsoleThemeProvider";
import { CONSOLE_THEMES } from "@/lib/console-themes";

const BRANDS = ["All", "Fender", "Gibson", "PRS", "Rickenbacker", "VYNL", "Default"];

export default function SettingsPage() {
    const { theme: activeTheme, setThemeId } = useConsoleTheme();
    const [filter, setFilter] = useState("All");
    const [justApplied, setJustApplied] = useState<string | null>(null);

    const filtered = filter === "All"
        ? CONSOLE_THEMES
        : CONSOLE_THEMES.filter(t => t.brand === filter);

    const apply = (id: string) => {
        setThemeId(id);
        setJustApplied(id);
        setTimeout(() => setJustApplied(null), 1500);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-6 border-b" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center gap-3 mb-1">
                    <Palette size={20} style={{ color: "var(--ct-accent)" }} />
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ct-text)" }}>Settings</h1>
                </div>
                <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>Console preferences and appearance</p>
            </div>

            <div className="px-8 py-8 max-w-4xl space-y-12">

                {/* ── THEME PICKER ────────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-1">
                        <Guitar size={16} style={{ color: "var(--ct-accent)" }} />
                        <h2 className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>Console Theme</h2>
                    </div>
                    <p className="text-xs mb-5" style={{ color: "var(--ct-text-muted)" }}>
                        Iconic guitar finishes from Fender, Gibson, PRS, and more. Changes apply instantly.
                    </p>

                    {/* Brand filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {BRANDS.map(b => (
                            <button
                                key={b}
                                onClick={() => setFilter(b)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                                style={filter === b ? {
                                    backgroundColor: "var(--ct-accent)",
                                    color: "#000",
                                } : {
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    color: "var(--ct-text-muted)",
                                    border: "1px solid var(--ct-border)",
                                }}
                            >
                                {b}
                            </button>
                        ))}
                    </div>

                    {/* Theme grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filtered.map(theme => {
                            const isActive = activeTheme.id === theme.id;
                            const wasJustApplied = justApplied === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => apply(theme.id)}
                                    className="group text-left p-4 rounded-2xl transition-all duration-200 relative"
                                    style={{
                                        backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${isActive ? "var(--ct-accent)" : "var(--ct-border)"}`,
                                        boxShadow: isActive ? `0 0 20px var(--ct-glow)` : "none",
                                    }}
                                >
                                    {/* Color swatch */}
                                    <div className="w-full h-10 rounded-xl mb-3 overflow-hidden flex"
                                        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                                        {theme.preview.map((color, i) => (
                                            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>

                                    {/* Info */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold leading-none" style={{ color: "var(--ct-text)" }}>
                                                {theme.name}
                                            </p>
                                            <p className="text-[10px] mt-1" style={{ color: "var(--ct-text-muted)" }}>
                                                {theme.brand}{theme.year ? ` · ${theme.year}` : ""}
                                            </p>
                                            <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>
                                                {theme.description}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: "var(--ct-accent)" }}>
                                                <Check size={11} color="#000" />
                                            </div>
                                        )}
                                    </div>

                                    {wasJustApplied && (
                                        <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                                            <span className="text-xs font-semibold" style={{ color: "var(--ct-accent)" }}>
                                                Applied ✓
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ── OTHER SETTINGS STUBS ────────────────────────────── */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>Account & Preferences</h2>
                    {[
                        { label: "Profile & EPK", desc: "Handle, bio, links, and press kit" },
                        { label: "Notifications", desc: "Alert preferences and delivery" },
                        { label: "Privacy & Security", desc: "Visibility, password, and access controls" },
                        { label: "Team & Members", desc: "Invite band members and manage roles" },
                    ].map(item => (
                        <div key={item.label}
                            className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}
                        >
                            <div>
                                <p className="text-sm font-medium" style={{ color: "var(--ct-text)" }}>{item.label}</p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--ct-text-muted)" }}>{item.desc}</p>
                            </div>
                            <span className="text-[10px] px-2 py-1 rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)" }}>
                                Soon
                            </span>
                        </div>
                    ))}
                </section>

                {/* Active theme preview strip */}
                <section className="p-5 rounded-2xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} style={{ color: "var(--ct-accent)" }} />
                        <p className="text-xs font-semibold" style={{ color: "var(--ct-text)" }}>
                            Active: {activeTheme.name}
                        </p>
                        <span className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>
                            — {activeTheme.brand}{activeTheme.year ? `, ${activeTheme.year}` : ""}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {Object.entries(activeTheme.vars)
                            .filter(([k]) => k !== "--ct-border" && k !== "--ct-text" && k !== "--ct-text-muted" && k !== "--ct-glow")
                            .map(([key, value]) => (
                                <div key={key} title={`${key}: ${value}`}
                                    className="w-8 h-8 rounded-lg border border-white/10"
                                    style={{ backgroundColor: value }} />
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
