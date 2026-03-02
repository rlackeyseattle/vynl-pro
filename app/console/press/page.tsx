"use client";

import { useState } from "react";
import {
    Megaphone, Plus, Image, FileText, Instagram, Twitter, Facebook, Youtube,
    Kanban, Lightbulb, Layout, Sparkles, Calendar, ChevronRight, Clock,
    ChevronDown, Zap, Copy, Check, Move
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type PostType = "instagram" | "twitter" | "facebook" | "flyer" | "press" | "email";
type KanbanCol = "ideas" | "creating" | "scheduled" | "posted";

interface PromoCard {
    id: string; title: string; type: PostType; col: KanbanCol;
    date?: string; platform?: string; preview?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const INIT_CARDS: PromoCard[] = [
    { id: "1", title: "🎸 Top Hat show announcement", type: "instagram", col: "posted", date: "Feb 20", preview: "We're playing the Top Hat! April 8th. Tickets on the door." },
    { id: "2", title: "Tractor Tavern April 8 flyer", type: "flyer", col: "scheduled", date: "Mar 25", preview: "High-res show flyer with AI-generated art" },
    { id: "3", title: "New track 'Neon Rust' announcement", type: "twitter", col: "creating", preview: "just dropped our new single 🎵" },
    { id: "4", title: "Spring tour announcement blast", type: "email", col: "ideas" },
    { id: "5", title: "Behind the scenes rehearsal reel", type: "instagram", col: "ideas" },
    { id: "6", title: "Press release — new single", type: "press", col: "creating" },
];

const TEMPLATES = [
    { id: "show-announce", label: "Show Announcement", icon: "📅", desc: "Date, venue, ticket link, vibe. Fast." },
    { id: "new-release", label: "New Release Drop", icon: "🎵", desc: "New track / EP / album announcement." },
    { id: "tour-post", label: "Tour Dates", icon: "🚐", desc: "Multi-date run with venue list." },
    { id: "thank-you", label: "Post-Show Thank You", icon: "❤️", desc: "Appreciate the crowd after a show." },
    { id: "merch-promo", label: "Merch Drop", icon: "👕", desc: "New merch or limited run announcement." },
    { id: "collab", label: "Collaboration Announce", icon: "🤝", desc: "Featured artist, producer, etc." },
    { id: "milestone", label: "Milestone Celebration", icon: "🏆", desc: "Follower count, stream count, years in." },
    { id: "fan-shout", label: "Fan Shoutout", icon: "🙌", desc: "Celebrate a street team member." },
];

const TIPS = [
    { icon: "📸", tip: "Post stories 24–48h before shows. Multiple stories = more top-of-feed exposure." },
    { icon: "🎵", tip: "Short Reels/TikToks of live performance clips outperform static posts 3:1 for new reach." },
    { icon: "⏰", tip: "Best times: Tue–Thu 11am–1pm and 7–9pm local. Avoid posting during major events." },
    { icon: "📍", tip: "Tag venue location and use venue's Instagram — they often reshare local act content." },
    { icon: "🎯", tip: "Use 5–10 hyper-relevant hashtags instead of 30 generic ones. Quality > quantity." },
    { icon: "💬", tip: "Reply to every comment in the first hour. Algorithm rewards early engagement velocity." },
    { icon: "🔁", tip: "Cross-post between platforms but adjust format. 9:16 for Stories/Reels, 1:1 for grid." },
    { icon: "📧", tip: "Email list is your most owned audience. Collect at shows with a sign-up sheet or QR code." },
];

const PLATFORM_COLORS: Record<PostType, string> = {
    instagram: "#e11d48",
    twitter: "#0ea5e9",
    facebook: "#3b82f6",
    flyer: "#f59e0b",
    press: "#a78bfa",
    email: "#34d399",
};

const COL_LABELS: Record<KanbanCol, string> = {
    ideas: "💡 IDEAS",
    creating: "🖊️ CREATING",
    scheduled: "📅 SCHEDULED",
    posted: "✅ POSTED",
};

const TABS = ["kanban", "create", "templates", "tips"] as const;
type Tab = typeof TABS[number];

export default function PromotionPage() {
    const [tab, setTab] = useState<Tab>("kanban");
    const [cards, setCards] = useState<PromoCard[]>(INIT_CARDS);
    const [dragging, setDragging] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<PostType>("instagram");
    const [copied, setCopied] = useState<string | null>(null);
    const [flyer, setFlyer] = useState<{ generating: boolean; done: boolean }>({ generating: false, done: false });

    const colCards = (col: KanbanCol) => cards.filter(c => c.col === col);

    const moveCard = (id: string, col: KanbanCol) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, col } : c));
    };

    const addCard = () => {
        if (!newTitle.trim()) return;
        setCards(prev => [...prev, {
            id: Date.now().toString(),
            title: newTitle, type: newType, col: "ideas",
        }]);
        setNewTitle(""); setShowForm(false);
    };

    const copyText = (id: string, text: string) => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const generateFlyer = () => {
        setFlyer({ generating: true, done: false });
        setTimeout(() => setFlyer({ generating: false, done: true }), 2800);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Megaphone size={18} style={{ color: "#f472b6" }} />
                            <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>Promotion</h1>
                        </div>
                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                            Create posts, flyers & press. Schedule your promo game.
                        </p>
                    </div>
                    <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #f472b6, #f43f5e)", color: "#fff", boxShadow: "0 4px 16px rgba(244,114,182,0.3)" }}>
                        <Plus size={15} /> New Promo
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b" style={{ borderColor: "var(--ct-border)" }}>
                    {(["kanban", "create", "templates", "tips"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all capitalize rounded-t-lg"
                            style={tab === t
                                ? { color: "#f472b6", borderBottom: "2px solid #f472b6" }
                                : { color: "var(--ct-text-muted)" }}>
                            {t === "kanban" ? "📋 Board" : t === "create" ? "✏️ Create" : t === "templates" ? "📄 Templates" : "💡 Tips"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* ── KANBAN ──────────────────────────────────────── */}
                {tab === "kanban" && (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        {(Object.keys(COL_LABELS) as KanbanCol[]).map(col => (
                            <div key={col} className="flex flex-col gap-2"
                                onDragOver={e => e.preventDefault()}
                                onDrop={() => dragging && moveCard(dragging, col)}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                                        {COL_LABELS[col]}
                                    </p>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-neutral-500">
                                        {colCards(col).length}
                                    </span>
                                </div>

                                {colCards(col).map(card => (
                                    <div key={card.id}
                                        draggable
                                        onDragStart={() => setDragging(card.id)}
                                        onDragEnd={() => setDragging(null)}
                                        className="p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
                                        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)" }}>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <p className="text-xs font-semibold leading-snug" style={{ color: "var(--ct-text)" }}>{card.title}</p>
                                            <Move size={10} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ct-text-muted)" }} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md capitalize"
                                                style={{ backgroundColor: PLATFORM_COLORS[card.type] + "20", color: PLATFORM_COLORS[card.type] }}>
                                                {card.type}
                                            </span>
                                            {card.date && <span className="text-[8px]" style={{ color: "var(--ct-text-muted)" }}>{card.date}</span>}
                                        </div>
                                        {card.preview && (
                                            <p className="text-[10px] mt-2 opacity-60 line-clamp-2 leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>
                                                {card.preview}
                                            </p>
                                        )}
                                        {/* Move buttons */}
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                            {(Object.keys(COL_LABELS) as KanbanCol[]).filter(c => c !== col).map(dest => (
                                                <button key={dest} onClick={() => moveCard(card.id, dest)}
                                                    className="text-[8px] px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-all"
                                                    style={{ color: "var(--ct-text-muted)" }}>
                                                    → {dest}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button onClick={() => { setShowForm(true); }}
                                    className="text-xs p-2 rounded-xl border border-dashed transition-all hover:bg-white/5 flex items-center justify-center gap-1"
                                    style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>
                                    <Plus size={11} /> Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── CREATE ──────────────────────────────────────── */}
                {tab === "create" && (
                    <div className="max-w-2xl space-y-6">
                        {/* Show Flyer Generator */}
                        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} style={{ color: "#f59e0b" }} />
                                <h2 className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>AI Flyer Generator</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { label: "Show Date", placeholder: "April 8, 2026" },
                                    { label: "Venue", placeholder: "Top Hat Billiards" },
                                    { label: "City", placeholder: "Missoula, MT" },
                                    { label: "Ticket Price / Door", placeholder: "$10 door" },
                                ].map(f => (
                                    <div key={f.label}>
                                        <label className="text-[10px] text-neutral-500 block mb-1">{f.label}</label>
                                        <input placeholder={f.placeholder}
                                            className="w-full text-sm px-3 py-2 rounded-xl focus:outline-none transition-all"
                                            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                                    </div>
                                ))}
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px] text-neutral-500 block mb-1">Vibe / Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Dark & Moody", "Neon Glow", "Vintage Poster", "Western Grit", "Punk Zine", "Minimal Clean"].map(v => (
                                        <button key={v} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:border-pink-500/40 hover:text-pink-400 transition-all">
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {!flyer.done ? (
                                <button onClick={generateFlyer} disabled={flyer.generating}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "#000" }}>
                                    {flyer.generating ? (
                                        <><span className="animate-spin">⚙️</span> Generating flyer...</>
                                    ) : (
                                        <><Image size={15} /> Generate Flyer with AI</>
                                    )}
                                </button>
                            ) : (
                                <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-900/30 to-orange-900/20 p-6 text-center">
                                    <div className="text-4xl mb-2">🎸</div>
                                    <p className="font-black text-xl text-white tracking-tight">ROB LACKEY BAND</p>
                                    <p className="text-amber-400 font-bold mt-1">LIVE AT THE TOP HAT</p>
                                    <p className="text-neutral-400 text-sm mt-1">April 8, 2026 · Missoula, MT · $10 Door</p>
                                    <div className="flex gap-2 justify-center mt-4">
                                        <button className="text-xs px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/30 transition-all">
                                            Download PNG
                                        </button>
                                        <button className="text-xs px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-all">
                                            Edit & Regenerate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Caption Generator */}
                        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Zap size={16} style={{ color: "#a78bfa" }} />
                                <h2 className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>Post Caption Builder</h2>
                            </div>
                            <div className="flex gap-2 mb-3 flex-wrap">
                                {(["instagram", "twitter", "facebook", "email"] as PostType[]).map(p => (
                                    <button key={p} className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                                        style={{ backgroundColor: PLATFORM_COLORS[p] + "20", color: PLATFORM_COLORS[p], border: `1px solid ${PLATFORM_COLORS[p]}30` }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <textarea placeholder="Describe your post (show announcement, new track, tour, etc.)..."
                                rows={3}
                                className="w-full text-sm px-3 py-2 rounded-xl focus:outline-none resize-none transition-all mb-3"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />

                            {/* Sample generated caption */}
                            <div className="p-4 rounded-xl mb-3 text-sm leading-relaxed"
                                style={{ backgroundColor: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "var(--ct-text)" }}>
                                🎸 We're taking over @tractortavern April 8th and we want YOU there.{"\n\n"}Doors at 9 · $12 cover · All ages we'll figure it out{"\n\n"}This one's gonna be real good, real loud, and real fun.{"\n\n"}#PNWMusic #Seattle #TractorTavern #LiveMusic #IndieRock
                            </div>
                            <button
                                onClick={() => copyText("caption", "🎸 We're taking over @tractortavern April 8th...")}
                                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                                style={{ backgroundColor: copied === "caption" ? "#34d39920" : "rgba(255,255,255,0.05)", border: "1px solid var(--ct-border)", color: copied === "caption" ? "#34d399" : "var(--ct-text-muted)" }}>
                                {copied === "caption" ? <Check size={12} /> : <Copy size={12} />}
                                {copied === "caption" ? "Copied!" : "Copy Caption"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── TEMPLATES ───────────────────────────────────── */}
                {tab === "templates" && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {TEMPLATES.map(t => (
                            <button key={t.id}
                                className="text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:border-pink-500/30"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                                <span className="text-2xl block mb-3">{t.icon}</span>
                                <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>{t.label}</p>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{t.desc}</p>
                                <div className="flex items-center gap-1 mt-3 text-[10px] font-bold" style={{ color: "#f472b6" }}>
                                    Use Template <ChevronRight size={10} />
                                </div>
                            </button>
                        ))}
                        {/* Add custom template */}
                        <button className="text-left p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center transition-all hover:bg-white/5"
                            style={{ borderColor: "var(--ct-border)" }}>
                            <Plus size={20} style={{ color: "var(--ct-text-muted)" }} />
                            <p className="text-xs mt-2 font-medium" style={{ color: "var(--ct-text-muted)" }}>Create Template</p>
                        </button>
                    </div>
                )}

                {/* ── TIPS ─────────────────────────────────────────── */}
                {tab === "tips" && (
                    <div className="max-w-2xl space-y-3">
                        {TIPS.map((tip, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{tip.tip}</p>
                            </div>
                        ))}
                        <div className="p-5 rounded-2xl border border-dashed text-center"
                            style={{ borderColor: "var(--ct-border)" }}>
                            <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>📚 Street Team Playbook</p>
                            <p className="text-xs mb-3" style={{ color: "var(--ct-text-muted)" }}>
                                Full guide on recruiting fans, assigning promo tasks, and tracking reach
                            </p>
                            <button className="text-xs font-bold px-4 py-2 rounded-xl"
                                style={{ backgroundColor: "rgba(244,114,182,0.15)", color: "#f472b6", border: "1px solid rgba(244,114,182,0.2)" }}>
                                Coming Soon
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add card modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-sm mx-4 p-6 rounded-2xl space-y-4" onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: "var(--ct-bg-2)", border: "1px solid var(--ct-border)" }}>
                        <h3 className="font-bold text-sm" style={{ color: "var(--ct-text)" }}>New Promo Item</h3>
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title..."
                            autoFocus onKeyDown={e => e.key === "Enter" && addCard()}
                            className="w-full text-sm px-3 py-2 rounded-xl focus:outline-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }} />
                        <select value={newType} onChange={e => setNewType(e.target.value as PostType)}
                            className="w-full text-sm px-3 py-2 rounded-xl focus:outline-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}>
                            {(["instagram", "twitter", "facebook", "flyer", "press", "email"] as PostType[]).map(p => (
                                <option key={p} value={p} style={{ backgroundColor: "#111" }}>{p}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button onClick={() => setShowForm(false)}
                                className="flex-1 py-2 rounded-xl text-sm font-medium"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                                Cancel
                            </button>
                            <button onClick={addCard}
                                className="flex-1 py-2 rounded-xl text-sm font-bold"
                                style={{ background: "linear-gradient(135deg, #f472b6, #f43f5e)", color: "#fff" }}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
