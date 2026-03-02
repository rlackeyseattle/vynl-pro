import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    FileText, Wrench, Calendar, Megaphone, DollarSign,
    Users, Radio, BookOpen, ArrowRight, Music2, ExternalLink,
    TrendingUp, Zap, Star, UserPlus, Sparkles, Guitar, Package,
} from "lucide-react";
import DashboardClient from "./DashboardClient";
import SceneTicker from "@/components/SceneTicker";

const TOOLS = [
    {
        name: "EPK Builder", href: "/console/epk", icon: FileText,
        gradient: "from-cyan-500 to-blue-600", glow: "rgba(6,182,212,0.3)",
        desc: "Press kit, bio, photos & links", badge: "Start Here",
        vibe: "🎤 vocal booth",
    },
    {
        name: "Booking", href: "/console/wire", icon: Calendar,
        gradient: "from-violet-500 to-purple-700", glow: "rgba(139,92,246,0.3)",
        desc: "Venues, gigs & contracts",
        vibe: "🚐 tour van",
    },
    {
        name: "Promotion", href: "/console/press", icon: Megaphone,
        gradient: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.3)",
        desc: "Press & social toolkit",
        vibe: "📣 street team",
    },
    {
        name: "Gear", href: "/console/toolkit/gear", icon: Package,
        gradient: "from-amber-400 to-orange-500", glow: "rgba(251,191,36,0.3)",
        desc: "Inventory & show checklists",
        vibe: "🎸 equipment",
    },
    {
        name: "Stage Mode", href: "/console/stage", icon: Music2,
        gradient: "from-orange-500 to-red-600", glow: "rgba(249,115,22,0.3)",
        desc: "Setlists & live show tools",
        vibe: "💡 stage lights",
    },
    {
        name: "Band Team", href: "/console/community", icon: Users,
        gradient: "from-blue-500 to-indigo-600", glow: "rgba(59,130,246,0.3)",
        desc: "Channels, crew & collab",
        vibe: "🎚️ green room",
    },
    {
        name: "Finance", href: "/console/finance", icon: DollarSign,
        gradient: "from-emerald-500 to-green-600", glow: "rgba(16,185,129,0.3)",
        desc: "Revenue, merch & tracking", comingSoon: true,
        vibe: "💵 per diem",
    },
    {
        name: "Radio", href: "/console/lab", icon: Radio,
        gradient: "from-rose-500 to-pink-600", glow: "rgba(244,63,94,0.3)",
        desc: "Rotation stations & playlists",
        vibe: "📻 airwaves",
    },
    {
        name: "Education", href: "/console/woodshed", icon: BookOpen,
        gradient: "from-teal-500 to-cyan-600", glow: "rgba(20,184,166,0.3)",
        desc: "Lessons & practice tools",
        vibe: "🎼 woodshed",
    },
];

// Easter egg: hidden messages scattered in console
const EASTER_EGGS = [
    "// remember to check levels before soundcheck",
    "// tune up. always.",
    "/* this function rocks */",
    "// don't forget to tip your sound engineer",
    "// check the rider. no brown M&Ms.",
    "// save your session. save it again.",
    "// the bass player showed up on time for once",
    "// gain before beauty",
    "// 11 is louder than 10",
    "// it ain't loud enough",
];

