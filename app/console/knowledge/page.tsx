import Link from "next/link";
import { BookOpen, ArrowRight, Zap, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Knowledge Base | VYNL",
    description: "Interactive manuals, guides, and tips for musicians — DAWs, gear, live performance, and more.",
};

const GUIDES = [
    {
        id: "reaper",
        name: "Reaper DAW",
        subtitle: "Complete Interactive Manual",
        desc: "Master the most flexible DAW on the planet. Hotkeys, routing, FX chains, MIDI, mixing, and pro workflow tips.",
        href: "/console/knowledge/reaper",
        emoji: "🎛️",
        gradient: "from-cyan-500 to-teal-600",
        glow: "rgba(6,182,212,0.3)",
        badge: "Comprehensive",
        tags: ["Recording", "Mixing", "MIDI", "200+ Shortcuts"],
        status: "available",
    },
    {
        id: "ableton",
        name: "Ableton Live",
        subtitle: "Session View & Workflow Guide",
        desc: "Loop-based production, clip launching, Ableton instruments and Max for Live essentials.",
        href: "#",
        emoji: "🎹",
        gradient: "from-orange-500 to-amber-600",
        glow: "rgba(249,115,22,0.3)",
        tags: ["Session View", "Clips", "Push"],
        status: "coming-soon",
    },
    {
        id: "protools",
        name: "Pro Tools",
        subtitle: "Industry Standard Workflow",
        desc: "Industry-standard recording workflows, edit modes, Pro Tools shortcuts and advanced routing.",
        href: "#",
        emoji: "🎞️",
        gradient: "from-blue-500 to-indigo-600",
        glow: "rgba(59,130,246,0.3)",
        tags: ["Recording", "Post", "Avid"],
        status: "coming-soon",
    },
    {
        id: "live-sound",
        name: "Live Sound",
        subtitle: "Soundcheck to Showtime",
        desc: "PA setup, gain staging, monitor mixes, DI boxes, running FOH, troubleshooting feedback.",
        href: "#",
        emoji: "🔊",
        gradient: "from-purple-500 to-violet-600",
        glow: "rgba(139,92,246,0.3)",
        tags: ["FOH", "Monitors", "Gain Staging"],
        status: "coming-soon",
    },
];

export default function KnowledgePage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="px-8 pt-10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: "linear-gradient(135deg, var(--ct-accent), var(--ct-accent-2))", boxShadow: "0 8px 32px var(--ct-glow)" }}
                    >
                        <BookOpen size={18} className="text-black" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>Knowledge Base</h1>
                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Interactive guides, manuals & cheat sheets for musicians</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                    {["DAWs", "Live Sound", "Gear", "Music Theory", "Production Tips"].map((tag) => (
                        <span
                            key={tag}
                            className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text-muted)" }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="mx-8 mb-6 h-px" style={{ backgroundColor: "var(--ct-border)" }} />

            {/* Available now */}
            <div className="px-8 pb-4">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>
                    Available Now
                </p>

                {/* Featured card */}
                {GUIDES.filter(g => g.status === "available").map(guide => (
                    <Link key={guide.id} href={guide.href}>
                        <div
                            className="relative group p-6 rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01] cursor-pointer mb-4"
                            style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ background: `radial-gradient(ellipse at 20% 50%, ${guide.glow}, transparent 70%)` }} />

                            <div className="relative flex items-start gap-5">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-2xl"
                                    style={{ background: `linear-gradient(135deg, ${guide.gradient.replace("from-", "").split(" ")[0]}, ${guide.gradient.replace("from-", "").split(" to-")[1]})` }}
                                >
                                    {guide.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-black" style={{ color: "var(--ct-text)" }}>{guide.name}</h2>
                                        {guide.badge && (
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>
                                                {guide.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--ct-accent)" }}>{guide.subtitle}</p>
                                    <p className="text-sm mb-3" style={{ color: "var(--ct-text-muted)" }}>{guide.desc}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1.5">
                                            {guide.tags.map(tag => (
                                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ color: "var(--ct-accent)" }}>
                                            Open Guide <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Coming Soon */}
            <div className="px-8 pb-10">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ct-text-muted)" }}>
                    Coming Soon
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {GUIDES.filter(g => g.status === "coming-soon").map(guide => (
                        <div
                            key={guide.id}
                            className="relative p-5 rounded-2xl overflow-hidden opacity-50 cursor-not-allowed"
                            style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid var(--ct-border)" }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{guide.emoji}</span>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>{guide.name}</p>
                                    <p className="text-[9px]" style={{ color: "var(--ct-text-muted)" }}>{guide.subtitle}</p>
                                </div>
                            </div>
                            <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{guide.desc}</p>
                            <span className="mt-3 inline-block text-[9px] px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                Coming Soon
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="mx-8 mb-10 p-5 rounded-2xl flex items-center justify-between gap-4"
                style={{ backgroundColor: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={13} style={{ color: "var(--ct-accent)" }} />
                        <p className="text-xs font-bold" style={{ color: "var(--ct-accent)" }}>Request a Guide</p>
                    </div>
                    <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                        Missing something? Let us know what gear, DAW, or topic you'd like covered next.
                    </p>
                </div>
                <a href="mailto:rlackey.seattle@gmail.com?subject=VYNL Knowledge Request"
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl flex-shrink-0 transition-all hover:scale-105"
                    style={{ backgroundColor: "rgba(6,182,212,0.15)", color: "var(--ct-accent)", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <ExternalLink size={11} /> Request
                </a>
            </div>
        </div>
    );
}
