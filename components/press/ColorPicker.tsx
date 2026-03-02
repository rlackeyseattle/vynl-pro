"use client";

import React from "react";
import { ThemeColors } from "@/lib/theme-engine";

interface ColorPickerProps {
    colors: ThemeColors;
    onChange: (colors: ThemeColors) => void;
}

const COLOR_LABELS = [
    { key: "primary" as const, label: "Primary", hint: "Headers, buttons, main accent" },
    { key: "secondary" as const, label: "Secondary", hint: "Background, surfaces" },
    { key: "accent" as const, label: "Accent", hint: "Highlights, links, CTAs" },
];

export default function ColorPicker({ colors, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Your 3 Colors
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {COLOR_LABELS.map(({ key, label, hint }) => (
                    <div key={key} className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-500">
                            {label}
                        </label>
                        <div className="relative group">
                            <input
                                type="color"
                                title={`Pick ${label} color`}
                                value={colors[key]}
                                onChange={(e) =>
                                    onChange({ ...colors, [key]: e.target.value })
                                }
                                className="w-full h-14 rounded-xl border border-white/10 cursor-pointer
                                    bg-transparent appearance-none
                                    [&::-webkit-color-swatch-wrapper]:p-1
                                    [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none
                                    hover:border-white/20 transition-all"
                            />
                            <div className="absolute -bottom-5 left-0 right-0 text-center">
                                <span className="text-[8px] font-mono text-neutral-600 uppercase">{colors[key]}</span>
                            </div>
                        </div>
                        <p className="text-[7px] text-neutral-700 uppercase tracking-widest mt-4">{hint}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
