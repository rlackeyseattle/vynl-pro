"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Music2, Mic2, Radio, Guitar, MessageCircle,
    X, Users, UserCircle, Search, Send, Hash
} from "lucide-react";

const ZONES = [
    { name: "Home", href: "/console", icon: LayoutDashboard },
    { name: "Stage", href: "/console/stage", icon: Music2 },
    { name: "Booking", href: "/console/wire", icon: Mic2 },
    { name: "Radio", href: "/console/lab", icon: Radio },
    { name: "Gear", href: "/console/toolkit/gear", icon: Guitar },
];

// ── Mock socials data ──────────────────────────────────────────────────────────
const FRIENDS = [
    { id: "1", name: "Kim Lee", role: "Manager", status: "online", avatar: "K", color: "#60a5fa" },
    { id: "2", name: "John Torres", role: "Guitarist", status: "online", avatar: "J", color: "#34d399" },
    { id: "3", name: "Dave R.", role: "Guitar Tech", status: "idle", avatar: "D", color: "#f59e0b" },
    { id: "4", name: "Sarah M.", role: "Fan", status: "offline", avatar: "S", color: "#a78bfa" },
    { id: "5", name: "Mike Press", role: "Promoter", status: "online", avatar: "M", color: "#f472b6" },
];

type ConvoMsg = { author: string; text: string; time: string };
const MOCK_DMS: Record<string, ConvoMsg[]> = {
    "1": [{ author: "Kim Lee", text: "Confirmed: Top Hat, April 8th. $600.", time: "2h ago" }],
    "2": [{ author: "John Torres", text: "Dude did you hear the new Rival Sons record 🔥", time: "1h ago" }],
    "5": [{ author: "Mike Press", text: "Can you do a Tuesday show in May?", time: "3h ago" }],
};