export default async function ConsoleDashboard() {
    const session = await auth();
    const userEmail = session?.user?.email || "rlackey.seattle@gmail.com";

    let profile = null;
    let songCount = 0;

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { profile: { include: { _count: { select: { songs: true } } } } },
        });
        profile = user?.profile;
        songCount = profile?._count?.songs ?? 0;
    } catch { }

    const firstName = session?.user?.name?.split(" ")[0] || "Artist";
    const hour = new Date().getHours();
    const greeting = hour < 5 ? "Still up?" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Burning midnight oil,";
    const easterEgg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];

    return (
        <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* ── STAGE LIGHTS — top decorative cones ─────────────────── */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-72 overflow-hidden" aria-hidden>
                {/* Main accent glow */}
                <div className="absolute top-0 left-1/4 w-[500px] h-72 opacity-[0.07]"
                    style={{ background: "radial-gradient(ellipse at top, var(--ct-accent), transparent 65%)" }} />
                <div className="absolute top-0 right-1/4 w-[400px] h-60 opacity-[0.05]"
                    style={{ background: "radial-gradient(ellipse at top, var(--ct-accent-2), transparent 65%)" }} />

                {/* Stage light cones — SVG-style using clip paths */}
                <div className="absolute top-0 left-[10%] w-[2px] h-40 opacity-20"
                    style={{ background: "linear-gradient(to bottom, var(--ct-accent), transparent)" }} />
                <div className="absolute top-0 left-[10%] w-32 h-48 opacity-[0.04]"
                    style={{ background: "linear-gradient(to bottom, var(--ct-accent), transparent)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />

                <div className="absolute top-0 left-[30%] w-[2px] h-52 opacity-15"
                    style={{ background: "linear-gradient(to bottom, #f472b6, transparent)" }} />
                <div className="absolute top-0 left-[30%] w-24 h-52 opacity-[0.03]"
                    style={{ background: "linear-gradient(to bottom, #f472b6, transparent)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />

                <div className="absolute top-0 right-[30%] w-[2px] h-44 opacity-15"
                    style={{ background: "linear-gradient(to bottom, #a78bfa, transparent)" }} />
                <div className="absolute top-0 right-[30%] w-28 h-44 opacity-[0.03]"
                    style={{ background: "linear-gradient(to bottom, #a78bfa, transparent)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />

                <div className="absolute top-0 right-[12%] w-[2px] h-36 opacity-12"
                    style={{ background: "linear-gradient(to bottom, #f59e0b, transparent)" }} />
                <div className="absolute top-0 right-[12%] w-20 h-36 opacity-[0.03]"
                    style={{ background: "linear-gradient(to bottom, #f59e0b, transparent)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
            </div>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="relative px-8 pt-10 pb-8">
                <div className="relative flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-2xl"
                        style={{ background: "linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))", boxShadow: "0 8px 32px var(--ct-glow)" }}>
                        🎸
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs mb-0.5" style={{ color: "var(--ct-text-muted)" }}>
                            {greeting}
                        </p>
                        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>
                            {firstName}
                        </h1>
                        {profile ? (
                            <p className="text-sm mt-1" style={{ color: "var(--ct-text-muted)" }}>
                                <span style={{ color: "var(--ct-accent)" }}>@{profile.handle}</span>
                                {" · "}{songCount} songs
                                {(profile as any).musicianType && ` · ${(profile as any).musicianType}`}
                            </p>
                        ) : (
                            <p className="text-xs mt-1" style={{ color: "var(--ct-text-muted)" }}>
                                Set up your EPK to get started →
                            </p>
                        )}
                    </div>

                    {/* View Live button */}
                    {profile?.handle && (
                        <Link href={`/${profile.handle}`} target="_blank"
                            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-105 flex-shrink-0"
                            style={{
                                background: "linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))",
                                color: "#000",
                                fontWeight: 700,
                                boxShadow: "0 4px 16px var(--ct-glow)",
                            }}>
                            <ExternalLink size={11} />
                            View Live
                        </Link>
                    )}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-2 mt-6">
                    <StatPill icon={<Music2 size={13} />} label="Songs" value={songCount} color="var(--ct-accent)" />
                    <StatPill icon={<Star size={13} />} label="Gigs" value={0} color="#f59e0b" />
                    <StatPill icon={<TrendingUp size={13} />} label="Profile Views" value={0} color="#a78bfa" />
                    <StatPill icon={<UserPlus size={13} />} label="Followers" value={0} color="#f472b6" />
                    <StatPill icon={<Zap size={13} />} label="EPK Sends" value={0} color="#34d399" />
                </div>
            </div>

            {/* ── LIVE SCENE TICKER ─────────────────────────────────── */}
            <SceneTicker />

            {/* ── STUDIO TEXTURE BAND — thin horizontal rule with grain ─ */}
            <div className="mx-8 mb-6 h-px relative overflow-visible" style={{ backgroundColor: "var(--ct-border)" }}>
                <div className="absolute -top-1 left-0 right-0 h-3 opacity-5"
                    style={{ background: "repeating-linear-gradient(90deg, var(--ct-accent) 0px, transparent 1px, transparent 8px)" }} />
            </div>

            {/* ── TOOL GRID ─────────────────────────────────────────────── */}
            <div className="px-8 pb-6">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>
                    Your Console
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {TOOLS.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.href} href={tool.href}>
                                <div className="relative group p-5 rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full"
                                    style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ background: `radial-gradient(ellipse at 30% 50%, ${tool.glow}, transparent 70%)` }} />

                                    {/* Stage light accent beam on hover */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                                        style={{
                                            height: "60px",
                                            background: `linear-gradient(to bottom, ${tool.glow?.replace("0.3", "0.6")}, transparent)`,
                                            clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
                                        }} />

                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 shadow-lg transition-transform group-hover:scale-110 duration-200`}
                                            style={{ boxShadow: `0 6px 20px ${tool.glow}` }}>
                                            <Icon size={18} className="text-white" />
                                        </div>

                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: "var(--ct-text)" }}>{tool.name}</p>
                                                <p className="text-xs mt-0.5" style={{ color: "var(--ct-text-muted)" }}>{tool.desc}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 ml-2">
                                                {tool.badge && (
                                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                                        style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                                                        {tool.badge}
                                                    </span>
                                                )}
                                                {tool.comingSoon && (
                                                    <span className="text-[8px] px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)" }}>
                                                        Soon
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Vibe tag + open arrow */}
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[9px] opacity-30 group-hover:opacity-60 transition-opacity"
                                                style={{ color: "var(--ct-text-muted)" }}>
                                                {tool.vibe}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ color: "var(--ct-accent)" }}>
                                                Open <ArrowRight size={10} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── STUDIO FLOOR TEXTURE — decorative VU meter bars ──────── */}
            <div className="mx-8 my-2 flex items-end gap-[3px] h-6 overflow-hidden opacity-[0.06]" aria-hidden>
                {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm"
                        style={{
                            height: `${Math.sin(i * 0.4) * 50 + 60}%`,
                            background: i < 36 ? "var(--ct-accent)" : i < 44 ? "#f59e0b" : "#f87171",
                        }} />
                ))}
            </div>

            {/* ── BOTTOM PANELS ──────────────────────────────────────────── */}
            <div className="px-8 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Rehearsal room vibe panel */}
                <div className="p-5 rounded-2xl relative overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03]"
                        style={{ background: "radial-gradient(ellipse, #f59e0b, transparent)" }} />
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🥁</span>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                            Rehearsal Room
                        </p>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>
                        Got a set to practice?
                    </p>
                    <p className="text-xs mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Stage Mode lets you run through your setlist hands-free. Tab through chords, cue lyrics, set the BPM.
                    </p>
                    <Link href="/console/stage"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}>
                        Open Stage Mode <ArrowRight size={10} />
                    </Link>
                </div>

                {/* Tour van vibe panel */}
                <div className="p-5 rounded-2xl relative overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03]"
                        style={{ background: "radial-gradient(ellipse, #a78bfa, transparent)" }} />
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🚐</span>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                            On The Road
                        </p>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>
                        Ready to route a tour?
                    </p>
                    <p className="text-xs mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Search 77+ PNW venues across WA, OR, MT, and ID. Send booking requests, generate contracts, track your dates.
                    </p>
                    <Link href="/console/wire"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                        Find Venues <ArrowRight size={10} />
                    </Link>
                </div>

                {/* Gear / load-out panel */}
                <div className="p-5 rounded-2xl relative overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🎛️</span>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                            Load Out Checklist
                        </p>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--ct-text)" }}>
                        Don't leave your Les Paul at the venue.
                    </p>
                    <p className="text-xs mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Track every piece of gear through load-out, load-in, stage check, and after-show recovery.
                    </p>
                    <Link href="/console/toolkit/gear"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(251,191,36,0.1)", color: "#f59e0b", border: "1px solid rgba(251,191,36,0.2)" }}>
                        Open Gear Manager <ArrowRight size={10} />
                    </Link>
                </div>

                {/* Platform mission */}
                <div className="p-5 rounded-2xl relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.04), rgba(139,92,246,0.04))", border: "1px solid var(--ct-border)" }}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
                        style={{ background: "radial-gradient(ellipse, var(--ct-accent), transparent)", filter: "blur(30px)" }} />
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} style={{ color: "var(--ct-accent)" }} />
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                            VYNL.PRO
                        </p>
                    </div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--ct-text)" }}>
                        Built for artists who do it themselves.
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>
                        Venue booking, AI tour routing, team collab, gear inventory, contract management, merch, rotation radio, and a full artist ecosystem directory — all in one place.
                    </p>
                </div>
            </div>

            {/* ── EASTER EGG — hidden dev comment style footer ─────────── */}
            <div className="px-8 pb-6">
                <p className="text-[9px] font-mono opacity-[0.08] hover:opacity-30 transition-opacity select-none cursor-default"
                    style={{ color: "var(--ct-text-muted)" }} title="🎸">
                    {easterEgg}
                </p>
            </div>

            {/* ── Interactive client layer (Konami code easter egg etc) ── */}
            <DashboardClient />
        </div>
    );
}

function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)" }}>
            <span style={{ color }}>{icon}</span>
            <div>
                <p className="text-sm font-bold leading-none" style={{ color: "var(--ct-text)" }}>{value}</p>
                <p className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "var(--ct-text-muted)" }}>{label}</p>
            </div>
        </div>
    );
}
