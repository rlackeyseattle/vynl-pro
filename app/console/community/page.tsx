"use client";

import { useState } from "react";
import {
    Users, MessageSquare, ShoppingBag, Lightbulb, Mic2,
    Radio, BookOpen, Link2, Plus, Search, ArrowRight,
    Heart, MapPin, Music2, Star, Filter, ChevronRight, Podcast
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────
const FORUM_POSTS: Record<string, { id: string; author: string; avatar: string; color: string; title: string; text: string; time: string; replies: number; likes: number; }[]> = {
    general: [
        { id: "g1", author: "JackWhiteNoise", avatar: "J", color: "#34d399", title: "Best PNW venues for indie rock — your picks?", text: "Doing a spring run from Missoula to Seattle. What spots should be on the list?", time: "2h ago", replies: 14, likes: 31 },
        { id: "g2", author: "GainBeforeBeauty", avatar: "G", color: "#f59e0b", title: "Touring in March — road conditions MT to WA?", text: "Anyone done the I-90 run in March recently? Weather concerns?", time: "4h ago", replies: 7, likes: 12 },
        { id: "g3", author: "DistortedFader42", avatar: "D", color: "#a78bfa", title: "Anyone using VYNL Stage live yet? Love the teleprompter feature", text: "Ran our whole set from it last Friday at the Top Hat. Game changer.", time: "1d ago", replies: 22, likes: 48 },
    ],
    gear: [
        { id: "r1", author: "PedalboardPaula", avatar: "P", color: "#f472b6", title: "WTB: Fender Deluxe Reverb — Missoula/Bozeman area", text: "Looking for a clean late 60s-70s Deluxe Reverb. Local pickup preferred.", time: "1h ago", replies: 3, likes: 5 },
        { id: "r2", author: "TubeDriverDave", avatar: "T", color: "#60a5fa", title: "FS: '72 Fender Tele — $1,800 OBO", text: "Olympic White, all original. Plays like butter. Missoula.", time: "3h ago", replies: 8, likes: 17 },
        { id: "r3", author: "SideChainSurfer", avatar: "S", color: "#34d399", title: "ISO: 4x12 cabinet — will trade Vox AC15", text: "Vox is in excellent shape. Looking for a Marshall 1960 or similar.", time: "6h ago", replies: 5, likes: 9 },
    ],
    tips: [
        { id: "t1", author: "NoisFloorSweeper", avatar: "N", color: "#f59e0b", title: "How to negotiate venue guarantees vs door splits", text: "Been doing this for 10 years. Here's what I've learned about negotiating fair pay...", time: "5h ago", replies: 28, likes: 76 },
        { id: "t2", author: "PhantomPowered", avatar: "P", color: "#a78bfa", title: "Stage plot tips that make you look professional", text: "Your stage plot is often the first impression you make on a venue. Here's how to nail it...", time: "2d ago", replies: 11, likes: 43 },
    ],
    services: [
        { id: "s1", author: "SnakeStageMike", avatar: "S", color: "#60a5fa", title: "Recording studio — Avail: March–April @ $55/hr", text: "8-track analog room in Missoula. Great for rock, folk, country. Package deals available.", time: "8h ago", replies: 4, likes: 8 },
        { id: "s2", author: "MixBusMagda", avatar: "M", color: "#f472b6", title: "Mixing & mastering — remote, $150/song bundle", text: "5 years mixing indie and alt-country. 2-track revision included. Portfolio on request.", time: "1d ago", replies: 6, likes: 14 },
    ],
};

const CONNECT_POSTS = [
    { id: "c1", type: "seeking-band", icon: "🎤", author: "VelvetVoice_Kat", avatar: "K", color: "#f472b6", title: "Singer looking for country or Americana band — Kalispell area", body: "I'm a female vocalist, 8 years experience. Looking for an established group in the Kalispell/Whitefish area. Have my own PA, prefer originals. Available weekends.", tags: ["singer", "country", "kalispell"], time: "3h ago" },
    { id: "c2", type: "seeking-act", icon: "🏟️", author: "TopHatMgmt", avatar: "T", color: "#34d399", title: "Top Hat Billiards — seeking weekly act, Thursdays", body: "We need a reliable acoustic or small group for Thursday nights. $150 flat. Missoula, MT. Local preferred. Apply with EPK link.", tags: ["venue", "missoula", "acoustic", "weekly"], time: "5h ago" },
    { id: "c3", type: "seeking-gig", icon: "🎸", author: "AcousticAce_Solo", avatar: "A", color: "#f59e0b", title: "Acoustic solo act — seeking $150-$250 shows, within 60mi of Spokane", body: "Country and classic rock covers. Full PA setup. Can do private events, breweries, restaurants. 3 hrs of material.", tags: ["acoustic", "solo", "covers", "spokane"], time: "1d ago" },
    { id: "c4", type: "fill-in", icon: "⚡", author: "GuitarSesh_Dan", avatar: "D", color: "#a78bfa", title: "Session guitarist available — fill-in shows, Seattle", body: "I cover for guitar players on short notice. Know 100+ songs across country, rock, blues. Fast learner. Available most weekends.", tags: ["seattle", "fill-in", "session", "guitar"], time: "2d ago" },
    { id: "c5", type: "opening-act", icon: "🌟", author: "PhantomRoute_Band", avatar: "P", color: "#60a5fa", title: "Phantom Route — seeking openers for April MT run", body: "Folk-rock quartet touring Montana April 4-12. Looking for local openers at each stop. We have booking at Top Hat, Badlander, Sean Kelly's. Reach out!", tags: ["opening-act", "montana", "folk-rock", "april"], time: "3d ago" },
];

const CONNECT_TYPES = [
    { key: "all", label: "All Posts" },
    { key: "seeking-band", label: "Musician → Band" },
    { key: "seeking-act", label: "Venue → Act" },
    { key: "seeking-gig", label: "Act → Gig" },
    { key: "fill-in", label: "Fill-In / Session" },
    { key: "opening-act", label: "Opening Acts" },
];

type ForumSection = "general" | "gear" | "tips" | "services";
type TabType = "forum" | "connect" | "radio" | "lessons";

const FORUM_TABS: { key: ForumSection; label: string; icon: string }[] = [
    { key: "general", label: "General Discussion", icon: "💬" },
    { key: "gear", label: "Gear Swap", icon: "🎸" },
    { key: "tips", label: "Tips & Tricks", icon: "💡" },
    { key: "services", label: "Services", icon: "🎛️" },
];

const LESSONS = [
    { title: "Music Theory for Guitarists Who Hate Theory", level: "Beginner", dur: "45 min", icon: "🎸", tags: ["theory", "guitar"] },
    { title: "How to Write a Touring Budget That Works", level: "All Levels", dur: "30 min", icon: "🚐", tags: ["business", "touring"] },
    { title: "Stage Presence: Own the Room", level: "Intermediate", dur: "25 min", icon: "🎤", tags: ["performance", "stage"] },
    { title: "Recording Your Band at Home on a Budget", level: "Beginner", dur: "60 min", icon: "🎛️", tags: ["recording", "studio"] },
    { title: "Negotiating with Venues: The Real Talk", level: "All Levels", dur: "35 min", icon: "📋", tags: ["business", "booking"] },
    { title: "Building a Street Team That Actually Works", level: "All Levels", dur: "20 min", icon: "🤘", tags: ["marketing", "fans"] },
];

export default function CommunityPage() {
    const [mainTab, setMainTab] = useState<TabType>("forum");
    const [forumSection, setForumSection] = useState<ForumSection>("general");
    const [connectFilter, setConnectFilter] = useState("all");

    const filteredConnect = connectFilter === "all"
        ? CONNECT_POSTS
        : CONNECT_POSTS.filter(p => p.type === connectFilter);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-0">
                <div className="flex items-center gap-2 mb-1">
                    <Users size={18} style={{ color: "#60a5fa" }} />
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>Community</h1>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--ct-text-muted)" }}>
                    The PNW music scene — talk, trade, collaborate, and connect.
                </p>

                {/* Main tabs */}
                <div className="flex gap-1 border-b" style={{ borderColor: "var(--ct-border)" }}>
                    {([
                        { key: "forum", label: "💬 Forum" },
                        { key: "connect", label: "🔗 Connect" },
                        { key: "radio", label: "📻 Radio & Pods" },
                        { key: "lessons", label: "📚 Lessons" },
                    ] as { key: TabType; label: string }[]).map(t => (
                        <button key={t.key} onClick={() => setMainTab(t.key)}
                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                            style={mainTab === t.key
                                ? { color: "#60a5fa", borderBottom: "2px solid #60a5fa" }
                                : { color: "var(--ct-text-muted)" }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* ── FORUM ────────────────────────────────────────── */}
                {mainTab === "forum" && (
                    <div className="flex gap-6">
                        {/* Forum sub-nav */}
                        <div className="w-44 flex-shrink-0 space-y-1">
                            {FORUM_TABS.map(t => (
                                <button key={t.key} onClick={() => setForumSection(t.key)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all"
                                    style={forumSection === t.key
                                        ? { backgroundColor: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }
                                        : { color: "var(--ct-text-muted)" }}>
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Posts */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                                    {FORUM_TABS.find(t => t.key === forumSection)?.label}
                                </p>
                                <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                                    style={{ backgroundColor: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                                    <Plus size={11} /> New Post
                                </button>
                            </div>

                            {FORUM_POSTS[forumSection]?.map(post => (
                                <div key={post.id} className="p-5 rounded-2xl transition-all cursor-pointer hover:bg-white/[0.04]"
                                    style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                                            style={{ backgroundColor: post.color + "22", color: post.color }}>
                                            {post.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--ct-text)" }}>{post.title}</p>
                                            <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--ct-text-muted)" }}>{post.text}</p>
                                            <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--ct-text-muted)" }}>
                                                <span className="font-semibold" style={{ color: post.color }}>@{post.author}</span>
                                                <span>{post.time}</span>
                                                <span>💬 {post.replies}</span>
                                                <span>❤️ {post.likes}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} style={{ color: "var(--ct-text-muted)" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── CONNECT ──────────────────────────────────────── */}
                {mainTab === "connect" && (
                    <div>
                        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                            <div className="flex gap-2 flex-wrap">
                                {CONNECT_TYPES.map(ct => (
                                    <button key={ct.key} onClick={() => setConnectFilter(ct.key)}
                                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                                        style={connectFilter === ct.key
                                            ? { backgroundColor: "#34d399", color: "#000" }
                                            : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}>
                                        {ct.label}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
                                style={{ background: "linear-gradient(135deg, #34d399, #06b6d4)", color: "#000" }}>
                                <Plus size={12} /> Post a Connect
                            </button>
                        </div>

                        <div className="space-y-3 max-w-3xl">
                            {filteredConnect.map(post => (
                                <div key={post.id} className="p-5 rounded-2xl transition-all hover:bg-white/[0.04] cursor-pointer"
                                    style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl flex-shrink-0">{post.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>{post.title}</p>
                                            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ct-text-muted)" }}>{post.body}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                                <span className="text-[9px] ml-2" style={{ color: "var(--ct-text-muted)" }}>{post.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{ backgroundColor: post.color + "22", color: post.color }}>
                                                {post.avatar}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button className="text-xs font-bold px-4 py-1.5 rounded-xl transition-all"
                                            style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                                            Contact
                                        </button>
                                        <button className="text-xs px-3 py-1.5 rounded-xl transition-all"
                                            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── RADIO & PODCASTS ─────────────────────────────── */}
                {mainTab === "radio" && (
                    <div className="max-w-3xl space-y-6">
                        <div className="p-5 rounded-2xl border text-center" style={{ backgroundColor: "rgba(244,114,182,0.05)", borderColor: "rgba(244,114,182,0.2)" }}>
                            <p className="text-lg font-black mb-1" style={{ color: "var(--ct-text)" }}>🎵 PNW Radio</p>
                            <p className="text-xs mb-4" style={{ color: "var(--ct-text-muted)" }}>6 genre stations streaming Pacific Northwest artists 24/7</p>
                            <a href="/console/radio" className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                                style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)", color: "#fff" }}>
                                <Radio size={13} /> Open PNW Radio
                            </a>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ct-text-muted)" }}>PNW Music Podcasts</p>
                            {[
                                { name: "Scene Report PNW", desc: "Weekly roundup of shows, releases, and scene news", ep: "Ep 47: Spring Tour Season Kicks Off", icon: "🎙️" },
                                { name: "The Gear Room", desc: "Gear talk for working musicians", ep: "Ep 31: Budget Home Recording Setups", icon: "🎛️" },
                                { name: "Backstage Pass", desc: "Interviews with PNW artists and venue owners", ep: "Ep 22: Inside the Top Hat with owner Sarah M.", icon: "🎤" },
                                { name: "The Business of Music", desc: "Booking, contracts, and making a living in music", ep: "Ep 15: Negotiating Guarantees in 2026", icon: "💼" },
                            ].map(pod => (
                                <div key={pod.name} className="flex items-start gap-4 p-4 rounded-2xl mb-2 transition-all hover:bg-white/[0.04] cursor-pointer"
                                    style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                    <span className="text-2xl flex-shrink-0">{pod.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>{pod.name}</p>
                                        <p className="text-xs mb-1" style={{ color: "var(--ct-text-muted)" }}>{pod.desc}</p>
                                        <p className="text-[10px] font-medium" style={{ color: "#a78bfa" }}>Latest: {pod.ep}</p>
                                    </div>
                                    <button className="text-[10px] font-bold px-3 py-1.5 rounded-xl flex-shrink-0" style={{ backgroundColor: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                                        ▶ Play
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── LESSONS ──────────────────────────────────────── */}
                {mainTab === "lessons" && (
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>
                            Musician Education — practical skills for working artists
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {LESSONS.map((lesson, i) => (
                                <div key={i} className="p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] hover:border-blue-500/30"
                                    style={{ backgroundColor: "rgba(255,255,255,0.025)", borderColor: "var(--ct-border)" }}>
                                    <span className="text-2xl block mb-3">{lesson.icon}</span>
                                    <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>{lesson.title}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-500">{lesson.level}</span>
                                        <span className="text-[9px] text-neutral-500">⏱ {lesson.dur}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {lesson.tags.map(t => (
                                            <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-md border" style={{ borderColor: "var(--ct-border)", color: "var(--ct-text-muted)" }}>#{t}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 mt-3 text-[10px] font-bold" style={{ color: "#60a5fa" }}>
                                        Watch / Read <ChevronRight size={10} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-5 rounded-2xl border border-dashed text-center" style={{ borderColor: "var(--ct-border)" }}>
                            <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>Have expertise to share?</p>
                            <p className="text-xs mb-3" style={{ color: "var(--ct-text-muted)" }}>Contribute a lesson or tutorial to the community</p>
                            <button className="text-xs font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                                Submit a Lesson
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
