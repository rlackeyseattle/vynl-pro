"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TrendingUp, Radio, Music2, Star } from "lucide-react";

// ── Mock live scene activity feed ─────────────────────────────────────────────
const SCENE_FEED = [
    { type: "upload", icon: "🎵", text: "The Rob Lackey Band just uploaded \"Neon Rust\" to their profile", time: "2m ago" },
    { type: "booking", icon: "📅", text: "Tractor Tavern booked Dirty Buttons for March 14th", time: "8m ago" },
    { type: "booking", icon: "📅", text: "The Top Hat just confirmed The Midnight Drifters for April 2nd", time: "12m ago" },
    { type: "upload", icon: "🎵", text: "Silver Creek just dropped a new single — check it out", time: "18m ago" },
    { type: "fan", icon: "❤️", text: "23 fans RSVPed for Spoke & Mule at The Badlander this Saturday", time: "22m ago" },
    { type: "booking", icon: "📅", text: "Monk's Bar booked Velvet Underground Tribute for Friday night", time: "31m ago" },
    { type: "upload", icon: "🎵", text: "Cold Shoulder Method posted a live recording from last week's set", time: "35m ago" },
    { type: "venue", icon: "🏟️", text: "Neumos has 3 open dates in April — booking requests open", time: "44m ago" },
    { type: "fan", icon: "❤️", text: "A new street team member joined Rob Lackey Band's fan crew", time: "51m ago" },
    { type: "trivia", icon: "🎸", text: "MUSIC TRIVIA: Jimi Hendrix was left-handed but played a right-handed guitar upside down", time: "" },
    { type: "booking", icon: "📅", text: "The Wilma just announced 4 new shows — local acts wanted for openers", time: "1h ago" },
    { type: "upload", icon: "🎵", text: "Phantom Route released their debut EP — now streaming on VYNL.PRO", time: "1h ago" },
    { type: "trivia", icon: "🎸", text: "MUSIC TRIVIA: Kurt Cobain was famously not impressed by major labels. Nirvana signed with DGC to reach more people.", time: "" },
    { type: "fan", icon: "❤️", text: "High Noon Drifters gained 14 new followers after Top Hat show", time: "2h ago" },
    { type: "venue", icon: "🏟️", text: "The Rialto posted a call for local bands — deadline Friday", time: "2h ago" },
    { type: "trivia", icon: "🎸", text: "MUSIC TRIVIA: The E chord is the most played chord in rock history", time: "" },
    { type: "booking", icon: "📅", text: "The Badlander confirmed 6 local acts for their Spring Showcase", time: "2h ago" },
    { type: "trivia", icon: "🎸", text: "MUSIC TRIVIA: A standard guitar string vibrates up to 100 times per second at full tension", time: "" },
    { type: "upload", icon: "🎵", text: "Copper & Coal added 3 new songs to their Stage Mode setlist", time: "3h ago" },
    { type: "trivia", icon: "🎸", text: "MUSIC TRIVIA: Sub Pop Records was founded in Seattle in 1988 and changed indie music forever", time: "" },
];

const TYPE_COLORS: Record<string, string> = {
    upload: "#34d399",
    booking: "#a78bfa",
    fan: "#f472b6",
    venue: "#60a5fa",
    trivia: "#f59e0b",
};

export default function SceneTicker() {
    const [paused, setPaused] = useState(false);

    // Duplicate feed for seamless loop
    const items = [...SCENE_FEED, ...SCENE_FEED];

    return (
        <div
            className="relative overflow-hidden"
            style={{
                borderTop: "1px solid var(--ct-border)",
                borderBottom: "1px solid var(--ct-border)",
                backgroundColor: "rgba(0,0,0,0.3)",
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>

            {/* Label */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 gap-2"
                style={{ backgroundColor: "var(--ct-bg-2)", borderRight: "1px solid var(--ct-border)" }}>
                <TrendingUp size={11} style={{ color: "var(--ct-accent)" }} />
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "var(--ct-accent)" }}>
                    LIVE SCENE
                </span>
            </div>

            {/* Scrolling ticker */}
            <div className="flex items-center h-9 pl-[120px]">
                <div
                    className="flex items-center gap-8 whitespace-nowrap"
                    style={{
                        animation: paused ? "none" : "tickerScroll 80s linear infinite",
                    }}>
                    {items.map((item, i) => (
                        <span key={i} className="flex items-center gap-2 text-[11px]">
                            <span>{item.icon}</span>
                            <span style={{ color: "var(--ct-text-muted)" }}>{item.text}</span>
                            {item.time && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md"
                                    style={{ color: TYPE_COLORS[item.type] || "var(--ct-text-muted)", backgroundColor: `${TYPE_COLORS[item.type]}15` }}>
                                    {item.time}
                                </span>
                            )}
                            <span style={{ color: "var(--ct-border)" }}>◆</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Fade edges */}
            <div className="absolute left-[104px] top-0 bottom-0 w-8 pointer-events-none"
                style={{ background: "linear-gradient(to right, var(--ct-bg-2), transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to left, var(--ct-bg), transparent)" }} />

            <style>{`
                @keyframes tickerScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
