"use client";
// Teal/cyan cyber accent version — subtle glow, glass, high-end studio

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Music2, DollarSign, Users, Zap, Package, Globe, Truck, Rss } from "lucide-react";
import Link from "next/link";

const FEATURES = [
    { icon: Music2, label: "Stage Mode", desc: "Setlists, charts, live tools" },
    { icon: DollarSign, label: "Finance", desc: "Gig income & splits" },
    { icon: Truck, label: "Loadout", desc: "Gear tracking & band passes" },
    { icon: Users, label: "The Crew", desc: "Team messaging & collab" },
    { icon: Package, label: "Supply Co.", desc: "Pro gear & VYNL merch" },
    { icon: Globe, label: "Scene", desc: "PNW venue directory" },
    { icon: Rss, label: "Music Wire", desc: "Live industry news" },
    { icon: Zap, label: "The Lab", desc: "AI tools for artists" },
];

type AuthMode = "login" | "signup";

export default function Home() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (mode === "signup") {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });
                if (!res.ok) {
                    const d = await res.json();
                    setError(d.error || "Signup failed");
                    setLoading(false);
                    return;
                }
            }
            const result = await signIn("credentials", {
                email, password, redirect: false,
            });
            if (result?.error) {
                setError("Wrong email or password");
                setLoading(false);
            } else {
                router.push("/console");
            }
        } catch {
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Grid texture */}
            <div className="fixed inset-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,242,242,0.025) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            {/* Ambient glows — amber + teal cyber */}
            <div className="fixed top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)" }} />
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,242,242,0.05) 0%, transparent 70%)" }} />
            {/* Teal cyber accent — top left */}
            <div className="fixed top-[30%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,242,242,0.04) 0%, transparent 70%)" }} />

            {/* Nav */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6" stroke="black" strokeWidth="1.5" />
                            <circle cx="7" cy="7" r="2" fill="black" />
                        </svg>
                    </div>
                    <span className="font-black text-sm tracking-tight">VYNL.PRO</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {["Features", "Store", "About"].map(l => (
                        <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setMode("login")}
                        className="text-xs px-4 py-1.5 rounded-lg transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.5)" }}>
                        Log in
                    </button>
                    <button onClick={() => setMode("signup")}
                        className="text-xs px-4 py-1.5 rounded-lg font-semibold transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#000" }}>
                        Get started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-73px)]">

                {/* Left — copy */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold mb-6 border"
                        style={{ borderColor: "rgba(0,242,242,0.25)", backgroundColor: "rgba(0,242,242,0.04)", color: "#00f2f2", boxShadow: "0 0 20px rgba(0,242,242,0.08)" }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00f2f2" }} />
                        Built for working musicians
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6"
                        style={{ letterSpacing: "-0.03em" }}>
                        Your entire music<br />
                        <span style={{ background: "linear-gradient(135deg, #00f2f2 0%, #f59e0b 60%, #ef4444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            career, one place.
                        </span>
                    </h1>

                    <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "480px" }}>
                        Press kits, gig booking, setlists, gear tracking, band passes, finances, and more —
                        everything a working musician needs, from soundcheck to payday.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {FEATURES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border transition-all cursor-default"
                                    style={{ borderColor: "rgba(0,242,242,0.1)", backgroundColor: "rgba(0,242,242,0.03)", color: "rgba(255,255,255,0.5)" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,242,0.3)"; (e.currentTarget as HTMLElement).style.color = "#00f2f2"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0,242,242,0.08)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,242,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                                    <Icon size={11} />
                                    <span className="font-medium">{f.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        Free forever for solo artists · Made in Missoula, MT 🎸
                    </p>
                </motion.div>

                {/* Right — Auth Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
                >
                    <div className="rounded-2xl p-7 border" style={{ backgroundColor: "rgba(5,5,10,0.7)", borderColor: "rgba(0,242,242,0.15)", backdropFilter: "blur(24px)", boxShadow: "0 0 40px rgba(0,242,242,0.06), inset 0 1px 0 rgba(0,242,242,0.08)" }}>

                        {/* Mode toggle */}
                        <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: "rgba(0,242,242,0.04)", border: "1px solid rgba(0,242,242,0.08)" }}>
                            {(["login", "signup"] as AuthMode[]).map(m => (
                                <button key={m} onClick={() => { setMode(m); setError(""); }}
                                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                                    style={mode === m
                                        ? { backgroundColor: "rgba(0,242,242,0.1)", color: "#00f2f2", boxShadow: "0 0 12px rgba(0,242,242,0.1)" }
                                        : { color: "rgba(255,255,255,0.35)" }}>
                                    {m === "login" ? "Log in" : "Create account"}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <AnimatePresence>
                                {mode === "signup" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required={mode === "signup"}
                                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                            onFocus={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"}
                                            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                onFocus={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                onFocus={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                            />

                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-xs px-3 py-2 rounded-lg"
                                    style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    {error}
                                </motion.p>
                            )}

                            <button type="submit" disabled={loading}
                                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#000" }}>
                                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                                {loading ? "One sec..." : mode === "login" ? "Log in to VYNL" : "Create my account"}
                                {!loading && <ArrowRight size={14} />}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
                            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                        </div>

                        <Link href="/console"
                            className="w-full py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                            Browse as guest
                        </Link>

                        <p className="text-center text-[9px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                            By continuing you agree to our{" "}
                            <Link href="/legal" className="underline hover:text-white/50">Terms</Link>
                            {" "}&{" "}
                            <Link href="/privacy" className="underline hover:text-white/50">Privacy</Link>.
                        </p>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-3 mt-5">
                        <div className="flex -space-x-1.5">
                            {["🎸", "🥁", "🎹", "🎤"].map((e, i) => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px]"
                                    style={{ borderColor: "#0a0a0c", backgroundColor: "rgba(255,255,255,0.06)" }}>{e}</div>
                            ))}
                        </div>
                        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                            Join musicians already on VYNL
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
