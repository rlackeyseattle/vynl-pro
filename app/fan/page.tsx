"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Music2, Heart, Star, Users, MapPin, Guitar, Radio, ArrowRight, Check, Loader2 } from "lucide-react";

// ── Demo fan profile (after signup) ──────────────────────────────────────────
const DEMO_FAN = {
    handle: "JackWhiteNoise",
    avatar: "🎸",
    avatarBg: "linear-gradient(135deg, #dc2626, #7c3aed)",
    bio: "PNW music addict. Tractor Tavern regular. Here for the local scene.",
    city: "Seattle, WA",
    following: ["Rob Lackey Band", "Dirty Buttons", "Cold Shoulder Method"],
    favoriteVenues: ["Tractor Tavern", "The Badlander", "Neumos"],
    streetTeams: ["Rob Lackey Band Street Team"],
    attended: 14,
    following_count: 23,
};

export default function FanSignupPage() {
    const [step, setStep] = useState<"landing" | "profile" | "success">("landing");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [city, setCity] = useState("");

    const handleOAuth = (provider: "google" | "discord") => {
        setLoading(true);
        signIn(provider, { callbackUrl: "/fan/welcome" });
    };

    const handleQuickSignup = () => {
        setStep("profile");
    };

    const handleFinish = () => setStep("success");

    if (step === "success") {
        return (
            <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-sm w-full text-center space-y-6">
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-2xl"
                        style={{ background: DEMO_FAN.avatarBg }}>
                        {DEMO_FAN.avatar}
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 mb-1 uppercase tracking-widest">Welcome to the scene,</p>
                        <h1 className="text-3xl font-black tracking-tight">{name || DEMO_FAN.handle}</h1>
                        <p className="text-sm text-neutral-400 mt-2">{city || "PNW Music Fan"}</p>
                    </div>

                    {/* Demo fan profile preview */}
                    <div className="p-6 rounded-2xl text-left bg-white/[0.025] border border-white/[0.07] space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Your Fan Profile</p>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: DEMO_FAN.avatarBg }}>
                                {DEMO_FAN.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{name || DEMO_FAN.handle}</p>
                                <p className="text-xs text-neutral-500">{city || "Seattle, WA"}</p>
                            </div>
                        </div>

                        {[
                            { icon: <Music2 size={11} />, label: "Following artists", value: "0 artists" },
                            { icon: <Heart size={11} />, label: "Fave venues", value: "0 venues" },
                            { icon: <Users size={11} />, label: "Street teams", value: "None yet" },
                        ].map(row => (
                            <div key={row.label} className="flex items-center gap-2">
                                <span className="text-neutral-600">{row.icon}</span>
                                <span className="text-xs text-neutral-400">{row.label}:</span>
                                <span className="text-xs text-neutral-300">{row.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Link href="/venues/tractor-tavern"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-violet-600 text-white transition-all hover:opacity-90">
                            Explore Venues <ArrowRight size={14} />
                        </Link>
                        <Link href="/"
                            className="w-full flex items-center justify-center py-2 text-xs text-neutral-600 hover:text-white transition-colors">
                            Go to VYNL.PRO →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (step === "profile") {
        return (
            <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-sm w-full space-y-6">
                    {/* Choose avatar */}
                    <div className="text-center">
                        <h2 className="text-2xl font-black tracking-tight mb-1">One more thing</h2>
                        <p className="text-sm text-neutral-500">Customize your fan profile — you can always edit this later</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1.5">Your name (or handle)</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                placeholder="JackWhiteNoise" autoFocus
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/40 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1.5">Your city</label>
                            <input value={city} onChange={e => setCity(e.target.value)}
                                placeholder="Seattle, WA"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/40 transition-all" />
                        </div>
                    </div>

                    {/* Genre picks */}
                    <div>
                        <label className="text-xs text-neutral-500 block mb-2">Genres you're into</label>
                        <div className="flex flex-wrap gap-2">
                            {["Indie Rock", "Alt-Country", "Americana", "Folk", "Punk", "Metal", "Hip-Hop", "Electronic", "Jazz", "Classical"].map(g => (
                                <button key={g} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleFinish}
                        className="w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 transition-all">
                        Finish Setup →
                    </button>
                    <button onClick={handleFinish} className="w-full text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
                        Skip for now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">
            {/* Stage light bg */}
            <div className="absolute top-0 left-1/4 w-72 h-96 opacity-[0.06] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top, #06b6d4, transparent 60%)" }} />
            <div className="absolute top-0 right-1/3 w-60 h-80 opacity-[0.04] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top, #7c3aed, transparent 60%)" }} />

            <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                        <span className="font-black text-black italic">V</span>
                    </div>
                    <span className="font-black text-lg tracking-tight">VYNL.PRO</span>
                </Link>

                <div className="max-w-sm w-full space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">
                            Join the<br />
                            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                                Local Scene
                            </span>
                        </h1>
                        <p className="text-sm text-neutral-400">
                            Follow artists, track shows, join street teams.<br />
                            Free forever for fans.
                        </p>
                    </div>

                    {/* One-click social */}
                    <div className="space-y-3">
                        <button onClick={() => handleOAuth("google")} disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm bg-white text-black hover:bg-neutral-100 transition-all disabled:opacity-50">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : (
                                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-[9px] font-black text-white">G</span>
                            )}
                            Continue with Google
                        </button>
                        <button onClick={() => handleOAuth("discord")} disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50">
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-black">D</span>
                            Continue with Discord
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#080810] px-3 text-[10px] text-neutral-600 uppercase tracking-widest">or</span>
                        </div>
                    </div>

                    <button onClick={handleQuickSignup}
                        className="w-full py-4 rounded-2xl font-semibold text-sm border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                        Sign up with email
                    </button>

                    {/* What you get */}
                    <div className="pt-2 space-y-2">
                        {[
                            { icon: "🎵", text: "Follow local artists & get notified of new releases" },
                            { icon: "📅", text: "Track upcoming shows at PNW venues" },
                            { icon: "🤘", text: "Join artist street teams & help promote shows" },
                            { icon: "💬", text: "Comment on venues, shows, and artist profiles" },
                            { icon: "📻", text: "Listen to local genre radio stations" },
                        ].map(item => (
                            <div key={item.text} className="flex items-start gap-3">
                                <span className="text-base">{item.icon}</span>
                                <span className="text-xs text-neutral-400 leading-relaxed">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-[10px] text-neutral-700">
                        Already an artist?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-white transition-colors">
                            Artist login →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
