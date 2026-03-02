"use client";

import React from "react";
import { GENRE_TEMPLATES, GenreTemplate } from "@/lib/theme-engine";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface GenreSelectorProps {
    selectedId: string;
    onSelect: (template: GenreTemplate) => void;
}

export default function GenreSelector({ selectedId, onSelect }: GenreSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Genre Template
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GENRE_TEMPLATES.map((template) => {
                    const isSelected = template.id === selectedId;
                    return (
                        <motion.button
                            key={template.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelect(template)}
                            className={`relative p-4 rounded-xl border text-left transition-all
                                ${isSelected
                                    ? "border-cyan-400/40 bg-cyan-400/5"
                                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <Check size={12} className="text-cyan-400" />
                                </div>
                            )}

                            {/* Color swatches */}
                            <div className="flex gap-1.5 mb-3">
                                <div
                                    className="w-5 h-5 rounded-md border border-white/10"
                                    style={{ backgroundColor: template.colors.primary }}
                                />
                                <div
                                    className="w-5 h-5 rounded-md border border-white/10"
                                    style={{ backgroundColor: template.colors.secondary }}
                                />
                                <div
                                    className="w-5 h-5 rounded-md border border-white/10"
                                    style={{ backgroundColor: template.colors.accent }}
                                />
                            </div>

                            <p className="text-[10px] font-black uppercase tracking-widest">{template.name}</p>
                            <p className="text-[7px] text-neutral-600 uppercase tracking-widest mt-1">
                                {template.mode} · {template.description}
                            </p>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
