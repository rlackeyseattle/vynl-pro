"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Layout, ArrowRight, Loader2, Check, Lock, AtSign, Mail, Guitar } from "lucide-react";

function JoinContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code") || "";

    const [step, setStep] = useState<"verify" | "signup" | "login" | "success">("verify");
    const [invite, setInvite] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [handle, setHandle] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // Verify invite on mount
    useEffect(() => {
        if (!code) { setError("No invite code provided."); return; }
        fetch(`/api/invites/verify?code=${code}`)
            .then(r => r.json())
            .then(data => {
                if (data.valid) { setInvite(data.invite); setStep("signup"); }
                else setError(data.error || "Invalid or expired invite.");
            })
            .catch(() => setError("Failed to verify invite."));
    }, [code]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) { setError("Passwords don't match."); return; }
        if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, handle, inviteCode: code }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Registration failed."); return; }

            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) { router.push("/login"); }
            else { setStep("success"); setTimeout(() => router.push("/console"), 1800); }
        } catch { setError("Something went wrong."); }
        finally { setLoading(false); }
    };

    const handleOAuth = (provider: "google" | "discord") =>
        signIn(provider, { callbackUrl: "/console" });

    if (error && step === "verify") {
        return (
            <Page>
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
                        <span className="text-2xl">⚠</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Invalid Invite</h1>
                    <p className="text-red-400 text-sm">{error}</p>
                    <Link href="/signup" className="block text-xs text-neutral-500 hover:text-white transition-colors mt-4">
                        Create an account without invite →
                    </Link>
                </div>
            </Page>
        );
    }

    if (step === "verify") {
        return (
            <Page>
                <div className="text-center">
                    <Loader2 size={32} className="animate-spin text-neutral-600 mx-auto mb-4" />
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">Verifying invite...</p>
                </div>
            </Page>
        );
    }

    if (step === "success") {
        return (
            <Page>
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto animate-pulse">
                        <Check size={32} className="text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white italic">You're In.</h1>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">Loading your console...</p>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            {/* Invite badge */}
            {invite?.label && (
                <div className="text-center mb-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        🎸 Invited: {invite.label}
                    </span>
                </div>
            )}

            <div className="text-center space-y-3 mb-8">
                <h1 className="text-4xl font-black tracking-tight text-white italic uppercase">Join VYNL.PRO</h1>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">
                    Invite Code: <span className="text-cyan-400 font-mono">{code}</span>
                </p>
            </div>

            {/* OAuth quick join */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => handleOAuth("google")}
                    className="flex items-center justify-center gap-3 bg-neutral-900 border border-white/10 py-4 rounded-2xl hover:border-white/20 hover:bg-neutral-800 transition-all">
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-black">G</span>
                    <span className="text-xs font-semibold text-white">Google</span>
                </button>
                <button onClick={() => handleOAuth("discord")}
                    className="flex items-center justify-center gap-3 bg-indigo-950/60 border border-indigo-700/30 py-4 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-900/40 transition-all">
                    <span className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">D</span>
                    <span className="text-xs font-semibold text-white">Discord</span>
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                <div className="relative flex justify-center">
                    <span className="bg-[#07070e] px-3 text-[10px] text-neutral-600 uppercase tracking-widest">or sign up with email</span>
                </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-3">
                <div className="relative">
                    <AtSign size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input value={handle} onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        placeholder="choose a handle" required minLength={2} maxLength={30}
                        className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-neutral-700" />
                </div>
                <div className="relative">
                    <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="email address" required
                        className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-neutral-700" />
                </div>
                <div className="relative">
                    <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="password (min 8)" required
                        className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-neutral-700" />
                </div>
                <div className="relative">
                    <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="confirm password" required
                        className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-neutral-700" />
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button type="submit" disabled={loading}
                    className="w-full bg-cyan-400 text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all disabled:opacity-50 mt-2">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    {loading ? "Creating Account..." : "Join VYNL.PRO"}
                </button>
            </form>

            <p className="text-center text-xs text-neutral-600 mt-4">
                Already have an account? <Link href="/login" className="text-cyan-400 hover:text-white transition-colors">Sign in</Link>
            </p>
        </Page>
    );
}

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#07070e] text-white flex flex-col items-center justify-center p-6">
            <Link href="/" className="flex items-center gap-2 mb-10 opacity-60 hover:opacity-100 transition-opacity">
                <Guitar size={18} className="text-cyan-400" />
                <span className="font-black tracking-tight text-lg italic text-white">VYNL.PRO</span>
            </Link>
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07070e]" />}>
            <JoinContent />
        </Suspense>
    );
}