export default function MobileTabBar() {
    const pathname = usePathname();
    const [chatOpen, setChatOpen] = useState(false);
    const [activeConvo, setActiveConvo] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(MOCK_DMS);
    const [tab, setTab] = useState<"friends" | "bandmates" | "fans">("friends");
    const inputRef = useRef<HTMLInputElement>(null);

    const send = () => {
        if (!message.trim() || !activeConvo) return;
        setMessages(prev => ({
            ...prev,
            [activeConvo]: [...(prev[activeConvo] || []), { author: "You", text: message, time: "just now" }],
        }));
        setMessage("");
    };

    const statusDot = (s: string) =>
        s === "online" ? "bg-green-400" : s === "idle" ? "bg-amber-400" : "bg-neutral-600";

    const onlineFriends = FRIENDS.filter(f => f.status !== "offline");
    const unread = Object.values(MOCK_DMS).flat().filter(m => m.author !== "You").length;

    return (
        <>
            {/* ── Bottom tab bar ───────────────────────────────────────── */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                bg-black/90 backdrop-blur-2xl border-t border-white/[0.04]
                flex items-center justify-around px-2 py-2">
                {ZONES.map((zone) => {
                    const isActive = zone.href === "/console"
                        ? pathname === "/console"
                        : pathname.startsWith(zone.href);
                    const Icon = zone.icon;
                    return (
                        <Link key={zone.href} href={zone.href}>
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all
                                ${isActive ? "text-cyan-400" : "text-neutral-600"}`}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                                <span className="text-[7px] font-black uppercase tracking-widest">{zone.name}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* Chat button — replaces Command Center */}
                <button onClick={() => setChatOpen(true)}
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all text-neutral-600 hover:text-cyan-400 relative">
                    <MessageCircle size={20} strokeWidth={1.5} />
                    {unread > 0 && (
                        <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-black text-[8px] font-black flex items-center justify-center">
                            {unread}
                        </span>
                    )}
                    <span className="text-[7px] font-black uppercase tracking-widest">Chat</span>
                </button>
            </nav>

            {/* ── Desktop floating chat button ─────────────────────────── */}
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 hidden md:flex items-center justify-center w-14 h-14 rounded-2xl shadow-2xl transition-all hover:scale-110 active:scale-95 group"
                style={{ background: "linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))", boxShadow: "0 8px 32px var(--ct-glow)" }}
                title="Open Chat">
                <MessageCircle size={22} className="text-black" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-black">
                        {unread}
                    </span>
                )}
            </button>

            {/* ── Chat Panel ───────────────────────────────────────────── */}
            {chatOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-end md:justify-end md:p-6 pointer-events-none">
                    {/* Backdrop (mobile) */}
                    <div className="absolute inset-0 bg-black/50 md:hidden pointer-events-auto"
                        onClick={() => { setChatOpen(false); setActiveConvo(null); }} />

                    <div className="relative pointer-events-auto w-full md:w-80 rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        style={{
                            backgroundColor: "var(--ct-bg-2)",
                            border: "1px solid var(--ct-border)",
                            height: "min(480px, 80vh)",
                        }}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                            style={{ borderColor: "var(--ct-border)" }}>
                            {activeConvo ? (
                                <>
                                    <button onClick={() => setActiveConvo(null)}
                                        className="text-xs flex items-center gap-1" style={{ color: "var(--ct-accent)" }}>
                                        ← Back
                                    </button>
                                    <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>
                                        {FRIENDS.find(f => f.id === activeConvo)?.name}
                                    </p>
                                    <div className="w-8" />
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>
                                        💬 Messages
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                                            {onlineFriends.length} online
                                        </span>
                                        <button onClick={() => { setChatOpen(false); setActiveConvo(null); }}
                                            className="ml-2 p-1 rounded-lg transition-all hover:bg-white/10"
                                            style={{ color: "var(--ct-text-muted)" }}>
                                            <X size={15} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* List or Convo */}
                        {!activeConvo ? (
                            <>
                                {/* Tabs */}
                                <div className="flex border-b flex-shrink-0" style={{ borderColor: "var(--ct-border)" }}>
                                    {(["friends", "bandmates", "fans"] as const).map(t => (
                                        <button key={t} onClick={() => setTab(t)}
                                            className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all"
                                            style={tab === t
                                                ? { color: "var(--ct-accent)", borderBottom: `2px solid var(--ct-accent)` }
                                                : { color: "var(--ct-text-muted)" }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Friend list */}
                                <div className="flex-1 overflow-y-auto py-2">
                                    {FRIENDS.map(f => (
                                        <button key={f.id} onClick={() => setActiveConvo(f.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/5 text-left">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                                                    style={{ backgroundColor: f.color + "22", color: f.color }}>
                                                    {f.avatar}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${statusDot(f.status)}`}
                                                    style={{ borderColor: "var(--ct-bg-2)" }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" style={{ color: "var(--ct-text)" }}>{f.name}</p>
                                                <p className="text-xs truncate" style={{ color: "var(--ct-text-muted)" }}>{f.role}</p>
                                            </div>
                                            {messages[f.id]?.length > 0 && (
                                                <p className="text-xs max-w-[80px] truncate text-right" style={{ color: "var(--ct-text-muted)" }}>
                                                    {messages[f.id].at(-1)?.text}
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                                    {(messages[activeConvo] || []).map((m, i) => {
                                        const isMe = m.author === "You";
                                        return (
                                            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div className="max-w-[75%]">
                                                    <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? "rounded-br-md" : "rounded-bl-md"}`}
                                                        style={{
                                                            backgroundColor: isMe ? "var(--ct-accent)" : "rgba(255,255,255,0.07)",
                                                            color: isMe ? "#000" : "var(--ct-text)",
                                                        }}>
                                                        {m.text}
                                                    </div>
                                                    <p className="text-[9px] mt-1 px-1" style={{ color: "var(--ct-text-muted)", textAlign: isMe ? "right" : "left" }}>
                                                        {m.time}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!(messages[activeConvo]?.length) && (
                                        <p className="text-xs text-center py-6" style={{ color: "var(--ct-text-muted)" }}>
                                            Start a conversation 👋
                                        </p>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="flex-shrink-0 px-3 py-3 border-t" style={{ borderColor: "var(--ct-border)" }}>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--ct-border)" }}>
                                        <input ref={inputRef} value={message} onChange={e => setMessage(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && send()}
                                            placeholder="Message..."
                                            className="flex-1 bg-transparent text-sm focus:outline-none"
                                            style={{ color: "var(--ct-text)" }} />
                                        <button onClick={send} disabled={!message.trim()}
                                            style={{ color: message.trim() ? "var(--ct-accent)" : "var(--ct-text-muted)" }}>
                                            <Send size={15} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
