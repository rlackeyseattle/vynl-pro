"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SocialLogin from "@/components/auth/SocialLogin";

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-white/50" size={32} />
            </div>
        }>
            <JoinContent />
        </Suspense>
    );
}

function JoinContent() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        handle: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;
        setError("");

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));

        startTransition(async () => {
            const result = await registerUser(data);

            if (result.success) {
                setSuccess(true);
                // Attempt sign in
                const signInResult = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password
                });

                if (signInResult?.error) {
                    setError("Account created, but auto-login failed. Please log in manually.");
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    router.push(`/${formData.handle}`);
                }

            } else {
                setError(result.message || "Registration failed");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-white/20 p-6">

            {/* Background Visuals */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 blur-[150px] rounded-full opacity-40 animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/10 blur-[150px] rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tighter mb-2">INITIALIZE PROFILE</h1>
                    <p className="text-xs text-neutral-500 tracking-[0.2em] uppercase">Join the Network</p>
                </div>

                <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                    <SocialLogin />

                    <div className="my-6 text-center text-xs text-neutral-600 font-bold tracking-widest uppercase flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        OR MANUAL ENTRY
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Input
                            placeholder="FULL NAME"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            placeholder="HANDLE"
                            name="handle"
                            value={formData.handle}
                            onChange={handleChange}
                            prefix="@"
                        />

                        <Input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            type="password"
                            placeholder="PASSWORD"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
                            >
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending || success}
                            className="w-full bg-white text-black font-bold tracking-widest uppercase py-4 rounded-full hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : (success ? "INITIALIZING..." : <span className="flex items-center gap-2">CREATE IDENTITY <ArrowRight size={16} /></span>)}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-[10px] text-neutral-500 font-mono">
                                ALREADY INITIALIZED? <Link href="/login" className="text-white hover:underline ml-1">LOG IN</Link>
                            </p>
                        </div>

                    </form>
                </div>

            </motion.div>
        </div>
    );
}

// Helper Input Component
function Input({ prefix, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { prefix?: string }) {
    return (
        <div className="relative">
            {prefix && (
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-500 font-mono text-sm leading-none pt-1">
                    {prefix}
                </div>
            )}
            <input
                {...props}
                className={`w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 ${prefix ? 'pl-10' : 'pl-6'} pr-6 text-sm font-bold text-white placeholder-neutral-600 outline-none focus:border-white/40 transition-colors uppercase tracking-wider`}
            />
        </div>
    )
}
