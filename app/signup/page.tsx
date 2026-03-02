"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Layout, ArrowRight, Loader2, Check, User, Mail, Lock, AtSign } from "lucide-react";
import Link from "next/link";

function SignupContent() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "success">("form");
    const [handle, setHandle] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, handle }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed.");
                return;
            }

            // Auto sign in after successful registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                // Registration worked but auto-login failed — send to login
                router.push("/login?registered=1");
            } else {
                setStep("success");
                setTimeout(() => router.push("/console"), 1800);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = (provider: "google" | "discord") => {
        signIn(provider, { callbackUrl: "/console" });
    };

    if (step === "success") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-vynl-teal/10 border border-vynl-teal/30 flex items-center justify-center mx-auto animate-pulse">
                        <Check size={32} className="text-vynl-teal" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic">Access Granted</h1>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Initializing your console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-vynl-teal/30">
            <div className="w-full max-w-md space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-vynl-teal hover:text-white transition-colors mb-4">
                        <Layout size={24} />
                        <span className="font-black tracking-tighter text-2xl italic">VYNL.PRO</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Create Access</h1>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Join the Network</p>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleOAuth("google")}
                        className="flex items-center justify-center gap-3 bg-neutral-900 border border-white/5 py-4 rounded-2xl hover:border-white/20 transition-all group"
                    >
                        <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="text-[8px] font-black">G</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleOAuth("discord")}
                        className="flex items-center justify-center gap-3 bg-neutral-900 border border-white/5 py-4 rounded-2xl hover:border-white/20 transition-all group"
                    >
                        <div className="w-4 h-4 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                            <span className="text-[8px] font-black text-indigo-400">D</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Discord</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                        <span className="bg-black px-4 text-neutral-700">Or with email</span>
                    </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Handle */}
                    <div className="relative">
                        <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                        <input
                            type="text"
                            placeholder="handle"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-12 pr-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700"
                            required
                            minLength={2}
                            maxLength={30}
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                        <input
                            type="email"
                            placeholder="email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-12 pr-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                        <input
                            type="password"
                            placeholder="password (min 8 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-12 pr-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                        <input
                            type="password"
                            placeholder="confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-12 pr-6 py-5 focus:outline-none focus:border-vynl-teal/50 transition-all font-mono text-xs tracking-widest placeholder:text-neutral-700"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest px-4">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-vynl-teal text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                        {loading ? "Creating Account..." : "Initialize Account"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-[10px] text-neutral-600 uppercase tracking-widest">
                    Already have access?{" "}
                    <Link href="/login" className="text-vynl-teal hover:text-white transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SignupContent />
        </Suspense>
    );
}
