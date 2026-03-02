"use client";

import React from "react";
import { ProfileSection } from "@/lib/theme-engine";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { motion, Reorder } from "framer-motion";

interface SectionManagerProps {
    sections: ProfileSection[];
    onChange: (sections: ProfileSection[]) => void;
}

export default function SectionManager({ sections, onChange }: SectionManagerProps) {
    const toggleSection = (id: string) => {
        onChange(
            sections.map((s) =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Page Sections
            </h3>
            <p className="text-[8px] text-neutral-600 uppercase tracking-widest">
                Drag to reorder · Toggle visibility
            </p>
            <Reorder.Group
                axis="y"
                values={sections}
                onReorder={onChange}
                className="space-y-2"
            >
                {sections.map((section) => (
                    <Reorder.Item
                        key={section.id}
                        value={section}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <motion.div
                            layout
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                                ${section.enabled
                                    ? "border-white/8 bg-white/[0.03]"
                                    : "border-white/[0.03] bg-transparent opacity-40"
                                }`}
                        >
                            <GripVertical size={14} className="text-neutral-700 flex-shrink-0" />

                            <span className="text-[10px] font-black uppercase tracking-widest flex-1">
                                {section.label}
                            </span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection(section.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
                                title={section.enabled ? "Hide section" : "Show section"}
                            >
                                {section.enabled ? (
                                    <Eye size={14} className="text-cyan-400" />
                                ) : (
                                    <EyeOff size={14} className="text-neutral-700" />
                                )}
                            </button>
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
}
